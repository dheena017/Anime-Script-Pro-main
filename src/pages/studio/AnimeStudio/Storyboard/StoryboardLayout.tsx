import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateImagePrompts } from '@/services/api/gemini';

import { StoryboardHeader } from '../components/Storyboard/StoryboardHeader';
import { StoryboardToolbar } from '../components/Storyboard/StoryboardToolbar';
import { StoryboardTab } from '../components/Storyboard/Tabs/StoryboardTabs';

export const StoryboardContext = React.createContext<{
  setHandlers: (handlers: any) => void;
}>({ setHandlers: () => { } });

export default function StoryboardLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    generatedScript,
    generatedImagePrompts, setGeneratedImagePrompts,
    isGeneratingImagePrompts, setIsGeneratingImagePrompts,
    selectedModel, showNotification,
    isSaving, 
    syncCore,
    session, episode
  } = useGenerator();

  useAuth();

  const handleSave = async () => {
    await syncCore();
  };

  const handleGenerate = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesize a script manifest before generating visual DNA.', 'error');
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

  const activeTab = (searchParams.get('tab') as StoryboardTab) || 'frames';

  const handleTabChange = (tab: StoryboardTab) => {
    setSearchParams({ tab });
  };

  return (
    <StoryboardContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <StoryboardHeader
            onRegenerate={handlers.handleGenerateAll || handleGenerate}
            isGenerating={handlers.isGenerating || isGeneratingImagePrompts}
            onNext={() => navigate('/anime/seo')}
            onPrev={() => navigate('/anime/script')}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedImagePrompts}
            session={session}
            episode={episode}
          />
        </div>

        <div className="studio-module-toolbar flex items-center justify-center p-2 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-xl mb-8">
          <StoryboardToolbar
            status={generatedImagePrompts ? 'active' : 'empty'}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            session={session}
            episode={episode}
            content={generatedImagePrompts}
            onEnhanceNarration={handlers.handleEnhanceAllNarration}
            onEnhanceVisuals={handlers.handleEnhanceAllVisuals}
            isGlobalEnhancing={handlers.isGlobalEnhancing}
            onAddScene={handlers.handleAddScene}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet context={{ activeTab }} />
        </motion.div>
      </div>
    </StoryboardContext.Provider>
  );
}


