import { callAI } from "./core";
import {
  METADATA_GENERATION_PROMPT,
  YOUTUBE_DESCRIPTION_GENERATION_PROMPT,
  ALT_TEXT_GENERATION_PROMPT
} from "../prompts";

export async function generateMetadata(script: string, model: string = "gemini-1.5-flash-latest") {
  const systemInstruction = METADATA_GENERATION_PROMPT(script);

  try {
    const text = await callAI(model, `Generate YouTube metadata for this script: ${script}`, systemInstruction);
    return text || "Failed to generate metadata.";
  } catch (error) {
    console.error("Error generating metadata:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function generateYouTubeDescription(script: string, model: string = "gemini-1.5-flash-latest", contentType: string = "Anime") {
  const systemInstruction = YOUTUBE_DESCRIPTION_GENERATION_PROMPT(contentType, script);

  try {
    const text = await callAI(model, `Generate a YouTube description for this script: ${script}`, systemInstruction);
    return text || "Failed to generate description.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function generateAltTexts(script: string, model: string = "gemini-1.5-flash-latest") {
  const systemInstruction = ALT_TEXT_GENERATION_PROMPT(script);

  try {
    const text = await callAI(model, `Generate alt text captions for this script: ${script}`, systemInstruction);
    return text || "Failed to generate alt text.";
  } catch (error) {
    console.error("Error generating alt text:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function generateGrowthStrategy(script: string, model: string = "gemini-1.5-flash-latest", contentType: string = "Anime") {
  const { GROWTH_STRATEGY_PROMPT } = await import("../prompts/metadata");
  const systemInstruction = GROWTH_STRATEGY_PROMPT(contentType, script);

  try {
    const text = await callAI(model, `Develop a comprehensive YouTube growth strategy for this script: ${script}`, systemInstruction);
    return text || "Failed to generate growth strategy.";
  } catch (error) {
    console.error("Error generating growth strategy:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function generateDistributionStrategy(script: string, model: string = "gemini-1.5-flash-latest") {
  const { REPURPOSE_MATRIX_PROMPT } = await import("../prompts/youtube_strategies");
  const systemInstruction = REPURPOSE_MATRIX_PROMPT(script);

  try {
    const text = await callAI(model, `Develop a cross-platform distribution matrix for this script: ${script}`, systemInstruction);
    return text || "Failed to generate distribution strategy.";
  } catch (error) {
    console.error("Error generating distribution strategy:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}




