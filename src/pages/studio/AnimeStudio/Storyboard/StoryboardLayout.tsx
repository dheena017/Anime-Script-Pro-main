import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGenerator } from '@/hooks/useGenerator';
import { StoryboardHeader } from '../../components/Storyboard/StoryboardHeader';
import { StoryboardToolbar } from '../../components/Storyboard/StoryboardToolbar';
import { generateImagePrompts } from '@/services/geminiService';
import { StoryboardTab } from '@/pages/studio/components/Storyboard/Tabs/StoryboardTabs';

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
    session, episode, selectedModel, showNotification,
    isSaving, setIsSaving
  } = useGenerator();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      showNotification?.('Visual DNA Manifest Synchronized', 'success');
    } catch (e) {
      showNotification?.('Sync Error', 'error');
    } finally {
      setIsSaving(false);
    }
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
