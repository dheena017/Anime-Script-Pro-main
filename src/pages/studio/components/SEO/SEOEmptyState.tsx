import React from 'react';
import { Search, BarChart, Globe, Zap } from 'lucide-react';
import { StudioEmptyState } from '@/components/studio/shared/StudioEmptyState';

interface SEOEmptyStateProps {
  onLaunch: () => void;
  isGenerating: boolean;
}

export const SEOEmptyState: React.FC<SEOEmptyStateProps> = ({
  onLaunch,
  isGenerating
}) => {
  const features = [
    { icon: BarChart, title: 'Retention Analysis', description: 'AI predicts engagement based on meta-structure' },
    { icon: Globe, title: 'Global Reach', description: 'Auto-translates metadata for international visibility' },
    { icon: Zap, title: 'Speed Sync', description: 'Optimizes resource loading for crawl performance' }
  ];

  return (
    <StudioEmptyState
      icon={Search}
      title="Algorithm Void"
      description="Your production has no visibility metadata. Initialize the SEO Optimizer to synthesize high-retention keywords, descriptions, and tags."
      actionLabel="Initialize SEO Engine"
      loadingLabel="Synthesizing SEO..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="emerald"
    />
  );
};

