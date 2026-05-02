import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-utils';
import { ProductionUnit } from '@/lib/sequence-utils';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { engineApi } from '../services/api/engine';
import { worldApi } from '../services/api/world';
import { productionApi } from '../services/api/production';
import { AI_EVENTS } from '../services/generators/core';
import { useLogs } from './LogContext';

interface GeneratorState {
  worldLore: any;
  seriesPlan: any;
  storyboardPrompts: any;
  seoMetadata: any;
  prompt: string;
  theme: string;
  generatedScript: string | null;
  generatedCharacters: string | null;
  generatedMetadata: string | null;
  generatedImagePrompts: string | null;
  generatedSeriesPlan: any[] | null;
  generatedDescription: string | null;
  generatedWorld: string | null;
  generatedAltText: string | null;
  visualData: Record<number, string[]>;
  videoData: Record<number, string>;
  castProfiles: string | null;
  castData: any | null;
  castList: any[];
  recapperPersona: string;
  characterRelationships: string | null;
  tone: string;
  audience: string;
  episode: string;
  session: string;
  numScenes: string;
  contentType: string;
  selectedModel: string;
  isLoading: boolean;
  isGeneratingCharacters: boolean;
  isGeneratingMetadata: boolean;
  isGeneratingImagePrompts: boolean;
  isGeneratingSeries: boolean;
  isGeneratingDescription: boolean;
  isGeneratingWorld: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isContinuingScript: boolean;
  isGeneratingVisuals: boolean;
  isGeneratingAltText: boolean;
  currentScriptId: string | null;
  history: any[];
  productionSequence: ProductionUnit[];
  isLiked: boolean;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  architecture: string | null;
  atlas: string | null;
  historyLore: string | null;
  systems: string | null;
  culture: string | null;
  generatedGrowthStrategy: string | null;
  isGeneratingGrowthStrategy: boolean;
  generatedDistributionPlan: string | null;
  isGeneratingDistribution: boolean;
}

interface GeneratorDispatch {
  setPrompt: (p: string) => void;
  setTheme: (t: string) => void;
  setGeneratedScript: (s: string | null) => void;
  setGeneratedCharacters: (c: string | null) => void;
  setGeneratedMetadata: (m: string | null) => void;
  setGeneratedImagePrompts: (p: string | null) => void;
  setGeneratedSeriesPlan: (s: any[] | null) => void;
  setGeneratedDescription: (d: string | null) => void;
  setGeneratedWorld: (w: string | null) => void;
  setGeneratedAltText: (a: string | null) => void;
  setVisualData: React.Dispatch<React.SetStateAction<Record<number, string[]>>>;
  setVideoData: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  setCastProfiles: (c: string | null) => void;
  setCastData: (d: any | null) => void;
  setCastList: (l: any[]) => void;
  setRecapperPersona: (p: string) => void;
  setCharacterRelationships: (r: string | null) => void;
  syncCore: () => Promise<void>;
  addLog: (module: string, status: string, message?: string) => void;
  setTone: (t: string) => void;
  setAudience: (a: string) => void;
  setEpisode: (e: string) => void;
  setSession: (s: string) => void;
  setNumScenes: (n: string) => void;
  setContentType: (t: string) => void;
  setSelectedModel: (m: string) => void;
  setIsLoading: (l: boolean) => void;
  setIsGeneratingCharacters: (l: boolean) => void;
  setIsGeneratingMetadata: (l: boolean) => void;
  setIsGeneratingImagePrompts: (l: boolean) => void;
  setIsGeneratingSeries: (l: boolean) => void;
  setIsGeneratingDescription: (l: boolean) => void;
  setIsGeneratingWorld: (l: boolean) => void;
  setIsEditing: (e: boolean) => void;
  setIsSaving: (s: boolean) => void;
  setIsContinuingScript: (c: boolean) => void;
  setIsGeneratingVisuals: (l: boolean) => void;
  setIsGeneratingAltText: (l: boolean) => void;
  setCurrentScriptId: (id: string | null) => void;
  setProductionSequence: (s: ProductionUnit[]) => void;
  setIsLiked: (l: boolean) => void;
  setTemperature: (t: number) => void;
  setMaxTokens: (t: number) => void;
  setTopP: (p: number) => void;
  setTopK: (k: number) => void;
  setArchitecture: (s: string | null) => void;
  setAtlas: (s: string | null) => void;
  setHistoryLore: (s: string | null) => void;
  setSystems: (s: string | null) => void;
  setCulture: (s: string | null) => void;
  setGeneratedGrowthStrategy: (s: string | null) => void;
  setIsGeneratingGrowthStrategy: (l: boolean) => void;
  setGeneratedDistributionPlan: (s: string | null) => void;
  setIsGeneratingDistribution: (l: boolean) => void;
  showNotification: (message: string, type?: 'error' | 'success' | 'info') => void;
}

export type GeneratorContextType = GeneratorState & GeneratorDispatch;

export const GeneratorStateContext = createContext<GeneratorState | undefined>(undefined);
export const GeneratorDispatchContext = createContext<GeneratorDispatch | undefined>(undefined);
export const GeneratorContext = createContext<GeneratorContextType | undefined>(undefined);

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { showNotification: rawShowNotification } = useApp();
  const [prompt, setPrompt] = useState('');
  const [theme, setTheme] = useState('');
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [generatedCharacters, setGeneratedCharacters] = useState<string | null>(null);
  const [generatedMetadata, setGeneratedMetadata] = useState<string | null>(null);
  const [generatedImagePrompts, setGeneratedImagePrompts] = useState<string | null>(null);
  const [generatedSeriesPlan, setGeneratedSeriesPlan] = useState<any[] | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [generatedWorld, setGeneratedWorld] = useState<string | null>(null);
  const [generatedAltText, setGeneratedAltText] = useState<string | null>(null);
  const [generatedGrowthStrategy, setGeneratedGrowthStrategy] = useState<string | null>(null);
  const [isGeneratingGrowthStrategy, setIsGeneratingGrowthStrategy] = useState(false);
  const [generatedDistributionPlan, setGeneratedDistributionPlan] = useState<string | null>(null);
  const [isGeneratingDistribution, setIsGeneratingDistribution] = useState(false);
  const [visualData, setVisualData] = useState<Record<number, string[]>>({});
  const [videoData, setVideoData] = useState<Record<number, string>>({});

  const showNotification = useCallback((message: string, type?: 'error' | 'success' | 'info') => {
    rawShowNotification(message, type);
  }, [rawShowNotification]);

  const [castProfiles, setCastProfiles] = useState<string | null>(null);
  const [castData, setCastData] = useState<any | null>(null);
  const [castList, setCastList] = useState<any[]>([]);
  const [recapperPersona, setRecapperPersona] = useState('');
  const [characterRelationships, setCharacterRelationships] = useState<string | null>(null);
  const { addLog } = useLogs();

  // World Modular Lore State
  const [architecture, setArchitecture] = useState<string | null>(null);
  const [atlas, setAtlas] = useState<string | null>(null);
  const [historyLore, setHistoryLore] = useState<string | null>(null);
  const [systems, setSystems] = useState<string | null>(null);
  const [culture, setCulture] = useState<string | null>(null);

  // Engine Configuration State
  const [temperature, setTemperature] = useState(0.85);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);
  const [tone, setTone] = useState('Hype/Energetic');
  const [audience, setAudience] = useState('General Fans');
  const [selectedModel, setSelectedModel] = useState('Gemini-2.5-Flash');

  // TanStack Queries for Caching
  const { data: config } = useQuery({
    queryKey: ['engineConfig', user?.id],
    queryFn: () => engineApi.getConfig(user!.id),
    enabled: !!user?.id,
  });

  const { data: lore } = useQuery({
    queryKey: ['worldLore', user?.id],
    queryFn: () => worldApi.getLore(user!.id),
    enabled: !!user?.id,
  });

  const { data: production } = useQuery({
    queryKey: ['productionContent', user?.id],
    queryFn: () => productionApi.getContent(user!.id),
    enabled: !!user?.id,
  });

  const { data: projectHistory = [] } = useQuery({
    queryKey: ['projectHistory', user?.id],
    queryFn: async () => {
      const projects = await apiRequest<any[]>(`/api/projects?user_id=${user!.id}`, { label: 'Project History' });
      return (projects || []).map(p => ({
        id: p.id,
        title: p.name || 'Untitled',
        date: new Date(p.created_at).toLocaleDateString(),
        createdAt: p.created_at,
        prompt: p.prompt,
        vibe: p.vibe,
        contentType: p.content_type,
        modelUsed: p.model_used
      }));
    },
    enabled: !!user?.id,
  });

  // Sync state with cached data when it changes
  useEffect(() => {
    if (config) {
      setTemperature(config.temperature);
      setMaxTokens(config.max_tokens);
      setSelectedModel(config.selected_model);
      setTone(config.vibe);
      setAudience(config.audience);
    }
  }, [config]);

  useEffect(() => {
    if (lore) {
      setArchitecture(lore.architecture);
      setAtlas(lore.atlas);
      setHistoryLore(lore.history);
      setSystems(lore.systems);
      setCulture(lore.culture);
      if (lore.full_lore_blob) setGeneratedWorld(lore.full_lore_blob);
    }
  }, [lore]);

  useEffect(() => {
    if (production) {
      setCastProfiles(production.cast_profiles);
      setCastData(production.cast_data);
      setCharacterRelationships(production.cast_relationships);
      setGeneratedScript(production.script_content);
      setGeneratedSeriesPlan(production.series_plan);
      setGeneratedMetadata(production.seo_metadata);
      setGeneratedGrowthStrategy(production.growth_strategy);
      setGeneratedDistributionPlan(production.distribution_plan);
    }
  }, [production]);

  // Moved to LogContext

  const [episode, setEpisode] = useState('1');
  const [session, setSession] = useState('1');
  const [numScenes, setNumScenes] = useState('6');
  const [contentType, setContentType] = useState('Anime');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCharacters, setIsGeneratingCharacters] = useState(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [isGeneratingImagePrompts, setIsGeneratingImagePrompts] = useState(false);
  const [isGeneratingSeries, setIsGeneratingSeries] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingWorld, setIsGeneratingWorld] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isContinuingScript, setIsContinuingScript] = useState(false);
  const [isGeneratingVisuals, setIsGeneratingVisuals] = useState(false);
  const [isGeneratingAltText, setIsGeneratingAltText] = useState(false);
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [productionSequence, setProductionSequence] = useState<ProductionUnit[]>([]);

  // Auto-save Engine Config
  useEffect(() => {
    if (!user?.id || !config) return;

    const timeout = setTimeout(async () => {
      try {
        await engineApi.updateConfig(user.id, {
          temperature,
          max_tokens: maxTokens,
          selected_model: selectedModel,
          vibe: tone,
          audience: audience
        });
      } catch (error) {
        console.warn("%c[System] %cEngine sync failed:", 'color: #f59e0b; font-weight: bold', 'color: #94a3b8', error);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [user?.id, temperature, maxTokens, selectedModel, tone, audience, config]);

  // Auto-save World Lore
  useEffect(() => {
    if (!user?.id || !lore) return;

    const timeout = setTimeout(async () => {
      try {
        await worldApi.updateLore(user.id, {
          architecture,
          atlas,
          history: historyLore,
          systems,
          culture,
          full_lore_blob: generatedWorld
        });
      } catch (error) {
        console.warn("%c[System] %cLore sync failed:", 'color: #f59e0b; font-weight: bold', 'color: #94a3b8', error);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [user?.id, architecture, atlas, historyLore, systems, culture, generatedWorld, lore]);

  // Auto-save Production Content
  useEffect(() => {
    if (!user?.id || !production) return;

    const timeout = setTimeout(async () => {
      try {
        await productionApi.updateContent(user.id, {
          cast_profiles: castProfiles,
          cast_data: castData,
          cast_relationships: characterRelationships,
          script_content: generatedScript,
          series_plan: generatedSeriesPlan,
          seo_metadata: generatedMetadata,
          growth_strategy: generatedGrowthStrategy,
          distribution_plan: generatedDistributionPlan
        });
      } catch (error) {
        console.error("%c[System] %cFailed to sync production content:", 'color: #ef4444; font-weight: bold', 'color: #94a3b8', error);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [user?.id, castProfiles, castData, characterRelationships, generatedScript, generatedSeriesPlan, generatedMetadata, generatedGrowthStrategy, generatedDistributionPlan, visualData, videoData, production]);

  const syncCore = useCallback(async () => {
    if (!user?.id) {
      showNotification("Authentication required for synchronization", "error");
      return;
    }

    setIsSaving(true);
    addLog("SYNC", "INITIALIZED", "Initiating global state synchronization protocol...");
    showNotification("Synchronizing Core Manifest...", "info");

    try {
      // PHASE 1: Neural Config Sync
      addLog("ENGINE", "SYNCING", "Synchronizing neural parameters and config...");
      await engineApi.updateConfig(user.id, {
        temperature,
        max_tokens: maxTokens,
        selected_model: selectedModel,
        vibe: tone,
        audience: audience
      });
      addLog("ENGINE", "COMPLETED", "Neural configuration synchronized.");

      // PHASE 2: World Lore Sync
      addLog("WORLD", "SYNCING", "Writing World Lore assets to neural archive...");
      await worldApi.updateLore(user.id, {
        architecture,
        atlas,
        history: historyLore,
        systems,
        culture,
        full_lore_blob: generatedWorld
      });
      addLog("WORLD", "COMPLETED", "World Lore synchronized.");

      // PHASE 3: Production Asset Sync (Tabs data)
      addLog("PRODUCTION", "SYNCING", "Persisting Cast, Series, and Script manifests...");
      await productionApi.updateContent(user.id, {
        cast_profiles: castProfiles,
        cast_data: castData,
        cast_relationships: characterRelationships,
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata,
        growth_strategy: generatedGrowthStrategy,
        distribution_plan: generatedDistributionPlan,
        storyboard: {
          visuals: visualData,
          videos: videoData
        }
      });
      addLog("PRODUCTION", "COMPLETED", "All production tabs synchronized.");

      showNotification("CORE SYNCHRONIZED", "success");
      addLog("CORE", "SUCCESS", "Full system state synchronized with central database.");
    } catch (error: any) {
      console.error("Core Sync Failed:", error);
      showNotification("SYNCHRONIZATION FAILURE", "error");
      addLog("CORE", "FAILURE", `Sync failed: ${error.message || 'Network error'}`);
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, temperature, maxTokens, selectedModel, tone, audience, architecture, atlas, historyLore, systems, culture, generatedWorld, castProfiles, castData, characterRelationships, generatedScript, generatedSeriesPlan, generatedMetadata, generatedGrowthStrategy, generatedDistributionPlan, visualData, videoData, addLog, showNotification]);

  // Neural Telemetry & Thinking Stream Log Sync
  useEffect(() => {
    const handleTelemetry = async (e: any) => {
      try {
        await engineApi.recordTelemetry({
          model: e.detail.model,
          latency_ms: e.detail.latency,
          status: e.detail.error ? 'ERROR' : 'SUCCESS',
          endpoint: 'studio_general',
          request_summary: e.detail.text?.substring(0, 100),
          error_message: e.detail.error,
          metadata: { fallbacks: e.detail.fallbacks }
        }, user?.id);
      } catch (err) {
        console.warn("%c[System] %cFailed to record remote telemetry:", 'color: #f59e0b; font-weight: bold', 'color: #94a3b8', err);
      }
    };

    const handleStart = (e: any) => {
      addLog("NEURAL_ENGINE", "INITIALIZED", `Activating ${e.detail.model} for synthesis...`);
    };

    const handleComplete = (e: any) => {
      addLog("NEURAL_ENGINE", "COMPLETED", `Synthesis finished via ${e.detail.model} (${e.detail.latency.toFixed(0)}ms)`);
    };

    const handleFallback = (e: any) => {
      addLog("NEURAL_ENGINE", "RETRYING", `Switching from ${e.detail.failedModel} to ${e.detail.nextModel} due to friction.`);
    };

    AI_EVENTS.addEventListener('ai_generation_complete', handleTelemetry);
    AI_EVENTS.addEventListener('ai_generation_start', handleStart as EventListener);
    AI_EVENTS.addEventListener('ai_generation_complete', handleComplete as EventListener);
    AI_EVENTS.addEventListener('ai_fallback', handleFallback as EventListener);

    return () => {
      AI_EVENTS.removeEventListener('ai_generation_complete', handleTelemetry);
      AI_EVENTS.removeEventListener('ai_generation_start', handleStart as EventListener);
      AI_EVENTS.removeEventListener('ai_generation_complete', handleComplete as EventListener);
      AI_EVENTS.removeEventListener('ai_fallback', handleFallback as EventListener);
    };
  }, [user?.id, addLog]);

  const state = useMemo<GeneratorState>(() => ({
    worldLore: generatedWorld,
    seriesPlan: generatedSeriesPlan,
    storyboardPrompts: generatedImagePrompts,
    seoMetadata: generatedMetadata,
    prompt,
    theme,
    generatedScript,
    generatedCharacters,
    generatedMetadata,
    generatedImagePrompts,
    generatedSeriesPlan,
    generatedDescription,
    castProfiles,
    castData,
    castList,
    recapperPersona,
    characterRelationships,
    tone,
    audience,
    episode,
    session,
    numScenes,
    contentType,
    selectedModel,
    isLoading,
    isGeneratingCharacters,
    isGeneratingMetadata,
    isGeneratingImagePrompts,
    isGeneratingSeries,
    isGeneratingDescription,
    isGeneratingWorld,
    isEditing,
    isSaving,
    isContinuingScript,
    isGeneratingVisuals,
    isGeneratingAltText,
    currentScriptId,
    history: projectHistory,
    productionSequence,
    visualData,
    videoData,
    generatedWorld,
    generatedAltText,
    isLiked,
    temperature,
    maxTokens,
    topP,
    topK,
    architecture,
    atlas,
    historyLore,
    systems,
    culture,
    generatedGrowthStrategy,
    isGeneratingGrowthStrategy,
    generatedDistributionPlan,
    isGeneratingDistribution
  }), [
    generatedWorld, generatedSeriesPlan, generatedImagePrompts, generatedMetadata, prompt, theme,
    generatedScript, generatedCharacters, generatedDescription, castProfiles, castData, castList,
    recapperPersona, characterRelationships, tone, audience, episode,
    session, numScenes, contentType, selectedModel, isLoading, isGeneratingCharacters,
    isGeneratingMetadata, isGeneratingImagePrompts, isGeneratingSeries, isGeneratingDescription,
    isGeneratingWorld, isEditing, isSaving, isContinuingScript, isGeneratingVisuals,
    isGeneratingAltText, currentScriptId, projectHistory, productionSequence, visualData, videoData,
    generatedAltText, isLiked, temperature,
    maxTokens, topP, topK, architecture, atlas, historyLore, systems, culture,
    generatedGrowthStrategy, isGeneratingGrowthStrategy, generatedDistributionPlan, isGeneratingDistribution
  ]);

  const dispatch = useMemo<GeneratorDispatch>(() => ({
    setPrompt,
    setTheme,
    setGeneratedScript,
    setGeneratedCharacters,
    setGeneratedMetadata,
    setGeneratedImagePrompts,
    setGeneratedSeriesPlan,
    setGeneratedDescription,
    setGeneratedWorld,
    setGeneratedAltText,
    setVisualData,
    setVideoData,
    setCastProfiles,
    setCastData,
    setCastList,
    setRecapperPersona,
    setCharacterRelationships,
    syncCore,
    addLog,
    setTone,
    setAudience,
    setEpisode,
    setSession,
    setNumScenes,
    setContentType,
    setSelectedModel,
    setIsLoading,
    setIsGeneratingCharacters,
    setIsGeneratingMetadata,
    setIsGeneratingImagePrompts,
    setIsGeneratingSeries,
    setIsGeneratingDescription,
    setIsGeneratingWorld,
    setIsEditing,
    setIsSaving,
    setIsContinuingScript,
    setIsGeneratingVisuals,
    setIsGeneratingAltText,
    setCurrentScriptId,
    setProductionSequence,
    setIsLiked,
    setTemperature,
    setMaxTokens,
    setTopP,
    setTopK,
    setArchitecture,
    setAtlas,
    setHistoryLore,
    setSystems,
    setCulture,
    setGeneratedGrowthStrategy,
    setIsGeneratingGrowthStrategy,
    setGeneratedDistributionPlan,
    setIsGeneratingDistribution,
    showNotification
  }), [syncCore, addLog, showNotification]);

  const fullValue = useMemo(() => ({
    ...state,
    ...dispatch
  }), [state, dispatch]);

  return (
    <GeneratorStateContext.Provider value={state}>
      <GeneratorDispatchContext.Provider value={dispatch}>
        <GeneratorContext.Provider value={fullValue}>
          {children}
        </GeneratorContext.Provider>
      </GeneratorDispatchContext.Provider>
    </GeneratorStateContext.Provider>
  );
}
