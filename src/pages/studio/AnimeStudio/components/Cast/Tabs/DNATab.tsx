import React from 'react';
import { Dna, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DNATab: React.FC = () => {
  return (
    <div className="py-12 space-y-12">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Dna className="w-6 h-6 text-blue-500" />
           </div>
           <div>
             <h2 className="text-xl font-black text-white uppercase tracking-widest italic">Genetic Narrative Analysis</h2>
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Profiling deep-seated character traits and fatal flaws</p>
           </div>
         </div>
         <Button variant="outline" className="h-10 px-6 bg-white/5 border-white/10 text-white font-black uppercase tracking-widest text-[9px] rounded-xl">
           Run Full Diagnostic
         </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="p-8 bg-[#080808] border border-white/5 rounded-[2.5rem] space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Narrative Weight Distribution</span>
              <Search className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="h-64 flex items-end gap-2 px-4">
               {[80, 40, 95, 60, 30, 85].map((h, i) => (
                 <div key={i} className="flex-1 bg-gradient-to-t from-blue-500/40 to-blue-500/10 rounded-t-lg transition-all hover:from-blue-400" style={{ height: `${h}%` }} />
               ))}
            </div>
            <p className="text-xs text-zinc-500 italic font-medium leading-relaxed">
              The DNA sequencing indicates a high concentration of tragic archetypes within the secondary cast, suggesting a dramatic pivot in the second act.
            </p>
         </div>
         <div className="space-y-4">
            {[
              { label: 'Psychological Complexity', score: 'Level 9', desc: 'Highly nuanced motivations detected.' },
              { label: 'Thematic Resonance', score: 'Matched', desc: 'Direct alignment with world themes.' },
              { label: 'Dialogue Variance', score: 'Optimal', desc: 'Unique voice signatures confirmed.' }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/[0.07] transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</span>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{item.desc}</p>
                </div>
                <span className="text-sm font-black text-blue-400 uppercase tracking-widest">{item.score}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};


