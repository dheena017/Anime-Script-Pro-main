import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Milestone, Activity, Table, ChevronRight, Volume2, Camera, Video, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/hooks/useGenerator';
import { generateSeriesPlan } from '@/services/geminiService';
import { generateProductionSequences } from '@/lib/sequence-utils';
import { useAuth } from '@/hooks/useAuth';
import { ManifestScaffolder } from '@/components/studio/ManifestArchitect';
import { cn } from '@/lib/utils';

// Sub-components
import { SeriesHeader } from '../components/Series/SeriesHeader';
import { SeriesToolbar } from '../components/Series/SeriesToolbar';
import { SeriesEmptyState } from '../components/Series/SeriesEmptyState';
import { SeriesView } from '../components/Series/SeriesView';

export function SeriesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showScaffolder, setShowScaffolder] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSyncDate, setLastSyncDate] = React.useState<string | null>(null);
  
  const { 
    generatedSeriesPlan, 
    setGeneratedSeriesPlan, 
    isGeneratingSeries, 
    setIsGeneratingSeries,
    isEditing,
    setIsEditing,
    prompt, 
    selectedModel,
    contentType,
    productionSequence,
    setProductionSequence,
    session,
    episode,
    setSession,
    setEpisode,
    generatedWorld,
    generatedCharacters,

    showNotification
  } = useGenerator();

  const handleUpdateEpisode = (index: number, updates: any) => {
    if (!generatedSeriesPlan) return;
    const newPlan = [...generatedSeriesPlan];
    newPlan[index] = { ...newPlan[index], ...updates };
    setGeneratedSeriesPlan(newPlan);
  };

  const handleUpdateAssetMatrix = (index: number, updates: any) => {
    if (!generatedSeriesPlan) return;
    const newPlan = [...generatedSeriesPlan];
    newPlan[index] = { 
      ...newPlan[index], 
      asset_matrix: { ...newPlan[index].asset_matrix, ...updates } 
    };
    setGeneratedSeriesPlan(newPlan);
  };

  const totalEpisodesInManifest = React.useMemo(() => {
    // Unique list of Sess-Ep combinations
    const episodes = new Set(productionSequence.map(u => `S${u.sess}E${u.ep}`));
    return episodes.size || 5; // Fallback to 5 if no sequence
  }, [productionSequence]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to map the series.', 'error');
      return;
    }
    setIsGeneratingSeries(true);
    try {
      const plan = await generateSeriesPlan(prompt, selectedModel, contentType, totalEpisodesInManifest, generatedWorld || undefined, generatedCharacters || undefined);
      setGeneratedSeriesPlan(plan);
      showNotification?.('Neural Synthesis Complete: Master Sequence Archived', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Synthesis Failure: ' + (error.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingSeries(false);
    }
  };


  const applySequenceItem = (sess: number, ep: number) => {
    setSession(sess.toString());
    setEpisode(ep.toString());
  };

  const handleManifestContinue = async (config: { sessions: number; episodes: number; scenes: number }) => {
    // 1. Generate the local sequence
    const sequence = generateProductionSequences(
      config.sessions,
      config.episodes,
      config.scenes
    );
    setProductionSequence(sequence);
    
    // 2. Trigger the bulk save to PostgreSQL/Supabase via API
    if (!user) return;
    setIsSyncing(true);
    
    try {
      // We send the whole sequence to the API
      // The backend orchestrator or scenes endpoint handles the scaffolding
      const res = await fetch("/api/scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: prompt, // Using prompt as temporary ID link
          scenes: sequence.map((u, idx) => ({
            scene_number: (u.ep - 1) * 16 + u.scen,
            status: 'QUEUED',
            visual_variance_index: Math.floor(idx / 4)
          }))
        })
      });

      if (!res.ok) throw new Error("Bulk sync failed");
      
      setLastSyncDate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Bulk sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" data-testid="marker-series-planning">
      <SeriesHeader 
        onRegenerate={handleGenerate}
        isGenerating={isGeneratingSeries}
        onNext={() => navigate('/studio/script')}
        session={session}
        episode={episode}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
      />

      <SeriesToolbar 
        session={session}
        episode={episode}
        status={generatedSeriesPlan ? 'active' : 'empty'}
        onToggleScaffolder={() => setShowScaffolder(!showScaffolder)}
        showScaffolder={showScaffolder}
      />

      <AnimatePresence>
        {showScaffolder && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <ManifestScaffolder 
              onContinue={handleManifestContinue} 
              isLoading={isSyncing} 
            />

            {lastSyncDate && !isSyncing && (
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/5 py-2 rounded-full border border-green-500/10">
                <CheckCircle2 className="w-3 h-3" />
                Production Blueprint locked to database at {lastSyncDate}
              </div>
            )}

            {productionSequence.length > 0 && !isSyncing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4"
              >
                <div className="flex items-center justify-between px-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Table className="w-3 h-3" />
                    Generated Manifest: {productionSequence.length} Units
                  </span>
                </div>
                <ScrollArea className="h-[200px] border border-studio/10 rounded-3xl bg-[#050505]/80 backdrop-blur-xl">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-6">
                    {productionSequence.map((unit, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-zinc-900/30 border border-studio/5 rounded-2xl hover:border-studio/30 transition-all group flex flex-col justify-between"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">S{unit.sess} E{unit.ep} SC{unit.scen}</span>
                          <span className="text-[10px] text-studio font-medium">Unit {idx + 1}</span>
                        </div>
                        <button 
                          onClick={() => applySequenceItem(unit.sess, unit.ep)}
                          className="mt-2 text-[8px] font-black uppercase tracking-widest text-zinc-500 hover:text-studio flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Jump <ChevronRight className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="bg-[#030303] border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 hover:border-studio/50">
        <div className="absolute inset-0 border-[1px] border-studio/20 rounded-[2.5rem] pointer-events-none group-hover/card:border-studio/40 transition-colors duration-700" />
        <div className="absolute -top-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-studio/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-[1400px] mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isGeneratingSeries ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-studio">
                  <div className="w-10 h-10 border-2 border-studio/30 border-t-studio rounded-full animate-spin mb-6 shadow-studio" />
                  <p className="font-sans font-medium uppercase tracking-[0.2em] text-[10px] text-shadow-studio">Architecting narrative arcs...</p>
                </div>
              ) : generatedSeriesPlan ? (
                <div className="space-y-16">
                  <div className="border-b border-zinc-800/80 pb-12 text-center space-y-6">
                    <div className="inline-block px-3 py-1 bg-studio/10 border border-studio/30 rounded-full text-[10px] uppercase tracking-[0.3em] text-studio font-bold shadow-studio">
                      Production Roadmap
                    </div>
                    <h1 className="text-5xl font-black text-studio text-shadow-studio uppercase tracking-widest leading-tight">
                      Master Sequence Plan
                    </h1>
                    <div className="flex flex-col items-center gap-6">
                      <p className="text-zinc-500 italic max-w-lg mx-auto font-medium">
                        {totalEpisodesInManifest} Episodes mapped across the active manifest structure.
                      </p>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 px-10 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all duration-300",
                          isEditing ? "bg-studio text-black border-studio shadow-studio" : "bg-white/5 border-white/10 text-zinc-400 hover:text-studio hover:border-studio/30"
                        )}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? "Save Roadmap Plan" : "Custom Manual Edit"}
                      </Button>
                    </div>
                  </div>

                  <SeriesView
                    plan={generatedSeriesPlan}
                    isEditing={isEditing}
                    onUpdateEpisode={handleUpdateEpisode}
                    onUpdateAssetMatrix={handleUpdateAssetMatrix}
                    onFocusEpisode={(epNum) => {
                      setEpisode(epNum);
                      navigate(`/${contentType.toLowerCase()}/script`);
                    }}
                  />

                  <div className="mt-24 pt-12 border-t border-zinc-800/50 text-center">
                    <p className="text-[10px] text-zinc-500/50 uppercase tracking-[0.5em] font-bold">
                      End of Master Sequence
                    </p>
                  </div>
                </div>
              ) : (
                <SeriesEmptyState 
                  onLaunch={handleGenerate}
                  isGenerating={isGeneratingSeries}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
