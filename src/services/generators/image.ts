import { callAI, getAIClient } from "./core";

export async function generateImagePrompts(script: string, model: string = "gemini-1.5-flash-latest", contentType: string = "Anime") {
  const systemInstruction = `
    You are an AI Image Prompt Engineer.
    Based on the "Visual/Cinematic Direction" column of the provided ${contentType} script, generate 5-8 highly detailed cinematic image prompts for a storyboard.
    
    Each prompt MUST include:
    - Subject description and character focus
    - Camera angle and lighting mood (Must match the "Visual/Cinematic Direction" from the script)
    - Anime art style details (High-quality, masterpiece, expressive)
    - Specific environmental details
    
    Format as a numbered list in Markdown.
  `;

  try {
    const text = await callAI(model, `Generate image prompts for this script: ${script}`, systemInstruction);
    return text || "Failed to generate image prompts.";
  } catch (error) {
    console.error("Error generating image prompts:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function enhanceSceneVisuals(visuals: string, narration: string, model: string = "gemini-1.5-flash-latest") {
  const systemInstruction = `
    You are an award-winning Cinematic Director and Visual Storyteller.
    Your task is to take a basic scene description and rewrite it into a highly evocative, cinematic storyboard description.
    
    CRITICAL REQUIREMENTS:
    - FOCUS ON CAMERA: Specify the exact camera angle (e.g., Extreme Close-up, Wide Angle Dutch Tilt, Low-angle Tracking Shot).
    - FOCUS ON LIGHTING: Define the lighting style (e.g., High-contrast Noir lighting, Ambient moonlight, Harsh backlighting, Soft warm glow).
    - FOCUS ON MOOD: Use emotive, sensory-rich language to convey the specific mood (e.g., suffocating, ethereal, gritty, triumphant).
    - FOCUS ON ACTION: Describe character micro-actions and environmental reactions (e.g., 'fingers brushing a cold surface', 'fabric swaying in unseen draft').

    Keep it concise but highly visual. Return ONLY the enhanced visual description without any markdown formatting or quotes.
  `;

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
    const imageData = await callAI(model, prompt, "Generate a cinematic anime storyboard frame.");
    return imageData; // The backend returns the full data URI
  } catch (error) {
    console.error("Error generating image via proxy:", error);
    return null;
  }
}
