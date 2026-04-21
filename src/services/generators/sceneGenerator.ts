import { ai } from "../generators/core";

export async function generateScene(prompt: string, beatDescription: string): Promise<{ narration: string; visuals: string; sound: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Generate a movie scene based on the following context.
      Overall Script/Prompt: ${prompt}
      Narrative Beat: ${beatDescription}
      
      Return the output as a JSON object with fields: "narration", "visuals", "sound".`,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Scene Generation failed:", error);
    return {
      narration: "Failed to generate narration.",
      visuals: "Failed to generate visuals.",
      sound: "Failed to generate sound.",
    };
  }
}
