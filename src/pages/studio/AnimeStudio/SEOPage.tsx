import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Search, Sparkles, FileText, Heart, MonitorPlay } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/hooks/useGenerator';
import { generateMetadata, generateYouTubeDescription } from '@/services/geminiService';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
// Sub-components
import { SEOHeader } from '../components/SEO/SEOHeader';
import { SEOToolbar } from '../components/SEO/SEOToolbar';

export function SEOPage() {
  const navigate = useNavigate();
  const [isLikedMeta, setIsLikedMeta] = React.useState(false);
  const [isLikedDesc, setIsLikedDesc] = React.useState(false);
  const {
    generatedMetadata,
    setGeneratedMetadata,
    isGeneratingMetadata,
    setIsGeneratingMetadata,
    generatedDescription,
    setGeneratedDescription,
    isGeneratingDescription,
    setIsGeneratingDescription,
    generatedScript,
    selectedModel,
    session,
    episode
  } = useGenerator();

  const handleGenerateMetadata = async () => {
    if (!generatedScript) return;
    setIsGeneratingMetadata(true);
    const metadata = await generateMetadata(generatedScript, selectedModel);
    setGeneratedMetadata(metadata);
    setIsGeneratingMetadata(false);
  };

  const handleGenerateDescription = async () => {
    if (!generatedScript) return;
    setIsGeneratingDescription(true);
    const description = await generateYouTubeDescription(generatedScript, selectedModel);
    setGeneratedDescription(description);
    setIsGeneratingDescription(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10" data-testid="marker-marketing-specs">
      <SEOHeader 
        onRegenerate={handleGenerateMetadata}
        isGenerating={isGeneratingMetadata}
        onNext={() => navigate('/studio/prompts')}
        session={session}
        episode={episode}
        isLiked={isLikedMeta}
        setIsLiked={setIsLikedMeta}
      />

      <SEOToolbar 
        session={session}
        episode={episode}
        status={generatedMetadata ? 'active' : 'empty'}
      />

      <Card className="bg-[#030303] border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 hover:border-studio/50">
        <div className="absolute inset-0 border-[1px] border-studio/20 rounded-[2.5rem] pointer-events-none group-hover/card:border-studio/40 transition-colors duration-700" />
        <div className="absolute -top-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-studio/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-6xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* General Metadata Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-studio shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              Titles & Tags Protocol
            </h3>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-11 w-11 rounded-2xl transition-all duration-300 border backdrop-blur-md",
                  isLikedMeta ? "text-studio bg-studio/10 border-studio/30 shadow-studio" : "text-zinc-600 border-white/5 bg-white/5 hover:text-studio hover:bg-studio/5 hover:border-studio/20"
                )}
                onClick={() => setIsLikedMeta(!isLikedMeta)}
              >
                <Heart className={cn("w-5 h-5", isLikedMeta && "fill-current")} />
              </Button>
              <Button
                size="sm"
                className="h-11 bg-studio text-black hover:bg-studio/90 font-black tracking-[0.2em] uppercase text-[10px] shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-white/20 px-8 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
                onClick={handleGenerateMetadata}
                disabled={isGeneratingMetadata || !generatedScript}
              >
                {isGeneratingMetadata ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-3" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform" />
                )}
                {isGeneratingMetadata ? 'Synthesizing...' : 'Generate'}
              </Button>
            </div>
          </div>
          <Card className={cn(
            "bg-[#050505]/50 border transition-all duration-700 backdrop-blur-3xl overflow-hidden relative rounded-[2.5rem] group/card min-h-[500px]",
            generatedMetadata ? "border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]" : "border-white/5 hover:border-studio/20"
          )}>
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover/card:opacity-10 transition-opacity duration-700">
              <FileText className="w-48 h-48 text-studio" />
            </div>
            
            <div className="relative z-10 p-10 h-full">
              {isGeneratingMetadata ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-studio animate-in fade-in duration-500">
                  <div className="w-12 h-12 border-4 border-studio/20 border-t-studio rounded-full animate-spin mb-6 shadow-studio" />
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-studio drop-shadow-studio mb-3">Architect Refining</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed">Optimizing metadata for YouTube algorithms...</p>
                </div>
              ) : generatedMetadata ? (
                <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000 prose-h1:text-studio prose-strong:text-studio prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-medium">
                  <ReactMarkdown>{generatedMetadata}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-zinc-700 group/empty">
                  <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center mb-8 group-hover/empty:border-studio/30 group-hover/empty:bg-studio/5 transition-all duration-700">
                    <Search className="w-8 h-8 opacity-20 group-hover/empty:opacity-60 transition-opacity" />
                  </div>
                  <p className="font-black uppercase tracking-[0.3em] text-[10px] max-w-[200px] text-center leading-loose">Initialize <span className="text-studio">SEO Core</span> to generate metadata.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* YouTube Description Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
              Manifest Description
            </h3>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-11 w-11 rounded-2xl transition-all duration-300 border backdrop-blur-md",
                  isLikedDesc ? "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.2)]" : "text-zinc-600 border-white/5 bg-white/5 hover:text-fuchsia-400 hover:bg-fuchsia-500/5 hover:border-fuchsia-500/20"
                )}
                onClick={() => setIsLikedDesc(!isLikedDesc)}
              >
                <Heart className={cn("w-5 h-5", isLikedDesc && "fill-current")} />
              </Button>
              <Button
                size="sm"
                className="h-11 bg-fuchsia-600 text-white hover:bg-fuchsia-500 font-black tracking-[0.2em] uppercase text-[10px] shadow-[0_0_25px_rgba(192,38,211,0.4)] border border-white/20 px-8 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
                onClick={handleGenerateDescription}
                disabled={isGeneratingDescription || !generatedScript}
              >
                {isGeneratingDescription ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform" />
                )}
                {isGeneratingDescription ? 'Inscribing...' : 'Generate'}
              </Button>
            </div>
          </div>
          <Card className={cn(
            "bg-[#050505]/50 border transition-all duration-700 backdrop-blur-3xl overflow-hidden relative rounded-[2.5rem] group/card min-h-[500px]",
            generatedDescription ? "border-fuchsia-500/30 shadow-[0_0_40px_rgba(192,38,211,0.1)]" : "border-white/5 hover:border-fuchsia-500/20"
          )}>
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover/card:opacity-10 transition-opacity duration-700">
              <MonitorPlay className="w-48 h-48 text-fuchsia-500" />
            </div>
            
            <div className="relative z-10 p-10 h-full">
              {isGeneratingDescription ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-fuchsia-700 animate-in fade-in duration-500">
                  <div className="w-12 h-12 border-4 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(217,70,239,0.3)]" />
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.4)] mb-3">Lore Weaver Active</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed">Drafting a high-conversion manifest...</p>
                </div>
              ) : generatedDescription ? (
                <div className="prose prose-invert prose-fuchsia max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000 prose-h1:text-fuchsia-400 prose-strong:text-fuchsia-300 prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-medium">
                  <ReactMarkdown>{generatedDescription}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-zinc-700 group/empty">
                  <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center mb-8 group-hover/empty:border-fuchsia-500/30 group-hover/empty:bg-fuchsia-500/5 transition-all duration-700">
                    <MonitorPlay className="w-8 h-8 opacity-20 group-hover/empty:opacity-60 transition-opacity" />
                  </div>
                  <p className="font-black uppercase tracking-[0.3em] text-[10px] max-w-[200px] text-center leading-loose">Initiate <span className="text-fuchsia-500">Manifest Core</span> for description.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
