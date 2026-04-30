import React, { useState, useEffect } from 'react';
import { Palette, Mic2, Zap, Copy, Download, Maximize, Minimize, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StoryboardTabs, StoryboardTab } from './Tabs/StoryboardTabs';
import { Button } from '@/components/ui/button';

export type { StoryboardTab };

interface StoryboardToolbarProps {
  onAddScene?: () => void;
  activeTab: StoryboardTab;
  setActiveTab: (tab: StoryboardTab) => void;
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  onEnhanceNarration?: () => void;
  onEnhanceVisuals?: () => void;
  isGlobalEnhancing?: boolean;
}

export const StoryboardToolbar: React.FC<StoryboardToolbarProps> = ({
  activeTab,
  setActiveTab,
  status,
  session = '1',
  episode = '1',
  content = null,
  onAddScene,
  onEnhanceNarration,
  onEnhanceVisuals,
  isGlobalEnhancing
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (err) { console.error(err); }
  };

  const handleCopy = () => { if (content) navigator.clipboard.writeText(content); };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storyboard-S${session}-E${episode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
            <Palette className={cn("w-5 h-5", status === 'active' ? "text-fuchsia-400" : "text-zinc-600")} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">
              Storyboard Nexus {status === 'active' ? 'Active' : 'Standby'}
            </span>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
              Visual DNA Engine // Frame_Sync_Ready
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {onAddScene && (
            <Button
              variant="outline"
              className="h-11 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-300 border-zinc-700 hover:text-white hover:border-studio transition-all duration-300"
              onClick={onAddScene}
            >
              <Plus className="w-3.5 h-3.5 mr-2" />
              Append Scene
            </Button>
          )}

          {/* Quick Actions */}
          <div className="flex items-center gap-4 px-5 py-2 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
            <button
              onClick={onEnhanceNarration}
              disabled={isGlobalEnhancing}
              className="text-zinc-500 hover:text-studio transition-colors disabled:opacity-40 group"
              title="Audio Sync"
            >
              <Mic2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={onEnhanceVisuals}
              disabled={isGlobalEnhancing}
              className="text-zinc-500 hover:text-fuchsia-400 transition-colors disabled:opacity-40 group"
              title="Refine Visual Matrix"
            >
              <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Production Unit */}
          <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md">
            <span className="text-fuchsia-400/60 text-xs font-black">#</span>
            <div className="flex flex-col">
              <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">Production Unit</span>
              <span className="text-sm font-black text-white font-mono leading-none mt-1">S{session}-E{episode}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 p-1.5 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md">
            <Button onClick={handleCopy} size="icon" variant="ghost"
              className="h-9 w-9 rounded-lg text-zinc-500 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all"
              title="Copy" disabled={!content}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button onClick={handleDownload} size="icon" variant="ghost"
              className="h-9 w-9 rounded-lg text-zinc-500 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all"
              title="Export JSON" disabled={!content}>
              <Download className="w-4 h-4" />
            </Button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <Button onClick={toggleFullscreen} size="icon" variant="ghost"
              className="h-9 w-9 rounded-lg text-zinc-500 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse" />
            <span className="text-[9px] font-black text-fuchsia-400/80 uppercase tracking-widest">Visual DNA Live</span>
          </div>
        </div>
      </div>

      <StoryboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

