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
  return function(this: any, ...args: any[]) {
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



/**
 * Robust AI Call Utility with built-in retries, timeouts, and error handling.
 */
export async function callAI(
  model: string, // user-selected model
  prompt: string,
  systemInstruction: string,
  temperature: number = 0.85,
  _retries: number = 0, // unused, kept for signature compatibility
  timeoutMs: number = 90000 // 90 second timeout for faster response cycles
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

  //
  // Try user-selected model first, then fallbacks
  const fallbackModels = [
    
    "Gemini 3 Flash Live"
    

  ];
  const modelFallbacks = [model, ...fallbackModels.filter(m => m !== model)];
  let lastError = null;
  for (const currentModel of modelFallbacks) {
    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
      if (!API_KEY) {
        console.error("[AI Core] CRITICAL: VITE_GEMINI_API_KEY is missing.");
        throw new AuthenticationError("AI Configuration Missing: Gemini API Key is required.");
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      const payload = {
        model: currentModel,
        prompt: prompt,
        systemInstruction: systemInstruction,
        temperature: temperature
      };
      console.log("[AI Core] Trying model:", currentModel, payload);
      const response = await fetch("http://localhost:8001/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        const msg = errorData.details || errorData.error?.message || errorData.error?.details || (typeof errorData.error === 'string' ? errorData.error : response.statusText) || "Generation Failed";
        console.error(`[AI Core] Backend Error (${response.status}):`, errorData);
        lastError = new Error(msg);
        continue; // Try next model
      }
      const data = await response.json();
      const text = data.text;
      if (!text) throw new Error("AI returned an empty response.");
      return text;
    } catch (error) {
      lastError = error;
      continue; // Try next model
    }
  }
  // If all models fail, throw the last error
  throw lastError || new Error("All Gemini models failed.");

}

export const getAIClient = () => new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
  apiVersion: 'v1beta'
});


