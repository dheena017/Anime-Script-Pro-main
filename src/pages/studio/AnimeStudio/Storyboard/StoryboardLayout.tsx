import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Palette } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { StoryboardHeader } from '../../components/Storyboard/StoryboardHeader';
import { StoryboardToolbar } from '../../components/Storyboard/StoryboardToolbar';
import { generateImagePrompts } from '@/services/geminiService';

export const StoryboardContext = React.createContext<{
  setHandlers: (handlers: any) => void;
}>({ setHandlers: () => { } });

export default function StoryboardLayout() {
  const navigate = useNavigate();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    generatedScript,
    generatedImagePrompts, setGeneratedImagePrompts,
    isGeneratingImagePrompts, setIsGeneratingImagePrompts,
    session, episode, selectedModel, showNotification
  } = useGenerator();

  const handleGenerate = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before generating visual DNA.', 'error');
      return;
    }
    setIsGeneratingImagePrompts(true);
    try {
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(prompts);
      showNotification?.('Visual DNA manifest synchronized', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('Synthesis Failure: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingImagePrompts(false);
    }
  };

  return (
    <StoryboardContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <StoryboardHeader
          onRegenerate={handlers.handleGenerateAll || handleGenerate}
          isGenerating={handlers.isGenerating || isGeneratingImagePrompts}
          onNext={() => navigate('/anime/seo')}
          onPrev={() => navigate('/anime/script')}
          session={session}
          episode={episode}
          handleAddScene={handlers.handleAddScene}
          scenesLength={handlers.scenesLength || 0}
          handleFullProductionLoop={handlers.handleFullProductionLoop}
          isProductionLoopActive={handlers.isProductionLoopActive}
          productionProgress={handlers.productionProgress}
        />

        <div className="flex items-center justify-between p-4 bg-[#050505]/60 backdrop-blur-xl border border-studio/20 rounded-2xl mb-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex items-center gap-12 z-10 w-full">
            <div className="flex items-center gap-3 px-4 py-2 bg-studio/10 border border-studio/20 rounded-xl">
              <Palette className="w-4 h-4 text-studio" />
              <span className="text-[10px] font-black text-studio uppercase tracking-[0.2em]">Storyboard_Nexus</span>
            </div>

            <StoryboardToolbar
              session={session}
              episode={episode}
              status={generatedImagePrompts ? 'active' : 'empty'}
              onEnhanceNarration={handlers.handleEnhanceAllNarration}
              onEnhanceVisuals={handlers.handleEnhanceAllVisuals}
              isGlobalEnhancing={handlers.isGlobalEnhancing}
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
    </StoryboardContext.Provider>
  );
}
