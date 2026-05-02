import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Sword,
  Layers,
  Users,
  ScrollText,
  ChevronRight,
  Play,
  History,
  Globe,
  LayoutGrid,
  Search,
  ImageIcon,
  Box,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/hooks/useGenerator';
import { useApp } from '@/contexts/AppContext';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Loader2 } from 'lucide-react';
import { ProductionOrchestrator } from '@/services/productionOrchestrator';
import { useAuth } from '@/hooks/useAuth';
import { useLogs } from '@/contexts/LogContext';
import { ProductionPipeline } from './components/Portal/ProductionPipeline';
import { NeuralMonitor } from './components/Portal/NeuralMonitor';
import { useEffect } from 'react';

export default function AnimePortal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useApp();
  const { masterLogs } = useLogs();
  const {
    history, prompt: globalPrompt, setPrompt,
    setGeneratedWorld, setGeneratedCharacters, setGeneratedSeriesPlan, setGeneratedScript,
    isLoading, setIsLoading, selectedModel, tone, addLog
  } = useGenerator();
  const [localPrompt, setLocalPrompt] = useState(globalPrompt);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const animeHistory = history.filter(h => h.contentType === 'Anime');

  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isDeferredReady, setIsDeferredReady] = useState(false);

  // Defer mounting of heavy sub-components to the next task to allow the shell to mount instantly
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsDeferredReady(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleMasterGenerate = async () => {
    if (!localPrompt.trim() || !user) return;
    
    // Sync local prompt to global state for other components
    setPrompt(localPrompt);
    
    setIsLoading(true);
    setCurrentStep(0);
    setStatusMessage('Neural Link Established');
    addLog("PORTAL", "INITIALIZED", "Establishing Neural Link for Full-Cycle Production...");
    try {
      const orchestrator = new ProductionOrchestrator({
        prompt: localPrompt, contentType: 'Anime', model: selectedModel,
        userId: user.id, vibe: tone
      });
// ... (rest of handleMasterGenerate)
// (skipping some lines for brevity in instruction, will provide full replacement content)

      const result = await orchestrator.executeFullCycle((phase) => {
        console.info(`%c[Portal] %c${phase}`, 'color: #3b82f6; font-weight: bold;', 'color: #94a3b8;');
        setStatusMessage(phase);
        addLog("ORCHESTRATOR", "SYNCING", phase);
        // Map phase names to step indices
        if (phase.includes('STATE 01')) setCurrentStep(0);
        else if (phase.includes('STATE 02')) setCurrentStep(1);
        else if (phase.includes('STATE 03')) setCurrentStep(2);
        else if (phase.includes('STATE 04')) setCurrentStep(3);
        else if (phase.includes('STATE 05')) setCurrentStep(4);
        else if (phase.includes('STATE 06')) setCurrentStep(5);
        else if (phase.includes('STATE 07')) setCurrentStep(6);
        else if (phase.includes('STATE 08')) setCurrentStep(7);
        else if (phase.includes('STATE 09')) setCurrentStep(8);
        else if (phase.includes('STATE 10')) setCurrentStep(9);
      });

      setGeneratedWorld(result.world);
      if (result.cast) setGeneratedCharacters(typeof result.cast === 'object' ? result.cast.markdown : result.cast);
      if (result.series) setGeneratedSeriesPlan(result.series);

      setCurrentStep(10); // Complete
      setStatusMessage('Production Archive Synced.');
      setIsComplete(true);
      showNotification?.('Universal Manifest Synthesized Successfully', 'success');
    } catch (e: any) {
      const errorMsg = e.message || 'Master Loop Failure';
      showNotification?.('Production Error: ' + errorMsg, 'error');
      setStatusMessage('CRITICAL FAILURE: ' + errorMsg);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadProject = (proj: any) => {
    addLog("ORCHESTRATOR", "SYNCING", `Establishing Neural Link to Production: ${proj.title}`);
    
    // Simulate fetching project details (world, cast, series, script)
    // In a real app, this would be an API call
    setTimeout(() => {
      setGeneratedWorld(proj.prod_metadata?.world || "# World Lore Found");
      setGeneratedCharacters(proj.prod_metadata?.cast || []);
      setGeneratedSeriesPlan(proj.prod_metadata?.series || []);
      setGeneratedScript(proj.prod_metadata?.script || "");
      
      addLog("ORCHESTRATOR", "SUCCESS", `Project Data Restored. Entering Storyboard Matrix...`);
      navigate('/anime/storyboard');
    }, 1000);
  };



  const phases = [
    { id: 'world', label: 'Anime World', desc: 'Neural foundation and power systems.', icon: Globe, state: 'STATE 01: WORLD Lore', color: 'text-orange-500' },

    { id: 'cast', label: 'Cast Studio', desc: 'Visual DNA and psychological profiles.', icon: Users, state: 'STATE 03: CHARACTER DNA', color: 'text-orange-500' },
    { id: 'series', label: 'Series Roadmap', desc: 'Full-season episodic mapping.', icon: Layers, state: 'STATE 04: SERIES Roadmap', color: 'text-yellow-500' },
    { id: 'script', label: 'Script Engine', desc: 'Dialogue and action synthesis.', icon: ScrollText, state: 'STATE 05: SCRIPT Engine', color: 'text-orange-500' },
    { id: 'storyboard', label: 'Storyboard', desc: 'Scene-by-scene visual direction.', icon: LayoutGrid, state: 'STATE 06: VISUAL Manifest', color: 'text-yellow-500' },
    { id: 'seo', label: 'SEO Engine', desc: 'Metadata and discovery tags.', icon: Search, state: 'STATE 07: GLOBAL Reach', color: 'text-orange-500' },
    { id: 'prompts', label: 'Asset Prompts', desc: 'Refined AI image/video prompts.', icon: ImageIcon, state: 'STATE 08: ASSET Synthesis', color: 'text-yellow-500' },
    { id: 'screening', label: 'Screening Room', desc: 'Cinematic review and rendering.', icon: Play, state: 'STATE 09: PREMIERE Hub', color: 'text-orange-500' },
    { id: 'engine', label: 'Studio Engine', desc: 'Advanced neural parameters.', icon: Box, state: 'STATE 10: CORE Logic', color: 'text-red-500' }
  ];

  return (
    <div className="space-y-12 p-4 pb-24">
      {/* 1. HERO SECTION */}
      <div className="relative rounded-[3rem] bg-gradient-to-br from-[#12141a] to-[#08090d] border border-studio/20 overflow-hidden p-12 group">
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-studio opacity-10 blur-[100px] rounded-full pointer-events-none group-hover:opacity-20 transition-opacity duration-1000" />

        <div className="relative z-10 max-w-4xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio/10 border border-studio/20 text-studio shadow-studio/20">
              <Zap className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">GOD MODE PRODUCTION / UNIT 01</span>
            </div>
            {isLoading && (
              <div className="flex items-center gap-4 px-4 py-2 bg-black/40 border border-studio/30 rounded-2xl backdrop-blur-md">
                <Loader2 className="w-4 h-4 text-studio animate-spin" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest animate-pulse">{statusMessage}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-none text-shadow-studio">
              Autonomous <br />
              <span className="text-studio">Production</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-lg uppercase tracking-wider">
              Initiate full-cycle anime generation. One prompt. Total manifest. From lore to premiere.
            </p>
          </div>

          <div className="flex flex-col gap-6 pt-4">
            <div className="relative group">
              <div className="absolute top-6 left-6 z-10">
                <Brain className={cn("w-6 h-6 transition-colors", isLoading ? "text-studio animate-pulse" : "text-zinc-700")} />
              </div>
              <Textarea
                value={localPrompt}
                disabled={isLoading}
                onChange={(e) => setLocalPrompt(e.target.value)}
                placeholder="DESCRIBE THE CORE CONCEPT OF YOUR ANIME MASTERPIECE..."
                className="min-h-[160px] bg-black/60 border-zinc-800 rounded-[2.5rem] pl-16 pr-40 py-8 text-sm font-black uppercase tracking-widest text-zinc-100 placeholder:text-zinc-800 focus:border-studio/50 transition-all resize-none shadow-2xl"
              />
              <div className="absolute right-6 bottom-6 flex items-center gap-4">
                {isComplete && (
                  <div className="flex gap-4">
                    <Button
                      onClick={() => navigate('screening')}
                      className="bg-studio text-black hover:bg-studio/80 font-black uppercase tracking-widest px-8 rounded-2xl h-14 shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95"
                    >
                      <Play className="w-5 h-5 mr-2" /> Watch Premiere
                    </Button>
                    <Button
                      onClick={() => navigate('storyboard')}
                      variant="outline"
                      className="border-studio/30 text-studio hover:bg-studio/10 font-black uppercase tracking-widest px-8 rounded-2xl h-14 transition-all"
                    >
                      <Layers className="w-5 h-5 mr-2" /> View Storyboard
                    </Button>
                  </div>
                )}
                <Button
                  disabled={isLoading || !localPrompt.trim()}
                  onClick={handleMasterGenerate}
                  className="h-16 px-10 rounded-3xl bg-zinc-950 border border-studio/40 text-studio font-black uppercase tracking-[0.2em] hover:bg-studio hover:text-white transition-all group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-studio opacity-0 group-hover:opacity-10 transition-opacity" />
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Sword className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />}
                  {isLoading ? 'Neural Link Active' : 'Initiate God Mode'}
                </Button>
              </div>
            </div>

            {/* PRODUCTION PIPELINE TRACKER */}
            {isDeferredReady ? (
              <ProductionPipeline phases={phases} currentStep={currentStep} />
            ) : (
              <div className="h-[100px] w-full flex items-center justify-center opacity-10">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. PRODUCTION HUB CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Orchestration Hub */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
              <Layers className="w-4 h-4 text-studio" /> Production Workflow
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {phases.map((tool, idx) => (
              <motion.button
                key={tool.id}
                whileHover={{ x: 5 }}
                onClick={() => navigate(tool.id)}
                className={cn(
                  "group flex items-center text-left p-6 bg-[#0a0a0a]/80 border border-zinc-900 rounded-[2rem] hover:border-studio/40 transition-all relative overflow-hidden",
                  currentStep >= idx ? "opacity-100" : "opacity-40 grayscale"
                )}
              >
                <div className={cn("p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 transition-all group-hover:scale-110 mr-6", tool.color)}>
                  <tool.icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-sm font-black text-white tracking-widest uppercase">{tool.label}</h4>
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest border border-zinc-800 px-2 py-0.5 rounded-full">
                      STATE 0{idx + 1}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed line-clamp-1 uppercase tracking-wide">{tool.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-studio group-hover:translate-x-1 transition-all ml-4" />
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* NEURAL MONITOR / LOGS - SIDEBAR */}
        {isDeferredReady ? (
          <NeuralMonitor masterLogs={masterLogs} />
        ) : (
          <div className="h-[600px] w-full bg-black/20 rounded-[2.5rem] animate-pulse" />
        )}

        {/* 4. RECENT SESSIONS - NOW IN THE MAIN GRID */}
        <div className="lg:col-span-2 space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-3">
              <History className="w-4 h-4 text-studio" /> Recent Anime Productions
            </h3>
            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Production Archive</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {animeHistory.length > 0 ? animeHistory.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 bg-zinc-950/50 border border-zinc-900 rounded-2xl hover:bg-zinc-900 hover:border-studio transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-studio/5 border border-studio/20 flex items-center justify-center">
                    <ScrollText className="w-5 h-5 text-studio" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">S{item.session} • E{item.episode}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleLoadProject(item)}
                  className="h-8 text-[8px] font-black uppercase text-studio opacity-0 group-hover:opacity-100"
                >
                  View Scenes <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )) : (
              <div className="col-span-2 p-12 border-2 border-dashed border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                <History className="w-12 h-12 text-zinc-800 mb-4" />
                <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">No previous anime manifests detected.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. PRODUCTION STANDARDS */}
      <div className="pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Empty space or additional metrics */}
          </div>
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-studio" /> Production Standards
            </h3>
            <Card className="bg-[#0a0a0a] border-zinc-900 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-studio/5 blur-[50px]" />
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-studio text-white text-[10px] font-black flex items-center justify-center shrink-0">1</div>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                    <span className="text-white font-bold">Dynamic Pacing:</span> Vary sentence length in scripts to mimic high-quality anime soundtracks.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-studio text-white text-[10px] font-black flex items-center justify-center shrink-0">2</div>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                    <span className="text-white font-bold">Lore Integrity:</span> Cross-check terms in the Lore Vault before finalizing episode scripts.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-studio text-white text-[10px] font-black flex items-center justify-center shrink-0">3</div>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                    <span className="text-white font-bold">Visual Language:</span> Use cinematic cues in prompts for dynamic image generation.
                  </p>
                </div>
              </div>

              <Button className="w-full bg-white text-black hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl mt-4">
                Open Production Logs
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

