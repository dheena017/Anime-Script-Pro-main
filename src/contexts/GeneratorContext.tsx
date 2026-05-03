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
  storyboardPrompts: any;
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
  recapperPersona: string;
  episode: string;
  session: string;
  numScenes: string;
  contentType: string;
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
  generatedGrowthStrategy: string | null;
  isGeneratingGrowthStrategy: boolean;
  generatedDistributionPlan: string | null;
  isGeneratingDistribution: boolean;
  // Engine / Model settings (migrated but kept for compatibility)
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  selectedModel: string;
  tone: string;
  audience: string;

  // Cast / World compatibility
  castData?: any | null;
  castList?: any[];
  castProfiles?: any | null;
  characterRelationships?: string | null;

  // Visual / storyboard compatibility
  visualData?: any[];
  videoData?: any[];

  // SEO / series compatibility
  seoMetadata?: any | null;
  seriesPlan?: any[] | null;
  worldLore?: any | null;
  activeModelAttempt: string | null;
  fallbackHistory: string[];
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
  setRecapperPersona: (p: string) => void;
  syncCore: () => Promise<void>;
  addLog: (module: string, status: string, message?: string) => void;
  setEpisode: (e: string) => void;
  setSession: (s: string) => void;
  setNumScenes: (n: string) => void;
  setContentType: (t: string) => void;
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
  setGeneratedGrowthStrategy: (s: string | null) => void;
  setIsGeneratingGrowthStrategy: (l: boolean) => void;
  setGeneratedDistributionPlan: (s: string | null) => void;
  setIsGeneratingDistribution: (l: boolean) => void;
  showNotification: (message: string, type?: 'error' | 'success' | 'info') => void;
  // Backwards-compatible setters (no-ops or proxies)
  setTemperature: (t: number) => void;
  setMaxTokens: (n: number) => void;
  setTopP: (p: number) => void;
  setTopK: (k: number) => void;
  setSelectedModel: (m: string) => void;
  setTone: (t: string) => void;
  setAudience: (a: string) => void;

  setCastData: (d: any | null) => void;
  setCastList: (l: any[]) => void;
  setCastProfiles: (p: any | null) => void;
  setCharacterRelationships: (r: string | null) => void;

  setVisualData: (v: any) => void;
  setVideoData: (v: any) => void;

  // Aliases for older APIs
  setGlobalPrompt: (p: string) => void;
  setGlobalContentType: (t: string) => void;
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

  const [activeModelAttempt, setActiveModelAttempt] = useState<string | null>(null);
  const [fallbackHistory, setFallbackHistory] = useState<string[]>([]);

  const showNotification = useCallback((message: string, type?: 'error' | 'success' | 'info') => {
    rawShowNotification(message, type);
  }, [rawShowNotification]);

  // World Modular Lore State REMOVED (Migrated to WorldContext)

  // Engine Configuration State REMOVED (Migrated to EngineContext)

  // TanStack Queries for Caching
  useQuery({
    queryKey: ['engineConfig', user?.id],
    queryFn: () => engineApi.getConfig(user!.id),
    enabled: !!user?.id,
  });

  useQuery({
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

  useEffect(() => {
    if (production) {
      setGeneratedScript(production.script_content);
      setGeneratedSeriesPlan(production.series_plan);
      setGeneratedMetadata(production.seo_metadata);
      setGeneratedGrowthStrategy(production.growth_strategy);
      setGeneratedDistributionPlan(production.distribution_plan);
    }
  }, [production]);

  const [episode, setEpisode] = useState('1');
  const [session, setSession] = useState('1');
  const [numScenes, setNumScenes] = useState('6');
  const [recapperPersona, setRecapperPersona] = useState('');
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

  // Compatibility engine settings (kept local to avoid cross-context coupling)
  const [temperature, setTemperature] = useState(0.85);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.1-flash');
  const [tone, setTone] = useState('Analytical');
  const [audience, setAudience] = useState('Developers');

  // Compatibility cast/world/visual placeholders
  const [castData, setCastData] = useState<any | null>(null);
  const [castList, setCastList] = useState<any[]>([]);
  const [castProfiles, setCastProfiles] = useState<any | null>(null);
  const [characterRelationships, setCharacterRelationships] = useState<string | null>('');
  const [visualData, setVisualData] = useState<any>([]);
  const [videoData, setVideoData] = useState<any>([]);

  // Removed specialized modular auto-saves (Handled by smaller contexts)

  // Auto-save Production Content (Remaining global fields)
  useEffect(() => {
    if (!user?.id || !production) return;

    const timeout = setTimeout(async () => {
      try {
        await productionApi.updateContent(user.id, {
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
  }, [user?.id, generatedScript, generatedSeriesPlan, generatedMetadata, generatedGrowthStrategy, generatedDistributionPlan, production]);

  const { addLog } = useLogs();

  const syncCore = useCallback(async () => {
    if (!user?.id) {
      showNotification("Authentication required for synchronization", "error");
      return;
    }

    setIsSaving(true);
    addLog("SYNC", "INITIALIZED", "Initiating global state synchronization protocol...");
    showNotification("Synchronizing Core Manifest...", "info");

    try {
      // PHASE 3: Production Asset Sync (Remaining global fields)
      addLog("PRODUCTION", "SYNCING", "Persisting Script and Series manifests...");
      await productionApi.updateContent(user.id, {
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata,
        growth_strategy: generatedGrowthStrategy,
        distribution_plan: generatedDistributionPlan
      });
      addLog("PRODUCTION", "COMPLETED", "Global production fields synchronized.");

      showNotification("CORE SYNCHRONIZED", "success");
      addLog("CORE", "SUCCESS", "Full system state synchronized with central database.");
    } catch (error: any) {
      console.error("Core Sync Failed:", error);
      showNotification("SYNCHRONIZATION FAILURE", "error");
      addLog("CORE", "FAILURE", `Sync failed: ${error.message || 'Network error'}`);
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, generatedScript, generatedSeriesPlan, generatedMetadata, generatedGrowthStrategy, generatedDistributionPlan, addLog, showNotification]);

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
      setActiveModelAttempt(e.detail.model);
      setFallbackHistory([]);
    };

    const handleComplete = (e: any) => {
      addLog("NEURAL_ENGINE", "COMPLETED", `Synthesis finished via ${e.detail.model} (${e.detail.latency.toFixed(0)}ms)`);
      setActiveModelAttempt(null);
    };

    const handleFallback = (e: any) => {
      addLog("NEURAL_ENGINE", "RETRYING", `Switching from ${e.detail.failedModel} to ${e.detail.nextModel} due to friction.`);
      setActiveModelAttempt(e.detail.nextModel);
      setFallbackHistory(prev => [...prev, e.detail.failedModel]);
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
    storyboardPrompts: generatedImagePrompts,
    prompt,
    theme,
    generatedScript,
    generatedCharacters,
    generatedMetadata,
    generatedImagePrompts,
    generatedSeriesPlan,
    generatedDescription,
    generatedWorld,
    generatedAltText,
    recapperPersona,
    episode,
    session,
    numScenes,
    contentType,
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
    isLiked,
    generatedGrowthStrategy,
    isGeneratingGrowthStrategy,
    generatedDistributionPlan,
    isGeneratingDistribution
    ,
    // Engine compatibility
    temperature,
    maxTokens,
    topP,
    topK,
    selectedModel,
    tone,
    audience,

    // Cast / world compatibility
    castData,
    castList,
    castProfiles,
    characterRelationships,

    // Visual / storyboard compatibility
    visualData,
    videoData,

    // SEO / series
    seoMetadata: generatedMetadata,
    seriesPlan: generatedSeriesPlan,
    worldLore: null,
    activeModelAttempt,
    fallbackHistory
  }), [
    prompt, theme, generatedScript, generatedCharacters, generatedMetadata, 
    generatedImagePrompts, generatedSeriesPlan, generatedDescription, generatedWorld, generatedAltText,
    recapperPersona, episode, session, numScenes, contentType, 
    isLoading, isGeneratingCharacters, isGeneratingMetadata, isGeneratingImagePrompts,
    isGeneratingSeries, isGeneratingDescription, isGeneratingWorld, isEditing, isSaving,
    isContinuingScript, isGeneratingVisuals, isGeneratingAltText, currentScriptId, 
    projectHistory, productionSequence, isLiked, 
    generatedGrowthStrategy, isGeneratingGrowthStrategy, generatedDistributionPlan, isGeneratingDistribution
    , temperature, maxTokens, topP, topK, selectedModel, tone, audience,
    castData, castList, castProfiles, characterRelationships, visualData, videoData, generatedMetadata, generatedSeriesPlan,
    activeModelAttempt, fallbackHistory
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
    setRecapperPersona,
    syncCore,
    addLog,
    setEpisode,
    setSession,
    setNumScenes,
    setContentType,
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
    setGeneratedGrowthStrategy,
    setIsGeneratingGrowthStrategy,
    setGeneratedDistributionPlan,
    setIsGeneratingDistribution,
    showNotification
    ,
    // Engine setters
    setTemperature,
    setMaxTokens,
    setTopP,
    setTopK,
    setSelectedModel,
    setTone,
    setAudience,

    // Cast / world setters
    setCastData,
    setCastList,
    setCastProfiles,
    setCharacterRelationships,

    // Visual setters
    setVisualData,
    setVideoData,

    // Aliases
    setGlobalPrompt: setPrompt,
    setGlobalContentType: setContentType
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
