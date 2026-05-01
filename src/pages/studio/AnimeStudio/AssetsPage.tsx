import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Search, Sparkles, Image as ImageIcon, MonitorPlay, Heart, Copy, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/hooks/useGenerator';
import { generateMetadata, generateYouTubeDescription, generateImagePrompts } from '@/services/api/gemini';
import { cn } from '@/lib/utils';
import { SEOEmptyState } from '../components/SEO/SEOEmptyState';

import { useLocation } from 'react-router-dom';

export function AssetsPage() {
  const location = useLocation();
  const {
    generatedMetadata, setGeneratedMetadata,
    generatedDescription, setGeneratedDescription,
    generatedImagePrompts, setGeneratedImagePrompts,
    isGeneratingMetadata, setIsGeneratingMetadata,
    isGeneratingDescription, setIsGeneratingDescription,
    isGeneratingImagePrompts, setIsGeneratingImagePrompts,
    generatedScript, selectedModel, 
    showNotification
  } = useGenerator();

  const activeTab = location.pathname.includes('prompts') ? 'prompts' : 'seo';

  const handleGenerateAll = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before generating all assets.', 'error');
      return;
    }
    
    setIsGeneratingMetadata(true);
    setIsGeneratingDescription(true);
    setIsGeneratingImagePrompts(true);

    try {
      const [meta, desc, prompts] = await Promise.all([
        generateMetadata(generatedScript, selectedModel),
        generateYouTubeDescription(generatedScript, selectedModel),
        generateImagePrompts(generatedScript, selectedModel)
      ]);
      
      setGeneratedMetadata(meta);
      setGeneratedDescription(desc);
      setGeneratedImagePrompts(prompts);
      showNotification?.('Neural Synthesis Complete: All Assets Generated', 'success');
    } catch (e: any) {
      showNotification?.('Synthesis Failure: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingMetadata(false);
      setIsGeneratingDescription(false);
      setIsGeneratingImagePrompts(false);
    }
  };

  const handleGenerateSEO = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before generating SEO data.', 'error');
      return;
    }
    setIsGeneratingMetadata(true);
    setIsGeneratingDescription(true);
    try {
      const [meta, desc] = await Promise.all([
        generateMetadata(generatedScript, selectedModel),
        generateYouTubeDescription(generatedScript, selectedModel)
      ]);
      setGeneratedMetadata(meta);
      setGeneratedDescription(desc);
      showNotification?.('SEO Manifest Synchronized', 'success');
    } catch (e: any) {
      showNotification?.('SEO Failure: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingMetadata(false);
      setIsGeneratingDescription(false);
    }
  };

  const handleGeneratePrompts = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before generating visual DNA.', 'error');
      return;
    }
    setIsGeneratingImagePrompts(true);
    try {
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(prompts);
      showNotification?.('Visual DNA manifest synchronized', 'success');
    } catch (e: any) {
      showNotification?.('Synthesis Failure: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingImagePrompts(false);
    }
  };


  const hasAnyAsset = generatedMetadata || generatedDescription || generatedImagePrompts;

  return (
    <div data-testid="marker-assets-production">

      <Card className="bg-[#030303] border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 hover:border-studio/50">
        <div className="absolute inset-0 border-[1px] border-studio/20 rounded-[2.5rem] pointer-events-none group-hover/card:border-studio/40 transition-colors duration-700" />
        <div className="absolute -top-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-studio/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-[1400px] mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {!hasAnyAsset && !isGeneratingMetadata ? (
                <SEOEmptyState 
                  onLaunch={handleGenerateAll}
                  isGenerating={isGeneratingMetadata || isGeneratingDescription || isGeneratingImagePrompts}
                />
              ) : (
                <div className="space-y-12">

                  <AnimatePresence mode="wait">
                    {activeTab === 'seo' ? (
                      <motion.div
                        key="seo"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                      >
                        <AssetCard 
                          title="Titles & Tags Protocol"
                          icon={Search}
                          content={generatedMetadata}
                          isGenerating={isGeneratingMetadata}
                          onGenerate={handleGenerateSEO}
                          color="studio"
                        />
                        
                        <AssetCard 
                          title="Manifest Description"
                          icon={MonitorPlay}
                          content={generatedDescription}
                          isGenerating={isGeneratingDescription}
                          onGenerate={handleGenerateSEO}
                          color="fuchsia"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="prompts"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <AssetCard 
                          title="Neural Visual DNA"
                          icon={ImageIcon}
                          content={generatedImagePrompts}
                          isGenerating={isGeneratingImagePrompts}
                          onGenerate={handleGeneratePrompts}
                          color="cyan"
                          fullWidth
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AssetCard({ title, icon: Icon, content, isGenerating, onGenerate }: any) {
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <Card className={cn(
      "bg-[#050505]/50 border transition-all duration-700 backdrop-blur-3xl overflow-hidden relative rounded-[2.5rem] group/card min-h-[600px]",
      content ? `border-studio/30 shadow-[0_0_40px_rgba(0,0,0,0.3)]` : "border-white/5 hover:border-zinc-800"
    )}>
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      <div className="p-8 border-b border-white/5 bg-[#0a0a0a]/40 backdrop-blur-xl flex items-center justify-between relative z-10 px-10">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-2xl border transition-all duration-700 shadow-lg",
            content ? `bg-studio/10 border-studio/30 text-studio` : "bg-zinc-900 border-zinc-800 text-zinc-600"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">{title}</h4>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic">Neural Synthesis Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl transition-all duration-300 border backdrop-blur-md",
              isLiked ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-zinc-600 border-white/5 bg-white/5 hover:text-red-400"
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-10 border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-studio h-10 px-4 rounded-xl transition-all"
            onClick={() => navigator.clipboard.writeText(content || '')}
            disabled={!content}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            className={cn(
              "h-10 font-black tracking-[0.2em] uppercase text-[10px] border border-white/10 px-8 rounded-xl transition-all shadow-xl",
              `bg-studio text-black hover:opacity-90`
            )}
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" /> : <Sparkles className="w-3.5 h-3.5 mr-2" />}
            {isGenerating ? 'Synthesizing...' : 'Regenerate'}
          </Button>
        </div>
      </div>
      
      <div className="relative z-10 p-12 h-full">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-zinc-500 animate-in fade-in duration-500">
            <div className={cn("w-14 h-14 border-4 border-white/5 border-t-studio rounded-full animate-spin mb-8 shadow-studio")} />
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white drop-shadow-xl mb-3 italic">Architect Refining...</h4>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px] text-center">Optimizing dataset for cinematic algorithmic resonance</p>
          </div>
        ) : content ? (
          <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000 prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-medium prose-strong:text-studio prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-zinc-800 group/empty">
            <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover/empty:border-zinc-700 transition-all duration-700">
              <Icon className="w-10 h-10 opacity-20 group-hover/empty:opacity-40 transition-opacity" />
            </div>
            <p className="font-black uppercase tracking-[0.4em] text-[10px] max-w-[200px] text-center leading-loose">Initialize <span className="text-zinc-600">Neural Matrix</span> to generate asset.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
