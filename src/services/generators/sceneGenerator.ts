import { callAI } from "./core";

export async function generateScene(prompt: string, beatDescription: string, model: string = "gemini-2.0-flash-exp"): Promise<{ narration: string; visuals: string; sound: string }> {
  const systemInstruction = `
    You are an expert ${prompt.includes('Anime') ? 'Anime' : 'Screenplay'} Writer.
    Based on the context, generate a detailed scene with narration, visuals, and sound.
    
    Return ONLY a valid JSON object with:
    { "narration": "...", "visuals": "...", "sound": "..." }
  `;

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
