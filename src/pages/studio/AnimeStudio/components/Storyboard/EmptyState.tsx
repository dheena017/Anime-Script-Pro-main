import React from 'react';
import { Layout, Sparkles, Zap, Box } from 'lucide-react';
import { StudioEmptyState } from '@/components/studio/shared/StudioEmptyState';

interface EmptyStateProps {
  handleAddScene: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ handleAddScene }) => {
  const features = [
    { icon: Sparkles, title: 'Visual Synthesis', description: 'AI maps script sequences to cinematic frames' },
    { icon: Zap, title: 'Neural Flow', description: 'Ensures visual continuity across sequences' },
    { icon: Box, title: 'Asset Injection', description: 'Seamlessly integrates custom visual assets' }
  ];

  return (
    <StudioEmptyState
      icon={Layout}
      title="Void Terminal"
      description="Neural storyboard buffer is empty. Initiate Production Core or inject a manual unit to begin visualization."
      actionLabel="Inject Scene"
      onAction={handleAddScene}
      features={features}
      accentColor="studio"
    />
  );
};




