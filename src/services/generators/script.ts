import { callAI, RateLimitError } from "./core";
import { MOCK_SCRIPT } from "./mockData";
import { 
  SCRIPT_GENERATION_PROMPT, 
  SCRIPT_CONTINUATION_PROMPT, 
  SCRIPT_REWRITE_TENSION_PROMPT 
} from "../prompts";

export async function generateScript(
  prompt: string,
  tone: string = "Hype/Energetic",
  audience: string = "General Fans",
  session: string = "1",
  episode: string = "1",
  numScenes: string = "6",
  model: string = "gemini-1.5-flash-latest",
  contentType: string = "Anime",
  recapperPersona: string = "",

  characterRelationships: string | null = null,
  worldBuilding: string | null = null,
  castProfiles: string | null = null,
  episodePlan: string | null = null
) {
  const systemInstruction = SCRIPT_GENERATION_PROMPT(
    contentType, 
    tone, 
    audience, 
    session, 
    episode, 
    numScenes, 
    episodePlan, 
    worldBuilding, 
    castProfiles, 
    characterRelationships, 
    recapperPersona
  ).replace("[PROMPT]", prompt);

  try {
    const text = await callAI(model, prompt, systemInstruction);
    return text || "Failed to generate script.";
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
      console.warn("[Script Lab] API Quota Exceeded. Injecting Local Synthesis Failover.");
      return MOCK_SCRIPT;
    }
    console.error("Error generating script:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function continueScript(currentScript: string, model: string = "gemini-1.5-flash-latest", contentType: string = "Anime") {
  const systemInstruction = SCRIPT_CONTINUATION_PROMPT(contentType);

  try {
    const text = await callAI(model, `Continue this script with 3 more scenes: ${currentScript}`, systemInstruction);
    return text || "Failed to continue script.";
  } catch (error) {
    console.error("Error continuing script:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function rewriteForTension(sceneDescription: string, model: string = "gemini-1.5-flash-latest") {
  const systemInstruction = SCRIPT_REWRITE_TENSION_PROMPT;

  try {
    const text = await callAI(model, `Rewrite this scene for maximum tension: ${sceneDescription}`, systemInstruction);
    return text || sceneDescription;
  } catch (error) {
    console.error("Error rewriting for tension:", error);
    return sceneDescription;
  }
}




