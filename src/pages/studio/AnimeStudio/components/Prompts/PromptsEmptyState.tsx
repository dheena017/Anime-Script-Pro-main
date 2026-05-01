import React from 'react';
import { Terminal, Code, Cpu, Command } from 'lucide-react';
import { StudioEmptyState } from '@/components/studio/shared/StudioEmptyState';

interface PromptsEmptyStateProps {
  onLaunch: () => void;
  isGenerating: boolean;
}

export const PromptsEmptyState: React.FC<PromptsEmptyStateProps> = ({
  onLaunch,
  isGenerating
}) => {
  const features = [
    { icon: Code, title: 'Technical Syntax', description: 'AI optimizes prompt structure for specific neural engines' },
    { icon: Cpu, title: 'Compute Efficiency', description: 'Reduces token overhead while maintaining visual fidelity' },
    { icon: Command, title: 'Directives Sync', description: 'Ensures prompts align with script technical notes' }
  ];

  return (
    <StudioEmptyState
      icon={Terminal}
      title="Syntax Void"
      description="Your production has no technical prompts for high-fidelity generation. Initialize the Prompt Architect to synthesize directives for visual and audio engines."
      actionLabel="Initialize Prompts"
      loadingLabel="Synthesizing Syntax..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="cyan"
    />
  );
};



