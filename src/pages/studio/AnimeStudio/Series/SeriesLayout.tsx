import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { SeriesHeader } from '../../components/Series/SeriesHeader';
import { SeriesToolbar } from '../../components/Series/SeriesToolbar';
import { generateSeriesPlan } from '@/services/geminiService';
import { SeriesTab } from '@/pages/studio/components/Series/Tabs/SeriesTabs';

export default function SeriesLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
    isSaving, setIsSaving,
    castProfiles, castData, generatedMetadata, generatedScript
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
      showNotification?.('Series Roadmap Synchronized', 'success');
    } catch (e) {
      console.error("Manual sync failed:", e);
      showNotification?.('Sync Error', 'error');
    } finally {
      setIsSaving(false);
    }
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

  const activeTab = (searchParams.get('tab') as SeriesTab) || 'roadmap';

  const handleTabChange = (tab: SeriesTab) => {
    setSearchParams({ tab });
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet context={{ showScaffolder, setShowScaffolder, activeTab }} />
      </motion.div>
    </div>
  );
}
