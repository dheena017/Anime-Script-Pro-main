import React from 'react';
import { Users, Fingerprint, Brain, Database } from 'lucide-react';
import { StudioEmptyState } from '@/components/studio/shared/StudioEmptyState';

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
      title="Registry Void"
      description="Your production has no identified souls. Initialize the DNA synthesizer to manifest a cast that inhabits your world lore."
      actionLabel="Initialize Cast Genesis"
      loadingLabel="Synthesizing Souls..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="cyan"
    />
  );
};

