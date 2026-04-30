import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGenerator } from '@/hooks/useGenerator';
import { PromptsHeader } from '../../components/Prompts/PromptsHeader';
import { PromptsToolbar } from '../../components/Prompts/PromptsToolbar';
import { generateImagePrompts } from '@/services/geminiService';
import { PromptsTab } from '../../components/Prompts/Tabs/PromptsTabs';

export const PromptsContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function PromptsLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    generatedImagePrompts, setGeneratedImagePrompts,
    isLoading, setIsLoading,
    generatedScript, selectedModel, session, episode,
    showNotification
  } = useGenerator();

  const handleGenerate = async () => {
    if (!generatedScript) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to initialize synthesis.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(prompts);
      showNotification?.('Neural Synthesis Complete: Visual Prompts Archived', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('Synthesis Failure: ' + (e.message || 'Unknown Error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const activeTab = (searchParams.get('tab') as PromptsTab) || 'image';

  const handleTabChange = (tab: PromptsTab) => {
    setSearchParams({ tab });
  };

  return (
    <PromptsContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <PromptsHeader
            onRegenerate={handlers.handleGenerate || handleGenerate}
            isGenerating={handlers.isGenerating || isLoading}
            onNext={() => navigate('/anime/screening')}
            onPrev={() => navigate('/anime/seo')}
            session={session}
            episode={episode}
          />
        </div>

        <div className="studio-module-toolbar flex items-center justify-center p-2 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-xl mb-8">
          <PromptsToolbar
            status={generatedImagePrompts ? 'active' : 'empty'}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            session={session}
            episode={episode}
            content={generatedImagePrompts}
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
    </PromptsContext.Provider>
  );
}
