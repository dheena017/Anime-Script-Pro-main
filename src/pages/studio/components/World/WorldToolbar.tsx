import React from 'react';
import { Box, Activity, Heart, Search, Layers, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorldToolbarProps {
  session: string;
  episode: string;
  status: 'active' | 'draft' | 'empty';
  onRefresh?: () => void;
  isGenerating?: boolean;
}

export const WorldToolbar: React.FC<WorldToolbarProps> = ({
  session,
  episode,
  status,
  onRefresh,
  isGenerating
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-studio/5 border border-studio/20 rounded-lg">
          <Box className="w-3 h-3 text-studio/50" />
          <span className="text-[9px] font-black text-studio/60 uppercase tracking-tighter">Unit</span>
          <span className="text-xs font-black text-white font-mono">S{session}-E{episode}</span>
        </div>

        <div className="flex items-center gap-2">
          <Activity className={cn("w-3 h-3", status === 'active' ? "text-emerald-500" : "text-zinc-600")} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {status === 'active' ? 'Active Nexus' : 'Awaiting Manifest'}
          </span>
          {status === 'active' && <Heart className="w-3 h-3 text-red-500/50 fill-red-500/20" />}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button
          className={cn(
            "flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group",
            isGenerating && "opacity-50 cursor-not-allowed"
          )}
          onClick={onRefresh}
          disabled={isGenerating}
        >
          {isGenerating ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
          <span className="text-[10px] font-black uppercase tracking-widest">Refresh Lore</span>
        </button>
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Inspect</span>
        </button>
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Layers className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Metadata</span>
        </button>
      </div>
    </div>
  );
};
