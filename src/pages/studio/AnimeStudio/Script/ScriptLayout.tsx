import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ScrollText } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { ScriptHeader } from '../../components/Script/ScriptHeader';
import { ScriptToolbar } from '../../components/Script/ScriptToolbar';
import { generateScript } from '@/services/geminiService';

export const ScriptContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function ScriptLayout() {
  const navigate = useNavigate();
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

        <div className="flex items-center justify-between p-4 bg-[#050505]/60 backdrop-blur-xl border border-studio/20 rounded-2xl mb-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex items-center gap-12 z-10 w-full">
            <div className="flex items-center gap-3 px-4 py-2 bg-studio/10 border border-studio/20 rounded-xl">
              <ScrollText className="w-4 h-4 text-studio" />
              <span className="text-[10px] font-black text-studio uppercase tracking-[0.2em]">Script_Nexus</span>
            </div>

            <ScriptToolbar
              session={session}
              episode={episode}
              status={generatedScript ? 'active' : 'empty'}
              onExport={handlers.exportToPDF}
              onViewSEO={handlers.handleGenerateSEO}
              onViewPrompts={handlers.handleGeneratePrompts}
              onViewStoryboard={handlers.handleGenerateVisuals}
              onExtend={handlers.handleContinueScript}
              onListen={handlers.playVoiceover}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </ScriptContext.Provider>
  );
}
