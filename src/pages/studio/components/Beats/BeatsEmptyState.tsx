import React from 'react';
import { ScrollText, Sparkles, Brain, Zap } from 'lucide-react';
import { StudioEmptyState } from '@/components/studio/shared/StudioEmptyState';

interface BeatsEmptyStateProps {
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
}

export const BeatsEmptyState: React.FC<BeatsEmptyStateProps> = ({
  onGenerate,
  isGenerating,
  canGenerate
}) => {
  const features = [
    { icon: Brain, title: 'Neural Synthesis', description: 'AI analyzes thematic weight and pacing' },
    { icon: Zap, title: 'Pacing Wave', description: 'Dynamic intensity mapping for retention' },
    { icon: Sparkles, title: 'Lore Sync', description: 'Auto-aligns with your Anime World' }
  ];

  return (
    <StudioEmptyState
      icon={ScrollText}
      title="Narrative Void Detected"
      description="The structural core of your production is currently unmapped. Invoke the Narrative Architect to synthesize a high-retention structural blueprint based on your concept."
      actionLabel="Initialize Narrative Core"
      loadingLabel="Synthesizing Architecture..."
      onAction={onGenerate}
      isLoading={isGenerating}
      isActionDisabled={!canGenerate}
      features={features}
      accentColor="studio"
    />

  );
};

