import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { ProductionOrchestrator } from '@/services/productionOrchestrator';
import { generateScript } from '@/services/geminiService';

import { motion, AnimatePresence } from 'motion/react';
import { ProductionCore } from './components/Layout/ProductionCore';
import { AnimeStudioNavigation as StudioNavigation } from './components/Layout/AnimeStudioNavigation';
import { SessionLogs } from './components/Layout/SessionLogs';

export function StudioLayout({ type }: { type?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sync Creative Engine state with URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const isEngineOpen = searchParams.get('engine') === 'open';
  const [sidebarOpen, setSidebarOpen] = React.useState(isEngineOpen);

  const toggleEngine = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    const newParams = new URLSearchParams(location.search);
    if (newState) {
      newParams.set('engine', 'open');
    } else {
      newParams.delete('engine');
    }
    navigate({ search: newParams.toString() }, { replace: true });
  };
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

  const handleSaveCurrent = async () => {
    if (!generatedScript || !user) return;
    setIsSaving(true);
    try {
      // API call handles the database save to PostgreSQL/Supabase
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: prompt || "Untitled Script",
          content_type: contentType,
          prompt: prompt,
          vibe: tone
        })
      });

      if (!res.ok) throw new Error("Failed to save project");
      const project = await res.json();
      setCurrentScriptId(project.id);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMasterGenerate = async () => {
    if (!prompt.trim() || !user) return;
    setIsLoading(true);

    try {
      const orchestrator = new ProductionOrchestrator({
        prompt,
        contentType,
        model: selectedModel,
        userId: user.id,
        vibe: tone
      });

      const result = await orchestrator.executeFullCycle((phase) => {
        const module = phase.split(":")[0].trim();
        const msg = phase.split(":").slice(1).join(":").trim();
        addLog(module, "PROCESSED", msg);
      });

      // Sync results to context
      if (result.world) setGeneratedWorld(result.world);

      if (result.cast) {
        if (typeof result.cast === 'object' && 'markdown' in result.cast) {
          setGeneratedCharacters(result.cast.markdown);
          setCastData(result.cast);
          if (result.cast.characters) {
            setCastList(result.cast.characters);
          }
          if (result.cast.relationships) {
            setCharacterRelationships(JSON.stringify(result.cast.relationships));
          }
        } else {
          setGeneratedCharacters(result.cast as string);
        }
      }

      if (result.series) {
        setGeneratedSeriesPlan(result.series);
        // Map 60 episodes to narrative beats for context
        const formattedBeats = result.series
          .slice(0, 10) // Only show first 10 in the beats area for UI clarity
          .map((e, i) => `${i + 1}. ${e.title}: ${e.hook}`)
          .join('\n');
        setNarrativeBeats(formattedBeats);
      }

      if (result.sequences) {
        // This is the SCEN blueprint (960 units)
        // In the context, we can store it for the SeriesPage visualization
        // setProductionSequence(result.sequences); // Assuming we add this to context
      }

      // Success feedback or redirect
      navigate(`${basePath}/series`);
    } catch (error) {
      console.error("Master Orchestration Failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
                rightSidebarOpen={sidebarOpen}
                onToggleRightSidebar={toggleEngine}
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

      <ProductionCore
        isOpen={sidebarOpen}
        onToggle={toggleEngine}
        prompt={prompt} setPrompt={setPrompt}
        tone={tone} setTone={setTone}
        audience={audience} setAudience={setAudience}
        session={session} setSession={setSession}
        episode={episode} setEpisode={setEpisode}
        numScenes={numScenes} setNumScenes={setNumScenes}
        selectedModel={selectedModel} setSelectedModel={setSelectedModel}
        recapperPersona={recapperPersona} setRecapperPersona={setRecapperPersona}
        narrativeBeats={narrativeBeats || ''}
        setNarrativeBeats={setNarrativeBeats}
        characterRelationships={characterRelationships || ''}
        setCharacterRelationships={setCharacterRelationships}
        worldBuilding={generatedWorld || ''}
        setWorldBuilding={setGeneratedWorld}
        castProfiles={generatedCharacters || ''}
        setCastProfiles={setGeneratedCharacters}
        handleGenerate={handleGenerate}
        handleMasterGenerate={handleMasterGenerate}
        handleSaveCurrent={handleSaveCurrent}
        isLoading={isLoading}
        isSaving={isSaving}
        generatedScript={generatedScript}
        currentScriptId={currentScriptId}
        user={user}
        basePath={basePath}
        navigate={navigate}
        contentType={contentType}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
