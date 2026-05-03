import React from 'react';
import { Layout as LayoutGrid, TrendingUp, GitBranch, Layers } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

interface SeriesEmptyStateProps {
  onLaunch: () => void;
  isGenerating: boolean;
}

export const SeriesEmptyState: React.FC<SeriesEmptyStateProps> = ({
  onLaunch,
  isGenerating
}) => {
  const features = [
    { icon: TrendingUp, title: 'Arc Synthesis', description: 'AI maps character growth and plot intensity over multiple episodes' },
    { icon: GitBranch, title: 'Branching Narratives', description: 'Identifies potential plot points for future seasons' },
    { icon: Layers, title: 'Structural Integrity', description: 'Ensures thematic consistency across the entire series' }
  ];

  return (
    <StudioEmptyState
      icon={LayoutGrid}
      title="No Series Plan"
      description="The narrative roadmap for your production is missing. Generate a multi-episode blueprint to see your story mapped out."
      actionLabel="Create Series Plan"
      loadingLabel="Structuring Your Series..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="amber"
    />
  );
};




