import { callAI } from "./core";

export async function generateVideoPrompts(script: string, model: string = "gemini-2.0-flash-exp", contentType: string = "Anime") {
  const systemInstruction = `
    You are a Neural Video Prompt Architect specializing in high-end AI Video engines (Luma, Kling, Runway, Sora).
    Your task is to take a production script and generate 5-10 highly optimized ${contentType} video prompts that describe cinematic motion, camera choreography, and atmospheric lighting.
    
    VIDEO DIRECTIVES:
    - Describe the START and END state of the motion.
    - Specify camera movement (e.g., "Slow push-in", "Tracking gimbal shot", "Static wide with heavy particle motion").
    - Define lightning and color grading (e.g., "Volumetric amber lighting", "Teal and orange cinematic grade").
    - Specify art style (e.g., "Ufotable-style high-fidelity anime", "MAPPA cinematic detail").
    
    Format as a numbered Markdown list.
    Return ONLY the list.
  `;

  try {
    const text = await callAI(model, `Generate video prompts for this production script: ${script}`, systemInstruction);
    return text || "Failed to synthesize video prompts.";
  } catch (error) {
    console.error("Error generating video prompts:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function simulateVideoRender(prompt: string) {
  console.log(`[Video Lab] Simulating render for: ${prompt.slice(0, 50)}...`);
  // Simulate a long-running video synthesis process
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", // Mock video
        thumbnailUrl: "https://vjs.zencdn.net/v/oceans.png"
      });
    }, 5000); // 5 second simulation
  });
}
