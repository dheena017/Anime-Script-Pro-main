import React, { useState, useEffect } from 'react';
import { ScrollText, Search, Layout, Volume2, Wand2, Download, RefreshCw, Copy, Maximize, Minimize, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScriptTabs, ScriptTab } from './Tabs/ScriptTabs';
import { Button } from '@/components/ui/button';

export type { ScriptTab };

interface ScriptToolbarProps {
  activeTab: ScriptTab;
  setActiveTab: (tab: ScriptTab) => void;
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  onExport: () => void;
  onViewSEO: () => void;
  onViewPrompts: () => void;
  onViewStoryboard: () => void;
  onExtend: () => void;
  onListen: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const ScriptToolbar: React.FC<ScriptToolbarProps> = ({
  activeTab,
  setActiveTab,
  status,
  session = '1',
  episode = '1',
  content = null,
  onExport,
  onViewSEO,
  onViewPrompts,
  onViewStoryboard,
  onExtend,
  onListen,
  onPrev,
  onNext
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

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-studio/10 border border-studio/20 flex items-center justify-center">
            <ScrollText className={cn("w-5 h-5", status === 'active' ? "text-studio" : "text-zinc-600")} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">
              Script Nexus {status === 'active' ? 'Active' : 'Standby'}
            </span>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
              Synthesis Mode: Sequential // Episode_Ready
            </span>
          </div>
        </div>

        {/* Sequence Control */}
        {status === 'active' && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all text-[9px] font-black uppercase tracking-widest gap-2"
              onClick={onPrev}
              disabled={!onPrev}
            >
              <ChevronLeft className="w-3 h-3" />
              PREV EPISODE
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-lg text-studio/80 hover:text-studio hover:bg-studio/10 transition-all text-[9px] font-black uppercase tracking-widest gap-2 bg-studio/5 border border-studio/20"
              onClick={onNext}
              disabled={!onNext}
            >
              NEXT EPISODE
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-6">
          {/* Quick Actions */}
          <div className="flex items-center gap-4 px-6 py-2 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
            <button onClick={onViewSEO} className="text-zinc-500 hover:text-studio transition-colors group" title="SEO Matrix">
              <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={onViewPrompts} className="text-zinc-500 hover:text-studio transition-colors group" title="Neural Prompts">
              <Wand2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={onViewStoryboard} className="text-zinc-500 hover:text-studio transition-colors group" title="Visual Storyboard">
              <Layout className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </button>
            <div className="w-px h-3 bg-white/10" />
            <button onClick={onExtend} className="text-zinc-500 hover:text-studio transition-colors group" title="Extend Script">
              <RefreshCw className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={onListen} className="text-zinc-500 hover:text-studio transition-colors group" title="Neural Voiceover">
              <Volume2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Production Unit */}
          <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md">
            <span className="text-studio/60 text-xs font-black">#</span>
            <div className="flex flex-col">
              <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">Production Unit</span>
              <span className="text-sm font-black text-white font-mono leading-none mt-1">S{session}-E{episode}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 p-1.5 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md">
            <Button 
              onClick={handleCopy} 
              size="icon" 
              variant="ghost" 
              className="h-9 w-9 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300"
              title="Copy Script"
              disabled={!content}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              onClick={onExport} 
              size="icon" 
              variant="ghost" 
              className="h-9 w-9 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300"
              title="Export as PDF"
              disabled={!content}
            >
              <Download className="w-4 h-4" />
            </Button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <Button 
              onClick={toggleFullscreen} 
              size="icon" 
              variant="ghost" 
              className="h-9 w-9 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>

        </div>
      </div>

      <ScriptTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

