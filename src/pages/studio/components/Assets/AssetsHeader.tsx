import React from 'react';
import { Package, RefreshCw, ChevronRight, Sparkles, Box, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AssetsHeaderProps {
  onRegenerate: () => void;
  isGenerating: boolean;
  onNext: () => void;
  session: string;
  episode: string;
  isLiked?: boolean;
  setIsLiked?: (liked: boolean) => void;
}

export const AssetsHeader: React.FC<AssetsHeaderProps> = ({
  onRegenerate,
  isGenerating,
  onNext,
  session,
  episode,
  isLiked,
  setIsLiked
}) => {
  return (
    <div className="flex items-center justify-between p-6 bg-[#0a0a0a]/80 backdrop-blur-xl border border-zinc-800 rounded-3xl mb-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-studio/10 border border-studio/20 flex items-center justify-center shadow-studio">
            <Package className="w-6 h-6 text-studio" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest text-white italic leading-none">Asset Laboratory</h1>
            <p className="text-[9px] font-black text-studio/60 uppercase tracking-[0.3em] mt-1">Multi-Format Synthesis Protocol</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 border-l border-zinc-800 pl-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-studio/5 border border-zinc-800 rounded-lg">
            <Box className="w-3 h-3 text-studio/50" />
            <span className="text-[9px] font-black text-studio/60 uppercase tracking-tighter">Unit</span>
            <span className="text-xs font-black text-white font-mono">S{session}-E{episode}</span>
          </div>
          {setIsLiked && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-xl transition-all duration-300",
                isLiked ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-zinc-600 border-white/5 bg-white/5 hover:text-red-400"
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          className="bg-black/40 border-zinc-800 text-zinc-400 hover:text-studio hover:border-studio/30 font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl transition-all"
          onClick={onRegenerate}
          disabled={isGenerating}
        >
          {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
          Synthesize All Assets
        </Button>
        <Button 
          className="bg-studio/10 hover:bg-studio text-studio hover:text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl border border-studio/30 transition-all shadow-studio/20"
          onClick={onNext}
        >
          Next Module <ChevronRight className="w-3 h-3 ml-2" />
        </Button>
      </div>
    </div>
  );
};
