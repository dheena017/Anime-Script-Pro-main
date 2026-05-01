import { useContext, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { generateImagePrompts } from '@/services/api/gemini';
import { cn } from '@/lib/utils';

// Context
import { PromptsContext } from './Prompts/PromptsLayout';

// Tabs
import { PromptsTab } from '../components/Prompts/Tabs/PromptsTabs';
import { ImagePromptsTab } from '../components/Prompts/Tabs/ImagePromptsTab';
import { MotionPromptsTab } from '../components/Prompts/Tabs/MotionPromptsTab';
import { StylePromptsTab } from '../components/Prompts/Tabs/StylePromptsTab';
import { NegativePromptsTab } from '../components/Prompts/Tabs/NegativePromptsTab';

export function PromptsPage() {
  const { activeTab } = useOutletContext<{ activeTab: PromptsTab }>();
  const { setHandlers } = useContext(PromptsContext);

  const {
    generatedImagePrompts, setGeneratedImagePrompts,
    isGeneratingImagePrompts, setIsGeneratingImagePrompts,
    generatedScript, selectedModel, showNotification
  } = useGenerator();

  const handleGenerate = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before generating visual prompts.', 'error');
      return;
    }
    setIsGeneratingImagePrompts(true);
    try {
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(prompts);
      showNotification?.('Neural Synthesis Complete: Visual Prompts Archived', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Synthesis Failure: ' + (error.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingImagePrompts(false);
    }
  };

  useEffect(() => {
    setHandlers({
      handleGenerate
    });
  }, [generatedScript, selectedModel]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'image':
        return (
          <ImagePromptsTab
            content={generatedImagePrompts}
            isGenerating={isGeneratingImagePrompts}
            onGenerate={handleGenerate}
          />
        );
      case 'video':
        return <MotionPromptsTab />;
      case 'style':
        return <StylePromptsTab />;
      case 'negative':
        return <NegativePromptsTab />;
      default:
        return (
          <ImagePromptsTab
            content={generatedImagePrompts}
            isGenerating={isGeneratingImagePrompts}
            onGenerate={handleGenerate}
          />
        );
    }
  };

  return (
    <div data-testid="marker-ai-image-prompts">
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

