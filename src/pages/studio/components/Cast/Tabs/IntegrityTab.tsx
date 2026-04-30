import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const IntegrityTab: React.FC = () => {
  return (
    <div className="py-20 text-center space-y-12">
      <div className="relative inline-block">
         <div className="absolute -inset-8 bg-emerald-500/10 blur-3xl rounded-full animate-pulse" />
         <ShieldCheck className="w-24 h-24 text-emerald-500 mx-auto relative z-10" />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-black text-white uppercase tracking-widest">Database Integrity Verified</h2>
        <p className="text-zinc-500 max-w-md mx-auto text-sm font-medium">All character souls are consistent with the world laws and narrative logic. No existential conflicts detected.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
         {[
           { label: 'Neural Sync', value: '100%', status: 'Optimal' },
           { label: 'Lore Consistency', value: 'Verified', status: 'Stable' },
           { label: 'Archetype Density', value: 'High', status: 'Active' }
         ].map((stat, i) => (
           <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl text-left space-y-2">
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
             <div className="flex items-end justify-between">
               <span className="text-2xl font-black text-white">{stat.value}</span>
               <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-1">{stat.status}</span>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};
