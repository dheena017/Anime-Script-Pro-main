import { GoogleGenAI } from "@google/genai";

/**
 * Custom Error Classes for AI Operations
 */
export class AIError extends Error {
  status?: number;
  details?: any;
  retryable: boolean;
  constructor(message: string, status?: number, details?: any, retryable: boolean = false) {
    super(message);
    this.name = "AIError";
    this.status = status;
    this.details = details;
    this.retryable = retryable;
  }
}

export class RateLimitError extends AIError {
  retryAfter: number;
  constructor(message: string, retryAfter: number = 25) {
    super(message, 429, null, true);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export class ContentFilterError extends AIError {
  constructor(message: string, details?: any) {
    super(message, 400, details, false);
    this.name = "ContentFilterError";
  }
}

export class AuthenticationError extends AIError {
  constructor(message: string) {
    super(message, 401, null, false);
    this.name = "AuthenticationError";
  }
}

export class ModelNotFoundError extends AIError {
  constructor(message: string) {
    super(message, 404, null, false);
    this.name = "ModelNotFoundError";
  }
}

export class ValidationError extends AIError {
  constructor(message: string) {
    super(message, 400, null, false);
    this.name = "ValidationError";
  }
}

export class NetworkError extends AIError {
  constructor(message: string) {
    super(message, 0, null, true);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends AIError {
  constructor(message: string = "Request timed out") {
    super(message, 408, null, true);
    this.name = "TimeoutError";
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Robust AI Call Utility with built-in retries, timeouts, and error handling.
 */
export async function callAI(
  model: string, 
  prompt: string, 
  systemInstruction: string, 
  retries: number = 3,
  timeoutMs: number = 60000 // 60 second default timeout
) {
  // 1. Pre-flight checks
  if (!prompt?.trim()) {
    throw new ValidationError("Prompt is required for AI generation.");
  }

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
  if (!API_KEY) {
    console.error("[AI Core] CRITICAL: VITE_GEMINI_API_KEY is missing.");
    throw new AuthenticationError("AI Configuration Missing: Gemini API Key is required.");
  }

  let attempt = 0;
  let currentModel = model.replace("models/", "").toLowerCase().trim();
  
  // Robust Model Mapping to Stable API IDs
  const getStableModel = (id: string) => {
    const mappings: Record<string, string> = {
      "gemini-2.0-flash": "gemini-2.0-flash-exp",
      "gemini-2.0-pro": "gemini-2.0-pro-exp-02-05",
      "gemini-1.5-pro": "gemini-1.5-pro",
      "gemini-1.5-flash": "gemini-1.5-flash",
      "gemini-pro-latest": "gemini-1.5-pro",
      "gemini-flash-latest": "gemini-1.5-flash",
      "pro": "gemini-1.5-pro",
      "flash": "gemini-1.5-flash",
      "gpt-4": "gpt-4o", // Just in case of cross-platform model IDs
      "gpt-3.5": "gpt-3.5-turbo"
    };

    for (const [key, value] of Object.entries(mappings)) {
      if (id.includes(key)) return value;
    }
    return id.replace(/\s+/g, "-");
  };

  currentModel = getStableModel(currentModel);
  
  while (attempt < retries + 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.log(`[AI Core] [Attempt ${attempt + 1}] Requesting: ${currentModel}`);
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: currentModel,
          prompt: prompt,
          systemInstruction: systemInstruction
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (e) {
          const text = await response.text().catch(() => "Unknown backend error");
          errorData = { error: text };
        }

        const msg = errorData.error?.message || errorData.error?.details || errorData.error || response.statusText || "Generation Failed";
        const msgLower = String(msg).toLowerCase();

        console.error(`[AI Core] Backend Error (${response.status}):`, errorData);

        // 1. Rate Limiting / Quota
        if (response.status === 429 || msgLower.includes("quota") || msgLower.includes("too many requests")) {
           const retryAfter = errorData.retryAfter || 25;
           throw new RateLimitError(msg, retryAfter);
        }
        
        // 2. Authentication Errors
        if (response.status === 401 || response.status === 403) {
           throw new AuthenticationError(`Authentication failed: ${msg}`);
        }

        // 3. Model Not Found (Fallback Logic)
        if (response.status === 404 || msgLower.includes("not found")) {
           if (attempt === 0 && currentModel !== "gemini-1.5-flash") {
             console.warn(`[AI Core] Model ${currentModel} not found. Falling back to gemini-1.5-flash.`);
             currentModel = "gemini-1.5-flash";
             attempt++;
             continue; 
           }
           throw new ModelNotFoundError(`Model ${currentModel} is unavailable.`);
        }

        // 4. Content Filtering (Safety)
        if (msgLower.includes("safety") || msgLower.includes("filtered") || msgLower.includes("blocked")) {
          throw new ContentFilterError("Response blocked by AI safety filters.", errorData);
        }

        // 5. Server Errors (Retryable)
        if (response.status >= 500) {
          throw new AIError(`Server error (${response.status}): ${msg}`, response.status, null, true);
        }

        throw new AIError(msg, response.status, null, false);
      }

      const data = await response.json();
      const text = data.text;
      
      if (!text) throw new AIError("AI returned an empty response.", 204, null, true);
      return text;

    } catch (error: any) {
      clearTimeout(timeoutId);
      attempt++;

      if (error.name === 'AbortError') {
        console.error(`[AI Core] Request Timed Out after ${timeoutMs}ms`);
        if (attempt <= retries) {
          const backoff = Math.pow(2, attempt) * 1000;
          await sleep(backoff);
          continue;
        }
        throw new TimeoutError();
      }

      // If it's already an AIError, respect its retryable flag
      const isRetryable = error instanceof AIError ? error.retryable : true;

      console.warn(`[AI Core] Attempt ${attempt} failed: ${error.message} (Retryable: ${isRetryable})`);

      if (attempt <= retries && isRetryable) {
        if (error instanceof RateLimitError) {
          const waitTime = error.retryAfter * 1000;
          console.log(`[AI Core] Quota Hit. Cooling down for ${error.retryAfter}s...`);
          await sleep(waitTime);
          continue;
        }

        // Exponential Backoff
        const backoff = Math.pow(2, attempt) * 1000;
        console.log(`[AI Core] Retrying in ${backoff}ms...`);
        await sleep(backoff);
        continue;
      }
      
      throw error;
    }
  }
}

export const getAIClient = () => new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
  apiVersion: 'v1beta'
});


