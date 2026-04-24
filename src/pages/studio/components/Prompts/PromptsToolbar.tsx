import React from 'react';
import { Box, Activity, Wand2, Copy, Share2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptsToolbarProps {
  session: string;
  episode: string;
  status: 'active' | 'draft' | 'empty';
}

export const PromptsToolbar: React.FC<PromptsToolbarProps> = ({
  session,
  episode,
  status
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800/50 rounded-2xl mb-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-studio/5 border border-studio/20 rounded-lg">
          <Box className="w-3 h-3 text-studio/50" />
          <span className="text-[9px] font-black text-studio/60 uppercase tracking-tighter">Unit</span>
          <span className="text-xs font-black text-white font-mono">S{session}-E{episode}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Activity className={cn("w-3 h-3", status === 'active' ? "text-cyan-500" : "text-zinc-600")} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {status === 'active' ? 'Prompt Matrix Live' : 'Terminal Standby'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Terminal className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Syntax</span>
        </button>
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Wand2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Optimizers</span>
        </button>
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Copy All</span>
        </button>
        <div className="w-px h-4 bg-zinc-800 mx-2" />
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Push</span>
        </button>
      </div>
    </div>
  );
};
