import { callAI } from "./core";
import { MOCK_SCRIPT } from "./mockData";
import { 
  SCRIPT_GENERATION_PROMPT, 
  SCRIPT_CONTINUATION_PROMPT, 
  SCRIPT_REWRITE_TENSION_PROMPT 
} from "../prompts";

function validateScriptInput(value: string, fieldName: string, minimumLength = 2): void {
  if (!value || typeof value !== 'string' || value.trim().length < minimumLength) {
    throw new Error(`${fieldName} must be a non-empty string with at least ${minimumLength} characters.`);
  }
}

function validateScriptSceneCount(numScenes: string): void {
  validateScriptInput(numScenes, 'Scene count', 1);
  const parsed = Number(numScenes);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error('Scene count must be a positive integer provided as a string.');
  }
  if (parsed < 6) {
    throw new Error('Scene count must be at least 6 scenes per episode.');
  }
}

function buildScriptSystemPrompt(
  contentType: string,
  tone: string,
  audience: string,
  session: string,
  episode: string,
  numScenes: string,
  recapperPersona: string,
  characterRelationships: string | null,
  worldBuilding: string | null,
  castProfiles: string | null,
  episodePlan: string | null,
  prompt: string
): string {
  const sourceContext = [
    episodePlan ? `EPISODE PLAN:\n${episodePlan}` : '',
    worldBuilding ? `WORLD CONTEXT:\n${worldBuilding}` : '',
    castProfiles ? `CAST REGISTRY:\n${castProfiles}` : '',
    characterRelationships ? `RELATIONSHIP MAP:\n${characterRelationships}` : ''
  ].filter(Boolean).join('\n\n');

  const baseInstruction = SCRIPT_GENERATION_PROMPT(
    contentType,
    tone,
    audience,
    session,
    episode,
    numScenes,
    episodePlan,
    worldBuilding,
    castProfiles,
    characterRelationships,
    recapperPersona
  );

  return `${baseInstruction}

ADDITIONAL PIPELINE CONTEXT:
${sourceContext || 'No extended pipeline context provided.'}

PROJECT PROMPT SEED:
${prompt}

SCRIPT RULES:
- The script must feel like a direct downstream translation of the world, series, cast, and relationship prompts.
- Scene progression should respect the episode plan and the established emotional arc.
- Narration should be compatible with later metadata, image, and video packaging.
- If the context is sparse, preserve canon and infer only what is logically supported.
`;
}

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
  validateScriptInput(prompt, 'Script prompt', 20);
  validateScriptInput(tone, 'Tone');
  validateScriptInput(audience, 'Audience');
  validateScriptInput(session, 'Session', 1);
  validateScriptInput(episode, 'Episode', 1);
  validateScriptSceneCount(numScenes);
  validateScriptInput(contentType, 'Content type');

  const systemInstruction = buildScriptSystemPrompt(
    contentType,
    tone,
    audience,
    session,
    episode,
    numScenes,
    recapperPersona,
    characterRelationships,
    worldBuilding,
    castProfiles,
    episodePlan,
    prompt
  );

  try {
    const callPrompt = `
WRITE A ${contentType.toUpperCase()} SCRIPT.
Tone: ${tone}
Audience: ${audience}
Session: ${session}
Episode: ${episode}
Scene Count: ${numScenes}

Project Prompt:
${prompt}
`;

    const text = await callAI(model, callPrompt, systemInstruction);
    return text || "Failed to generate script.";
  } catch (error: any) {
    console.error("Error generating script:", error);
    console.warn("[Script Lab] Falling back to MOCK_SCRIPT to preserve pipeline continuity.");
    return MOCK_SCRIPT;
  }
}

export async function continueScript(currentScript: string, model: string = "gemini-1.5-flash-latest", contentType: string = "Anime") {
  validateScriptInput(currentScript, 'Current script', 20);
  validateScriptInput(contentType, 'Content type');

  const systemInstruction = SCRIPT_CONTINUATION_PROMPT(contentType);

  try {
    const prompt = `
Continue this ${contentType} script with 3 more scenes.

CURRENT SCRIPT:
${currentScript}

CONTINUITY RULES:
- Preserve world logic, cast behavior, and emotional momentum.
- Build on the existing scene rhythm instead of restarting the story.
- Keep the new scenes usable for later storyboard, metadata, and image generation.
`;

    const text = await callAI(model, prompt, systemInstruction);
    return text || "Failed to continue script.";
  } catch (error) {
    console.error("Error continuing script:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function rewriteForTension(sceneDescription: string, model: string = "gemini-1.5-flash-latest") {
  validateScriptInput(sceneDescription, 'Scene description', 10);

  const systemInstruction = SCRIPT_REWRITE_TENSION_PROMPT;

  try {
    const prompt = `
Rewrite this scene for maximum tension.

SCENE DESCRIPTION:
${sceneDescription}

TENSION RULES:
- Increase urgency without changing the core meaning.
- Add sharper verbs, more pressure, and more immediate stakes.
- Keep the rewrite cinematic and production-friendly.
`;

    const text = await callAI(model, prompt, systemInstruction);
    return text || sceneDescription;
  } catch (error) {
    console.error("Error rewriting for tension:", error);
    return sceneDescription;
  }
}




