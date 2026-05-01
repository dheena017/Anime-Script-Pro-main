import React from 'react';
import { Globe, Map, Book, Shield } from 'lucide-react';
import { StudioEmptyState } from '@/components/studio/shared/StudioEmptyState';

interface WorldEmptyStateProps {
  onLaunch: () => void;
  isGenerating: boolean;
}

export const WorldEmptyState: React.FC<WorldEmptyStateProps> = ({
  onLaunch,
  isGenerating
}) => {
  const features = [
    { icon: Map, title: 'Geographic Synthesis', description: 'AI manifests terrain, climates, and strategic points' },
    { icon: Book, title: 'Lore Generation', description: 'Auto-generates historical timelines and cultural norms' },
    { icon: Shield, title: 'Rule Definition', description: 'Defines the metaphysical and physical laws of reality' }
  ];

  return (
    <StudioEmptyState
      icon={Globe}
      title="Awaiting Cosmic Blueprint"
      description="The foundation of your anime reality is unmapped. Initialize the world engine to manifest geography, lore, and metaphysical laws."
      actionLabel="Launch World Genesis"
      loadingLabel="Manifesting Reality..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="studio"
    />
  );
};



