import { callAI, RateLimitError } from "./core";
import { MOCK_WORLD } from "./mockData";
import { WORLD_GENERATION_PROMPT } from "../prompts";

function validateWorldPrompt(prompt: string): void {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 20) {
    throw new Error('World prompt must be at least 20 characters long.');
  }
}

function validateWorldModel(model: string): void {
  if (!model || typeof model !== 'string' || model.trim().length < 2) {
    throw new Error('Model name must be a non-empty string.');
  }
}

function normalizeContentType(contentType: string): string {
  return contentType.trim() || 'Anime';
}

function buildWorldPrompt(prompt: string, contentType: string): string {
  return `
CONTENT TYPE: ${contentType}
PROJECT PROMPT: ${prompt}

CONNECTION RULES:
- The world must support character generation, relationship mapping, series planning, scene breakdowns, image prompts, metadata packaging, and channel growth assets.
- Define the world's lore so it can produce consistent cast archetypes, faction politics, episode arcs, scene beats, and visual prompt language.
- Establish clear social hierarchies, power rules, sensory identity, and historical pressure that can be reused across the full prompt pipeline.
- Make the world strong enough to feed downstream prompts without needing reinterpretation.
- Ensure the lore can be translated directly into characters, series sessions, script scenes, thumbnail concepts, alt text, and marketing copy.

PIPELINE ALIGNMENT:
- Character prompts should be able to derive archetypes, flaws, secrets, and power logic from this world.
- Series prompts should be able to derive episode milestones, factions, and escalation from this world.
- Scene prompts should be able to derive blocking, mood, geography, sound, and continuity from this world.
- Image prompts should be able to derive composition, lighting, costume state, and environmental detail from this world.
- Metadata prompts should be able to derive keywords, hooks, and thumbnail concepts from this world.

SOURCE OF TRUTH:
- Treat the project prompt as the canonical story seed.
- Build a coherent world that can sustain long-form narrative, visual storytelling, and SEO packaging.
- Prefer specific, reusable lore elements over vague atmosphere.
`;
}

export async function generateWorld(prompt: string, model: string = "gemini-2.5-flash", contentType: string = "Anime") {
  validateWorldPrompt(prompt);
  validateWorldModel(model);

  const normalizedContentType = normalizeContentType(contentType);
  const enhancedPrompt = buildWorldPrompt(prompt, normalizedContentType);

  const systemInstruction = WORLD_GENERATION_PROMPT(normalizedContentType);

  try {
    const text = await callAI(model, enhancedPrompt, systemInstruction);
    if (!text) throw new Error("Synthesis produced no data.");
    if (text.startsWith("ERROR:")) throw new Error(text);
    return text;
  } catch (error: any) {
    console.error("Error generating world:", error);

    // If all retries fail, return mock data as a last resort to keep the UI functional and downstream prompts connected
    if (error instanceof RateLimitError || error?.status === 429) {
      console.warn("[World Lab] API Exhausted after retries. Injecting Local Synthesis Failover.");
      return MOCK_WORLD;
    }

    console.warn("[World Lab] Falling back to local mock world to preserve downstream prompt generation.");
    return MOCK_WORLD;
  }
}




