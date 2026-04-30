import React, { createContext, useState, useEffect } from 'react';
import { apiRequest } from '../lib/api-utils';
import { ProductionUnit } from '../lib/sequence-utils';
import { useAuth } from '../hooks/useAuth';

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
  const [visualData, setVisualData] = useState<Record<number, string[]>>({});
  const [videoData, setVideoData] = useState<Record<number, string>>({});

  const [castProfiles, setCastProfiles] = useState<string | null>(null);
  const [castData, setCastData] = useState<any | null>(null);
  const [castList, setCastList] = useState<any[]>([]);
  const [recapperPersona, setRecapperPersona] = useState('');
  const [characterRelationships, setCharacterRelationships] = useState<string | null>(null);
  const [masterLogs, setMasterLogs] = useState<any[]>([]);

  const addLog = (module: string, status: string, message?: string) => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      module,
      status,
      message
    };
    setMasterLogs(prev => [newLog, ...prev].slice(0, 50));
  };
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const showNotification = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      if (!user?.id) return; // Defensive check
      try {
        const projects = await apiRequest<any[]>(`/api/projects?user_id=${user.id}`);
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
        console.error("Failed to fetch history:", error);
      }
    };

    fetchHistory();
    // Poll every 30 seconds or use a socket in the future
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Load Engine Config
  useEffect(() => {
    if (!user?.id) return;

    const loadConfig = async () => {
      try {
        const { engineApi } = await import('../services/api/engine');
        const config = await engineApi.getConfig(user.id);
        if (config) {
          setTemperature(config.temperature);
          setMaxTokens(config.max_tokens);
          setSelectedModel(config.selected_model);
          setTone(config.vibe);
          setAudience(config.audience);
          setIsEngineInitialized(true);
        }
      } catch (error) {
        console.error("Failed to load engine config:", error);
      }
    };

    loadConfig();
  }, [user?.id]);

  // Auto-save Engine Config
  useEffect(() => {
    if (!user?.id || !isEngineInitialized) return;

    const timeout = setTimeout(async () => {
      try {
        const { engineApi } = await import('../services/api/engine');
        await engineApi.updateConfig(user.id, {
          temperature,
          max_tokens: maxTokens,
          selected_model: selectedModel,
          vibe: tone,
          audience: audience
        });
        console.log("Engine configuration synced to cloud.");
      } catch (error) {
        console.error("Failed to sync engine config:", error);
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timeout);
  }, [user?.id, temperature, maxTokens, selectedModel, tone, audience, isEngineInitialized]);
  // Neural Telemetry Sync
  useEffect(() => {
    const syncTelemetry = async () => {
      const { AI_EVENTS } = await import('../services/generators/core');
      const { engineApi } = await import('../services/api/engine');

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
          console.warn("Failed to record remote telemetry:", err);
        }
      };

      AI_EVENTS.addEventListener('ai_generation_complete', handleTelemetry);
      return () => AI_EVENTS.removeEventListener('ai_generation_complete', handleTelemetry);
    };

    syncTelemetry();
  }, [user?.id]);

  return (
    <GeneratorContext.Provider value={{
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
      topK, setTopK
    }}>
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


