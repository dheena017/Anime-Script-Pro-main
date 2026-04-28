import React, { useState, useEffect } from 'react';
import { Box, Activity, Calendar, ListChecks, Network, Share2, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SeriesToolbarProps {
  session: string;
  episode: string;
  status: 'active' | 'draft' | 'empty';
  onToggleScaffolder?: () => void;
  showScaffolder?: boolean;
}

export const SeriesToolbar: React.FC<SeriesToolbarProps> = ({
  session,
  episode,
  status,
  onToggleScaffolder,
  showScaffolder
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800/50 rounded-2xl mb-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-studio/5 border border-studio/20 rounded-lg">
          <Box className="w-3 h-3 text-studio/50" />
          <span className="text-[9px] font-black text-studio/60 uppercase tracking-tighter">Unit</span>
          <span className="text-xs font-black text-white font-mono">S{session}-E{episode}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Activity className={cn("w-3 h-3", status === 'active' ? "text-orange-500" : "text-zinc-600")} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {status === 'active' ? 'Blueprint Locked' : 'Architectural Standby'}
          </span>
          {status === 'active' && <Calendar className="w-3 h-3 text-studio/50" />}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <ListChecks className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Manifest</span>
        </button>
        <button 
          onClick={onToggleScaffolder}
          className={cn(
            "flex items-center gap-2 transition-colors group",
            showScaffolder ? "text-studio" : "text-zinc-600 hover:text-studio"
          )}
        >
          <Network className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Blueprint</span>
        </button>
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Export</span>
        </button>
        <div className="w-[1px] h-4 bg-zinc-800" />
        <button 
          onClick={toggleFullscreen}
          className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> : <Maximize className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
          <span className="text-[10px] font-black uppercase tracking-widest">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
        </button>
      </div>
    </div>
  );
};
