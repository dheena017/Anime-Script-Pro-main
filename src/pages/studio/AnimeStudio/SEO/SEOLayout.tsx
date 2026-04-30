import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGenerator } from '@/hooks/useGenerator';
import { SEOHeader } from '../../components/SEO/SEOHeader';
import { SEOToolbar } from '../../components/SEO/SEOToolbar';
import { generateMetadata } from '@/services/geminiService';
import { SEOTab } from '../../components/SEO/Tabs/SEOTabs';

export const SEOContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function SEOLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [, setHandlers] = React.useState<any>({});

  const {
    generatedMetadata, setGeneratedMetadata,
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
      const metadata = await generateMetadata(generatedScript, selectedModel);
      setGeneratedMetadata(metadata);
      showNotification?.('SEO Analysis Complete: Metadata Manifested', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('SEO Failure: ' + (e.message || 'Unknown Error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const activeTab = (searchParams.get('tab') as SEOTab) || 'keywords';

  const handleTabChange = (tab: SEOTab) => {
    setSearchParams({ tab });
  };

  return (
    <SEOContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <SEOHeader
            onRegenerate={handleGenerate}
            isGenerating={isLoading}
            onNext={() => navigate('/anime/prompts')}
            onPrev={() => navigate('/anime/storyboard')}
            session={session}
            episode={episode}
          />
        </div>

        <div className="studio-module-toolbar flex items-center justify-center p-2 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-xl mb-8">
          <SEOToolbar
            status={generatedMetadata ? 'active' : 'empty'}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            session={session}
            episode={episode}
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
    </SEOContext.Provider>
  );
}
