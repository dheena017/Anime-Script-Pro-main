import React from 'react';
import { Activity, Hash, Tag, Globe, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SEOToolbarProps {
  session: string;
  episode: string;
  status: 'active' | 'draft' | 'empty';
}

export const SEOToolbar: React.FC<SEOToolbarProps> = ({
  status
}) => {
  return (
    <div className="flex items-center justify-between gap-8">
      <div className="flex items-center gap-6">

        <div className="flex items-center gap-2">
          <Activity className={cn("w-3 h-3", status === 'active' ? "text-emerald-500" : "text-zinc-600")} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {status === 'active' ? 'Optimization Active' : 'SEO Standby'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Hash className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Keywords</span>
        </button>
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Tag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Metadata</span>
        </button>
        <button className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group">
          <Globe className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Alt Texts</span>
        </button>
      </div>
    </div>
  );
};
