import React from 'react';
import { Activity, Heart, Search, Layout, Volume2, Wand2, Download, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScriptToolbarProps {
  session: string;
  episode: string;
  status: 'active' | 'draft' | 'empty';
  onExport: () => void;
  onViewSEO: () => void;
  onViewPrompts: () => void;
  onViewStoryboard: () => void;
  onExtend: () => void;
  onListen: () => void;
}

export const ScriptToolbar: React.FC<ScriptToolbarProps> = ({
  status,
  onExport,
  onViewSEO,
  onViewPrompts,
  onViewStoryboard,
  onExtend,
  onListen
}) => {
  return (
    <div className="flex items-center justify-between gap-8">
      <div className="flex items-center gap-6">

        <div className="flex items-center gap-2">
          <Activity className={cn("w-3 h-3", status === 'active' ? "text-cyan-500" : "text-zinc-600")} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {status === 'active' ? 'Active Script' : 'Awaiting Synthesis'}
          </span>
          {status === 'active' && <Heart className="w-3 h-3 text-red-500/50 fill-red-500/20" />}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={onViewSEO} className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">SEO</span>
        </button>
        <button onClick={onViewPrompts} className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Wand2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Prompts</span>
        </button>
        <button onClick={onViewStoryboard} className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Layout className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Storyboard</span>
        </button>
        <button onClick={onExtend} className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <RefreshCw className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Extend</span>
        </button>
        <button onClick={onListen} className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Volume2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Listen</span>
        </button>
        <div className="w-px h-4 bg-zinc-800 mx-2" />
        <button onClick={onExport} className="flex items-center gap-2 text-studio/60 hover:text-studio transition-colors group">
          <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">PDF</span>
        </button>
      </div>
    </div>
  );
};
