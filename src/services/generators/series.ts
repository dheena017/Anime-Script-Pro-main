import { callAI, RateLimitError } from "./core";

export async function generateSeriesPlan(
  prompt: string,
  model: string = "gemini-1.5-flash-latest",
  contentType: string = "Anime",
  episodeCount: number = 5,
  worldLore?: string,
  castProfiles?: string,

) {
  const systemInstruction = `
    You are an elite Showrunner, Cinematic Director, and Master Storyteller specializing in high-end ${contentType} productions.
    Your objective is to architect a legendary ${episodeCount}-episode Master Sequence.

    CRITICAL CONTEXT:
    - WORLD BIBLE: ${worldLore || 'Standard genre rules.'}
    - CAST DNA: ${castProfiles || 'Generic archetypes.'}

    DIRECTIVES:
    1. Narrative Arc: Structure a flawless overarching plot. The pacing must be relentless, the stakes must escalate exponentially, and each episode must end on a devastating hook or psychological cliffhanger.
    2. Asset Matrix Matrix: Provide hyper-specific, highly technical cinematic directives for the production team (think focal lengths, color grading, lighting setups, and sound design paradigms).
    3. Epic Scale: Every single episode MUST be feature-length (exceeding 1 hour of runtime). The narrative complexity and scene counts must reflect this massive scale.
    
    Return EXACTLY a JSON array of objects matching this schema:
    [
      {
        "episode": "01",
        "title": "A highly evocative, cinematic episode title (e.g., 'Echoes in the Glass', 'The Bleeding Sky')",
        "hook": "A detailed 2-3 sentence synopsis that sets the scene, highlights the primary conflict, and ends with a powerful hook.",
        "setting": "Primary location(s) for this episode",
        "runtime": "Estimated runtime (MUST be > 1 hour, e.g., '1h 15m', '1h 45m')",
        "focus_characters": ["Character Name 1", "Character Name 2"],
        "emotional_arc": "The core emotional shift or theme of the episode (e.g., 'From Arrogance to Despair')",
        "asset_matrix": {
          "sound": "Specific audio engineering (e.g., 'Low-BPM synth drones, sharp orchestral staccato on impact, binaural whispers')",
          "image": "Cinematic visual style (e.g., 'High-contrast Chiaroscuro lighting, desaturated cyan/teal grading, anamorphic lens flare')",
          "video": "Motion/Camera mechanics (e.g., 'Handheld shaky-cam for tension, sweeping drone shots for scale, extreme close-up tracking')",
          "scene_count": "Number of core scenes (Scale up for 1hr+ runtime, e.g., 45, 60)"
        }
      }
    ]

    NO MARKDOWN. NO BACKTICKS. NO EXPLANATIONS. Return ONLY the raw JSON array.
  `;

  try {
    const text = await callAI(model, `Generate a ${episodeCount}-episode production plan for: ${prompt}. Ensure it respects the world lore and characters provided.`, systemInstruction);
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
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
      console.warn("[Series Lab] API Quota Exceeded. Throwing error to UI.");
      throw new RateLimitError("Rate limit exceeded for series generation.", 25);
    }
    console.error("Error generating series plan:", error);
    throw error;
  }
}
