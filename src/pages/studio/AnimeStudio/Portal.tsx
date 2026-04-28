import { useState } from 'react';
import { motion } from 'motion/react';
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
import { Textarea } from '@/components/ui/textarea';
import { Brain, Loader2 } from 'lucide-react';
import { ProductionOrchestrator } from '@/services/productionOrchestrator';
import { useAuth } from '@/hooks/useAuth';

export default function AnimePortal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    history, prompt, setPrompt,
    setGeneratedWorld, setGeneratedCharacters, setGeneratedSeriesPlan,
    isLoading, setIsLoading, selectedModel, tone, showNotification
  } = useGenerator();
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const animeHistory = history.filter(h => h.contentType === 'Anime');

  const [currentStep, setCurrentStep] = useState<number>(-1);

  const handleMasterGenerate = async () => {
    if (!prompt.trim() || !user) return;
    setIsLoading(true);
    setCurrentStep(0);
    setStatusMessage('Neural Link Established');
    try {
      const orchestrator = new ProductionOrchestrator({ 
        prompt, contentType: 'Anime', model: selectedModel, 
        userId: user.id, vibe: tone 
      });
      
      const result = await orchestrator.executeFullCycle((phase) => {
        console.log(`[PORTAL-ORCHESTRATOR] ${phase}`);
        setStatusMessage(phase);
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
    <div className="space-y-12 p-4 no-scrollbar pb-24">
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
                 value={prompt}
                 disabled={isLoading}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="DESCRIBE THE CORE CONCEPT OF YOUR ANIME MASTERPIECE..."
                 className="min-h-[160px] bg-black/60 border-zinc-800 rounded-[2.5rem] pl-16 pr-40 py-8 text-sm font-black uppercase tracking-widest text-zinc-100 placeholder:text-zinc-800 focus:border-studio/50 transition-all resize-none shadow-2xl"
               />
               <div className="absolute right-6 bottom-6 flex items-center gap-4">
                 {isComplete && (
                    <Button 
                      onClick={() => navigate('screening')}
                      className="h-16 px-10 rounded-3xl bg-studio text-white font-black uppercase tracking-[0.2em] shadow-studio hover:scale-105 transition-transform"
                    >
                      Watch Premiere <Play className="w-4 h-4 ml-3 fill-current" />
                    </Button>
                 )}
                 <Button 
                   disabled={isLoading || !prompt.trim()}
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
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               {phases.map((phase, idx) => {
                 const isActive = currentStep === idx;
                 const isDone = currentStep > idx;
                 return (
                   <motion.div 
                     key={phase.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.05 }}
                     className={cn(
                       "p-4 rounded-3xl border transition-all duration-500 flex flex-col items-center text-center gap-2 relative overflow-hidden",
                       isActive ? "bg-studio/10 border-studio shadow-studio/20 scale-105 z-10" : 
                       isDone ? "bg-zinc-900/50 border-studio/20 opacity-60" : "bg-black/20 border-zinc-900 opacity-30"
                     )}
                   >
                     {isActive && <div className="absolute inset-0 bg-studio/5 animate-pulse" />}
                     <div className={cn(
                       "p-2.5 rounded-xl border transition-all",
                       isActive ? "bg-studio text-black border-studio shadow-studio" : 
                       isDone ? "bg-studio/20 text-studio border-studio/20" : "bg-zinc-950 text-zinc-800 border-zinc-900"
                     )}>
                        <phase.icon className="w-4 h-4" />
                     </div>
                     <div className="space-y-0.5">
                       <p className={cn("text-[8px] font-black uppercase tracking-widest", isActive ? "text-studio" : "text-zinc-600")}>
                         {isDone ? 'COMPLETE' : isActive ? 'PROCESSING' : `STEP 0${idx + 1}`}
                       </p>
                       <h4 className="text-[10px] font-black text-white uppercase tracking-tighter line-clamp-1">{phase.label}</h4>
                     </div>
                   </motion.div>
                 );
               })}
             </div>
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
            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Autonomous Orchestration v2.0</span>
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
      </div>

      {/* 4. RECENT SESSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-3">
               <History className="w-4 h-4" /> Recent Anime Productions
            </h3>
            <div className="space-y-4">
               {animeHistory.length > 0 ? animeHistory.slice(0, 3).map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-6 bg-zinc-950/50 border border-zinc-900 rounded-2xl hover:bg-zinc-900 hover:border-studio transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-studio/5 border border-studio/20 flex items-center justify-center">
                          <ScrollText className="w-5 h-5 text-studio" />
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">{item.title}</h4>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Episode {item.episode} • S{item.session}</p>
                       </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase text-studio opacity-0 group-hover:opacity-100">
                       Resume Build <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                 </div>
               )) : (
                 <div className="p-12 border-2 border-dashed border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                    <History className="w-12 h-12 text-zinc-800 mb-4" />
                    <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">No previous anime manifests detected.</p>
                 </div>
               )}
            </div>
         </div>

         {/* 5. PRODUCTION PROTOCOL */}
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
  );
}
