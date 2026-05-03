import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { WorldHeader } from './components/WorldHeader';
import { WorldToolbar } from './components/WorldToolbar';
import { generateWorld } from '@/services/api/gemini';
import { WorldTab } from './tabs/WorldTabs';

import { createContext } from 'react';

export const WorldContext = createContext<{
  activeTab: WorldTab;
  setActiveTab: (tab: WorldTab) => void;
}>({
  activeTab: 'architecture',
  setActiveTab: () => { },
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
    isSaving,
    syncCore
  } = useGenerator();

  useAuth();

  const handleSave = async () => {
    await syncCore();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first before building your world.', 'error');
      return;
    }
    setIsGeneratingWorld(true);
    try {
      const result = await generateWorld(prompt, selectedModel, contentType);
      setGeneratedWorld(result);
      showNotification?.('World created successfully!', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('Failed to create world: ' + (e.message || 'Unknown error'), 'error');
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
          onPrev={() => navigate('/anime/engine')}
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
        <Outlet context={{ activeTab }} />
      </WorldContext.Provider>
    </div>
  );
}



