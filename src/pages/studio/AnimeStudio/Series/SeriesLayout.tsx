import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateSeriesPlan } from '@/services/api/gemini';
import { SeriesHeader } from '../components/Series/SeriesHeader';
import { SeriesToolbar } from '../components/Series/SeriesToolbar';
import { SeriesTab } from '../components/Series/Tabs/SeriesTabs';

export default function SeriesLayout() {
  const navigate = useNavigate();
  const [showScaffolder, setShowScaffolder] = React.useState(false);

  const {
    generatedSeriesPlan,
    setGeneratedSeriesPlan,
    isGeneratingSeries,
    setIsGeneratingSeries,
    prompt,
    selectedModel,
    contentType,
    session,
    episode,
    generatedWorld,
    generatedCharacters,
    showNotification,
    isSaving, 
    syncCore
  } = useGenerator();

  useAuth();

  const handleSave = async () => {
    await syncCore();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to map the series.', 'error');
      return;
    }
    setIsGeneratingSeries(true);
    try {
      const totalEpisodes = 12; // Default
      const plan = await generateSeriesPlan(prompt, selectedModel, contentType, totalEpisodes, generatedWorld || undefined, generatedCharacters || undefined);
      setGeneratedSeriesPlan(plan);
      showNotification?.('Neural Synthesis Complete: Master Sequence Archived', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Synthesis Failure: ' + (error.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingSeries(false);
    }
  };

  const location = useLocation();
  
  const getActiveTab = (): SeriesTab => {
    const path = location.pathname;
    if (path.includes('/series/episodes')) return 'episodes';
    if (path.includes('/series/arcs')) return 'arcs';
    if (path.includes('/series/blueprint')) return 'blueprint';
    if (path.includes('/series/assets')) return 'assets';
    if (path.includes('/series/timeline')) return 'timeline';
    
    if (path.endsWith('/series') || path.includes('/series/roadmap')) return 'roadmap';
    
    return 'roadmap';
  };

  const activeTab = getActiveTab();
  
  const handleTabChange = (tab: SeriesTab) => {
    const base = `/${contentType.toLowerCase()}/series`;
    if (tab === 'roadmap') {
      navigate(base);
    } else {
      navigate(`${base}/${tab}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="studio-module-header">
        <SeriesHeader
          onRegenerate={handleGenerate}
          isGenerating={isGeneratingSeries}
          onPrev={() => navigate('/anime/cast')}
          onNext={() => navigate('/anime/script')}
          onSave={handleSave}
          isSaving={isSaving}
          hasContent={!!generatedSeriesPlan}
          session={session}
          episode={episode}
        />
      </div>

      <div className="studio-module-toolbar flex items-center justify-center p-2 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-xl mb-8">
        <SeriesToolbar
          status={generatedSeriesPlan ? 'active' : 'empty'}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          session={session}
          episode={episode}
          onToggleScaffolder={() => setShowScaffolder(!showScaffolder)}
          showScaffolder={showScaffolder}
          onManifestClick={() => handleTabChange('roadmap')}
          onExportClick={() => {
            if (!generatedSeriesPlan) return;
            const blob = new Blob([JSON.stringify(generatedSeriesPlan, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `series-manifest-S${session}-E${episode}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          content={generatedSeriesPlan ? JSON.stringify(generatedSeriesPlan, null, 2) : null}
        />
      </div>

      <Outlet context={{ showScaffolder, setShowScaffolder, activeTab }} />
    </div>
  );
}



