import { callAI, RateLimitError } from "./core";
import { cleanJson } from "@/lib/api-utils";
import { MOCK_STORY_BIBLE } from "./mockData";
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

const SUPPLEMENTAL_CAST: GeneratedCharacter[] = [
  {
    name: "Mira Solace",
    archetype: "The Signal Runner",
    personality: "Fast-talking, observant, and impossible to pin down.",
    appearance: "Short silver braid, utility jacket, storm goggles, luminous patchwork interfaces.",
    visualPrompt: "anime character sheet, silver braid, storm goggles, utility jacket, luminous interfaces, neon-steampunk sky city",
    conflict: "Knows too much about the city's hidden transit network and keeps getting pulled into larger conspiracies.",
    goal: "Stay one step ahead of the system while helping the crew survive.",
    flaw: "Refuses to trust anyone long enough to be safe.",
    speakingStyle: "rapid, clipped, and full of technical shorthand",
    secret: "She has a stolen map to a sealed descent route.",
  },
  {
    name: "Orion Vale",
    archetype: "The Archive Keeper",
    personality: "Calm, meticulous, and quietly opinionated.",
    appearance: "Long coat, brass monocle interface, ink-stained gloves, weathered data satchels.",
    visualPrompt: "anime character sheet, archive keeper, brass monocle interface, long coat, data satchels, floating sky archive",
    conflict: "Protects forbidden records that could expose the truth behind the Great Shift.",
    goal: "Preserve the last unedited version of the world's history.",
    flaw: "Values information over people until forced to choose.",
    speakingStyle: "measured, formal, and precise",
    secret: "He has already met the rogue AI before the main story begins.",
  },
  {
    name: "Nara Voss",
    archetype: "The Dockside Mechanic",
    personality: "Blunt, fearless, and emotionally straightforward.",
    appearance: "Oil-slick overalls, copper tools, cropped hair, soot-streaked sleeves.",
    visualPrompt: "anime character sheet, dockside mechanic, oil-slick overalls, copper tools, soot-streaked sleeves, rust dock workshop",
    conflict: "Keeps the lower-city engines alive while the upper tiers hoard power.",
    goal: "Build a machine that can survive the descent into the storm core.",
    flaw: "Solves every problem with force before asking for help.",
    speakingStyle: "direct, low, and practical",
    secret: "She can bypass Cloud Council locks without leaving a trace.",
  },
];

function buildFallbackCharacter(index: number, userRequest: string, contentType: string): GeneratedCharacter {
  const source = MOCK_STORY_BIBLE.cast[index % MOCK_STORY_BIBLE.cast.length];
  const supplemental = SUPPLEMENTAL_CAST[index - MOCK_STORY_BIBLE.cast.length];

  if (supplemental) {
    return supplemental;
  }

  const variant = Math.floor(index / MOCK_STORY_BIBLE.cast.length);
  const variantLabel = variant > 0 ? ` ${variant + 1}` : "";

  return {
    name: `${source.name}${variantLabel}`,
    archetype: source.archetype,
    personality: `${source.psychology} The character is tuned to the story's central conflict: ${MOCK_STORY_BIBLE.theme.toLowerCase()}.`,
    appearance: source.visuals,
    visualPrompt: `${source.visuals}, cinematic anime character sheet, ${MOCK_STORY_BIBLE.visualPalette}, ${contentType} production still`,
    conflict: `${source.role} is strained by ${MOCK_STORY_BIBLE.theme.toLowerCase()} while responding to ${userRequest}.`,
    goal: source.name.includes("Anya")
      ? "Protect the cast and uncover the truth behind the anomaly."
      : source.name.includes("Taro")
        ? "Keep the younger generation alive long enough to break the cycle."
        : source.name.includes("Rika")
          ? "Force the world into a controlled upgrade."
          : source.name.includes("Sachi")
            ? "Prove she can stand beside Anya and survive the storm."
            : "Preserve order and keep the system from collapsing.",
    flaw: `${source.psychology} The flaw deepens whenever the system is under pressure.`,
    speakingStyle: source.name.includes("Rika")
      ? "cold, elegant, and absolute"
      : source.name.includes("Taro")
        ? "gruff, dry, and world-weary"
        : source.name.includes("Sachi")
          ? "bright, impulsive, and emotional"
          : "sharp, tactical, and guarded",
    secret: `${source.name} is hiding a connection to ${MOCK_STORY_BIBLE.worldName}'s deeper collapse.`,
  };
}

function buildFallbackCast(userRequest: string, contentType: string, count: number): GeneratedCast {
  const characters = Array.from({ length: count }, (_, index) => buildFallbackCharacter(index, userRequest, contentType));
  const names = characters.map(character => character.name);

  const relationshipTemplates: GeneratedCast['relationships'] = [
    {
      source: characters[0]?.name || "Anya Wraith",
      target: characters[1]?.name || "Taro Tanaka",
      type: "Familial" as RelationshipType,
      tension: 86,
      description: "A protective bond shaped by guilt, survival, and unspoken history.",
    },
    {
      source: characters[0]?.name || "Anya Wraith",
      target: characters[2]?.name || "Rika Nyx",
      type: "Enemy" as RelationshipType,
      tension: 98,
      description: "A direct ideological clash between human instinct and synthetic control.",
    },
    {
      source: characters[3]?.name || "Sachi Nakamura",
      target: characters[0]?.name || "Anya Wraith",
      type: "Master/Apprentice" as RelationshipType,
      tension: 72,
      description: "A fast-growing bond between inspiration, mentorship, and battlefield pressure.",
    },
    {
      source: characters[4]?.name || "Kenji Ito",
      target: characters[0]?.name || "Anya Wraith",
      type: "Betrayal" as RelationshipType,
      tension: 94,
      description: "An unresolved betrayal that still shapes every tactical decision.",
    },
  ].filter(relationship => names.includes(relationship.source) && names.includes(relationship.target));

  const markdown = [
    `# ${MOCK_STORY_BIBLE.title}`,
    ``,
    `## Cast Matrix`,
    ...characters.map((character, index) => `### ${index + 1}. ${character.name}\n- Archetype: ${character.archetype}\n- Personality: ${character.personality}\n- Appearance: ${character.appearance}\n- Conflict: ${character.conflict}\n- Goal: ${character.goal}\n- Flaw: ${character.flaw}\n- Speaking Style: ${character.speakingStyle}\n- Secret: ${character.secret}`),
  ].join("\n");

  return {
    markdown,
    characters,
    relationships: relationshipTemplates,
  };
}

function buildFallbackRelationships(cast: string): GeneratedCast['relationships'] {
  const names = MOCK_STORY_BIBLE.cast.map(character => character.name);

  return [
    {
      source: names[0],
      target: names[1],
      type: "Familial" as RelationshipType,
      tension: 86,
      description: `A protective bond shaped by the cast archive implied in ${cast}.`,
    },
    {
      source: names[0],
      target: names[2],
      type: "Enemy" as RelationshipType,
      tension: 98,
      description: "A direct clash between human instinct and synthetic control.",
    },
    {
      source: names[3],
      target: names[0],
      type: "Master/Apprentice" as RelationshipType,
      tension: 72,
      description: "A dynamic between inspiration, mentorship, and battlefield pressure.",
    },
    {
      source: names[4],
      target: names[0],
      type: "Betrayal" as RelationshipType,
      tension: 94,
      description: "An unresolved betrayal that continues to shape the wider conflict.",
    },
  ];
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

    if (!text) return buildFallbackCast(userRequest, contentType, count);

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
          return buildFallbackCast(userRequest, contentType, count);
        }
      }
      return buildFallbackCast(userRequest, contentType, count);
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
      console.warn("[Cast Lab] API Quota Exceeded. Using local cast bible fallback.");
      return buildFallbackCast(userRequest, contentType, count);
    }
    console.error("Error generating characters:", error);
    return buildFallbackCast(userRequest, contentType, count);
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

    if (!text) return buildFallbackRelationships(cast);

    try {
      return cleanJson(text) as GeneratedCast['relationships'];
    } catch {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : buildFallbackRelationships(cast);
    }
  } catch (error) {
    console.error("Error generating relationships:", error);
    return buildFallbackRelationships(cast);
  }
}




