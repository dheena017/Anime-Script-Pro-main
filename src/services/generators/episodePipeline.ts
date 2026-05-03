import { generateScript } from './script';
import { generateScene } from './sceneGenerator';
import { generateImagePrompts } from './image';
import { generateVideoPrompts } from './video';
import { MOCK_SCRIPT } from './mockData';

type SceneAsset = {
  index: number;
  parsed?: Record<string, string>;
  sceneOutput: { narration: string; visuals: string; sound: string };
  imagePrompts?: string;
  videoPrompts?: string | null;
};

type EpisodeAssets = {
  script: string;
  episodeImagePrompts: string | null;
  episodeVideoPrompts: string | null;
  scenes: SceneAsset[];
  fallbackUsed: boolean;
};

function parseScriptToScenes(script: string, expectedScenes = 6): Record<string, string>[] {
  if (!script || typeof script !== 'string') return [];

  const lines = script.split('\n').map((l) => l.trim());

  // Try to detect a markdown table with a header that contains 'Scene'
  const headerIndex = lines.findIndex((l) => /^\|/.test(l) && /scene/i.test(l));
  if (headerIndex !== -1) {
    const headerCells = lines[headerIndex]
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);

    const rows = lines.slice(headerIndex + 1).filter((l) => /^\|/.test(l));

    return rows.map((row) => {
      const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
      const obj: Record<string, string> = {};
      headerCells.forEach((h, i) => {
        obj[h] = cells[i] || '';
      });
      return obj;
    });
  }

  // Fallback: split by blank lines and group into expectedScenes
  const paragraphs = script.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length <= expectedScenes) {
    return paragraphs.map((p, i) => ({ ['Scene ' + String(i + 1)]: p }));
  }

  // If more paragraphs than expected, chunk them
  const chunkSize = Math.ceil(paragraphs.length / expectedScenes);
  const chunks: Record<string, string>[] = [];
  for (let i = 0; i < paragraphs.length; i += chunkSize) {
    const group = paragraphs.slice(i, i + chunkSize).join('\n\n');
    chunks.push({ ['Scene ' + String(chunks.length + 1)]: group });
  }
  return chunks;
}

export async function generateEpisodeAssets(options: {
  prompt?: string;
  script?: string;
  tone?: string;
  audience?: string;
  session?: string;
  episode?: string;
  numScenes?: string;
  model?: string;
  contentType?: string;
  worldLore?: string | null;
  castProfiles?: string | null;
}): Promise<EpisodeAssets> {
  const {
    prompt,
    script: providedScript,
    tone = 'Hype/Energetic',
    audience = 'General Fans',
    session = '1',
    episode = '1',
    numScenes = '6',
    model = 'gemini-1.5-flash-latest',
    contentType = 'Anime',
    worldLore = null,
    castProfiles = null,
  } = options || {};

  let script = providedScript || '';
  let fallbackUsed = false;

  if (!script && !prompt) {
    // Nothing provided — use MOCK_SCRIPT
    script = MOCK_SCRIPT;
    fallbackUsed = true;
  }

  if (!script && prompt) {
    try {
      script = (await generateScript(prompt, tone, audience, session, episode, numScenes, model, contentType, '')) || '';
    } catch (err) {
      console.error('generateScript failed, using MOCK_SCRIPT fallback:', err);
      script = MOCK_SCRIPT;
      fallbackUsed = true;
    }
  }

  // Ensure we have a script
  if (!script) {
    script = MOCK_SCRIPT;
    fallbackUsed = true;
  }

  // Parse scenes
  const parsed = parseScriptToScenes(script, Number(numScenes || '6'));

  const scenes: SceneAsset[] = [];

  for (let i = 0; i < parsed.length; i++) {
    const row = parsed[i];
    const beatDescription = row['Narration'] || row['Visual Direction'] || Object.values(row).join(' ');

    try {
      const sceneOutput = await generateScene(script, beatDescription, model, worldLore, castProfiles, { temperature: 0.7, maxTokens: 1024 });

      // Generate image prompts for the scene (fallback preserved inside generator)
      const imagePrompts = await generateImagePrompts(sceneOutput.visuals || sceneOutput.narration, model);

      // Optionally generate scene-level video prompts (lightweight)
      let sceneVideoPrompts: string | null = null;
      try {
        sceneVideoPrompts = (await generateVideoPrompts(sceneOutput.narration || sceneOutput.visuals, model)) as string;
      } catch (err) {
        console.warn('Scene-level video prompt generation failed, continuing without scene video prompts.', err);
        sceneVideoPrompts = null;
      }

      scenes.push({
        index: i + 1,
        parsed: row,
        sceneOutput,
        imagePrompts,
        videoPrompts: sceneVideoPrompts,
      });
    } catch (err) {
      console.error('Scene generation error for scene', i + 1, err);
      scenes.push({
        index: i + 1,
        parsed: row,
        sceneOutput: { narration: '', visuals: '', sound: '' },
        imagePrompts: '',
        videoPrompts: null,
      });
    }
  }

  // Episode-level image and video prompts
  let episodeImagePrompts: string | null = null;
  let episodeVideoPrompts: string | null = null;

  try {
    episodeImagePrompts = (await generateImagePrompts(script, model)) as string;
  } catch (err) {
    console.warn('Episode-level image prompt generation failed:', err);
    episodeImagePrompts = null;
  }

  try {
    episodeVideoPrompts = (await generateVideoPrompts(script, model)) as string;
  } catch (err) {
    console.warn('Episode-level video prompt generation failed:', err);
    episodeVideoPrompts = null;
  }

  return {
    script,
    episodeImagePrompts,
    episodeVideoPrompts,
    scenes,
    fallbackUsed,
  };
}

export default generateEpisodeAssets;
