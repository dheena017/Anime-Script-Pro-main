import React from 'react';
import { Brain, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MastermindCoreProps {
  aiBeats: any[] | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const MastermindCore: React.FC<MastermindCoreProps> = ({
  aiBeats,
  isGenerating,
  onGenerate
}) => {
  return (
    <Card className="bg-[#050505]/80 border-orange-500/20 p-12 rounded-[3rem] overflow-hidden relative group shadow-[0_0_50px_rgba(249,115,22,0.1)]">
       <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <Brain className="w-full h-full text-orange-500" />
       </div>
       
       <div className="relative z-10 text-center space-y-12">
          <div className="space-y-4">
             <div className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-[10px] uppercase tracking-[0.4em] text-orange-500 font-black">
                Neural Diagnostic Active
             </div>
             <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Dynamic Narrative Synthesis</h3>
             <p className="text-sm text-zinc-500 max-w-2xl mx-auto font-medium">
               The Mastermind is analyzing your creative intent to architect a structure that maximizes retention and emotional payoff.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {[
               { label: 'Prompt Decay', val: '0.002ms', color: 'text-emerald-500' },
               { label: 'Thematic Weight', val: '88%', color: 'text-orange-500' },
               { label: 'Structural Integrity', val: 'Stable', color: 'text-cyan-500' },
             ].map((stat, i) => (
               <div key={i} className="p-6 bg-black/40 border border-zinc-900 rounded-2xl space-y-1">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                  <p className={cn("text-2xl font-black uppercase tracking-widest", stat.color)}>{stat.val}</p>
               </div>
             ))}
          </div>

          <div className="p-1 border border-zinc-800 rounded-[2rem] bg-black/40 backdrop-blur-xl">
             <div className="p-10 text-center space-y-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Mastermind Output</p>
                {aiBeats ? (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {aiBeats.map((beat: any, i: number) => (
                      <div key={i} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2 group/beat hover:border-orange-500/50 transition-all text-left">
                         <span className="text-[9px] font-black text-zinc-600 uppercase">Phase 0{i+1}</span>
                         <h4 className="text-[11px] font-black text-white uppercase tracking-wider truncate">{beat.label}</h4>
                         <div className="h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${beat.intensity * 10}%` }} />
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 py-10">
                    <div className="w-20 h-20 bg-orange-500/5 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                       <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
                    </div>
                    <p className="text-sm font-black text-zinc-600 uppercase tracking-[0.2em]">Awaiting Instruction...</p>
                  </div>
                )}

                <Button 
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="h-16 px-12 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.4em] text-xs rounded-2xl shadow-[0_15px_40px_rgba(249,115,22,0.3)] transition-all active:scale-95"
                >
                  {isGenerating ? "Synthesizing Architecture..." : "INVOKE MASTERMIND CORE"}
                </Button>
             </div>
          </div>
       </div>
    </Card>
  );
};
