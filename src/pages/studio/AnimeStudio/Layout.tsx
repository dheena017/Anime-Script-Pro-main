import React, { useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';

// Local Studio Components
import { ProductionCore } from './components/Layout/ProductionCore';
import { SessionLogs } from './components/Layout/SessionLogs';
import { AnimeStudioNavigation } from './components/AnimeStudioNavigation';
import { AnimeStudioTopBar } from './components/AnimeStudioTopBar';

import '@/styles/creative-engine.css';
import { generateScript } from '@/services/generators/script';

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
    // Basic Parameters
    prompt, setPrompt,
    tone, setTone,
    audience, setAudience,
    episode, setEpisode,
    session, setSession,
    numScenes, setNumScenes,
    selectedModel, setSelectedModel,
    isLoading, setIsLoading,
    isSaving, setIsSaving,
    
    // Generated Content
    generatedScript, setGeneratedScript,
    generatedCharacters, setGeneratedCharacters,
    generatedSeriesPlan, setGeneratedSeriesPlan,
    generatedWorld, setGeneratedWorld,
    currentScriptId, setCurrentScriptId,
    
    // UI & State Helpers
    setContentType,
    setCastData, setCastList,
    setCharacterRelationships,
    setVisualData,
    setGeneratedMetadata,
    setGeneratedImagePrompts,
    addLog,
    theme, setTheme,
    showNotification,
    history,
    characterRelationships,
    recapperPersona, setRecapperPersona,
  } = useGenerator();

  // Initialize content type for this layout
  useEffect(() => {
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

  /**
   * Master Orchestration Loop
   * Triggers the full sequential production cycle.
   */
  const handleMasterGenerate = useCallback(async () => {
    if (!prompt.trim() || !user) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to initialize God Mode.', 'error');
      return;
    }
    setIsLoading(true);
    addLog("GOD_MODE", "INITIALIZED", "Orchestrating Autonomous Production Cycle...");
    showNotification?.('GOD MODE ACTIVE: Initiating Sequential Synthesis...', 'success');

    try {
      // Dynamic imports to optimize initial bundle
      const { generateWorld } = await import('@/services/generators/world');
      const { generateCharacters } = await import('@/services/generators/characters');
      const { generateSeriesPlan } = await import('@/services/generators/series');
      const { generateScript, generateImagePrompts, generateMetadata } = await import('@/services/api/gemini');

      // PHASE 1: WORLD Lore
      addLog("WORLD", "STARTING", "Synthesizing World Lore Source of Truth...");
      const world = await generateWorld(prompt, selectedModel, 'Anime');
      setGeneratedWorld(world);
      addLog("WORLD", "COMPLETED", "Lore synchronized to core.");

      // PHASE 2: Cast DNA
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

      // PHASE 3: Series Architecture
      addLog("SERIES", "STARTING", "Architecting Series Hierarchy...");
      const seriesPlan = await generateSeriesPlan(prompt, selectedModel, 'Anime', 12, world, typeof castResult === 'string' ? castResult : castResult.markdown);
      setGeneratedSeriesPlan(seriesPlan);
      addLog("SERIES", "COMPLETED", "Series hierarchy mapped to beats.");

      // PHASE 4: Script Synthesis
      addLog("SCRIPT", "STARTING", "Synthesizing Episode 1 Script...");
      const ep1Plan = seriesPlan?.find((ep: any) => parseInt(ep.episode) === 1);
      const script = await generateScript(
        prompt, tone, audience, "1", "1", numScenes, selectedModel, 'Anime', 
        recapperPersona, characterRelationships, world, typeof castResult === 'string' ? castResult : castResult.markdown, ep1Plan ? JSON.stringify(ep1Plan) : null
      );
      setGeneratedScript(script);
      addLog("SCRIPT", "COMPLETED", "Script synthesis successful.");

      // PHASE 5: Visual DNA (Storyboard)
      addLog("STORYBOARD", "STARTING", "Manifesting Visual DNA for Scenes...");
      const visualPrompts = await generateImagePrompts(script, selectedModel);
      setGeneratedImagePrompts(visualPrompts);
      setVisualData({ 0: ["pending"] }); 
      addLog("STORYBOARD", "COMPLETED", "Visual prompts architected.");

      // PHASE 6: SEO Matrix
      addLog("SEO", "STARTING", "Synchronizing SEO Metadata...");
      const seo = await generateMetadata(script, selectedModel);
      setGeneratedMetadata(seo);
      addLog("SEO", "COMPLETED", "SEO Matrix online.");

      showNotification?.('God Mode Synchronization Complete: Full Production Scaffolded', 'success');
      navigate(`${basePath}/world`);
    } catch (error: any) {
      console.error("Master Orchestration Failed:", error);
      addLog("CORE", "FAILURE", error.message || "Unknown error during synthesis");
      showNotification?.(`Master Loop Failure: ${error.message || 'Check logs'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, user, selectedModel, tone, audience, numScenes, recapperPersona, characterRelationships, setGeneratedWorld, setGeneratedCharacters, setCastData, setCastList, setCharacterRelationships, setGeneratedSeriesPlan, setGeneratedScript, setGeneratedImagePrompts, setVisualData, setGeneratedMetadata, showNotification, addLog, navigate, basePath, setIsLoading]);
  
  useEffect(() => {
    const handleGenerateSignal = () => handleMasterGenerate();
    window.addEventListener('studio-generate-all', handleGenerateSignal);
    return () => window.removeEventListener('studio-generate-all', handleGenerateSignal);
  }, [handleMasterGenerate]);


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
    <div className="fixed inset-0 bg-[#020203] flex flex-col overflow-hidden z-[1000] studio-engine-root">
      {/* Dedicated Studio Top Bar */}
      <AnimeStudioTopBar 
        onToggleEngine={toggleEngine}
        isEngineOpen={sidebarOpen}
      />

      {/* Global Studio Navigation */}
      <AnimeStudioNavigation basePath={basePath} />

      <div className="flex-1 flex overflow-hidden relative h-full">
        <div className="flex-1 flex flex-col min-w-0 relative h-full">

        {/* Main Production Workspace */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Background Atmospheric Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="w-full max-w-7xl mx-auto px-6 py-8 relative z-10">
            <div id="studio-content-area" className="w-full min-h-[600px] bg-[#0a0b0e]/80 backdrop-blur-3xl border border-zinc-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              
              <div className="relative z-10 w-full h-full">
                <React.Suspense fallback={
                  <div className="flex items-center justify-center w-full h-[600px]">
                    <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin shadow-[0_0_15px_rgba(239,68,68,0.2)]" />
                  </div>
                }>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.02, y: -10 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        mass: 0.8
                      }}
                      className="w-full h-full p-6"
                    >
                      <Outlet />
                    </motion.div>
                  </AnimatePresence>
                </React.Suspense>
              </div>
            </div>

            {/* Production Intelligence Console */}
            <div className="mt-8">
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
        </div>

        {/* Creative Engine Sidepanel */}
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
    </div>
  );
}
