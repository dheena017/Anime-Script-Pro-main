import { callAI, RateLimitError } from "./core";
import { MOCK_SCRIPT } from "./mockData";

export async function generateScript(
  prompt: string,
  tone: string = "Hype/Energetic",
  audience: string = "General Fans",
  session: string = "1",
  episode: string = "1",
  numScenes: string = "6",
  model: string = "gemini-1.5-flash-latest",
  contentType: string = "Anime",
  recapperPersona: string = "",

  characterRelationships: string | null = null,
  worldBuilding: string | null = null,
  castProfiles: string | null = null,
  episodePlan: string | null = null
) {
  const systemInstruction = `
    You are the Prime Synthesis Architect and the Transcendent Showrunner.
    You are manifests a living reality for a ${contentType} production.
    
    PRODUCTION SPECS:
    - MODE: ${tone}
    - TARGET AUDIENCE: ${audience}
    - PLACEMENT: Session ${session}, Episode ${episode}
    - VOLUME: Generate exactly ${numScenes} scenes.
    
    ${episodePlan ? `EPISODE MASTER BLUEPRINT:\n${episodePlan}\n` : ""}
    ${worldBuilding ? `WORLD LORE SOURCE OF TRUTH:\n${worldBuilding}\n` : ""}
    ${castProfiles ? `CHARACTER DNA REGISTRY:\n${castProfiles}\n` : ""}
    ${characterRelationships ? `INTERPERSONAL DYNAMICS:\n${characterRelationships}\n` : ""}

    PRIME ARCHITECTURE PROTOCOLS:
    - QUANTUM CONTINUITY: Ensure micro-details (scars on hands, unique prop cracks, specific lighting temperatures) remain persistent across the entire arc of ${prompt}.
    - ASSET SYNCHRONIZATION: Explicitly inventory every character identity and primary prop required for the shot.
    - KINETIC WEIGHT: Describe the 'Physics' of the scene. How does the wind move? How does the gravity feel? Use 'Heavy', 'Floaty', 'Resistance'.
    
    SUPREME ARCHITECTURE (STRICT 11-COLUMN TABULAR FORMAT):
    1. Scene #
    2. Section (GENESIS -> ASCENSION -> ZENITH -> IMPACT -> AFTERGLOW)
    3. Soul Focus (The character at the spiritual center of the shot)
    4. Narration (${recapperPersona} persona with [DSP] and (Dynamic Delivery))
    5. Visual Direction (CAMERA + LIGHTING + SAKUGA MARKERS [On-1s] + CHOREOGRAPHY)
    6. VFX Compounds (PARTICLES + SHADERS + VOLUMETRICS + LENS ARTEFACTS)
    7. Audio Forge (BGM + FOLEY + FREQUENCY + SONIC METAPHORS)
    8. Emotional Key (The psychological seed: e.g. "Shattered Hope", "Solar Euphoria")
    9. Subtext / The Why (The hidden spiritual motive behind the action)
    10. Active Asset List (INVENTORY: Characters Present + Primary Props Required)
    11. Time (Precise Timing and Cumulative Chronology. Final scene must hit exactly 5:00)
    
    INFINITE DIRECTIVES:
    - Eliminate every trace of the ordinary. Every scene must be a high-fidelity visual and sonic masterpiece.
    - Synchronize the 11 columns into a singular, high-octane production heartbeat.
    
    Return ONLY the markdown table.
  `;

  try {
    const text = await callAI(model, prompt, systemInstruction);
    return text || "Failed to generate script.";
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
      console.warn("[Script Lab] API Quota Exceeded. Injecting Local Synthesis Failover.");
      return MOCK_SCRIPT;
    }
    console.error("Error generating script:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function continueScript(currentScript: string, model: string = "gemini-1.5-flash-latest", contentType: string = "Anime") {
  const systemInstruction = `
    You are the Prime Synthesis Architect continuing a cosmic blueprint for a ${contentType} production.
    Synthesize the next 3 scenes with Supreme 11-Column depth.
    
    1. Scene # | 2. Section | 3. Soul Focus | 4. Narration | 5. Visuals | 6. VFX | 7. Audio | 8. Emotion | 9. Subtext | 10. Assets | 11. Time
    
    Maintain Quantum Continuity and Sakuga intensity.
    Return ONLY the markdown table.
  `;

  try {
    const text = await callAI(model, `Continue this script with 3 more scenes: ${currentScript}`, systemInstruction);
    return text || "Failed to continue script.";
  } catch (error) {
    console.error("Error continuing script:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function rewriteForTension(sceneDescription: string, model: string = "gemini-1.5-flash-latest") {
  const systemInstruction = `
    You are an expert Dramatic Scriptwriter.
    Your task is to take a scene description and rewrite it specifically to MAXIMIZE TENSION.
    - Use shorter sentences.
    - Focus on urgent sensory details.
    - Emphasize high-stakes conflict.
    - Use active verbs.
    Return ONLY the rewritten scene description.
  `;

  try {
    const text = await callAI(model, `Rewrite this scene for maximum tension: ${sceneDescription}`, systemInstruction);
    return text || sceneDescription;
  } catch (error) {
    console.error("Error rewriting for tension:", error);
    return sceneDescription;
  }
}
