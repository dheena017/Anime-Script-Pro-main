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

  const systemInstruction = `
    You are an expert ${contentType} Character Designer and Story Consultant.
    Based on the provided genre, theme, and world lore, you must dynamically determine the optimal number of characters needed to tell this story. You must generate a fully fleshed-out cast that fills out all structural tiers (Core, Support, and Periphery).
    ${contextInjected}
    
    Please utilize the following comprehensive structural framework to architect the characters:

    --- TIER 1: THE CORE (Load-Bearing Pillars) ---
    - The Protagonist (The Anchor): The lens of the world. Every major plot event must connect to their goals, growth, or survival. (Archetypes: Hot-blooded Shonen Hero lacking raw skill but having boundless potential; Cynical Isekai Everyman acting as the audience surrogate; or OP Loner hiding their max-level strength to find purpose).
    - The Deuteragonist (The Rival/Shield): The second most important character. Has a distinct, often conflicting internal goal. If the hero is fire/loud, they are ice/strategy. They constantly push the protagonist to grow.
    - The Tritagonist (The Third Pillar): Balances the dynamic between the Anchor and the Rival, providing emotional grounding, tactical support, or a unique philosophical viewpoint.
    - The Prime Antagonist (The Big Bad): The ultimate wall. Their goals are the exact opposite or a twisted dark mirror of the Protagonist's goals.

    --- TIER 2: THE SUPPORT (Sub-Characters & Local Conflict) ---
    - The Nakama (Core Party): Loyal friends/guildmates with specific tactical roles (Healer, Tank, Scout) handling secondary battles.
    - The Mentor Figure: Highly skilled, eccentric veteran who teaches the power system/lore. Must eventually step aside, get captured, or die to force the protagonist's independence.
    - The Lieutenants (Elite Guard): The Prime Antagonist's terrifyingly strong right-hand enforcers serving as arc mini-bosses.
    - The Dark Foil: An antagonist who shares the exact same origin or powers as the protagonist but made one crucial, dark choice differently.

    --- TIER 3 & 4: THE PERIPHERY & NARRATIVE DEVICES ---
    - The Ojou-sama (Noble Heir): Haughty, wealthy, carries a fan/umbrella, laughs distinctively, but struggles with immense family pressure.
    - The Mascot: Small, non-human entity providing comic relief, exposition on magic systems, and tension breaking.
    - The MacGuffin: A character who is effectively an object to be won, rescued, or escorted (e.g., child with forbidden magic).
    - World-Builders: Shopkeepers, guild receptionists, or episodic allies who exist strictly to provide resources or localized exposition.

    --- BEHAVIORAL LOGIC ("-Dere" Spectrum) ---
    Assign these specific psychological logic loops to dictate dialogue and inner conflict where appropriate:
    - Tsundere: Hostile/arrogant exterior, caring interior. (Logic loop: If complimented -> Output anger/denial -> Update internal affection metric).
    - Kuudere: Cold, pragmatic, emotionless. Stays flawlessly calm in high-stress, rarely showing a faint vulnerability.
    - Dandere: Paralyzed by anxiety and extremely shy, but desperately wants to be social. Opens up only to the Core Leads.
    - Yandere: Sweet and innocent on the surface, but deeply unstable, obsessive, and willing to commit extreme violence to possess their loved one.

    Ensure every character has a distinct, deep psychological profile, a clear motive, and cinematic visual DNA.
    You MUST return a JSON object with the following exact structure:
    
    1. "castSize": An integer representing the total number of characters you generated (MUST be >= ${count}).
    2. "characters": An array of EXACTLY "castSize" objects for each character:
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
    
    3. "relationships": An array of objects representing the social architecture between these characters. You MUST utilize the following frameworks for their dynamic:
       - RIVALRY: Ideological Rivalry, Friendly Rivalry (Sparring Partners), or One-Sided Rivalry.
       - POWER/MENTORSHIP: Master & Apprentice, Commander & Soldier, or Creator & Creation.
       - BONDING: The Nakama (Found Family), Protector & VIP, or The Sibling Dynamic.
       - ROMANTIC: The Slow Burn, The Fated Pair / Star-Crossed, or The Oblivious Protagonist.
       - BETRAYAL: The Sleeper Agent, or The Necessary Evil.

       - "source": Name of character A
       - "target": Name of character B
       - "type": One of ["Ally", "Rival", "Enemy", "Love", "Secret", "Master/Apprentice", "Familial", "Betrayal", "Stalker"]
       - "tension": A number from 1 to 10 (1 = total peace, 10 = extreme friction or lethal intent)
       - "description": A short, impactful sentence explicitly utilizing one of the specific sub-dynamics above (e.g., "Ideological Rivalry: Both want the throne but through opposite methods").

    Return ONLY the JSON. No preamble.
  `;

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
  const systemInstruction = `
    You are an expert Social Architect and Script Consultant.
    Based on the provided cast of characters and the genre/prompt, generate a complex web of relationships utilizing the following comprehensive dynamic frameworks:

    --- 1. THE RIVALRY DYNAMICS (The Growth Engine) ---
    - Ideological Rivalry: Both want the exact same thing but their methods are completely opposite (Righteous vs Ruthless).
    - Friendly Rivalry (Sparring Partners): Allies constantly competing. Dialogue must feature heavy sarcasm, betting, and deep mutual respect.
    - One-Sided Rivalry: Character A is obsessed with defeating Character B. Character B barely acknowledges A exists (Comedic relief or tragic villainy).

    --- 2. THE POWER & MENTORSHIP DYNAMICS (The Lore Engine) ---
    - Master & Apprentice: Master is eccentric/harsh but deeply cares. Logic Loop: Withhold final lesson until Apprentice is pushed to absolute limit.
    - Commander & Soldier: Strict military/guild hierarchy. Conflict arises when Soldier must choose between a harsh order and doing what is morally right.
    - Creator & Creation: One literally made the other (Cyborg/Homunculus). Dynamic revolves entirely around control vs free will.

    --- 3. THE BONDING DYNAMICS (The Emotional Core) ---
    - The Nakama (Found Family): Misfits bound by absolute loyalty. Logic Loop: They will abandon all logic and risk the entire mission if one is captured.
    - Protector & VIP: Highly capable sworn to protect weaker. Dialogue slowly shifts from strictly professional to deeply protective.
    - The Sibling Dynamic: Fiercely protective or deeply resentful. If on opposite sides, causes massive emotional damage in fights.

    --- 4. THE ROMANTIC DYNAMICS (The Tension Engine) ---
    - The Slow Burn: Forced to work together, constantly bicker. Hostility slowly decreases, replaced by subtle, unspoken sacrifices.
    - The Fated Pair / Star-Crossed: Soulmates prevented by world logic (warring factions). Dialogue is dramatic, tragic, and desperate.
    - The Oblivious Protagonist: A loves B deeply. B thinks they are just really good friends and misses all cues (Comedy trope).

    --- 5. THE BETRAYAL DYNAMICS (The Plot Twist) ---
    - The Sleeper Agent: Established as a loyal Nakama, but holds a hidden true_allegiance. Flips at the climax to turn on the party.
    - The Necessary Evil: Betrays the protagonist, but only did it to save the protagonist from a much worse fate.

    You MUST return a JSON array of objects, each with:
    - "source": Name of character A
    - "target": Name of character B
    - "type": One of ["Ally", "Rival", "Enemy", "Love", "Secret", "Master/Apprentice", "Familial", "Betrayal", "Stalker"]
    - "tension": A number from 1 to 10 (1 = total peace, 10 = extreme friction or lethal intent)
    - "description": A short, impactful sentence explicitly utilizing one of the specific sub-dynamics above.
    
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
