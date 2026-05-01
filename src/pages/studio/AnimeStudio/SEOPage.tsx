import { useContext, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { 
  generateMetadata, 
  generateYouTubeDescription, 
  generateAltTexts 
} from '@/services/api/gemini';
import { cn } from '@/lib/utils';

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
    generatedMetadata, setGeneratedMetadata,
    isGeneratingMetadata, setIsGeneratingMetadata,
    generatedDescription, setGeneratedDescription,
    isGeneratingDescription, setIsGeneratingDescription,
    generatedAltText, setGeneratedAltText,
    isGeneratingAltText, setIsGeneratingAltText,
    generatedScript, selectedModel, showNotification
  } = useGenerator();

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

  useEffect(() => {
    setHandlers({
      handleGenerateMetadata,
      handleGenerateDescription,
      handleGenerateAltText
    });
  }, [generatedScript, selectedModel]);

  const renderTabContent = () => {
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
            content={generatedDescription}
            isGenerating={isGeneratingDescription}
            onGenerate={handleGenerateDescription}
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



