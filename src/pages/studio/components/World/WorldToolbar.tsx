import React from 'react';
import { Box, Copy, Download, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorldTabs, WorldTab } from './Tabs/WorldTabs';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/hooks/useGenerator';

export type { WorldTab };

interface WorldToolbarProps {
  activeTab: WorldTab;
  setActiveTab: (tab: WorldTab) => void;
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
}

export const WorldToolbar: React.FC<WorldToolbarProps> = ({
  activeTab,
  setActiveTab,
  status,
  session = '1',
  episode = '1',
  content = null
}) => {
  const { isFullscreen } = useGenerator();

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

  const handleDownload = () => {
    if (content) {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'world_manifest.md';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 md:p-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-studio/10 border border-studio/20 flex items-center justify-center shrink-0">
            <Box className={cn("w-5 h-5", status === 'active' ? "text-studio" : "text-zinc-600")} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">
              World Nexus {status === 'active' ? 'Active' : 'Standby'}
            </span>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
              System Status: Optimal // World_Sync_01
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            {/* Production Unit */}
            <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md grow md:grow-0">
              <span className="text-studio/60 text-xs font-black">#</span>
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">Production Unit</span>
                <span className="text-sm font-black text-white font-mono leading-none mt-1">S{session}-E{episode}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 p-1.5 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md shrink-0">
              <Button 
                onClick={handleCopy} 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300"
                title="Copy to clipboard"
                disabled={!content}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button 
                onClick={handleDownload} 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-lg text-zinc-500 hover:text-studio hover:bg-studio/10 transition-all duration-300"
                title="Export as Markdown"
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
      </div>

      <WorldTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

