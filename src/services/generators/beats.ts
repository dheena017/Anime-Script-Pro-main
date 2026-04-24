import { callAI, RateLimitError } from "./core";
import { MOCK_NARRATIVE_BEATS } from "./mockData";

export async function generateNarrativeBeats(
  prompt: string, 
  model: string = "gemini-2.0-flash-exp", 
  contentType: string = "Anime",
  worldBuilding: string | null = null,
  castProfiles: string | null = null
) {
  const systemInstruction = `
    You are an expert ${contentType} Audio Director and Tone Architect.
    Your task is to create a set of 5-6 compelling beats for a production cycle, focusing heavily on the auditory and atmospheric experience.
    
    WORLD LORE: ${worldBuilding || 'Standard genre rules.'}
    CAST PROFILES: ${castProfiles || 'Generic archetypes.'}
    
    Return a JSON array of objects with the following structure:
    [
      {
        "label": "Beat Identifier (e.g., 'The Silent Opening')",
        "description": "Narrative purpose of this beat.",
        "duration": "Time range (e.g., 0:00 - 0:45)",
        "intensity": 1-10,
        "tone": "Specific emotional tone (e.g., 'Melancholic', 'Adrenaline-Fueled', 'Eerie')",
        "music": "Music/BGM directive (e.g., 'Lo-fi hip-hop with muffled sword clashes', 'Orchestral swell with heavy percussion')",
        "audio": "Ambient sound effects/Soundscape directive (e.g., 'Rain patter against metal', 'Distant screams echoing in a void')",
        "vfx": "Visual cinematic directive to match the audio"
      }
    ]
    
    Guidelines:
    - BEATS ARE PRIMARILY AUDITORY AND ATMOSPHERIC: Focus on how the scene sounds and feels.
    - Match the tone of ${contentType}.
    - Integrity: THE BEATS MUST RESPECT THE WORLD LORE AND CHARACTER PROFILES PROVIDED.
    - Music and Audio must be descriptive enough for a sound engineer.
    - Return ONLY the JSON array.
  `;

  try {
    const text = await callAI(model, `Create narrative beats for: ${prompt}. Incorporate lore and cast where appropriate.`, systemInstruction);
    // Find the first [ and last ] to extract JSON array
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1 || end < start) {
      throw new Error(`Invalid JSON format in narrative beats: ${text}`);
    }
    const cleanJson = text.substring(start, end + 1);
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
       console.warn("[Beats Lab] API Quota Exceeded. Injecting Local Synthesis Failover.");
       return MOCK_NARRATIVE_BEATS;
    }
    console.error("Error generating narrative beats:", error);
    return null;
  }
}
export async function refineSingleBeat(
    currentBeat: any, 
    refinementPrompt: string, 
    overallPrompt: string,
    model: string = "gemini-2.0-flash-exp", 
    contentType: string = "Anime"
) {
  const systemInstruction = `
    You are an expert ${contentType} Script Doctor.
    Refine the following narrative beat based on the user's specific feedback.
    
    ORIGINAL BEAT: ${JSON.stringify(currentBeat)}
    OVERALL STORY CONTEXT: ${overallPrompt}
    REFINEMENT REQUEST: ${refinementPrompt}
    
    Return a SINGLE JSON object with the refined data (label, description, duration, intensity, vfx, audio).
    Ensure the new beat still fits the context of the overall story and the existing duration.
    Return ONLY the JSON object.
  `;

  try {
    const text = await callAI(model, refinementPrompt, systemInstruction);
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end < start) {
      throw new Error(`Invalid JSON format in refined beat: ${text}`);
    }
    const cleanJson = text.substring(start, end + 1);
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error refining beat:", error);
    return currentBeat;
  }
}
