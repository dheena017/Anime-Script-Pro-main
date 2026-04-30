import React from 'react';
import { Workflow, Zap } from 'lucide-react';

export const DynamicsTab: React.FC = () => {
  return (
    <div className="py-12 space-y-12">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full">
          <Workflow className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Dynamic Conflict Mapper</span>
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Narrative Tension Dynamics</h2>
        <p className="text-zinc-500 max-w-xl mx-auto font-medium">Visualizing the pressure points and emotional collisions between your characters.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { type: 'Rivalry', focus: 'Lead vs Antagonist', strength: 'High' },
           { type: 'Romance', focus: 'Sub-plot A', strength: 'Moderate' },
           { type: 'Betrayal', focus: 'The Rogue Factor', strength: 'Critical' },
           { type: 'Mentorship', focus: 'The Elder Guidance', strength: 'Low' }
         ].map((dynamic, i) => (
           <div key={i} className="relative group/dyn">
             <div className="absolute inset-0 bg-rose-500/5 blur-xl rounded-3xl opacity-0 group-hover/dyn:opacity-100 transition-opacity" />
             <div className="relative p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem] space-y-6 text-center">
               <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 mx-auto flex items-center justify-center">
                  <Zap className="w-5 h-5 text-rose-500" />
               </div>
               <div className="space-y-1">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest">{dynamic.type}</h3>
                 <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{dynamic.focus}</p>
               </div>
               <div className="pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest italic">{dynamic.strength} Tension</span>
               </div>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};
