import React from 'react';
import { GitMerge } from 'lucide-react';

export const ArcsTab: React.FC = () => {
  return (
    <div className="py-12 space-y-12">
      <div className="text-center space-y-4">
         <div className="w-16 h-16 rounded-[2rem] bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(217,70,239,0.1)]">
            <GitMerge className="w-8 h-8 text-fuchsia-400" />
         </div>
         <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Narrative Arcs</h2>
         <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Mapping emotional beats and seasonal progression</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
         {[
           { title: 'The Awakening', episodes: '1-3', status: 'Rising Action', color: 'text-blue-400' },
           { title: 'Trial of Shadows', episodes: '4-8', status: 'Core Conflict', color: 'text-amber-400' },
           { title: 'Nexus Convergence', episodes: '9-11', status: 'Climax', color: 'text-rose-400' },
           { title: 'A New Dawn', episodes: '12', status: 'Resolution', color: 'text-emerald-400' }
         ].map((arc, i) => (
           <div key={i} className="p-8 bg-[#080808] border border-white/5 rounded-[2.5rem] space-y-6 hover:border-fuchsia-500/20 transition-all group">
              <div className="flex items-center justify-between">
                 <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full", arc.color)}>
                    {arc.status}
                 </span>
                 <span className="text-zinc-600 text-[10px] font-black uppercase">EP {arc.episodes}</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider">{arc.title}</h3>
              <div className="flex gap-2">
                 {[1, 2, 3, 4].map(j => (
                   <div key={j} className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-fuchsia-500/40 w-full" />
                   </div>
                 ))}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}


