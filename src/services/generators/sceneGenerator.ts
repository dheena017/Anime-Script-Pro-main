import { callAI } from "./core";
import { SCENE_GENERATION_PROMPT } from "../prompts";

export async function generateScene(prompt: string, beatDescription: string, model: string = "gemini-1.5-flash-latest"): Promise<{ narration: string; visuals: string; sound: string }> {
  const type = prompt.includes('Anime') ? 'Anime' : 'Screenplay';
  const systemInstruction = SCENE_GENERATION_PROMPT(type);

  try {
    const result = await callAI(model, `Overall Context: ${prompt}\nBeat: ${beatDescription}`, systemInstruction);


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

