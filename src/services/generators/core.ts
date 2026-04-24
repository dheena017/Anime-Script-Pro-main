import { GoogleGenAI } from "@google/genai";

export class RateLimitError extends Error {
  retryAfter: number;
  constructor(message: string, retryAfter: number = 20) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function callAI(model: string, prompt: string, systemInstruction: string, retries: number = 3) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
  const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is missing.");
  }

  let attempt = 0;
  let currentModel = model.replace("models/", "").toLowerCase().trim();
  
  // Map display names or short IDs to stable API IDs
  if (currentModel.includes("gemini-1.5-flash")) currentModel = "gemini-1.5-flash";
  else if (currentModel.includes("gemini-1.5-pro")) currentModel = "gemini-1.5-pro";
  else if (currentModel.includes("gemini-2.0-flash")) currentModel = "gemini-2.0-flash-exp";
  else if (currentModel.includes("gemini-2.0-pro")) currentModel = "gemini-2.0-pro-exp-02-05";
  else if (currentModel === "gemini-pro-latest") currentModel = "gemini-1.5-pro";
  else if (currentModel === "gemini-flash-latest") currentModel = "gemini-1.5-flash";
  else if (currentModel.includes("gemini-2.0-flash-exp")) currentModel = "gemini-2.0-flash-exp"; // Fallback for typo in codebase


  // If it still has spaces, replace them with dashes as a last resort
  currentModel = currentModel.replace(/\s+/g, "-");

  while (attempt < retries) {
    try {
      console.log(`[AI Core] Requesting: ${currentModel} (Attempt ${attempt + 1})`);
      
      const response = await fetch(`${BASE_URL}/${currentModel}:generateContent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY // Use the header format from your successful curl
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 4096,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[AI Core] Error ${response.status}:`, errorData);
        if (response.status === 404) throw new Error("MODEL_NOT_FOUND");
        throw new Error(errorData.error?.message || "API Error");
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) throw new Error("EMPTY_RESPONSE");
      return text;

    } catch (error: any) {
      attempt++;
      console.warn(`[AI Core] Attempt ${attempt} failed:`, error.message);

      if (attempt < retries) {
        if (error.message.includes("MODEL_NOT_FOUND")) {
          currentModel = "gemini-flash-latest";
        }
        await sleep(2000);
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
