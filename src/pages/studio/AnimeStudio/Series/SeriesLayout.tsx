import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { SeriesHeader } from '../../components/Series/SeriesHeader';
import { SeriesToolbar } from '../../components/Series/SeriesToolbar';
import { generateSeriesPlan } from '@/services/geminiService';

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
    showNotification
  } = useGenerator();

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

  return (
    <div className="space-y-6">
      <SeriesHeader
        onRegenerate={handleGenerate}
        isGenerating={isGeneratingSeries}
        onNext={() => navigate('/anime/script')}
        session={session}
        episode={episode}
      />

      <div className="flex items-center justify-between p-4 bg-[#050505]/60 backdrop-blur-xl border border-studio/20 rounded-2xl mb-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="flex items-center gap-12 z-10 w-full">
          <div className="flex items-center gap-3 px-4 py-2 bg-studio/10 border border-studio/20 rounded-xl">
            <Layers className="w-4 h-4 text-studio" />
            <span className="text-[10px] font-black text-studio uppercase tracking-[0.2em]">Series_Nexus</span>
          </div>

          <SeriesToolbar
            session={session}
            episode={episode}
            status={generatedSeriesPlan ? 'active' : 'empty'}
            onToggleScaffolder={() => setShowScaffolder(!showScaffolder)}
            showScaffolder={showScaffolder}
            onManifestClick={() => {
              document.getElementById('master-manifest')?.scrollIntoView({ behavior: 'smooth' });
            }}
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
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet context={{ showScaffolder, setShowScaffolder }} />
      </motion.div>
    </div>
  );
}
