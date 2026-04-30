import React from 'react';
import '@/styles/creative-engine.css';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { generateScript } from '@/services/geminiService';
import { ProductionCore } from '@/pages/studio/components/Layout/ProductionCore';
import { AnimeStudioNavigation as StudioNavigation } from '@/pages/studio/components/Layout/AnimeStudioNavigation';
import { SessionLogs } from '@/pages/studio/components/Layout/SessionLogs';

/**
 * AnimeLayout - Production Node v2.1
 * Handles the main production loop for Anime studio type.
 */
export default function AnimeLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sync Creative Engine state with URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const isEngineOpen = searchParams.get('engine') === 'open';
  const [sidebarOpen, setSidebarOpen] = React.useState(isEngineOpen);

  // Update URL when sidebar state changes
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
    generatedSeriesPlan,
    setGeneratedSeriesPlan,
    tone, setTone,
    audience, setAudience,
    episode, setEpisode,
    session, setSession,
    setContentType,
    selectedModel, setSelectedModel,
    isLoading, setIsLoading,
    generatedScript,
    setCurrentScriptId,
    currentScriptId,
    history,
    setGeneratedMetadata,
    setGeneratedImagePrompts,

    recapperPersona, setRecapperPersona,
    characterRelationships, setCharacterRelationships,
    numScenes, setNumScenes,
    generatedWorld, setGeneratedWorld, generatedCharacters,
    setCastData, setCastList,
    isSaving, setIsSaving,
    setVisualData,
    addLog,
    theme, setTheme,
    showNotification,
  } = useGenerator();


  React.useEffect(() => {
    setContentType('Anime');
  }, [setContentType]);

  const basePath = '/anime';

  const handleSaveCurrent = async () => {
    if (!generatedScript || !user) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: prompt || "Untitled Anime Project",
          content_type: 'Anime',
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
    if (!prompt.trim() || !user) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to initialize God Mode.', 'error');
      return;
    }
    setIsLoading(true);
    addLog("GOD_MODE", "INITIALIZED", "Orchestrating Autonomous Production Cycle...");
    showNotification?.('GOD MODE ACTIVE: Initiating Sequential Synthesis...', 'success');

    try {
      const { generateWorld } = await import('@/services/generators/world');
      const { generateCharacters } = await import('@/services/generators/characters');
      const { generateSeriesPlan } = await import('@/services/generators/series');
      const { generateScript, generateImagePrompts, generateMetadata } = await import('@/services/geminiService');

      // PHASE 1: WORLD Lore
      addLog("WORLD", "STARTING", "Synthesizing World Lore Source of Truth...");
      const world = await generateWorld(prompt, selectedModel, 'Anime');
      setGeneratedWorld(world);
      addLog("WORLD", "COMPLETED", "Lore synchronized to core.");



      // PHASE 3: Cast DNA
      addLog("CAST", "STARTING", "Sequencing Character DNA...");
      const castResult = await generateCharacters(prompt, selectedModel, 'Anime', world);
      if (typeof castResult === 'object' && castResult.characters) {
        setGeneratedCharacters(castResult.markdown);
        setCastData(castResult);
        setCastList(castResult.characters);
        if (castResult.relationships) {
          setCharacterRelationships(JSON.stringify(castResult.relationships));
        }
      } else {
        setGeneratedCharacters(castResult as string);
      }
      addLog("CAST", "COMPLETED", "Cast manifest generated.");

      // PHASE 4: Series Architecture
      addLog("SERIES", "STARTING", "Architecting Series Hierarchy...");
      const seriesPlan = await generateSeriesPlan(prompt, selectedModel, 'Anime', 12, world, typeof castResult === 'string' ? castResult : castResult.markdown);
      setGeneratedSeriesPlan(seriesPlan);
      addLog("SERIES", "COMPLETED", "Series hierarchy mapped to beats.");

      // PHASE 5: Script Synthesis
      addLog("SCRIPT", "STARTING", "Synthesizing Episode 1 Script...");
      const ep1Plan = seriesPlan?.find((ep: any) => parseInt(ep.episode) === 1);
      const script = await generateScript(
        prompt, tone, audience, "1", "1", numScenes, selectedModel, 'Anime', 
        recapperPersona, characterRelationships, world, typeof castResult === 'string' ? castResult : castResult.markdown, ep1Plan ? JSON.stringify(ep1Plan) : null
      );
      setGeneratedScript(script);
      addLog("SCRIPT", "COMPLETED", "Script synthesis successful.");

      // PHASE 6: Visual DNA (Storyboard)
      addLog("STORYBOARD", "STARTING", "Manifesting Visual DNA for Scenes...");
      const visualPrompts = await generateImagePrompts(script, selectedModel);
      setGeneratedImagePrompts(visualPrompts);
      // Simulate visual data for storyboard unlocking
      setVisualData({ 0: ["pending"] }); 
      addLog("STORYBOARD", "COMPLETED", "Visual prompts architected.");

      // PHASE 7: SEO Matrix
      addLog("SEO", "STARTING", "Synchronizing SEO Metadata...");
      const seo = await generateMetadata(script, selectedModel);
      setGeneratedMetadata(seo);
      addLog("SEO", "COMPLETED", "SEO Matrix online.");

      // PHASE 8: Prompts (Already done in storyboard phase but can be specific)
      addLog("PROMPTS", "COMPLETED", "Image generation prompts archived.");

      // PHASE 9: Screening Room
      addLog("SCREENING", "READY", "Production pipeline finalized. Screening room open.");

      showNotification?.('God Mode Synchronization Complete: Full Production Scaffolded', 'success');
      navigate(`${basePath}/world`);
    } catch (error: any) {
      console.error("Master Orchestration Failed:", error);
      addLog("CORE", "FAILURE", error.message || "Unknown error during synthesis");
      showNotification?.(`Master Loop Failure: ${error.message || 'Check logs'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt.', 'error');
      return;
    }
    setIsLoading(true);
    navigate(`${basePath}/script`);
    
    try {
      const currentEpisodePlan = generatedSeriesPlan?.find((ep: any) => parseInt(ep.episode) === parseInt(episode));
      const script = await generateScript(prompt, tone, audience, session, episode, numScenes, selectedModel, 'Anime', recapperPersona, characterRelationships, generatedWorld, generatedCharacters, currentEpisodePlan ? JSON.stringify(currentEpisodePlan) : null);
      setGeneratedScript(script);
      setCurrentScriptId(null);
      showNotification?.('Neural Synthesis Complete: Script Manifested', 'success');

      if (user) {
        // 1. Create/Initialize Project
        const projectRes = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            name: prompt.slice(0, 30) || "Single Generation",
            content_type: 'Anime',
            prompt: prompt,
            vibe: tone
          })
        });

        if (projectRes.ok) {
          const project = await projectRes.json();
          setCurrentScriptId(project.id);

          // 2. Save the Actual Script Content
          await fetch("/api/scripts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: `Script: ${project.name}`,
              content: script,
              project_id: project.id
            })
          });

          // 3. Log the Production Method (Vibe)
          await fetch("/api/methods", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: tone,
              description: `Production vibe used for project ${project.id}`
            })
          });

          // 4. Archive the Prompt
          await fetch("/api/prompts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: prompt,
              context: `SINGLE_GEN_SEED_PROMPT_ID_${project.id}`
            })
          });
        }
      }
    } catch (error) {
      console.error("Single generation persistence failed:", error);
      showNotification?.('Synthesis Failure', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen transition-all duration-500 bg-[#020203] relative overflow-hidden">
      {/* Global Ambient Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] -z-10 animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] -z-10" />

      <div className={cn(
        "w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 lg:py-8 space-y-8 transition-all duration-500 relative z-10"
      )}>
        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col gap-6">
            <StudioNavigation
              basePath={basePath}
              handleGenerate={handleMasterGenerate}
              isLoading={isLoading}
              rightSidebarOpen={sidebarOpen}
              onToggleRightSidebar={toggleEngine}
            />

            <div id="studio-content-area" className="flex-1 min-h-[500px] lg:min-h-[850px] bg-gradient-to-br from-[#111318] to-[#0a0b0e] border border-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-3xl relative overflow-y-auto custom-scrollbar">
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
        contentType="Anime"
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
