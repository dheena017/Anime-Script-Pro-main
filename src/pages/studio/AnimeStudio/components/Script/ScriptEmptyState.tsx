import React from 'react';
import { FileText, MessageSquare, PenTool, Terminal } from 'lucide-react';
import { StudioEmptyState } from '@/components/studio/shared/StudioEmptyState';

interface ScriptEmptyStateProps {
  onLaunch: () => void;
  isGenerating: boolean;
}

export const ScriptEmptyState: React.FC<ScriptEmptyStateProps> = ({
  onLaunch,
  isGenerating
}) => {
  const features = [
    { icon: MessageSquare, title: 'Dynamic Dialogue', description: 'AI synthesizes character-specific speech patterns' },
    { icon: PenTool, title: 'Technical Directives', description: 'Auto-generates cinematic staging and instructions' },
    { icon: Terminal, title: 'Logic Validation', description: 'Ensures narrative consistency across scenes' }
  ];

  return (
    <StudioEmptyState
      icon={FileText}
      title="Awaiting Neural Synthesis"
      description="The narrative structure is locked, but the production script remains unmanifested. Launch the neural engine to synthesize cinematic dialogue and technical directives."
      actionLabel="Launch Production"
      loadingLabel="Synthesizing Script..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="studio"
    />
  );
};




