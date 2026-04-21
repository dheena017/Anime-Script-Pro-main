import { motion } from 'motion/react';
import { 
  Zap, 
  Sword, 
  Layers, 
  Users, 
  ScrollText, 
  Search,
  ArrowRight,
  TrendingUp,
  Target,
  ChevronRight,
  Play,
  Film,
  History,
  Box,
  BookOpen,
  FileText,
  Globe,
  LayoutGrid,
  ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/contexts/GeneratorContext';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Loader2, Sparkles } from 'lucide-react';
import { ProductionOrchestrator } from '@/services/productionOrchestrator';
import { useAuth } from '@/hooks/useAuth';

export default function AnimePortal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    history, session, episode, prompt, setPrompt,
    setGeneratedWorld, setGeneratedCharacters, setGeneratedSeriesPlan,
    isLoading, setIsLoading, selectedModel, tone, showNotification
  } = useGenerator();
  const animeHistory = history.filter(h => h.contentType === 'Anime');

  const handleMasterGenerate = async () => {
    if (!prompt.trim() || !user) return;
    setIsLoading(true);
    try {
      const orchestrator = new ProductionOrchestrator({ 
        prompt, contentType: 'Anime', model: selectedModel, 
        userId: user.id, vibe: tone 
      });
      
      const result = await orchestrator.executeFullCycle((phase) => {
        console.log(`[PORTAL-ORCHESTRATOR] ${phase}`);
      });

      if (result.world) setGeneratedWorld(result.world);
      if (result.cast) setGeneratedCharacters(typeof result.cast === 'object' ? result.cast.markdown : result.cast);
      if (result.series) setGeneratedSeriesPlan(result.series);
      
      navigate('series');
    } catch (e: any) { const errorMsg = e.message || 'Master Loop Failure'; showNotification?.('Production Error: ' + errorMsg, 'error');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: 'Active Productions', value: animeHistory.length.toString(), icon: Film, color: 'text-orange-500' },
    { label: 'Total Units', value: (animeHistory.length * 60).toString(), icon: Zap, color: 'text-yellow-500' },
    { label: 'Neural Power', value: '45.2 tflops', icon: Target, color: 'text-red-500' },
  ];

  const phases = [
    {
      title: 'PHASE 1: FOUNDATION',
      tools: [
        { id: 'concept', label: 'Concept Synthesis', desc: 'Narrative objectives and thematic hooks.', icon: Brain, path: 'concept', bg: 'bg-studio/10' },
        { id: 'template', label: 'Drafting Template', desc: 'Core structural templates for different anime sub-genres.', icon: BookOpen, path: 'template', bg: 'bg-orange-500/10' },
        { id: 'methods', label: 'Production Methods', desc: 'Narrative frameworks and pacing algorithms.', icon: FileText, path: 'framework', bg: 'bg-yellow-500/10' },
        { id: 'world', label: 'Lore Vault', desc: 'Power systems, history, and world-building.', icon: Globe, path: 'world', bg: 'bg-orange-500/10' },
      ]
    },
    {
      title: 'PHASE 2: ARCHITECTURE',
      tools: [
        { id: 'beats', label: 'Narrative Beats', desc: '60-unit plot point scaffolding and emotional tracking.', icon: Zap, path: 'beats', bg: 'bg-yellow-500/10' },
        { id: 'cast', label: 'Cast Studio', desc: 'Character visual DNA and psychological profiling.', icon: Users, path: 'cast', bg: 'bg-orange-500/10' },
        { id: 'series', label: 'Series Plan', desc: 'Full-season episodic mapping and character arcs.', icon: Layers, path: 'series', bg: 'bg-yellow-500/10' },
      ]
    },
    {
      title: 'PHASE 3: GENERATION',
      tools: [
        { id: 'script', label: 'Script Engine', desc: 'High-speed dialogue and cinematic action sequences.', icon: ScrollText, path: 'script', bg: 'bg-orange-500/10' },
        { id: 'storyboard', label: 'Vision Board', desc: 'Scene-by-scene visual direction and AI storyboards.', icon: LayoutGrid, path: 'storyboard', bg: 'bg-yellow-500/10' },
      ]
    },
    {
      title: 'PHASE 4: DISTRIBUTION',
      tools: [
        { id: 'seo', label: 'SEO Engine', desc: 'Package episodes with optimized metadata and tags.', icon: Search, path: 'seo', bg: 'bg-orange-500/10' },
        { id: 'prompts', label: 'Visual Prompts', desc: 'Refined AI image prompts for marketing assets.', icon: ImageIcon, path: 'prompts', bg: 'bg-yellow-500/10' },
        { id: 'screening', label: 'Screening Room', desc: 'Cinematic review room for generated content.', icon: Play, path: 'example', bg: 'bg-orange-500/10' },
      ]
    }
  ];

  return (
    <div className="space-y-12 p-4 no-scrollbar pb-24">
      {/* 1. HERO SECTION */}
      <div className="relative rounded-[3rem] bg-gradient-to-br from-[#12141a] to-[#08090d] border border-studio overflow-hidden p-12 group">
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-studio opacity-10 blur-[100px] rounded-full pointer-events-none group-hover:opacity-20 transition-opacity duration-1000" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio/10 border border-studio/20 text-studio shadow-studio/20">
            <Play className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Anime Studio / Mainline Production</span>
          </div>
          
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none text-shadow-studio">
            Craft Your <br />
            <span className="text-studio">Masterpiece</span>
          </h1>
          
          <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-lg uppercase tracking-wider">
            Professional suite for cinematic anime recaps and narrative planning. From high-stakes tournament arcs to deep emotional dramas.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
             <div className="flex items-center gap-2 px-6 py-4 bg-zinc-950/80 border border-studio/30 rounded-full shadow-studio/20">
               <Box className="w-4 h-4 text-studio" />
               <div className="flex flex-col">
                 <span className="text-[9px] font-black text-studio/60 uppercase tracking-widest leading-none mb-1">Active Unit</span>
                 <span className="text-sm font-black text-white font-mono leading-none">SESSION {session} / EPISODE {episode}</span>
               </div>
             </div>
             <Button 
               onClick={() => navigate('script')}
               className="h-14 px-10 rounded-full bg-studio text-white font-black uppercase tracking-[0.25em] text-[11px] shadow-studio hover:bg-studio/90 transition-all hover:-translate-y-1 active:scale-95"
             >
                Enter Production <ArrowRight className="w-4 h-4 ml-3" />
             </Button>
          </div>
        </div>

        {/* Floating Motifs */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6">
           <div className="w-16 h-32 rounded-xl border border-studio/30 bg-studio/5 flex items-center justify-center shadow-studio/10">
              <Film className="w-8 h-8 text-studio opacity-40" />
           </div>
           <div className="w-16 h-32 rounded-xl border border-studio/30 bg-studio/5 flex items-center justify-center shadow-studio/10 self-end">
              <Sword className="w-8 h-8 text-studio opacity-40" />
           </div>
        </div>
      </div>

         {/* 1.5 AUTONOMOUS CONSTRUCTION (GOD MODE) */}
         <div className="relative rounded-[3rem] bg-zinc-950 border border-studio/30 overflow-hidden p-12 group shadow-studio/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_100%)] pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
               <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio/10 border border-studio/20 text-studio">
                     <Sparkles className="w-4 h-4 animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Master Control / Concept Synthesis</span>
                  </div>
                  
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                     Concept / <br />
                     <span className="text-studio">Theme</span>
                  </h2>
                  
                  <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-md uppercase tracking-wider">
                     Launch the full production mainline. Generates world architecture, character profiles, and 60 episode narrative beats in one sequence.
                  </p>
               </div>

               <div className="w-full lg:w-[500px] space-y-4">
                  <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black text-studio uppercase tracking-widest">Narrative Blueprint</label>
                      <button 
                        onClick={() => setPrompt('')}
                        className="text-[9px] font-black text-zinc-500 hover:text-studio uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        CLEAR
                      </button>
                  </div>
                  <div className="relative">
                     <Textarea 
                        placeholder="Describe your core narrative concept and structural requirements..."
                        className="min-h-[120px] bg-black border-studio/20 focus:border-studio/50 text-studio placeholder:text-zinc-800 rounded-[2rem] p-6 text-sm font-medium resize-none shadow-inner"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                     />
                     <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Neural Sync {prompt.length > 0 ? 'Ready' : 'Pending'}</span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                       variant="outline"
                       className="h-14 border-studio/20 bg-studio/5 text-studio hover:bg-studio/10 text-[10px] font-black uppercase tracking-widest rounded-2xl"
                    >
                      Omni-Surge (Synthesize All)
                    </Button>
                    <Button 
                       onClick={handleMasterGenerate}
                       disabled={isLoading || !prompt.trim()}
                       className="h-14 rounded-2xl bg-studio hover:bg-studio/90 text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-studio transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
                    >
                       {isLoading ? (
                          <>
                             <Loader2 className="w-5 h-5 animate-spin" />
                             Forging...
                          </>
                       ) : (
                          <>
                             <Zap className="w-5 h-5 fill-current" />
                             Initiate Master Production Loop
                          </>
                       )}
                    </Button>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. STATS GRID */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-[#0a0a0a]/50 border-zinc-900 p-8 flex items-center justify-between group hover:border-studio/30 transition-all">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
             </div>
             <div className={cn("p-4 rounded-2xl bg-zinc-950 border border-zinc-800 transition-all group-hover:scale-110", stat.color)}>
                <stat.icon className="w-6 h-6" />
             </div>
          </Card>
        ))}
      </div>

      {/* 3. MULTI-PHASE HUB */}
      {phases.map((phase, pIdx) => (
        <div key={pIdx} className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
             <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-studio" />
                {phase.title}
             </h2>
             <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Phase {pIdx + 1} / 4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {phase.tools.map((tool) => (
               <motion.button
                 key={tool.id}
                 whileHover={{ y: -5 }}
                 onClick={() => navigate(tool.path)}
                 className="group flex flex-col text-left p-8 bg-[#0a0a0a]/80 border border-zinc-900 rounded-[2.5rem] hover:border-studio/40 transition-all relative overflow-hidden aspect-[3/2] justify-between shadow-2xl"
               >
                  <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", tool.bg)} />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-studio opacity-0 group-hover:opacity-5 blur-[80px] rounded-full pointer-events-none transition-opacity" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className={cn("p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 transition-all group-hover:scale-110 group-hover:shadow-studio/20", "text-studio")}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-studio group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="relative z-10">
                     <h4 className="text-xl font-black text-white mb-2 tracking-tighter uppercase">{tool.label}</h4>
                     <p className="text-xs text-zinc-500 font-medium leading-relaxed line-clamp-2 uppercase tracking-wide">{tool.desc}</p>
                  </div>
               </motion.button>
             ))}
          </div>
        </div>
      ))}

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
