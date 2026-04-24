import React from 'react';
import { Box, Activity, Camera, Layers, Wand2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoryboardToolbarProps {
  session: string;
  episode: string;
  status: 'active' | 'draft' | 'empty';
}

export const StoryboardToolbar: React.FC<StoryboardToolbarProps> = ({
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
          <Activity className={cn("w-3 h-3", status === 'active' ? "text-fuchsia-500" : "text-zinc-600")} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {status === 'active' ? 'Frames Initialized' : 'Optics Standby'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
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
