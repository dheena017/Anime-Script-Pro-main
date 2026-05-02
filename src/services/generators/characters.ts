import { callAI, RateLimitError } from "./core";
import { cleanJson } from "@/lib/api-utils";
import { CHARACTER_GENERATION_PROMPT, CHARACTER_RELATIONSHIP_PROMPT } from "../prompts";

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
  userRequest: string,
  model: string = "Gemini-2.5-Flash",
  contentType: string = "Anime",
  worldLore?: string,
  count: number = 8
): Promise<GeneratedCast | string> {

  const contextInjected = `
    ${worldLore ? `\nWORLD LORE CONTEXT: ${worldLore}\n` : ""}
    Characters MUST inhabit and reflect the above context's logic, history, and planned plot points.
  `;

  const systemInstruction = CHARACTER_GENERATION_PROMPT(contentType, contextInjected, count);

  try {
    const aiPrompt = `
      CRITICAL INSTRUCTION: You must determine the ideal size of the cast based on the world lore and production type.
      However, you ABSOLUTELY MUST generate AT LEAST ${count} characters. 
      YOUR OUTPUT WILL BE REJECTED IF THE "characters" ARRAY HAS FEWER THAN ${count} OBJECTS.
      Do NOT stop after generating just the core leads. You must populate the world with necessary Tier 2 (Support) and Tier 3 (Periphery) characters (e.g., mentors, villains, sleeper agents, mascots).
      
      User Request / Genre / Theme: ${userRequest}
      Production Type: ${contentType}
    `;
    const text = await callAI(model, aiPrompt, systemInstruction);

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
      console.warn("[Cast Lab] API Quota Exceeded. Throwing error to UI.");
      throw new Error("Neural Link Severed: API Quota Exceeded. Please wait 60 seconds before retrying.");
    }
    console.error("Error generating characters:", error);
    throw error;
  }
}

/**
 * generateRelationships
 * Synthesizes a complex web of social friction and alliances between an existing cast.
 */
export async function generateRelationships(
  genre: string,
  cast: string,
  model: string = "gemini-2.0-flash",
  contentType: string = "Anime"
): Promise<GeneratedCast['relationships']> {
  const systemInstruction = CHARACTER_RELATIONSHIP_PROMPT;

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




