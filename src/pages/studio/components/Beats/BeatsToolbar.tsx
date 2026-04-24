import React from 'react';
import { Box, Layers, Activity, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeatsToolbarProps {
  session: string;
  episode: string;
  status: 'active' | 'draft' | 'empty';
}

export const BeatsToolbar: React.FC<BeatsToolbarProps> = ({
  session,
  episode,
  status
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 rounded-2xl mb-8 relative group/toolbar overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-transparent opacity-0 group-hover/toolbar:opacity-100 transition-opacity duration-700" />
      
      <div className="flex items-center gap-8 relative z-10">
        <div className="flex items-center gap-3 px-4 py-2 bg-studio/10 border border-studio/20 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <Box className="w-3.5 h-3.5 text-studio" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-studio/60 uppercase tracking-tighter leading-none">Production Unit</span>
            <span className="text-[11px] font-black text-white font-mono tracking-tighter">S{session} — E{episode}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 border-l border-white/5 pl-8">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.4)]",
            status === 'active' ? "bg-orange-500" : "bg-zinc-700"
          )} />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
              {status === 'active' ? 'Architecture Locked' : 'Pacing Standby'}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">Neural Sync Status</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10 relative z-10 pr-4">
        {[
          { icon: Layers, label: 'Phases' },
          { icon: Activity, label: 'Intensity' },
          { icon: Wand2, label: 'Optimize' }
        ].map((item, idx) => (
          <button key={idx} className="flex items-center gap-3 text-zinc-500 hover:text-studio transition-all duration-300 group/btn">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover/btn:border-studio/30 group-hover/btn:bg-studio/10 transition-all duration-300">
              <item.icon className="w-4 h-4 group-hover/btn:scale-110 group-hover/btn:rotate-3 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
