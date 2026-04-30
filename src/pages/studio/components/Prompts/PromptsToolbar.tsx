import React from 'react';
import { Activity, Wand2, Copy, Share2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptsToolbarProps {
  status: 'active' | 'draft' | 'empty';
}

export const PromptsToolbar: React.FC<PromptsToolbarProps> = ({
  status
}) => {
  return (
    <div className="flex items-center justify-between gap-8">
      <div className="flex items-center gap-6">

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
