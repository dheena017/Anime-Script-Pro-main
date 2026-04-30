import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { generateImagePrompts } from '@/services/geminiService';
import { useNavigate } from 'react-router-dom';

// Sub-components
import { PromptsHeader } from '../components/Prompts/PromptsHeader';
import { PromptsToolbar } from '../components/Prompts/PromptsToolbar';
import { PromptsEmptyState } from '../components/Prompts/PromptsEmptyState';
import { ViewerToolbar } from '../components/Layout/ViewerToolbar';

export function PromptsPage() {
  const navigate = useNavigate();
  const {
    generatedImagePrompts,
    setGeneratedImagePrompts,
    isGeneratingImagePrompts,
    setIsGeneratingImagePrompts,
    generatedScript,
    selectedModel,
    session,
    episode,
    showNotification } = useGenerator();

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


  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10" data-testid="marker-ai-image-prompts">
      <PromptsHeader
        onRegenerate={handleGenerate}
        isGenerating={isGeneratingImagePrompts}
        onNext={() => navigate('/studio/screening')}
        session={session}
        episode={episode} />

      <ViewerToolbar
        content={generatedImagePrompts}
        nexusLabel="Prompt_Nexus"
        session={session}
        episode={episode}
        icon={Zap}
      >
        <PromptsToolbar
          status={generatedImagePrompts ? 'active' : 'empty'} />
      </ViewerToolbar>

      <Card className="bg-[#030303] border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 hover:border-studio/50">
        <div className="absolute inset-0 border-[1px] border-studio/20 rounded-[2.5rem] pointer-events-none group-hover/card:border-studio/40 transition-colors duration-700" />
        <div className="absolute -top-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-studio/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

        <div className="w-full p-0">
          <div className="p-12 max-w-6xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isGeneratingImagePrompts ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-studio animate-in fade-in duration-500">
                  <div className="w-14 h-14 border-4 border-studio/20 border-t-studio rounded-full animate-spin mb-8 shadow-studio" />
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] text-studio drop-shadow-studio mb-3">Architect Active</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed">Encoding complex visual parameters into neural prompts...</p>
                </div>
              ) : generatedImagePrompts ? (
                <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000 prose-h1:text-studio prose-h2:text-studio/80 prose-strong:text-studio prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-medium prose-p:tracking-wide">
                  <ReactMarkdown>{generatedImagePrompts}</ReactMarkdown>
                </div>
              ) : (
                <PromptsEmptyState
                  onLaunch={handleGenerate}
                  isGenerating={isGeneratingImagePrompts} />
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
