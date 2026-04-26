import { callAI, RateLimitError } from "./core";
import { MOCK_WORLD } from "./mockData";

export async function generateWorld(prompt: string, model: string = "gemini-2.0-flash-exp", contentType: string = "Anime") {
  const systemInstruction = `
    You are an expert ${contentType} World Builder and Lore Architect.
    Based on the provided prompt, design a comprehensive world setting for a ${contentType} series.
    
    Provide a deep-dive specification including:
    - **World Name & High Concept**: (The elevator pitch for the setting)
    - **Power System & Combat Logic**: (Explicitly define if the world is based on Magic, Sword skills, Spiritual energy, or Tech. Define the 'Power' rules and limitations.)
    - **The Ultimate Ambition (Main Goal)**: (What is the overarching goal of the characters or the world in this anime?)
    - **Visual Architecture**: (Camera styles, color palettes, lighting mood, and recurring visual motifs)
    - **Physical Geography & Climate**: (Visual descriptions of environments and environmental hazards)
    - **Social Laws & Hierarchy**: (Social hierarchy, forbidden acts, and ruling factions)
    - **The Core Conflict**: (The underlying friction that drives the story)
    - **Chronicle of Eras**: (Brief history segments: Genesis, The Great Shift, and The Current State)
    - **Flora & Fauna / Tech Specs**: (Unique creatures or signature technology)
    - **Sensory Palette**: (Dominant colors, ambient sound textures, and environmental smells)
    
    Format the output as professional world-building documentation (Lore Bible style) in Markdown with clear headers.
    Return ONLY the world description.
  `;

  try {
    const text = await callAI(model, prompt, systemInstruction);
    if (!text) throw new Error("Synthesis produced no data.");
    return text;
  } catch (error: any) {
    console.error("Error generating world:", error);
    
    // If all retries fail, return mock data as a last resort to keep the UI functional
    if (error instanceof RateLimitError || error?.status === 429) {
      console.warn("[World Lab] API Exhausted after retries. Injecting Local Synthesis Failover.");
      return MOCK_WORLD;
    }
    
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}
