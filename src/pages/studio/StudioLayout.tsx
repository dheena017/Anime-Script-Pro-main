import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateScript } from '@/services/geminiService';

import { motion, AnimatePresence } from 'motion/react';
import { AnimeStudioNavigation as StudioNavigation } from './components/Layout/AnimeStudioNavigation';
import { SessionLogs } from './components/Layout/SessionLogs';

export function StudioLayout({ type }: { type?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    prompt, setPrompt,
    setGeneratedScript,
    setGeneratedCharacters,
    setGeneratedSeriesPlan,
    tone, setTone,
    audience, setAudience,
    episode, setEpisode,
    session, setSession,
    contentType, setContentType,
    selectedModel, setSelectedModel,
    isLoading, setIsLoading,
    generatedScript,
    isSaving, setIsSaving,
    setCurrentScriptId,
    currentScriptId,
    history,
    setGeneratedMetadata,
    narrativeBeats, setNarrativeBeats,
    recapperPersona, setRecapperPersona,
    characterRelationships, setCharacterRelationships,
    numScenes, setNumScenes,
    generatedWorld, setGeneratedWorld, generatedCharacters,
    setCastData, setCastList,
    addLog,
    theme, setTheme
  } = useGenerator();

  React.useEffect(() => {
    if (type) setContentType(type);
  }, [type, setContentType]);

  const basePath = type ? `/${type.toLowerCase()}` : '';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    navigate(`${basePath}/script`);
    const script = await generateScript(prompt, tone, audience, session, episode, numScenes, selectedModel, contentType, recapperPersona, narrativeBeats, characterRelationships, generatedWorld, generatedCharacters);
    setGeneratedScript(script);
    setCurrentScriptId(null);
    setIsLoading(false);
    if (user) {
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            name: prompt || "Single Generation",
            content_type: contentType,
            prompt: prompt,
            vibe: tone,
            metadata: { script, episode, session, model: selectedModel }
          })
        });
        if (res.ok) {
          const project = await res.json();
          setCurrentScriptId(project.id);
        }
      } catch (error) {
        console.error("Save single generation failed:", error);
      }
    }
  };

  return (
    <div className={cn(
      "w-full min-h-screen transition-all duration-500",
      type === 'Manhwa' ? 'theme-manhwa' : type === 'Comic' ? 'theme-comic' : 'theme-anime'
    )}>

      <div className={cn(
        "w-full max-w-[1800px] mx-auto px-4 sm:px-6 py-6 lg:py-10 space-y-8 transition-all duration-500"
      )}>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="flex flex-col gap-6 lg:overflow-visible transition-all duration-500">
            <div className="sticky top-[60px] z-30 bg-[#050505]/80 backdrop-blur-md py-4 -mx-2 px-2">
              <StudioNavigation
                basePath={basePath}
                handleGenerate={handleGenerate}
                isLoading={isLoading}
              />
            </div>
            <div className="flex-1 min-h-[500px] lg:min-h-[850px] bg-gradient-to-br from-[#111318] to-[#0a0b0e] border border-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              <div className="relative z-10 w-full h-full p-2 lg:p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full"
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <SessionLogs
            history={history}
            setPrompt={setPrompt}
            setTone={setTone}
            setAudience={setAudience}
            setEpisode={setEpisode}
            setSession={setSession}
            setContentType={setContentType}
            setSelectedModel={setSelectedModel}
            setGeneratedMetadata={setGeneratedMetadata}
          />
        </div>
      </div>
    </div>
  );
}
