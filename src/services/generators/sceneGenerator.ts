import { callAI } from "./core";
import { SCENE_GENERATION_PROMPT } from "../prompts";

export async function generateScene(
  prompt: string, 
  beatDescription: string, 
  model: string = "gemini-1.5-flash-latest",
  worldLore: string | null = null,
  castProfiles: string | null = null,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<{ narration: string; visuals: string; sound: string }> {
  const type = prompt.includes('Anime') ? 'Anime' : 'Screenplay';
  const systemInstruction = SCENE_GENERATION_PROMPT(type, worldLore, castProfiles);

  try {
    const result = await callAI(
      model, 
      `Overall Context: ${prompt}\nBeat: ${beatDescription}`, 
      systemInstruction,
      options.temperature,
      options.maxTokens
    );


    if (!result) {
      throw new Error("No response from AI");
    }

    const cleanJson = result.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Scene Generation failed:", error);
    return {
      narration: "Failed to generate narration.",
      visuals: "Failed to generate visuals.",
      sound: "Failed to generate sound.",
    };
  }
}

