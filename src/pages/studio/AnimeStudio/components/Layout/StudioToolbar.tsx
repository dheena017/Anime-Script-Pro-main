import React from 'react';
import { Activity, Heart, Copy, Download, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudioToolbarProps {
  session: string;
  episode: string;
  content: string | null;
  filename: string;
}

export const StudioToolbar: React.FC<StudioToolbarProps> = ({
  content,
  filename
}) => {
  const [isLiked, setIsLiked] = React.useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-4 h-12 px-4 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-xl">
      <div className="flex items-center gap-4 pr-4 border-r border-white/10">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <Activity className={cn("w-3 h-3", content ? "text-emerald-500" : "text-zinc-600")} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {content ? 'Active Nexus' : 'Standby'}
          </span>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="transition-transform active:scale-95"
          >
            <Heart className={cn("w-3.5 h-3.5 transition-colors", isLiked ? "text-red-500 fill-red-500" : "text-zinc-600 hover:text-red-500/50")} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Action Buttons - Text Style */}
        <button
          onClick={handleCopy}
          disabled={!content}
          className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">Manifest</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={!content}
          className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">Archive</span>
        </button>

        <button
          className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group"
        >
          <Maximize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};


