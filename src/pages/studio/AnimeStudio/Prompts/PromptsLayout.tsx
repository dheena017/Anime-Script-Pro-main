import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import EpisodePackager from './components/EpisodePackager';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateImagePrompts, generateVideoPrompts } from '@/services/api/gemini';
import { PromptsHeader } from './components/PromptsHeader';
import { PromptsToolbar } from './components/PromptsToolbar';
import { PromptsTab } from './Tabs/PromptsTabs';

export const PromptsContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function PromptsLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    generatedImagePrompts, setGeneratedImagePrompts,
    videoData, setVideoData,
    isLoading, setIsLoading,
    generatedScript, selectedModel, session, episode,
    showNotification,
    isSaving, setIsSaving,
    castProfiles, castData, generatedSeriesPlan, generatedMetadata
  } = useGenerator();

  const { user } = useAuth();

  const handleSave = async () => {
    if (!user?.id) {
      showNotification?.('Authentication Required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const { productionApi } = await import('@/services/api/production');
      await productionApi.updateContent(user.id, {
        cast_profiles: castProfiles,
        cast_data: castData,
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata
      });
      showNotification?.('Prompts saved successfully!', 'success');
    } catch (e) {
      console.error("Manual sync failed:", e);
      showNotification?.('Sync Error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating prompts.', 'error');
      return;
    }

    const tab = (searchParams.get('tab') as PromptsTab) || 'image';

    setIsLoading(true);
    try {
      if (tab === 'video') {
        const vprompts = await generateVideoPrompts(generatedScript, selectedModel);
        setVideoData(vprompts as any);
        showNotification?.('Video prompts generated successfully!', 'success');
      } else {
        const prompts = await generateImagePrompts(generatedScript, selectedModel);
        setGeneratedImagePrompts(prompts as any);
        showNotification?.('Image prompts generated successfully!', 'success');
      }
    } catch (e: any) {
      console.error(e);
      showNotification?.('Failed to generate prompts: ' + (e.message || 'Unknown error'), 'error');
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
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={activeTab === 'video' ? !!videoData : !!generatedImagePrompts}
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
          {activeTab === 'video' ? <EpisodePackager /> : <Outlet context={{ activeTab }} />}
        </motion.div>
      </div>
    </PromptsContext.Provider>
  );
}



