import { callAI, RateLimitError } from "./core";
import { MOCK_WORLD } from "./mockData";
import { WORLD_GENERATION_PROMPT } from "../prompts";

export async function generateWorld(prompt: string, model: string = "gemini-2.5-flash", contentType: string = "Anime") {
  const systemInstruction = WORLD_GENERATION_PROMPT(contentType);

  try {
    const text = await callAI(model, prompt, systemInstruction);
    if (!text) throw new Error("Synthesis produced no data.");
    return text;
  } catch (error: any) {
    console.error("Error generating world:", error);

    // If all retries fail, return mock data as a last resort to keep the UI functional
    if (error instanceof RateLimitError || error?.status === 429) {
      console.warn("[World Lab] API Exhausted after retries. Injecting Local Synthesis Failover.");
      return MOCK_WORLD;
    }

    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

