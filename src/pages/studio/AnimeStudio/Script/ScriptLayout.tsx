import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGenerator } from '@/hooks/useGenerator';
import { ScriptHeader } from '../../components/Script/ScriptHeader';
import { ScriptToolbar } from '../../components/Script/ScriptToolbar';
import { generateScript } from '@/services/geminiService';
import { ScriptTab } from '@/pages/studio/components/Script/Tabs/ScriptTabs';

export const ScriptContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function ScriptLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    generatedScript, setGeneratedScript,
    isLoading, setIsLoading,
    prompt, tone, audience, session, episode, numScenes, selectedModel, contentType,
    recapperPersona, characterRelationships, generatedWorld, generatedCharacters,
    generatedSeriesPlan, showNotification
  } = useGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to initialize synthesis.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const currentEpisodePlan = generatedSeriesPlan?.find((ep: any) => parseInt(ep.episode) === parseInt(episode));
      const script = await generateScript(
        prompt, tone, audience, session, episode, numScenes, selectedModel, contentType,
        recapperPersona, characterRelationships, generatedWorld, generatedCharacters,
        currentEpisodePlan ? JSON.stringify(currentEpisodePlan) : null
      );
      setGeneratedScript(script);
      showNotification?.('Neural Synthesis Complete: Script Manifested', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('Synthesis Failure: ' + (e.message || 'Unknown Error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const activeTab = (searchParams.get('tab') as ScriptTab) || 'teleprompter';

  const handleTabChange = (tab: ScriptTab) => {
    setSearchParams({ tab });
  };

  return (
    <ScriptContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <ScriptHeader
          onRegenerate={handleGenerate}
          isGenerating={isLoading}
          onNext={handlers.handleNextEpisode || (() => navigate('/anime/storyboard'))}
          onPrev={handlers.handlePrevEpisode || (() => navigate('/anime/series'))}
          session={session}
          episode={episode}
        />

        <div className="flex items-center justify-center p-2 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-xl mb-8">
          <ScriptToolbar
            status={generatedScript ? 'active' : 'empty'}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            session={session}
            episode={episode}
            content={generatedScript}
            onExport={handlers.exportToPDF}
            onViewSEO={handlers.handleGenerateSEO}
            onViewPrompts={handlers.handleGeneratePrompts}
            onViewStoryboard={handlers.handleGenerateVisuals}
            onExtend={handlers.handleContinueScript}
            onListen={handlers.playVoiceover}
          />
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet context={{ activeTab }} />
        </motion.div>
      </div>
    </ScriptContext.Provider>
  );
}
