import { callAI } from "./core";
import { ENHANCE_NARRATION_PROMPT, SUGGEST_DURATION_PROMPT } from "../prompts";

export async function enhanceNarration(narration: string, model: string = "gemini-1.5-flash-latest") {
  const systemInstruction = ENHANCE_NARRATION_PROMPT;

  try {
    const prompt = `Current Narration: "${narration}"\n\nEnhance this narration with delivery details.`;
    const text = await callAI(model, prompt, systemInstruction);
    return text || narration;
  } catch (error) {
    console.error("Error enhancing narration:", error);
    return narration;
  }
}

export async function suggestDuration(narration: string, model: string = "gemini-1.5-flash-latest") {
  const systemInstruction = SUGGEST_DURATION_PROMPT;

  try {
    const text = await callAI(model, `Narration: ${narration}`, systemInstruction);
    return text ? text.trim() : "5s";
  } catch (error) {
    console.error("Error suggesting duration:", error);
    return "5s";
  }
}

