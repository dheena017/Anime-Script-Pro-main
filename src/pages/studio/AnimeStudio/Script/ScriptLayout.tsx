import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { ScriptHeader } from './components/ScriptHeader';
import { ScriptToolbar } from './components/ScriptToolbar';
import { generateScript } from '@/services/api/gemini';
import { ScriptTab } from './Tabs/ScriptTabs';

export const ScriptContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function ScriptLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const { showNotification } = useApp();
  const {
    generatedScript, isLoading, prompt, tone, audience,
    session, episode, numScenes, selectedModel, contentType,
    recapperPersona, characterRelationships, generatedWorld,
    generatedCharacters, generatedSeriesPlan, isSaving
  } = useGeneratorState();

  const {
    setGeneratedScript, setIsLoading, syncCore
  } = useGeneratorDispatch();

  useAuth();

  const handleSave = async () => {
    await syncCore();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first to write a script.', 'error');
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
      showNotification?.('Script written successfully!', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('Failed to write script: ' + (e.message || 'Unknown error'), 'error');
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
        <div className="studio-module-header">
          <ScriptHeader
            onRegenerate={handleGenerate}
            isGenerating={isLoading}
            onNext={() => navigate('/anime/storyboard')}
            onPrev={() => navigate('/anime/series')}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedScript}
            session={session}
            episode={episode}
          />
        </div>

        <div className="studio-module-toolbar flex items-center justify-center p-2 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-xl mb-8">
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
            onNext={handlers.handleNextEpisode}
            onPrev={handlers.handlePrevEpisode}
          />
        </div>

        <Outlet context={{ activeTab }} />
      </div>

    </ScriptContext.Provider>
  );
}



