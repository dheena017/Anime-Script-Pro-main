import { callAI} from "./core";
import { 
  IMAGE_PROMPT_GENERATION_PROMPT, 
  ENHANCE_SCENE_VISUALS_PROMPT, 
  GENERATE_SCENE_IMAGE_SYSTEM_PROMPT 
} from "../prompts";

export async function generateImagePrompts(script: string, model: string = "gemini-1.5-flash-latest") {
  const contentType = script.toLowerCase().includes("anime") ? "Anime" : "Series";
  const systemInstruction = IMAGE_PROMPT_GENERATION_PROMPT(contentType, script);

  try {
    const text = await callAI(model, `Generate image prompts for this script: ${script}`, systemInstruction);
    return text || "Failed to generate image prompts.";
  } catch (error) {
    console.error("Error generating image prompts:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function enhanceSceneVisuals(visuals: string, narration: string, model: string = "gemini-1.5-flash-latest") {
  const systemInstruction = ENHANCE_SCENE_VISUALS_PROMPT;

  try {
    const prompt = `Narration context: "${narration}"\nCurrent Visuals: "${visuals}"\n\nEnhance these visuals.`;
    const text = await callAI(model, prompt, systemInstruction);
    return text || visuals;
  } catch (error) {
    console.error("Error enhancing visuals:", error);
    return visuals;
  }
}

export async function generateSceneImage(prompt: string, model: string = "imagen-3.0-generate-001"): Promise<string | null> {
  try {
    // Route image generation through our stable proxy
    const imageData = await callAI(model, prompt, GENERATE_SCENE_IMAGE_SYSTEM_PROMPT);
    return imageData; // The backend returns the full data URI
  } catch (error) {
    console.error("Error generating image via proxy:", error);
    return null;
  }
}



