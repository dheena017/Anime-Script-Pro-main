import React from 'react';
import { SeriesView } from '../SeriesView';

interface RoadmapTabProps {
  plan: any[];
  isEditing: boolean;
  onUpdateEpisode: (index: number, updates: any) => void;
  onUpdateAssetMatrix: (index: number, updates: any) => void;
  onFocusEpisode: (epNum: string) => void;
}

export const RoadmapTab: React.FC<RoadmapTabProps> = ({
  plan,
  isEditing,
  onUpdateEpisode,
  onUpdateAssetMatrix,
  onFocusEpisode
}) => {
  return (
    <div className="space-y-16">
      <div className="border-b border-zinc-800/80 pb-12 text-center space-y-6">
        <div className="inline-block px-4 py-1.5 bg-studio/10 border border-studio/30 rounded-full text-[10px] uppercase tracking-[0.4em] text-studio font-black shadow-studio backdrop-blur-md">
          Production Roadmap // Classic Node v4.2
        </div>
        <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
          Master Scene <span className="text-studio">Manifest</span>
        </h1>
      </div>

      <SeriesView
        plan={plan}
        isEditing={isEditing}
        onUpdateEpisode={onUpdateEpisode}
        onUpdateAssetMatrix={onUpdateAssetMatrix}
        onFocusEpisode={onFocusEpisode}
      />
    </div>
  );
};


