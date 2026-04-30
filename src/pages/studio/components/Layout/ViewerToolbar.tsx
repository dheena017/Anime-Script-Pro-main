import { useState, useEffect } from 'react';
import { Copy, Download, Maximize, Minimize, Heart, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ViewerToolbarProps {
  content: string | null;
  filename?: string;
  isLiked?: boolean;
  setIsLiked?: (liked: boolean) => void;
  nexusLabel?: string;
  session?: string;
  episode?: string;
  children?: React.ReactNode;
  icon?: React.ElementType;
  hideProductionUnit?: boolean;
  hideActions?: boolean;
}

export function ViewerToolbar({ 
  content, 
  filename = 'manifest.md',
  isLiked = false,
  setIsLiked,
  nexusLabel = 'CAST_NEXUS',
  session = '1',
  episode = '1',
  children,
  icon: Icon = UserPlus,
  hideProductionUnit = false,
  hideActions = false
}: ViewerToolbarProps) {
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
        const target = document.getElementById('studio-content-area') || document.documentElement;
        await target.requestFullscreen();
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
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex items-center justify-between w-full p-4 bg-[#050505]/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden group/toolbar">
      {/* Background Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.02)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 opacity-0 group-hover/toolbar:opacity-100 transition-opacity duration-1000" />

      <div className="flex items-center gap-12 z-10 w-full">
        {/* Left Section: Nexus Label */}
        <div className="flex items-center gap-3 px-4 py-2 bg-studio/10 border border-studio/20 rounded-xl">
          <Icon className="w-4 h-4 text-studio" />
          <span className="text-[10px] font-black text-studio uppercase tracking-[0.2em]">{nexusLabel}</span>
        </div>

        <div className="flex items-center justify-between flex-1">
          {/* Middle Section: Production Unit */}
          <div className="flex items-center gap-8 ml-auto mr-8">
             {children}
             
             {!hideProductionUnit && (
               <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md">
                  <span className="text-studio/60 text-xs font-black">#</span>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">Production Unit</span>
                    <span className="text-sm font-black text-white font-mono leading-none mt-1">S{session}-E{episode}</span>
                  </div>
               </div>
             )}
          </div>

          {/* Right Section: Actions */}
          {!hideActions && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1.5 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md">
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

              {setIsLiked && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-11 w-11 rounded-full transition-all duration-500 border relative",
                    isLiked 
                      ? "text-red-400 bg-red-500/20 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)] scale-110" 
                      : "text-zinc-600 border-white/10 bg-black/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                  )}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={cn("w-5 h-5 transition-transform duration-300 active:scale-125", isLiked && "fill-current")} />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

  );
}
