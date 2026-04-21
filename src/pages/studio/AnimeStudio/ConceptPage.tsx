import { Card as ShadcnCard } from '@/components/ui/card';
import { useGenerator } from '@/contexts/GeneratorContext';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Trash2, 
  Brain, 
  Zap,
  Target,
  FlaskConical,
  Wind
} from 'lucide-react';
import { ProductionOrchestrator } from '@/services/productionOrchestrator';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { OmniPrompt } from '@/components/studio/OmniPrompt';

export default function ConceptPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    prompt, 
    setPrompt, 
    isLoading,
    setIsLoading,
    selectedModel,
    tone,
    showNotification,
    setGeneratedWorld,
    setGeneratedCharacters,
    setGeneratedSeriesPlan
  } = useGenerator();

  const handleMasterGenerate = async () => {
    if (!prompt.trim() || !user) return;
    setIsLoading(true);
    try {
      const orchestrator = new ProductionOrchestrator({ 
        prompt, contentType: 'Anime', model: selectedModel, 
        userId: user.id, vibe: tone 
      });
      
      const result = await orchestrator.executeFullCycle((phase) => {
        console.log(`[CONCEPT-ORCHESTRATOR] ${phase}`);
      });

      if (result.world) setGeneratedWorld(result.world);
      if (result.cast) setGeneratedCharacters(typeof result.cast === 'object' ? result.cast.markdown : result.cast);
      if (result.series) setGeneratedSeriesPlan(result.series);
      
      navigate('../series');
    } catch (e: any) { 
      const errorMsg = e.message || 'Master Loop Failure'; 
      showNotification?.('Production Error: ' + errorMsg, 'error');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* HEADER SECTION */}
      <div className="border-b border-zinc-800/80 pb-12 text-center space-y-4 relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
        <div className="inline-block px-3 py-1 bg-studio/10 border border-studio/30 rounded-full text-[10px] uppercase tracking-[0.3em] text-studio font-bold shadow-none mb-4">
          Core Production Directive
        </div>
        <h1 className="text-6xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          Concept / <span className="text-studio">Theme</span>
        </h1>
        <p className="text-zinc-500 italic max-w-lg mx-auto font-medium">
          Define the primary narrative objective, seasonal hook, and the master logic of the series identity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* MAIN INPUT AREA */}
        <div className="lg:col-span-8 space-y-8">
          <ShadcnCard className="bg-[#050505] border-zinc-900 rounded-[3rem] overflow-hidden group shadow-2xl">
            <div className="p-8 border-b border-zinc-900 bg-studio/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-studio/10 border border-studio/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-studio" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Narrative Blueprint</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Neural Link Active</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setPrompt('')}
                  className="h-8 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3 mr-2" /> CLEAR
                </Button>
              </div>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-4">
                <OmniPrompt 
                  value={prompt}
                  onChange={(val) => setPrompt(val)}
                  onExecute={(val) => setPrompt(val)}
                  onChipClick={(val) => setPrompt(val)}
                  placeholder="Describe your vision, or choose a starting point below..."
                />
              </div>

              <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row gap-4">
                <Button 
                   onClick={() => {}} // Could trigger a refinement prompt
                   className="h-14 flex-1 bg-zinc-900 border border-zinc-800 hover:bg-studio/10 hover:border-studio/30 text-zinc-400 hover:text-studio rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                >
                  <FlaskConical className="w-4 h-4 mr-2" /> Omni-Surge (Synthesize All)
                </Button>
                <Button 
                  onClick={handleMasterGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className="h-14 flex-[1.5] bg-studio hover:bg-studio/90 text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-studio shadow-[0_0_30px_rgba(var(--studio-rgb),0.3)] transition-all flex items-center justify-center gap-3"
                >
                  {isLoading ? <Wind className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                  Initiate Master Production Loop
                </Button>
              </div>
            </div>
          </ShadcnCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[2.5rem] bg-zinc-950 border border-zinc-900/50 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-studio" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 font-mono">Series Hook</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Establish the "What If" scenario that hooks the audience within the first 60 seconds of the series premiere.
              </p>
            </div>
            <div className="p-6 rounded-[2.5rem] bg-zinc-950 border border-zinc-900/50 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-fuchsia-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 font-mono">Thematic Core</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                The ideological centerpiece. What fundamental human friction or environmental conflict does this story resolve?
              </p>
            </div>
          </div>
        </div>

        {/* SIDEBAR TIPS / METADATA */}
        <div className="lg:col-span-4 space-y-6">
          <ShadcnCard className="bg-[#050505] border-zinc-900 rounded-[2.5rem] p-8 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-studio border-b border-zinc-900 pb-4">Production Specs</h4>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Primary Persona</label>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  Dynamic / Hype
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Model Directive</label>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  Gemini-1.5-Pro
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Structural Units</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
                    <span className="block text-[8px] text-zinc-600 font-black mb-1">SESSION</span>
                    <span className="text-xs font-mono font-black text-studio">01</span>
                  </div>
                  <div className="flex-1 p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
                    <span className="block text-[8px] text-zinc-600 font-black mb-1">EPISODE</span>
                    <span className="text-xs font-mono font-black text-studio">01</span>
                  </div>
                </div>
              </div>
            </div>
          </ShadcnCard>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-studio/5 to-transparent border border-studio/20 space-y-4">
            <div className="flex items-center gap-3 text-studio">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">AI Strategist Tip</span>
            </div>
            <p className="text-[11px] text-studio/70 leading-relaxed font-medium italic">
              "Focus your concept on the 'Central Friction'. Whether it's man vs machine or magic vs logic, a strong thematic core makes all subsequent world-building effortless."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
