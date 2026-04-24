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
  model: string = "gemini-2.0-flash-exp", 
  contentType: string = "Anime",
  worldLore?: string,
  narrativeBeats?: string,
  count: number = 3
): Promise<GeneratedCast | string> {
  
  const contextInjected = `
    ${worldLore ? `\nWORLD LORE CONTEXT: ${worldLore}\n` : ""}
    ${narrativeBeats ? `\nNARRATIVE BEATS CONTEXT: ${narrativeBeats}\n` : ""}
    Characters MUST inhabit and reflect the above context's logic, history, and planned plot points.
  `;

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

/**
 * generateRelationships
 * Synthesizes a complex web of social friction and alliances between an existing cast.
 */
export async function generateRelationships(
  genre: string,
  cast: string,
  model: string = "gemini-2.0-flash-exp",
  contentType: string = "Anime"
): Promise<GeneratedCast['relationships']> {
  const systemInstruction = `
    You are an expert Social Architect and Script Consultant.
    Based on the provided cast of characters and the genre/prompt, generate a complex web of relationships.
    
    You MUST return a JSON array of objects, each with:
    - "source": Name of character A
    - "target": Name of character B
    - "type": One of ["Ally", "Rival", "Enemy", "Love", "Secret", "Master/Apprentice", "Familial", "Betrayal", "Stalker"]
    - "tension": A number from 1 to 10
    - "description": A short, impactful sentence on their dynamic.
    
    Return ONLY the JSON array. No preamble.
  `;
  
  try {
    const prompt = `Generate a relationship matrix for the following characters in a ${genre} ${contentType}: ${cast}`;
    const text = await callAI(model, prompt, systemInstruction);
    
    if (!text) return [];
    
    try {
      return cleanJson(text) as GeneratedCast['relationships'];
    } catch {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }
  } catch (error) {
    console.error("Error generating relationships:", error);
    return [];
  }
}
