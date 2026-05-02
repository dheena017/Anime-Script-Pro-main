import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { apiRequest } from '@/lib/api-utils';
import { ProductionUnit } from '@/lib/sequence-utils';
import { useAuth } from '@/hooks/useAuth';
import { engineApi } from '../services/api/engine';
import { worldApi } from '../services/api/world';
import { productionApi } from '../services/api/production';
import { AI_EVENTS } from '../services/generators/core';

interface GeneratorContextType {
  worldLore: any;
  seriesPlan: any;
  storyboardPrompts: any;
  seoMetadata: any;
  prompt: string;
  setPrompt: (p: string) => void;
  theme: string;
  setTheme: (t: string) => void;
  generatedScript: string | null;
  setGeneratedScript: (s: string | null) => void;
  generatedCharacters: string | null;
  setGeneratedCharacters: (c: string | null) => void;
  generatedMetadata: string | null;
  setGeneratedMetadata: (m: string | null) => void;
  generatedImagePrompts: string | null;
  setGeneratedImagePrompts: (p: string | null) => void;
  generatedSeriesPlan: any[] | null;
  setGeneratedSeriesPlan: (s: any[] | null) => void;
  generatedDescription: string | null;
  setGeneratedDescription: (d: string | null) => void;
  generatedWorld: string | null;
  setGeneratedWorld: (w: string | null) => void;
  generatedAltText: string | null;
  setGeneratedAltText: (a: string | null) => void;
  visualData: Record<number, string[]>;
  setVisualData: React.Dispatch<React.SetStateAction<Record<number, string[]>>>;
  videoData: Record<number, string>;
  setVideoData: React.Dispatch<React.SetStateAction<Record<number, string>>>;

  castProfiles: string | null;
  setCastProfiles: (c: string | null) => void;
  castData: any | null;
  setCastData: (d: any | null) => void;
  castList: any[];
  setCastList: (l: any[]) => void;
  recapperPersona: string;
  setRecapperPersona: (p: string) => void;
  characterRelationships: string | null;
  setCharacterRelationships: (r: string | null) => void;
  syncCore: () => Promise<void>;
  masterLogs: any[];
  addLog: (module: string, status: string, message?: string) => void;
  tone: string;
  setTone: (t: string) => void;
  audience: string;
  setAudience: (a: string) => void;
  episode: string;
  setEpisode: (e: string) => void;
  session: string;
  setSession: (s: string) => void;
  numScenes: string;
  setNumScenes: (n: string) => void;
  contentType: string;
  setContentType: (t: string) => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  isLoading: boolean;
  setIsLoading: (l: boolean) => void;
  isGeneratingCharacters: boolean;
  setIsGeneratingCharacters: (l: boolean) => void;
  isGeneratingMetadata: boolean;
  setIsGeneratingMetadata: (l: boolean) => void;
  isGeneratingImagePrompts: boolean;
  setIsGeneratingImagePrompts: (l: boolean) => void;
  isGeneratingSeries: boolean;
  setIsGeneratingSeries: (l: boolean) => void;
  isGeneratingDescription: boolean;
  setIsGeneratingDescription: (l: boolean) => void;
  isGeneratingWorld: boolean;
  setIsGeneratingWorld: (l: boolean) => void;
  isEditing: boolean;
  setIsEditing: (e: boolean) => void;
  isSaving: boolean;
  setIsSaving: (s: boolean) => void;
  isContinuingScript: boolean;
  setIsContinuingScript: (c: boolean) => void;
  isGeneratingVisuals: boolean;
  setIsGeneratingVisuals: (l: boolean) => void;
  isGeneratingAltText: boolean;
  setIsGeneratingAltText: (l: boolean) => void;
  currentScriptId: string | null;
  setCurrentScriptId: (id: string | null) => void;
  history: any[];
  productionSequence: ProductionUnit[];
  setProductionSequence: (s: ProductionUnit[]) => void;
  isLiked: boolean;
  setIsLiked: (l: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (f: boolean) => void;
  notification: { message: string; type: 'error' | 'success' | 'info' } | null;
  showNotification: (message: string, type?: 'error' | 'success' | 'info') => void;
  temperature: number;
  setTemperature: (t: number) => void;
  maxTokens: number;
  setMaxTokens: (t: number) => void;
  topP: number;
  setTopP: (p: number) => void;
  topK: number;
  setTopK: (k: number) => void;
  // World Modular Lore
  architecture: string | null;
  setArchitecture: (s: string | null) => void;
  atlas: string | null;
  setAtlas: (s: string | null) => void;
  historyLore: string | null;
  setHistoryLore: (s: string | null) => void;
  systems: string | null;
  setSystems: (s: string | null) => void;
  culture: string | null;
  setCulture: (s: string | null) => void;
  generatedGrowthStrategy: string | null;
  setGeneratedGrowthStrategy: (s: string | null) => void;
  isGeneratingGrowthStrategy: boolean;
  setIsGeneratingGrowthStrategy: (l: boolean) => void;
  generatedDistributionPlan: string | null;
  setGeneratedDistributionPlan: (s: string | null) => void;
  isGeneratingDistribution: boolean;
  setIsGeneratingDistribution: (l: boolean) => void;
}

export const GeneratorContext = createContext<GeneratorContextType | undefined>(undefined);

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [theme, setTheme] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
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

  const [castProfiles, setCastProfiles] = useState<string | null>(null);
  const [castData, setCastData] = useState<any | null>(null);
  const [castList, setCastList] = useState<any[]>([]);
  const [recapperPersona, setRecapperPersona] = useState('');
  const [characterRelationships, setCharacterRelationships] = useState<string | null>(null);
  const [masterLogs, setMasterLogs] = useState<any[]>([]);

  const addLog = useCallback((module: string, status: string, message?: string) => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      module,
      status,
      message
    };
    
    // Styled Console Output for Master Logs
    const moduleColor = module === 'NEURAL_ENGINE' ? '#8b5cf6' : '#3b82f6';
    const statusColor = status === 'ERROR' || status === 'FAILED' ? '#ef4444' : 
                      status === 'COMPLETED' || status === 'SUCCESS' ? '#10b981' : '#f59e0b';

    console.info(
      `%c[${module}] %c${status} %c${message || ''}`,
      `color: ${moduleColor}; font-weight: bold;`,
      `color: ${statusColor}; font-weight: 800; text-transform: uppercase;`,
      'color: #94a3b8;'
    );

    setMasterLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);
  const [tone, setTone] = useState('Hype/Energetic');
  const [audience, setAudience] = useState('General Fans');
  const [episode, setEpisode] = useState('1');
  const [session, setSession] = useState('1');
  const [numScenes, setNumScenes] = useState('6');
  const [contentType, setContentType] = useState('Anime');
  const [selectedModel, setSelectedModel] = useState('Gemini-2.5-Flash');
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
  const [history, setHistory] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [productionSequence, setProductionSequence] = useState<ProductionUnit[]>([]);

  // Engine Configuration State
  const [temperature, setTemperature] = useState(0.85);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);
  const [isEngineInitialized, setIsEngineInitialized] = useState(false);

  // World Modular Lore State
  const [architecture, setArchitecture] = useState<string | null>(null);
  const [atlas, setAtlas] = useState<string | null>(null);
  const [historyLore, setHistoryLore] = useState<string | null>(null);
  const [systems, setSystems] = useState<string | null>(null);
  const [culture, setCulture] = useState<string | null>(null);
  const [isWorldInitialized, setIsWorldInitialized] = useState(false);
  const [isProductionInitialized, setIsProductionInitialized] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const showNotification = useCallback((message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      if (!user?.id) return;
      try {
        const projects = await apiRequest<any[]>(`/api/projects?user_id=${user.id}`, { label: 'Project History' });
        setHistory((projects || []).map(p => ({
          id: p.id,
          title: p.name || 'Untitled',
          date: new Date(p.created_at).toLocaleDateString(),
          createdAt: p.created_at,
          prompt: p.prompt,
          vibe: p.vibe,
          contentType: p.content_type,
          modelUsed: p.model_used
        })));
      } catch (error) {
        console.error("%c[Frontend] %cFailed to fetch history:", 'color: #3b82f6; font-weight: bold', 'color: #94a3b8', error);
      }
    };

    fetchHistory();
  }, [user?.id]);

  // Combine initial loading of all modular data
  useEffect(() => {
    if (!user?.id) return;

    const loadAllData = async () => {
      try {
        const [config, lore, production] = await Promise.all([
          engineApi.getConfig(user.id),
          worldApi.getLore(user.id),
          productionApi.getContent(user.id)
        ]);

        if (config) {
          setTemperature(config.temperature);
          setMaxTokens(config.max_tokens);
          setSelectedModel(config.selected_model);
          setTone(config.vibe);
          setAudience(config.audience);
          setIsEngineInitialized(true);
        }

        if (lore) {
          setArchitecture(lore.architecture);
          setAtlas(lore.atlas);
          setHistoryLore(lore.history);
          setSystems(lore.systems);
          setCulture(lore.culture);
          if (lore.full_lore_blob) setGeneratedWorld(lore.full_lore_blob);
          setIsWorldInitialized(true);
        }

        if (production) {
          setCastProfiles(production.cast_profiles);
          setCastData(production.cast_data);
          setCharacterRelationships(production.cast_relationships);
          setGeneratedScript(production.script_content);
          setGeneratedSeriesPlan(production.series_plan);
          setGeneratedMetadata(production.seo_metadata);
          setGeneratedGrowthStrategy(production.growth_strategy);
          setGeneratedDistributionPlan(production.distribution_plan);
          setIsProductionInitialized(true);
        }
      } catch (error) {
        console.error("%c[System] %cCriticall error loading modular studio data:", 'color: #ef4444; font-weight: bold', 'color: #94a3b8', error);
      }
    };

    loadAllData();
  }, [user?.id]);

  // Auto-save Engine Config
  useEffect(() => {
    if (!user?.id || !isEngineInitialized) return;

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
  }, [user?.id, temperature, maxTokens, selectedModel, tone, audience, isEngineInitialized]);

  // Auto-save World Lore
  useEffect(() => {
    if (!user?.id || !isWorldInitialized) return;

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
  }, [user?.id, architecture, atlas, historyLore, systems, culture, generatedWorld, isWorldInitialized]);

  // Auto-save Production Content
  useEffect(() => {
    if (!user?.id || !isProductionInitialized) return;

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
  }, [user?.id, castProfiles, castData, characterRelationships, generatedScript, generatedSeriesPlan, generatedMetadata, generatedGrowthStrategy, generatedDistributionPlan, visualData, videoData, isProductionInitialized]);

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

  const value = useMemo(() => ({
    worldLore: generatedWorld,
    seriesPlan: generatedSeriesPlan,
    storyboardPrompts: generatedImagePrompts,
    seoMetadata: generatedMetadata,
    prompt, setPrompt,
    theme, setTheme,
    generatedScript, setGeneratedScript,
    generatedCharacters, setGeneratedCharacters,
    generatedMetadata, setGeneratedMetadata,
    generatedImagePrompts, setGeneratedImagePrompts,
    generatedSeriesPlan, setGeneratedSeriesPlan,
    generatedDescription, setGeneratedDescription,

    castProfiles, setCastProfiles,
    castData, setCastData,
    castList, setCastList,
    masterLogs, addLog,
    recapperPersona, setRecapperPersona,
    characterRelationships, setCharacterRelationships,
    syncCore,
    tone, setTone,
    audience, setAudience,
    episode, setEpisode,
    session, setSession,
    numScenes, setNumScenes,
    contentType, setContentType,
    selectedModel, setSelectedModel,
    isLoading, setIsLoading,
    isGeneratingCharacters, setIsGeneratingCharacters,
    isGeneratingMetadata, setIsGeneratingMetadata,
    isGeneratingImagePrompts, setIsGeneratingImagePrompts,
    isGeneratingSeries, setIsGeneratingSeries,
    isGeneratingDescription, setIsGeneratingDescription,
    isGeneratingWorld, setIsGeneratingWorld,
    isEditing, setIsEditing,
    isSaving, setIsSaving,
    isContinuingScript, setIsContinuingScript,
    isGeneratingVisuals, setIsGeneratingVisuals,
    isGeneratingAltText, setIsGeneratingAltText,
    currentScriptId, setCurrentScriptId,
    history,
    productionSequence, setProductionSequence,
    visualData, setVisualData,
    videoData, setVideoData,
    generatedWorld, setGeneratedWorld,
    generatedAltText, setGeneratedAltText,
    isLiked, setIsLiked,
    isFullscreen, setIsFullscreen,
    notification, showNotification,
    temperature, setTemperature,
    maxTokens, setMaxTokens,
    topP, setTopP,
    topK, setTopK,
    architecture, setArchitecture,
    atlas, setAtlas,
    historyLore, setHistoryLore,
    systems, setSystems,
    culture, setCulture,
    generatedGrowthStrategy, setGeneratedGrowthStrategy,
    isGeneratingGrowthStrategy, setIsGeneratingGrowthStrategy,
    generatedDistributionPlan, setGeneratedDistributionPlan,
    isGeneratingDistribution, setIsGeneratingDistribution
  }), [
    generatedWorld, generatedSeriesPlan, generatedImagePrompts, generatedMetadata, prompt, theme,
    generatedScript, generatedCharacters, generatedDescription, castProfiles, castData, castList,
    masterLogs, addLog, recapperPersona, characterRelationships, syncCore, tone, audience, episode,
    session, numScenes, contentType, selectedModel, isLoading, isGeneratingCharacters,
    isGeneratingMetadata, isGeneratingImagePrompts, isGeneratingSeries, isGeneratingDescription,
    isGeneratingWorld, isEditing, isSaving, isContinuingScript, isGeneratingVisuals,
    isGeneratingAltText, currentScriptId, history, productionSequence, visualData, videoData,
    generatedAltText, isLiked, isFullscreen, notification, showNotification, temperature,
    maxTokens, topP, topK, architecture, atlas, historyLore, systems, culture,
    generatedGrowthStrategy, isGeneratingGrowthStrategy, generatedDistributionPlan, isGeneratingDistribution
  ]);

  return (
    <GeneratorContext.Provider value={value}>
      {children}
      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] p-4 rounded-2xl border backdrop-blur-xl animate-in slide-in-from-right-10 duration-500 shadow-2xl ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-red-500/20' :
          notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-emerald-500/20' :
            'bg-cyan-500/10 border-cyan-500/50 text-cyan-500 shadow-cyan-500/20'
          }`}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${notification.type === 'error' ? 'bg-red-500' :
              notification.type === 'success' ? 'bg-emerald-500' :
                'bg-cyan-500'
              }`} />
            <p className="text-[10px] font-black uppercase tracking-widest">{notification.message}</p>
          </div>
        </div>
      )}
    </GeneratorContext.Provider>
  );
}


