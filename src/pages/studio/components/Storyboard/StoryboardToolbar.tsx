import React from 'react';
import { Box, Activity, Camera, Layers, Wand2, Download, Mic2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoryboardToolbarProps {
  session: string;
  episode: string;
  status: 'active' | 'draft' | 'empty';
  onEnhanceNarration?: () => void;
  onEnhanceVisuals?: () => void;
  isGlobalEnhancing?: boolean;
}

export const StoryboardToolbar: React.FC<StoryboardToolbarProps> = ({
  session,
  episode,
  status,
  onEnhanceNarration,
  onEnhanceVisuals,
  isGlobalEnhancing
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
          <Activity className={cn("w-3 h-3", status === 'active' ? "text-fuchsia-500" : "text-zinc-600")} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {status === 'active' ? 'Frames Initialized' : 'Optics Standby'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button
          onClick={onEnhanceNarration}
          disabled={isGlobalEnhancing}
          className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group disabled:opacity-50"
        >
          <Mic2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Audio Sync</span>
        </button>
        <button
          onClick={onEnhanceVisuals}
          disabled={isGlobalEnhancing}
          className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Refine Matrix</span>
        </button>
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Angles</span>
        </button>
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Layers className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Composition</span>
        </button>
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Wand2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Render All</span>
        </button>
        <div className="w-px h-4 bg-zinc-800 mx-2" />
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Export All</span>
        </button>
      </div>
    </div>
  );
};
