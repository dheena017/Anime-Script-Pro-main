import { generateWorld } from "./generators/world";
import { generateCharacters } from "./generators/characters";
import { generateSeriesPlan } from "./generators/series";
import { generateProductionSequences, ProductionUnit } from "../lib/sequence-utils";
import { apiRequest } from "@/lib/api-utils";
import { VIBE_LIBRARY } from "@/lib/vibe-presets";

import { callAI } from "./generators/core";

export interface ProductionContext {
  prompt: string;
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
    // PHASE 1: FOUNDATION (Global Variables)
    if (onProgress) onProgress("PHASE 1: Initializing World Lore Source of Truth...");
    const world = await this.initializeFoundation();
    
    // PHASE 2: ARCHITECTURE (Outer Loops: SESS & EP)
    if (onProgress) onProgress("PHASE 2: Structuring Sessions and 60 Episode Beats...");
    const { cast, series } = await this.buildArchitecture(world);
    
    // PHASE 3: GENERATION (Inner Loop: SCEN)
    if (onProgress) onProgress("PHASE 3: Scaffolding 960 Scene Units (The Factory Floor)...");
    const sequences = await this.scaffoldGeneration(series);
    
    // PHASE 4: DISTRIBUTION (Polish & SEO)
    if (onProgress) onProgress("PHASE 4: Preparing Screening Room & SEO Metadata...");
    await this.prepareDistribution();

    return {
      project: this.project,
      world,
      cast,
      series,
      sequences
    };
  }

  private async initializeFoundation(): Promise<string> {
    const preset = VIBE_LIBRARY[this.context.vibe?.toLowerCase() || ""] || VIBE_LIBRARY["ufotable-noir"];
    
    // initialize project in PostgreSQL
    this.project = await apiRequest("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        user_id: this.context.userId,
        name: `Production: ${this.context.prompt.slice(0, 30)}...`,
        content_type: this.context.contentType,
        prompt: this.context.prompt,
        vibe: preset.name,
        prod_metadata: {
          style_preset: preset,
          engine_version: "2.0-god-mode"
        }
      })
    });

    // Generate and save global World Lore
    const world = await generateWorld(this.context.prompt, this.context.model, this.context.contentType);
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

  private async buildArchitecture(world: string) {
    // 1. Generate Cast with Visual DNA (Global for all 960 units)
    const rawCast = await generateCharacters(this.context.prompt, this.context.model, this.context.contentType, world);
    
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
    
    // 2. Generate 5 Major Sessions (Arcs) dynamically via AI
    const sessions = await this.generateSessions(world);

    const savedSessions = await apiRequest<any[]>("/api/sessions", {
      method: "POST",
      body: JSON.stringify({ project_id: this.project.id, sessions })
    });

    // 3. Generate 60 Episode Narrative Beats (Series Plan)
    const series = await generateSeriesPlan(this.context.prompt, this.context.model, this.context.contentType, 60);
    
    if (!Array.isArray(series)) throw new Error("Failed to generate series episodes.");

    // Save Episodes to DB, linking them to their respective sessions
    // (A session has 12 episodes: 12 * 5 = 60)
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

    return { cast, series };
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
    const orchestratorModel = this.context.model || "gemini-2.5-flash";
    
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

  private async prepareDistribution() {
    // Initialize SEO records or screening room metadata
    // Placeholder for Phase 4 automation
    return true;
  }
}
