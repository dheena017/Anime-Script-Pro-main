import { useContext, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { useSEOState, useSEODispatch, useEngineState } from '@/contexts/generator';
import { 
  generateMetadata, 
  generateYouTubeDescription, 
  generateAltTexts,
  generateDistributionStrategy 
} from '@/services/api/gemini';
import { GrowthTab } from './components/SEO/Tabs/GrowthTab';
import { cn } from '@/lib/utils';
import { growthApi } from '@/services/api/growth';

// Context
import { SEOContext } from './SEO/SEOLayout';

// Tabs
import { SEOTab } from './components/SEO/Tabs/SEOTabs';
import { KeywordsTab } from './components/SEO/Tabs/KeywordsTab';
import { DescriptionTab } from './components/SEO/Tabs/DescriptionTab';
import { AltTextTab } from './components/SEO/Tabs/AltTextTab';
import { TagsTab } from './components/SEO/Tabs/TagsTab';
import { DistributionTab } from './components/SEO/Tabs/DistributionTab';

export function SEOPage() {
  const { activeTab } = useOutletContext<{ activeTab: SEOTab }>();
  const { setHandlers } = useContext(SEOContext);

  const {
    generatedScript, showNotification
  } = useGenerator();

  const {
    generatedMetadata, generatedDescription, generatedAltText, 
    generatedGrowthStrategy, generatedDistributionPlan,
    isGeneratingMetadata, isGeneratingDescription, isGeneratingAltText,
    isGeneratingGrowthStrategy, isGeneratingDistribution
  } = useSEOState();

  const {
    setGeneratedMetadata, setGeneratedDescription, setGeneratedAltText, 
    setGeneratedGrowthStrategy, setGeneratedDistributionPlan,
    setIsGeneratingMetadata, setIsGeneratingDescription, setIsGeneratingAltText,
    setIsGeneratingGrowthStrategy, setIsGeneratingDistribution
  } = useSEODispatch();

  const { selectedModel } = useEngineState();

  const handleGenerateMetadata = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before generating metadata.', 'error');
      return;
    }
    setIsGeneratingMetadata(true);
    try {
      const metadata = await generateMetadata(generatedScript, selectedModel);
      setGeneratedMetadata(metadata);
      showNotification?.('Neural Synthesis Complete: Keywords Archived', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Synthesis Failure: ' + (error.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before generating description.', 'error');
      return;
    }
    setIsGeneratingDescription(true);
    try {
      const description = await generateYouTubeDescription(generatedScript, selectedModel);
      setGeneratedDescription(description);
      showNotification?.('Neural Synthesis Complete: Narrative Synopsis Archived', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Synthesis Failure: ' + (error.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGenerateAltText = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before generating alt texts.', 'error');
      return;
    }
    setIsGeneratingAltText(true);
    try {
      const altText = await generateAltTexts(generatedScript, selectedModel);
      setGeneratedAltText(altText);
      showNotification?.('Neural Synthesis Complete: Visual Accessibility Mapped', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Synthesis Failure: ' + (error.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingAltText(false);
    }
  };

  const handleGenerateGrowthStrategy = async (strategyId?: number) => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before generating growth strategy.', 'error');
      return;
    }

    if (!strategyId) {
      setGeneratedGrowthStrategy(null);
      return;
    }

    setIsGeneratingGrowthStrategy(true);
    try {
      const result = await growthApi.generateStrategy(strategyId, generatedScript, selectedModel);
      setGeneratedGrowthStrategy(result.content);
      showNotification?.('Neural Synthesis Complete: YouTube Growth Strategy Manifested', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Synthesis Failure: ' + (error.response?.data?.detail || error.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingGrowthStrategy(false);
    }
  };

  const handleGenerateDistribution = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before generating distribution plan.', 'error');
      return;
    }
    setIsGeneratingDistribution(true);
    try {
      const plan = await generateDistributionStrategy(generatedScript, selectedModel);
      setGeneratedDistributionPlan(plan);
      showNotification?.('Neural Synthesis Complete: Cross-Platform Distribution Matrix Mapped', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Synthesis Failure: ' + (error.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingDistribution(false);
    }
  };

  useEffect(() => {
    setHandlers({
      handleGenerateMetadata,
      handleGenerateDescription,
      handleGenerateAltText,
      handleGenerateGrowthStrategy,
      handleGenerateDistribution
    });
  }, [generatedScript, selectedModel]);

  const renderTabContent = () => {
    const isAnyGenerating = isGeneratingMetadata || isGeneratingDescription || isGeneratingAltText || isGeneratingGrowthStrategy || isGeneratingDistribution;

    if (isAnyGenerating) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] space-y-8">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-studio/20 border-t-studio rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
            <div className="absolute inset-0 m-auto w-2 h-2 bg-studio rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-black tracking-[0.3em] text-[10px] uppercase text-studio animate-pulse">Computing SEO Analytics...</p>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Optimizing distribution meta-data</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'keywords':
        return (
          <KeywordsTab
            content={generatedMetadata}
            isGenerating={isGeneratingMetadata}
            onGenerate={handleGenerateMetadata}
          />
        );
      case 'description':
        return (
          <DescriptionTab
            content={generatedDescription}
            isGenerating={isGeneratingDescription}
            onGenerate={handleGenerateDescription}
          />
        );
      case 'alt-texts':
        return (
          <AltTextTab
            content={generatedAltText}
            isGenerating={isGeneratingAltText}
            onGenerate={handleGenerateAltText}
          />
        );
      case 'tags':
        return (
          <TagsTab
            content={generatedMetadata}
            isGenerating={isGeneratingMetadata}
            onGenerate={handleGenerateMetadata}
          />
        );
      case 'distribution':
        return (
          <DistributionTab
            content={generatedDistributionPlan}
            isGenerating={isGeneratingDistribution}
            onGenerate={handleGenerateDistribution}
          />
        );
      case 'growth':
        return (
          <GrowthTab
            content={generatedGrowthStrategy}
            isGenerating={isGeneratingGrowthStrategy}
            onGenerate={handleGenerateGrowthStrategy}
          />
        );
      default:
        return (
          <KeywordsTab
            content={generatedMetadata}
            isGenerating={isGeneratingMetadata}
            onGenerate={handleGenerateMetadata}
          />
        );
    }
  };

  return (
    <div data-testid="marker-seo-nexus">
      <Card className={cn(
        "bg-[#030303] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700",
        "border-studio/20 shadow-[0_0_40px_rgba(6,182,212,0.08)] hover:border-studio/40"
      )}>
        <div className="absolute inset-0 border-[1px] border-white/5 rounded-[2.5rem] pointer-events-none group-hover/card:border-white/10 transition-colors duration-700" />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderTabContent()}
          </div>
        </div>
      </Card>
    </div>
  );
}




