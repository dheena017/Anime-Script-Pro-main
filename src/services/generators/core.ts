import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
  let attempt = 0;
  
  while (attempt < retries) {
    try {
      // Use Gemini directly if it's a Gemini model
      if (model.includes("gemini")) {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { systemInstruction },
        });
        
        if (!response.text) {
          throw new Error("AI response was blocked by safety filters or returned empty.");
        }
        
        return response.text;
      }

      // Backend proxy for other providers
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt, systemInstruction }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new RateLimitError("AI Quota Exhausted.", 20);
        }
        const error = await response.json();
        throw new Error(error.error || "Failed to generate content");
      }

      const data = await response.json();
      return data.text;
    } catch (error: any) {
      attempt++;
      const isRateLimit = error instanceof RateLimitError || 
                         error?.message?.includes("429") || 
                         error?.toString().includes("RESOURCE_EXHAUSTED");

      if (isRateLimit && attempt < retries) {
        const delay = attempt * 2000; // Exponential backoff
        console.warn(`[AI Core] Rate Limit (Attempt ${attempt}). Retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      
      console.error(`[AI Core] Fail at attempt ${attempt}:`, error);
      if (attempt >= retries) throw error;
    }
  }
}
