import React from 'react';
import { Box, User, Image, Music, Map } from 'lucide-react';

export const AssetsTab: React.FC = () => {
  return (
    <div className="py-12 space-y-12">
      <div className="flex items-center gap-6 border-b border-white/5 pb-10">
         <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Box className="w-8 h-8 text-emerald-400" />
         </div>
         <div className="space-y-1">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Asset Matrix</h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Cross-episode resource manifesting and tracking</p>
         </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Characters', icon: User, count: 24, status: 'Synced' },
           { label: 'Environments', icon: Map, count: 12, status: 'Synced' },
           { label: 'Key Visuals', icon: Image, count: 48, status: 'Active' },
           { label: 'Soundscapes', icon: Music, count: 18, status: 'Stable' }
         ].map((item, i) => (
           <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-4 hover:border-emerald-500/20 transition-all group text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                 <item.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                 <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</h3>
                 <p className="text-3xl font-black text-white font-mono">{item.count}</p>
              </div>
              <div className="pt-4">
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/60">{item.status}</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};


