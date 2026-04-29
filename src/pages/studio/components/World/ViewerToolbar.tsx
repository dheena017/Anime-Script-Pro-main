import { useState, useEffect } from 'react';
import { Copy, Download, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewerToolbarProps {
  content: string;
}

export function ViewerToolbar({ content }: ViewerToolbarProps) {
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
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'world-lore-manifest.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-xl shadow-inner h-14 px-2">
      <Button 
        onClick={handleCopy} 
        size="icon" 
        variant="ghost" 
        className="h-10 w-10 rounded-xl text-zinc-400 hover:text-studio hover:bg-studio/10 transition-colors"
        title="Copy to clipboard"
      >
        <Copy className="w-4 h-4" />
      </Button>
      <Button 
        onClick={handleDownload} 
        size="icon" 
        variant="ghost" 
        className="h-10 w-10 rounded-xl text-zinc-400 hover:text-studio hover:bg-studio/10 transition-colors"
        title="Export as Markdown"
      >
        <Download className="w-4 h-4" />
      </Button>
      <div className="w-[1px] h-6 bg-white/10 mx-1" />
      <Button 
        onClick={toggleFullscreen} 
        size="icon" 
        variant="ghost" 
        className="h-10 w-10 rounded-xl text-zinc-400 hover:text-studio hover:bg-studio/10 transition-colors"
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </Button>
    </div>
  );
}
