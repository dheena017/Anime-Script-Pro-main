import { callAI, RateLimitError } from "./core";
import { cleanJson } from "@/lib/api-utils";

export type RelationshipType = 
  | 'Ally' 
  | 'Rival' 
  | 'Enemy' 
  | 'Love' 
  | 'Secret' 
  | 'Master/Apprentice' 
  | 'Familial' 
  | 'Betrayal' 
  | 'Stalker';

export interface GeneratedCharacter {
  name: string;
  archetype: string;
  personality: string;
  appearance: string; 
  visualPrompt: string; // Specific prompt for image generation
  conflict: string; 
  goal: string; 
  flaw: string;
  speakingStyle: string; // How they talk (e.g., "formal and clipped", "slang-heavy and loud")
  secret: string; // Something hidden
}

export interface GeneratedCast {
  markdown: string;
  characters: GeneratedCharacter[];
  relationships: {
    source: string;
    target: string;
    type: RelationshipType;
    tension: number;
    description: string;
  }[];
}

/**
 * generateCharacters
 * Synthesizes a cast of characters with deep psychological profiles and visual DNA.
 */
export async function generateCharacters(
  genre: string, 
  model: string = "gemini-2.5-flash", 
  contentType: string = "Anime",
  worldLore?: string,
  count: number = 3
): Promise<GeneratedCast | string> {
  
  const contextInjected = worldLore 
    ? `\nWORLD LORE CONTEXT: ${worldLore}\nCharacters MUST inhabit and reflect this world's logic and history.`
    : "";

  const systemInstruction = `
    You are an expert ${contentType} Character Designer and Story Consultant.
    Based on the provided genre or theme, suggest exactly ${count} unique character archetypes for a ${contentType} series.
    ${contextInjected}
    
    You MUST return a JSON object with THREE keys:
    1. "markdown": A professional Markdown representation of the character sheets.
    
    2. "characters": An array of objects for each character:
       - "name": Character name
       - "archetype": Their class or role
       - "personality": Psycho-behavioral traits
       - "appearance": Extensive visual details
       - "visualPrompt": A technical, concise image generation prompt (e.g., "high-contrast, neon-backlit, silver-haired warrior")
       - "conflict": Their core narrative struggle
       - "goal": Their burning desire or mission
       - "flaw": Their deep-seated limitation
       - "speakingStyle": Their linguistic signature
       - "secret": A hidden truth or motivation
    
    3. "relationships": An array of objects representing the social architecture between these characters.
       - "source": Name of character A
       - "target": Name of character B
       - "type": One of ["Ally", "Rival", "Enemy", "Love", "Secret", "Master/Apprentice", "Familial", "Betrayal", "Stalker"]
       - "tension": A number from 1 to 10
       - "description": A short, impactful sentence on their dynamic.

    Return ONLY the JSON. No preamble.
  `;

  try {
    const prompt = `Generate a cast of ${count} characters for a ${genre} ${contentType} production.`;
    const text = await callAI(model, prompt, systemInstruction);
    
    if (!text) return "Failed to generate characters.";

    try {
      return cleanJson(text) as GeneratedCast;
    } catch (e) {
      console.warn("AI failed to return valid JSON for characters, falling back to manual parsing.");
      // Fallback extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         try {
           return JSON.parse(jsonMatch[0]) as GeneratedCast;
         } catch {
           return text;
         }
      }
      return text;
    }
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
      console.warn("[Cast Lab] API Quota Exceeded. Injecting Local Synthesis Failover.");
      return {
        markdown: "### [SYSTEM ERROR] Neural Link Severed\n\nThe AI Character Architect has reached its maximum daily throughput. Please wait 60 seconds and try a **Neural Surge** or a **Master Generate** once the quota resets.",
        characters: [],
        relationships: []
      };
    }
    console.error("Error generating characters:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}
