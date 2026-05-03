import React from 'react';
import { Users, Fingerprint, Brain, Database } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

interface CastEmptyStateProps {
  onLaunch: () => void;
  isGenerating: boolean;
}

export const CastEmptyState: React.FC<CastEmptyStateProps> = ({
  onLaunch,
  isGenerating
}) => {
  const features = [
    { icon: Fingerprint, title: 'DNA Synthesis', description: 'Unique personality markers and backstories' },
    { icon: Brain, title: 'Cognitive Mapping', description: 'AI determines relationship dynamics and arcs' },
    { icon: Database, title: 'Lore Integration', description: 'Auto-checks for consistency with world history' }
  ];

  return (
    <StudioEmptyState
      icon={Users}
      title="Empty Cast List"
      description="Your production has no characters yet. Generate a rich cast with unique personalities, backstories, and dynamic relationships."
      actionLabel="Create Characters"
      loadingLabel="Assembling Your Cast..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="cyan"
    />
  );
};




