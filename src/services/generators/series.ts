import { callAI, RateLimitError } from "./core";
import { SERIES_PLAN_GENERATION_PROMPT } from "../prompts";

export async function generateSeriesPlan(
  prompt: string,
  model: string = "gemini-1.5-flash-latest",
  contentType: string = "Anime",
  episodeCount: number = 5,
  worldLore?: string,
  castProfiles?: string,

) {
  const systemInstruction = SERIES_PLAN_GENERATION_PROMPT(
    contentType, 
    episodeCount, 
    worldLore || 'Standard genre rules.', 
    castProfiles || 'Generic archetypes.'
  );

  try {
    const text = await callAI(model, `Generate a ${episodeCount}-episode production plan for: ${prompt}. Ensure it respects the world lore and characters provided.`, systemInstruction);
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    const errorStr = error?.toString() || "";
    const errorMsg = error?.message || "";

    const isRateLimit = error instanceof RateLimitError ||
      errorStr.includes("429") ||
      errorMsg.includes("429") ||
      errorStr.includes("RESOURCE_EXHAUSTED") ||
      errorMsg.includes("RESOURCE_EXHAUSTED") ||
      error?.status === 429;

    if (isRateLimit) {
      console.warn("[Series Lab] API Quota Exceeded. Throwing error to UI.");
      throw new RateLimitError("Rate limit exceeded for series generation.", 25);
    }
    console.error("Error generating series plan:", error);
    throw error;
  }
}




