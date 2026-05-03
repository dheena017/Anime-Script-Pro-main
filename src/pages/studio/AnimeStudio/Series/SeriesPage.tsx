import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { generateProductionSequences } from '@/lib/sequence-utils';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { SeriesTab } from './Tabs/SeriesTabs';

// Modularized Tab Components
import { RoadmapTab } from './Tabs/RoadmapTab';
import { BlueprintTab } from './Tabs/BlueprintTab';
import { ArcsTab } from './Tabs/ArcsTab';
import { AssetsTab } from './Tabs/AssetsTab';
import { TimelineTab } from './Tabs/TimelineTab';
import { SeriesEmptyState } from './components/SeriesEmptyState';
import EpisodesPage from './Episodes/EpisodesPage';

export function SeriesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSyncDate, setLastSyncDate] = React.useState<string | null>(null);
  const { activeTab } = useOutletContext<{ activeTab: SeriesTab }>();

  const {
    generatedSeriesPlan,
    setGeneratedSeriesPlan,
    isGeneratingSeries,
    prompt,
    contentType,
    productionSequence,
    setProductionSequence,
    setSession,
    setEpisode,
    isEditing,
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

  const applySequenceItem = (sess: number, ep: number) => {
    setSession(sess.toString());
    setEpisode(ep.toString());
  };

  const handleManifestContinue = async (config: { sessions: number; episodes: number; scenes: number }) => {
    const sequence = generateProductionSequences(
      config.sessions,
      config.episodes,
      config.scenes
    );
    setProductionSequence(sequence);

    if (!user) return;
    setIsSyncing(true);

    try {
      const res = await fetch("/api/scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: prompt,
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

  const renderTabContent = () => {
    if (isGeneratingSeries) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] space-y-8">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-studio/20 border-t-studio rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
            <div className="absolute inset-0 m-auto w-2 h-2 bg-studio rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-black tracking-[0.3em] text-[10px] uppercase text-studio animate-pulse">Mapping Production Roadmap...</p>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Sequencing episodic beats</p>
          </div>
        </div>
      );
    }

    if (!generatedSeriesPlan) {
      return (
        <SeriesEmptyState
          onLaunch={() => { }} // Handled by Layout Header
          isGenerating={isGeneratingSeries}
        />
      );
    }

    switch (activeTab) {
      case 'roadmap':
        return (
          <RoadmapTab
            plan={generatedSeriesPlan}
            isEditing={isEditing}
            onUpdateEpisode={handleUpdateEpisode}
            onUpdateAssetMatrix={handleUpdateAssetMatrix}
            onFocusEpisode={(epNum) => {
              setEpisode(epNum);
              navigate(`/${contentType.toLowerCase()}/script`);
            }}
            onViewEpisode={(epNum) => {
              navigate(`/${contentType.toLowerCase()}/series/episodes/${epNum}`);
            }}
          />
        );
      case 'episodes':
        return <EpisodesPage />;
      case 'blueprint':
        return (
          <BlueprintTab
            showScaffolder={true}
            onManifestContinue={handleManifestContinue}
            isSyncing={isSyncing}
            lastSyncDate={lastSyncDate}
            productionSequence={productionSequence}
            applySequenceItem={applySequenceItem}
          />
        );
      case 'arcs':
        return <ArcsTab />;
      case 'assets':
        return <AssetsTab />;
      case 'timeline':
        return <TimelineTab />;
      default:
        return (
          <RoadmapTab
            plan={generatedSeriesPlan}
            isEditing={isEditing}
            onUpdateEpisode={handleUpdateEpisode}
            onUpdateAssetMatrix={handleUpdateAssetMatrix}
            onFocusEpisode={(epNum) => {
              setEpisode(epNum);
              navigate(`/${contentType.toLowerCase()}/script`);
            }}
            onViewEpisode={(epNum) => {
              navigate(`/${contentType.toLowerCase()}/series/episodes/${epNum}`);
            }}
          />
        );
    }
  };

  return (
    <div data-testid="marker-series-planning">
      <Card className={cn(
        "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700",
        activeTab === 'roadmap'
          ? "border-studio/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:border-studio/50"
          : "border-zinc-800/30 hover:border-zinc-700"
      )}>
        <div className={cn(
          "absolute inset-0 border-[1px] rounded-3xl pointer-events-none transition-colors duration-700",
          activeTab === 'roadmap' ? "border-studio/20 group-hover/card:border-studio/40" : "border-white/5"
        )} />

        <div className="w-full p-8 lg:p-10 max-w-[1400px] mx-auto">
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
}




