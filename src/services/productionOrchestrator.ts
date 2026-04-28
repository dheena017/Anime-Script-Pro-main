import { generateWorld } from "./generators/world";
import { generateCharacters } from "./generators/characters";
import { generateSeriesPlan } from "./generators/series";
import { generateScript } from "./generators/script";
import { generateProductionSequences, ProductionUnit } from "../lib/sequence-utils";
import { apiRequest } from "@/lib/api-utils";
import { VIBE_LIBRARY } from "@/lib/vibe-presets";

import { callAI } from "./generators/core";

export interface ProductionContext {
  prompt: string;
  theme?: string;
  contentType: string;
  model: string;
  userId: string;
  vibe?: string;
}

export interface OrchestrationResult {
  project: any;
  world: string;
  cast: any;
  series: any[];
  sequences: ProductionUnit[];
}

/**
 * ProductionOrchestrator
 * Implements the 4-Phase architecture for autonomous "God Mode" production.
 */
export class ProductionOrchestrator {
  private context: ProductionContext;
  private project: any = null;

  constructor(context: ProductionContext) {
    this.context = context;
  }

  async executeFullCycle(onProgress?: (phase: string, data?: any) => void): Promise<OrchestrationResult> {
    try {
      // STATE 01: WORLD Lore
      if (onProgress) onProgress("STATE 01: Initializing Anime World Lore...");
      const world = await this.initializeFoundation();

      // STATE 02: Narrative SCALPEL
      if (onProgress) onProgress("STATE 02: Structuring 60 Episode Series Plan...");
      const { series } = await this.buildSeries(world);

      // STATE 03: CHARACTER DNA
      if (onProgress) onProgress("STATE 03: Synthesizing Cast Visual DNA...");
      const cast = await this.buildCast(world);

      // STATE 04: SERIES Roadmap
      if (onProgress) onProgress("STATE 04: Architecting Series Roadmap...");
      await this.saveSeriesPlan(series);

      // STATE 05: SCRIPT Engine
      if (onProgress) onProgress("STATE 05: Initializing Script Engine Pilot...");
      await this.materializePilot(world, cast, series[0]);

      // STATE 06: VISUAL Manifest
      if (onProgress) onProgress("STATE 06: Scaffolding 960 Scene Storyboards...");
      const sequences = await this.scaffoldGeneration(series);

      // STATE 07: GLOBAL Reach
      if (onProgress) onProgress("STATE 07: Optimizing SEO Metadata...");
      await this.prepareSEO();

      // STATE 08: ASSET Synthesis
      if (onProgress) onProgress("STATE 08: Refining Visual Prompts...");
      await this.preparePrompts();

      // STATE 09: PREMIERE Hub
      if (onProgress) onProgress("STATE 09: Initializing Screening Room Premiere...");
      await this.prepareScreening();

      // STATE 10: CORE Logic
      if (onProgress) onProgress("STATE 10: Finalizing Studio Engine Parameters...");
      await new Promise(r => setTimeout(r, 1000)); // Final engine sync

      return {
        project: this.project,
        world,
        cast,
        series,
        sequences
      };
    } catch (error: any) {
      const errorMsg = error?.message || "Unknown Orchestration Error";
      console.error(`[ORCHESTRATOR-FAILURE] ${errorMsg}`, error);
      if (onProgress) onProgress(`CRITICAL_FAILURE: ${errorMsg}`);
      throw error; // Re-throw to let the UI handle the final notification
    }
  }

  private getCombinedPrompt(): string {
    return `${this.context.prompt}${this.context.theme ? `\n\nAesthetic Theme/Vibe: ${this.context.theme}` : ''}`;
  }

  private async initializeFoundation(): Promise<string> {
    const preset = VIBE_LIBRARY[this.context.vibe?.toLowerCase() || ""] || VIBE_LIBRARY["ufotable-noir"];

    // initialize project in PostgreSQL
    this.project = await apiRequest("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        user_id: this.context.userId,
        title: `Production: ${this.context.prompt.slice(0, 30)}...`,
        content_type: this.context.contentType,
        prompt: this.context.prompt,
        vibe: preset.name,
        prod_metadata: {
          style_preset: preset,
          engine_version: "2.0-god-mode"
        }
      })
    });

    // Save production method to DB
    await apiRequest("/api/methods", {
      method: "POST",
      body: JSON.stringify({
        name: preset.name,
        description: `Autonomous production vibe for project ${this.project.id}`
      })
    });

    // Generate and save global World Lore
    const worldPrompt = this.getCombinedPrompt();
    const world = await generateWorld(worldPrompt, this.context.model, this.context.contentType);
    await apiRequest("/api/world-lore", {
      method: "POST",
      body: JSON.stringify({
        project_id: this.project.id,
        markdown_content: world,
        metadata: { source: "AI Core", version: "1.0" }
      })
    });

    return world;
  }

  private async buildSeries(world: string) {
    const architecturePrompt = this.getCombinedPrompt();
    // 1. Generate 5 Major Sessions (Arcs) dynamically via AI
    const sessions = await this.generateSessions(world);

    const savedSessions = await apiRequest<any[]>("/api/sessions", {
      method: "POST",
      body: JSON.stringify({ project_id: this.project.id, sessions })
    });

    // 2. Generate 60 Episode Narrative Flow (Series Plan)
    const series = await generateSeriesPlan(architecturePrompt, this.context.model, this.context.contentType, 60);

    if (!Array.isArray(series)) throw new Error("Failed to generate series episodes.");

    return { series, savedSessions };
  }

  private async buildCast(world: string) {
    const architecturePrompt = this.getCombinedPrompt();
    // Generate Cast with Visual DNA (Global for all 960 units)
    const rawCast = await generateCharacters(architecturePrompt, this.context.model, this.context.contentType, world);

    // Process cast into a registry with "Visual DNA"
    const charactersList = (typeof rawCast !== 'string' && rawCast.characters) ? rawCast.characters : [];
    const cast = charactersList.map((c: any) => ({
      ...c,
      visual_dna: `[Trait: ${c.personality}, Appearance: ${c.appearance}]`
    }));

    // Save to DB
    await apiRequest("/api/characters", {
      method: "POST",
      body: JSON.stringify({ project_id: this.project.id, characters: cast })
    });

    return cast;
  }

  private async saveSeriesPlan(series: any[]) {
    // Fetch sessions created in buildSeries
    const savedSessions = await apiRequest<any[]>(`/api/sessions?project_id=${this.project.id}`);

    // Save Episodes to DB, linking them to their respective sessions
    for (const session of savedSessions) {
      const epStart = (session.session_number - 1) * 12;
      const epBatch = series.slice(epStart, epStart + 12);

      await apiRequest("/api/episodes", {
        method: "POST",
        body: JSON.stringify({
          project_id: this.project.id,
          session_id: session.id,
          episodes: epBatch.map((e: any, idx: number) => ({
            episode_number: epStart + idx + 1,
            title: e.title || `Episode ${epStart + idx + 1}`,
            hook: e.hook || '',
            summary: e.summary || ''
          }))
        })
      });
    }
  }

  private async scaffoldGeneration(_series: any[]): Promise<ProductionUnit[]> {
    console.log("[PHASE 3] Starting Initial Scaffolding for 960 Skeletons...");

    // 1. Generate the 960 units blueprint (5 SESS * 12 EP * 16 SCEN)
    const sequences = generateProductionSequences(5, 12, 16);

    // Group sequences by episode to batch insert
    // This simulates the "bulkCreate" requested
    const dbEpisodes = await apiRequest<any[]>(`/api/episodes?project_id=${this.project.id}`);

    for (const ep of dbEpisodes) {
      const epSequences = sequences.filter(s => s.sess === Math.ceil(ep.episode_number / 12) && s.ep === ((ep.episode_number - 1) % 12) + 1);

      await apiRequest("/api/scenes", {
        method: "POST",
        body: JSON.stringify({
          project_id: this.project.id,
          episode_id: ep.id,
          scenes: epSequences.map((_, idx) => ({
            scene_number: (ep.episode_number - 1) * 16 + (idx + 1),
            status: "QUEUED",
            visual_variance_index: Math.floor(idx / 4)
          }))
        })
      });
    }

    console.log(`[ORCHESTRATOR] Successfully scaffolded 960 scene records with visual variance markers.`);

    return sequences;
  }

  private async generateSessions(world: string): Promise<any[]> {
    const systemInstruction = `
      You are an expert Story Architect for ${this.context.contentType}.
      Based on the provided World Lore and Prompt, create a 5-Session production arc.
      Each Session should represent a major narrative milestone.
      
      Return ONLY a JSON array with exactly 5 objects:
      [
        { "session_number": 1, "title": "Session Title", "summary": "Detailed summary of the session goals" },
        ...
      ]
    `;
    const prompt = `World Lore: ${world}\n\nProject Concept: ${this.context.prompt}\n\nGenerate the 5 major sessions.`;
    const orchestratorModel = this.context.model || "gemini-2.0-flash-exp";

    try {
      const result = await callAI(orchestratorModel, prompt, systemInstruction);
      const cleanJson = result.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Session Generation failed, using generic fallback arcs", e);
      return [
        { session_number: 1, title: "PHASE_01_INIT", summary: "Establishing narrative foundation and world-state." },
        { session_number: 2, title: "PHASE_02_DEVELOP", summary: "Synthesizing secondary conflicts and character friction." },
        { session_number: 3, title: "PHASE_03_TRANSITION", summary: "Architectural shift in narrative momentum." },
        { session_number: 4, title: "PHASE_04_PEAK", summary: "Peak intensity and climax orchestration." },
        { session_number: 5, title: "PHASE_05_CONCLUSION", summary: "Resolving all active narrative threads." }
      ];
    }
  }

  private async prepareSEO() {
    await apiRequest("/api/seo_entries", {
      method: "POST",
      body: JSON.stringify({
        keyword: `ANIME_${this.project.id}_${this.context.prompt.slice(0, 10).toUpperCase()}`,
        description: `Autonomous production metadata for ${this.context.prompt}`
      })
    });
  }

  private async preparePrompts() {
    await apiRequest("/api/prompts", {
      method: "POST",
      body: JSON.stringify({
        text: this.context.prompt,
        context: "MASTER_PRODUCTION_SEED"
      })
    });
  }

  private async prepareScreening() {
    const scripts = await apiRequest<any[]>(`/api/scripts?project_id=${this.project.id}`);
    if (scripts && scripts.length > 0) {
      await apiRequest("/api/screening_room_entries", {
        method: "POST",
        body: JSON.stringify({
          script_id: scripts[0].id,
          feedback: "Awaiting Initial Production Review..."
        })
      });
    }
  }

  private async materializePilot(world: string, cast: any, firstEpisode: any) {
    const scriptPrompt = `PILOT_PILOT: ${this.context.prompt}\n\nEPISODE_GOAL: ${firstEpisode.title} - ${firstEpisode.summary || firstEpisode.hook}`;

    // Convert cast to string if it's an array
    const castProfiles = Array.isArray(cast)
      ? cast.map(c => `${c.name} (${c.role}): ${c.personality}`).join('\n')
      : JSON.stringify(cast);

    const scriptMarkdown = await generateScript(
      scriptPrompt,
      this.context.vibe || "Energetic",
      "Anime Fans",
      "1",
      "1",
      "8", // 8 scenes for the pilot starter
      this.context.model,
      this.context.contentType,
      "SHOGUN_AI",
      null, // characterRelationships
      world,
      castProfiles
    );

    // Save Pilot Script to DB
    const dbEpisodes = await apiRequest<any[]>(`/api/episodes?project_id=${this.project.id}`);
    const firstEp = dbEpisodes.find(e => e.episode_number === 1);

    await apiRequest("/api/scripts", {
      method: "POST",
      body: JSON.stringify({
        project_id: this.project.id,
        episode_id: firstEp?.id,
        title: `PILOT: ${firstEpisode.title}`,
        content: scriptMarkdown
      })
    });

    return scriptMarkdown;
  }
}
