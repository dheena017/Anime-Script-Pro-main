import React from 'react';
import { Clock, Timer } from 'lucide-react';

export const TimelineTab: React.FC = () => {
  return (
    <div className="py-12 space-y-12">
      <div className="text-center space-y-4">
         <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-blue-400" />
         </div>
         <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Production Timeline</h2>
         <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Estimated synthesis and rendering schedule</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
         {[
           { phase: 'Concept Manifest', time: '14 Days', status: 'Complete' },
           { phase: 'Asset Synthesis', time: '30 Days', status: 'Active' },
           { phase: 'Neural Scripting', time: '21 Days', status: 'Pending' },
           { phase: 'Visual Sequencing', time: '45 Days', status: 'Queued' }
         ].map((phase, i) => (
           <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all group">
              <div className="flex items-center gap-6">
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Timer className="w-5 h-5 text-blue-400" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{phase.phase}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Est. Duration: {phase.time}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", phase.status === 'Complete' ? "bg-emerald-500" : "bg-blue-500")} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{phase.status}</span>
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
