import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Sparkles, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/hooks/useGenerator';
import { generateWorld } from '@/services/geminiService';
import { cn } from '@/lib/utils';

// Sub-components
import { WorldHeader } from '../components/World/WorldHeader';
import { WorldEmptyState } from '../components/World/WorldEmptyState';
import { WorldOutputViewer } from '../components/World/WorldOutputViewer';
import { ViewerToolbar } from '../components/World/ViewerToolbar';

export function WorldPage() {
  const [isLiked, setIsLiked] = React.useState(false);
  const [synthStep, setSynthStep] = React.useState(0);
  const {
    generatedWorld,
    setGeneratedWorld,
    isGeneratingWorld,
    setIsGeneratingWorld,
    isEditing,
    setIsEditing,
    prompt,
    selectedModel,
    contentType,
    session,
    episode,
    showNotification
  } = useGenerator();

  const synthSteps = [
    "Analyzing Narrative DNA...",
    "Drafting Tectonic Layouts...",
    "Calculating Environmental Aesthetics...",
    "Defining Metaphysical Systems...",
    "Chronicalizing Lore Eras...",
    "Archiving World Bible..."
  ];

  React.useEffect(() => {
    let interval: any;
    if (isGeneratingWorld) {
      setSynthStep(0);
      interval = setInterval(() => {
        setSynthStep(prev => (prev < synthSteps.length - 1 ? prev + 1 : prev));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGeneratingWorld]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to manifest reality.', 'error');
      return;
    }
    setIsGeneratingWorld(true);
    try {
      const world = await generateWorld(prompt, selectedModel, contentType);
      setGeneratedWorld(world);
      showNotification?.('Neural Synthesis Complete: World Bible Archived', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('Synthesis Failure: ' + (e.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingWorld(false);
    }
  };


  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" data-testid="marker-world-architecture">
      <WorldHeader
        onRegenerate={handleGenerate}
        isGenerating={isGeneratingWorld}
        onNext={() => { }}
        session={session}
        episode={episode}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
      />

      <Card className="bg-[#030303] border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 hover:border-studio/50">
        <div className="absolute inset-0 border-[1px] border-studio/20 rounded-[2.5rem] pointer-events-none group-hover/card:border-studio/40 transition-colors duration-700" />
        <div className="absolute -top-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-studio/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

        <div className="w-full p-0">
          <div className="p-12 max-w-[1400px] mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <AnimatePresence mode="wait">
                {isGeneratingWorld ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="flex flex-col items-center justify-center min-h-[600px] text-center"
                  >
                    <div className="relative mb-12">
                      <div className="absolute inset-0 bg-studio/20 blur-3xl rounded-full animate-pulse" />
                      <div className="relative w-24 h-24 border-2 border-studio/10 border-t-studio rounded-full animate-spin" />
                      <Globe className="w-10 h-10 text-studio absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>

                    <div className="space-y-4 max-w-sm">
                      <h3 className="text-xl font-black text-white uppercase tracking-[0.4em]">NEURAL MANIFESTATION</h3>
                      <p className="text-[10px] font-bold text-studio/60 uppercase tracking-[0.3em] animate-pulse">
                        {synthSteps[synthStep]}
                      </p>

                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-10">
                        <motion.div
                          className="h-full bg-gradient-to-r from-studio via-fuchsia-500 to-studio shadow-studio"
                          initial={{ width: "0%" }}
                          animate={{ width: `${((synthStep + 1) / synthSteps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : generatedWorld ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-16"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-10">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-studio/10 border border-studio/20 rounded-full">
                          <Sparkles className="w-3 h-3 text-studio" />
                          <span className="text-[9px] font-black text-studio uppercase tracking-[0.2em]">WORLD BIBLE ARCHIVE SYNCED</span>
                        </div>
                        <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
                          PRODUCTION <br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-fuchsia-500 to-studio">SPECIFICATION</span>
                        </h1>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {generatedWorld && (
                          <ViewerToolbar content={generatedWorld} />
                        )}
                        <Button
                          variant="outline"
                          className={cn(
                            "h-14 px-8 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all duration-300 backdrop-blur-xl",
                            isEditing ? "bg-studio text-black border-studio shadow-studio" : "bg-white/5 border-white/10 text-zinc-400 hover:text-studio hover:border-studio/30"
                          )}
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? "Save Specification" : "Custom Manual Edit"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-14 w-14 rounded-2xl border border-white/5 transition-all duration-300 backdrop-blur-xl",
                            isLiked ? "bg-studio/20 text-studio border-studio/40 shadow-studio" : "bg-white/5 text-zinc-600 hover:text-studio"
                          )}
                          onClick={() => setIsLiked(!isLiked)}
                        >
                          <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
                        </Button>
                      </div>
                    </div>

                    <div className="max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar pb-8">
                      {/* Main Content */}
                      <div className="w-full">
                        <WorldOutputViewer 
                          isEditing={isEditing} 
                          content={generatedWorld || ''} 
                          prompt={prompt}
                          onContentChange={setGeneratedWorld} 
                        />
                      </div>


                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <WorldEmptyState
                      onLaunch={handleGenerate}
                      isGenerating={isGeneratingWorld}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

