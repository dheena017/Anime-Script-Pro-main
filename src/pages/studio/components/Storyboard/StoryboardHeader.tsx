import React from 'react';
import { RefreshCw, Image as ImageIcon, ChevronRight, ChevronLeft, Layers, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoryboardHeaderProps {
  isLiked?: boolean;
  setIsLiked?: (liked: boolean) => void;
  isGuideOpen?: boolean;
  setIsGuideOpen?: (open: boolean) => void;
  handleEnhanceAllVisuals?: () => void;
  handleEnhanceAllNarration?: () => void;
  onRegenerate: () => void;
  isGlobalEnhancing?: boolean;
  isGenerating: boolean;
  isGeneratingVisuals?: boolean;
  isEnhancingAllVisuals?: boolean;
  isEnhancingAllNarration?: boolean;
  session: string;
  episode: string;
  onNext?: () => void;
  onPrev?: () => void;
}

export const StoryboardHeader: React.FC<StoryboardHeaderProps> = ({
  onRegenerate,
  isGenerating,
  onNext,
  onPrev,
  session,
  episode,
}) => {
  return (
    <div className="relative group">
      {/* Cinematic Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-studio/20 via-fuchsia-500/10 to-studio/20 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

      <div className="relative flex flex-col lg:flex-row items-center justify-between p-5 md:p-6 bg-[#050505]/80 backdrop-blur-3xl border border-studio/20 rounded-[2rem] shadow-2xl overflow-hidden gap-6 lg:gap-0">
        {/* Background Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none animate-scanline" />
        
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 w-full lg:w-auto">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-studio/10 border border-studio/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] group/icon overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-studio/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
              <Layers className="w-7 h-7 text-studio relative z-10 animate-pulse-slow" />
              <div className="absolute inset-0 border-2 border-studio/50 rounded-2xl animate-ping opacity-20" />
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-white italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400">
                Visual Storyboard
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Cpu className="w-3.5 h-3.5 text-studio/40 shrink-0" />
              <p className="text-[8px] md:text-[9px] font-black text-studio/40 uppercase tracking-[0.2em] md:tracking-[0.4em]">S{session} // EP{episode} // Neural Layout Engine V2.4</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
          {onPrev && (
            <Button 
              variant="outline" 
              className="relative w-full sm:w-auto h-12 px-8 bg-[#050505] border-white/10 text-zinc-400 hover:text-studio hover:border-studio/50 font-black uppercase tracking-widest text-[10px] rounded-full transition-all duration-500 backdrop-blur-xl group/back shadow-2xl"
              onClick={onPrev}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform" />
              PREVIOUS: SCRIPT
            </Button>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="relative w-full sm:w-auto h-12 px-8 bg-[#050505] border-white/10 text-zinc-100 hover:text-studio hover:border-studio/50 font-black uppercase tracking-widest text-[11px] rounded-full transition-all duration-500 backdrop-blur-xl group/btn shadow-2xl"
              onClick={onRegenerate}
              disabled={isGenerating}
            >
              <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-full" />
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-3 text-studio" />
              ) : (
                <ImageIcon className="w-4 h-4 mr-3 text-studio group-hover/btn:scale-110 transition-transform duration-500" />
              )}
              <span className="relative z-10">GENERATE STORYBOARD</span>
            </Button>

            <Button 
              className="relative w-full sm:w-auto h-12 px-10 rounded-full bg-[#050505] border border-white/10 text-zinc-400 hover:text-studio hover:border-studio/50 font-black uppercase tracking-widest text-[10px] transition-all duration-500 backdrop-blur-xl group/next shadow-2xl"
              onClick={onNext}
            >
              <span className="relative z-10 flex items-center gap-2">
                NEXT: SEO <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover/next:opacity-100 transition-opacity duration-500 rounded-full" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

