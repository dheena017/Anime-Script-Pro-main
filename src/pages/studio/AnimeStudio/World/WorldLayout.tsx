import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { WorldHeader } from '../components/World/WorldHeader';
import { WorldToolbar } from '../components/World/WorldToolbar';
import { generateWorld } from '@/services/api/gemini';
import { WorldTab } from '../components/World/Tabs/WorldTabs';

import { createContext } from 'react';

export const WorldContext = createContext<{
  activeTab: WorldTab;
  setActiveTab: (tab: WorldTab) => void;
}>({
  activeTab: 'architecture',
  setActiveTab: () => {},
});

export default function WorldLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    isGeneratingWorld, setIsGeneratingWorld,
    prompt, selectedModel, contentType,
    setGeneratedWorld,
    session, episode, showNotification,
    generatedWorld,
    isSaving, setIsSaving,
    architecture, atlas, historyLore, systems, culture
  } = useGenerator();

  const { user } = useAuth();

  const handleSave = async () => {
    if (!user?.id) {
      showNotification?.('Authentication Required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const { worldApi } = await import('@/services/api/world');
      await worldApi.updateLore(user.id, {
        architecture,
        atlas,
        history: historyLore,
        systems,
        culture,
        full_lore_blob: generatedWorld
      });
      showNotification?.('World Lore Manifest Synchronized', 'success');
    } catch (e) {
      console.error("Manual sync failed:", e);
      showNotification?.('Sync Error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to manifest world lore.', 'error');
      return;
    }
    setIsGeneratingWorld(true);
    try {
      const result = await generateWorld(prompt, selectedModel, contentType);
      setGeneratedWorld(result);
      showNotification?.('Neural Synthesis Complete: World Manifested', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('Lore Synthesis Failure: ' + (e.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingWorld(false);
    }
  };

  const activeTab = (searchParams.get('tab') as WorldTab) || 'architecture';

  const handleTabChange = (tab: WorldTab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      <div className="studio-module-header">
        <WorldHeader
          isGenerating={isGeneratingWorld}
          onRegenerate={handleGenerate}
          prompt={prompt}
          session={session}
          episode={episode}
          onPrev={() => navigate('/anime/mission')}
          onNext={() => navigate('/anime/cast')}
          onSave={handleSave}
          isSaving={isSaving}
          hasContent={!!generatedWorld}
        />
      </div>

      <div className="studio-module-toolbar flex items-center justify-center p-2 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-xl mb-8">
        <WorldToolbar
          status={generatedWorld ? 'active' : 'empty'}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          session={session}
          episode={episode}
          content={generatedWorld}
        />
      </div>

      <WorldContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet context={{ activeTab }} />
        </motion.div>
      </WorldContext.Provider>
    </div>
  );
}


