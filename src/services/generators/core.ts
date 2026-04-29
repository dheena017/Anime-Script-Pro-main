/**
 * Utility: Checks if a value is empty (null, undefined, empty string, or empty array/object)
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * Utility: Clamp a number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Utility: Debounce a function (wait ms after last call before invoking)
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  } as T;
}

/**
 * Utility: Simple logger with levels
 */
export const logger = {
  info: (...args: any[]) => console.info("[INFO]", ...args),
  warn: (...args: any[]) => console.warn("[WARN]", ...args),
  error: (...args: any[]) => console.error("[ERROR]", ...args),
  debug: (...args: any[]) => console.debug("[DEBUG]", ...args),
};

function logAIUserHint(message: string) {
  console.groupCollapsed("[AI Core] User Guidance");
  console.info(message);
  console.info("• If you are running locally, set VITE_GEMINI_API_KEY in your .env file.");
  console.info("• If you want to use the backend proxy, ensure the FastAPI backend is running and accessible at http://127.0.0.1:8001.");
  console.groupEnd();
}

import { GoogleGenAI } from "@google/genai";
import { API_BASE_URL } from "@/lib/api-utils";

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



/**
 * AI Event System for real-time feedback
 */
export const AI_EVENTS = new EventTarget();

const inFlightRequests = new Map<string, Promise<string>>();
const DEFAULT_BACKEND_URL = "http://127.0.0.1:8001";
const BACKEND_BASE_URL = API_BASE_URL || (import.meta as any)?.env?.VITE_API_BASE_URL || DEFAULT_BACKEND_URL;
const BACKEND_GENERATE_URL = `${BACKEND_BASE_URL.replace(/\/+$|^\s+|\s+$/g, '')}/api/generate`;

export interface AIMetadata {
  text: string;
  model: string;
  latency: number;
  fallbacks: string[];
  error?: string;
}

function broadcastAIMetadata(metadata: AIMetadata) {
  AI_EVENTS.dispatchEvent(new CustomEvent('ai_generation_complete', { detail: metadata }));
}

function broadcastAIFallback(failedModel: string, error: string, nextModel: string) {
  AI_EVENTS.dispatchEvent(new CustomEvent('ai_fallback', { detail: { failedModel, error, nextModel } }));
}

function broadcastAIStart(model: string) {
  AI_EVENTS.dispatchEvent(new CustomEvent('ai_generation_start', { detail: { model } }));
}

/**
 * Robust AI Call Utility with built-in retries, timeouts, and error handling.
 */
export async function callAI(
  model: string, // user-selected model
  prompt: string,
  systemInstruction: string,
  temperature: number = 0.87,
  _retries: number = 0, // unused, kept for signature compatibility
  timeoutMs: number = 180000 // 180 second timeout to allow for backend fallback cycles
) {
  const requestKey = JSON.stringify({ model, prompt, systemInstruction, temperature });
  if (inFlightRequests.has(requestKey)) {
    console.info('[AI Core] Duplicate generation request detected. Reusing existing in-flight request.');
    return inFlightRequests.get(requestKey)!;
  }

  const generationPromise = (async () => {
    const startTime = performance.now();
    broadcastAIStart(model);

    console.info(`[AI Core] Starting generation request for model: ${model}`);
    console.info(`[AI Core] Prompt length: ${prompt?.length || 0}, instruction length: ${systemInstruction?.length || 0}`);

    // 1. Pre-flight checks
    if (!prompt?.trim()) {
      throw new ValidationError("Prompt is required for AI generation.");
    }

    console.info("[AI Core] Browser-side Gemini SDK direct call is disabled. Using backend proxy /api/generate only.");

    //
    // Normalize and prepare model fallbacks
    //
    const normalizeModelId = (id: string | undefined): string => {
      if (!id) return "gemini-2.5-flash";
      let normalized = id.toLowerCase().trim();
      // Remove "models/" prefix if present, as the SDK adds it or handles it
      normalized = normalized.replace(/^models\//, "");
      // Common aliases
      if (normalized === "gemini-flash") return "gemini-2.5-flash";
      if (normalized === "gemini-pro") return "gemini-2.5-pro";
      return normalized;
    };

    const primaryModel = normalizeModelId(model);
    const fallbackModels = [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-2.5-flash-lite",
      "gemini-2-flash",
      "gemini-2-flash-lite",
      "gemini-2.0-flash",
      "gemini-3-flash",
      "gemini-3.1-flash-lite-preview",
      "gemini-3.1-pro",
      "gemini-3-flash-preview",
      "gemini-3-pro-preview"
    ];

    const modelFallbacks = [
      primaryModel,
      ...fallbackModels.filter(m => m !== primaryModel)
    ];

    let lastError = null;
    const attemptedFallbacks: string[] = [];

    for (const currentModel of modelFallbacks) {
      let timeoutId: any;
      try {
        if (currentModel !== model) attemptedFallbacks.push(currentModel);

        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        const payload = {
          model: currentModel,
          prompt: prompt,
          systemInstruction: systemInstruction,
          temperature: temperature
        };

        console.log("[AI Core] Trying model:", currentModel);
        let response = null;
        try {
          response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
        } catch (fetchError: any) {
          const fetchErrorMessage = fetchError?.message?.toString?.() || "";
          if (fetchError instanceof TypeError || fetchErrorMessage.includes('Failed to fetch') || fetchErrorMessage.includes('ERR_EMPTY_RESPONSE')) {
            console.warn("[AI Core] /api proxy fetch failed, retrying direct backend URL:", BACKEND_GENERATE_URL);
            response = await fetch(BACKEND_GENERATE_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
              signal: controller.signal
            });
          } else {
            throw fetchError;
          }
        }
        clearTimeout(timeoutId);

        if (!response) {
          throw new NetworkError("Backend proxy and direct backend URL both failed to return a response.");
        }

        if (!response.ok) {
          let errorData: any = {};
          try {
            errorData = await response.json();
          } catch (e) {
            const text = await response.text().catch(() => "Unknown backend error");
            errorData = { error: text };
          }
          const msg = errorData.detail || errorData.details || errorData.error?.message || errorData.error?.details || (typeof errorData.error === 'string' ? errorData.error : response.statusText) || "Generation Failed";
          console.error(`[AI Core] Backend Error (${response.status}):`, errorData);
          if (response.status === 401 || msg.includes("Invalid AI Credentials")) {
            logAIUserHint("The backend proxy rejected the API key. Verify the backend uses a valid Gemini key in GOOGLE_API_KEY or VITE_GEMINI_API_KEY.");
          }
          if (response.status === 500 || response.status === 502) {
            console.warn("[AI Core] Backend proxy may be unavailable or misconfigured. Ensure the FastAPI server is running.");
          }
          if (response.status === 503 || msg.includes("UNAVAILABLE")) {
            logAIUserHint("The backend or Gemini service is temporarily unavailable. Wait briefly and retry.");
          }

          const nextModel = modelFallbacks[modelFallbacks.indexOf(currentModel) + 1];
          if (nextModel) broadcastAIFallback(currentModel, msg, nextModel);

          lastError = new Error(msg);
          continue; // Try next model
        }

        const data = await response.json();
        const text = data.text;
        if (!text) throw new Error("AI returned an empty response.");

        const totalLatency = performance.now() - startTime;
        console.info(`[AI Core] Success! Model: ${currentModel} | Latency: ${totalLatency.toFixed(2)}ms`);

        broadcastAIMetadata({
          text: text,
          model: currentModel,
          latency: data.latency_ms || totalLatency,
          fallbacks: attemptedFallbacks
        });

        return text;
      } catch (error: any) {
        if (typeof timeoutId !== 'undefined') clearTimeout(timeoutId);
        const errMessage = error?.message || error;
        console.warn(`[AI Core] Model ${currentModel} failed:`, errMessage);

        if (errMessage.toString().includes('Failed to fetch') || errMessage.toString().includes('ERR_EMPTY_RESPONSE')) {
          logAIUserHint("The backend proxy fetch failed. Confirm that the frontend dev server can reach /api/generate and that the backend is running on port 8001.");
          throw new NetworkError("Backend proxy unreachable. Ensure the backend is running at http://127.0.0.1:8001 and Vite proxy /api is configured.");
        }

        const nextModel = modelFallbacks[modelFallbacks.indexOf(currentModel) + 1];
        if (nextModel) broadcastAIFallback(currentModel, errMessage, nextModel);

        lastError = error;
        continue; // Try next model
      }
    }

    // If all models fail, show helpful guidance and throw the last error
    if (lastError) {
      const errMessage = lastError?.message?.toString() || String(lastError);
      if (errMessage.includes("API_KEY_INVALID") || errMessage.includes("Invalid AI Credentials") || errMessage.includes("401")) {
        logAIUserHint("All Gemini fallback attempts failed due to invalid or missing API credentials.");
      } else if (errMessage.includes("Failed to fetch") || errMessage.includes("ERR_EMPTY_RESPONSE")) {
        logAIUserHint("All Gemini fallback attempts failed because the backend proxy is not reachable. Start the backend and verify /api/generate is available.");
      } else {
        console.error("[AI Core] Final fallback failure:", errMessage);
        console.info("[AI Core] You can try a different model, simplify the prompt, or refresh the application.");
      }
    }
    throw lastError || new Error("All Gemini models failed.");
  })();

  inFlightRequests.set(requestKey, generationPromise);
  generationPromise.finally(() => inFlightRequests.delete(requestKey));
  return generationPromise;
}


/**
 * Returns a configured Gemini API client using the best available key.
 */
export const getAIClient = (userKey?: string) => {
  const apiKey = userKey || localStorage.getItem('gemini_api_key') || (import.meta as any)?.env?.VITE_GEMINI_API_KEY || "";
  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    apiVersion: 'v1beta'
  });
};


