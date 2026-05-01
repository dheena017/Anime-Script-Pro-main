import React from 'react';
import { Share2, Play, Music2, Camera, Globe, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DistributionTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const DistributionTab: React.FC<DistributionTabProps> = () => {
  const platforms = [
    { name: 'YouTube', icon: Play, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', status: 'Ready' },
    { name: 'TikTok', icon: Music2, icon2: Share2, color: 'text-zinc-100', bg: 'bg-zinc-100/10', border: 'border-zinc-100/20', status: 'Ready' },
    { name: 'Instagram', icon: Camera, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', status: 'Pending' },
    { name: 'Web Portal', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', status: 'Optimizing' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.1)]">
            <Share2 className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Distribution Matrix</h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
              Cross-platform content snippets and engagement strategy
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((platform, i) => (
          <Card key={i} className={cn("p-6 bg-[#050505]/60 border transition-all duration-500 group cursor-default", platform.border, "hover:scale-[1.02]")}>
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-3 rounded-xl", platform.bg)}>
                <platform.icon className={cn("w-6 h-6", platform.color)} />
              </div>
              <div className={cn("px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest", 
                platform.status === 'Ready' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
              )}>
                {platform.status}
              </div>
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">{platform.name}</h4>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Snippets and metadata optimized for {platform.name} discovery.</p>
            
            <Button variant="ghost" className="w-full mt-6 h-10 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-[9px] font-black uppercase tracking-widest gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Sync Snippet
            </Button>
          </Card>
        ))}
      </div>

      <Card className="bg-[#050505]/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
          <Share2 className="w-8 h-8 text-zinc-700" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-black text-white uppercase tracking-widest">Global Sync Engaged</h4>
          <p className="text-[10px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
            All distribution channels are synchronized with the current production DNA. Snippets will update automatically upon script regeneration.
          </p>
        </div>
      </Card>
    </div>
  );
};


