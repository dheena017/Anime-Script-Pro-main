import React from 'react';
import { Plus, RefreshCw, Zap, Image as ImageIcon, ChevronRight, Layers, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoryboardHeaderProps {
  isLiked?: boolean;
  setIsLiked?: (liked: boolean) => void;
  isGuideOpen?: boolean;
  setIsGuideOpen?: (open: boolean) => void;
  handleAddScene?: () => void;
  scenesLength: number;
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
  handleFullProductionLoop?: () => void;
  isProductionLoopActive?: boolean;
  productionProgress?: number;
}

export const StoryboardHeader: React.FC<StoryboardHeaderProps> = ({
  handleAddScene,
  scenesLength,
  onRegenerate,
  isGenerating,
  isGeneratingVisuals,
  onNext,
  onPrev,
  session,
  episode,
  handleFullProductionLoop,
  isProductionLoopActive,
  productionProgress = 0
}) => {
  return (
    <div className="space-y-6">
      <div className="relative group">
        {/* Cinematic Ambient Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-studio/20 via-fuchsia-500/10 to-studio/20 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

        <div className="relative flex flex-col lg:flex-row items-center justify-between p-6 bg-[#050505]/80 backdrop-blur-3xl border border-studio/20 rounded-[2rem] shadow-2xl overflow-hidden">
          {/* Background Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none animate-scanline" />
          
          <div className="flex items-center gap-8 z-10 w-full lg:w-auto">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-studio/10 border border-studio/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] group/icon overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-studio/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                <Layers className="w-7 h-7 text-studio relative z-10 animate-pulse-slow" />
                <div className="absolute inset-0 border-2 border-studio/50 rounded-2xl animate-ping opacity-20" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
                  Visual Storyboard
                </h1>
                <div className="px-2 py-0.5 rounded-lg bg-studio/20 text-studio text-[10px] font-black border border-studio/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                  {scenesLength} SCENES
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Wand2 className="w-3 h-3 text-studio/40" />
                <p className="text-[9px] font-black text-studio/40 uppercase tracking-[0.4em]">S{session} // EP{episode} // Asset_Cache_Sync</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 lg:mt-0 z-10 w-full lg:w-auto justify-between lg:justify-end">

            <div className="flex items-center gap-3">
              {onPrev && (
                <Button 
                  variant="ghost" 
                  className="text-zinc-500 hover:text-white font-black uppercase tracking-widest text-[10px] h-11 px-4 rounded-2xl transition-all duration-300 backdrop-blur-md"
                  onClick={onPrev}
                >
                  Back
                </Button>
              )}
              <Button 
                variant="outline" 
                className="bg-black/60 border-zinc-800 text-zinc-400 hover:text-studio hover:border-studio/30 font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-2xl transition-all duration-300 backdrop-blur-md"
                onClick={handleAddScene}
              >
                <Plus className="w-3.5 h-3.5 mr-2" />
                Append Scene
              </Button>

              <Button 
                className={cn(
                  "relative h-11 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-2xl gap-3 overflow-hidden group/btn border",
                  isGenerating 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-600" 
                    : "bg-studio/10 hover:bg-studio text-studio hover:text-black border-studio/40 hover:border-studio shadow-studio/20"
                )}
                onClick={onRegenerate}
                disabled={isGenerating}
              >
                {!isGenerating && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />}
                
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ImageIcon className="w-4 h-4 mr-2" />
                )}
                <span className="relative z-10">Synthesize Frames</span>
              </Button>

              <Button 
                className={cn(
                  "relative h-11 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-2xl gap-3 overflow-hidden group/loop border",
                  isProductionLoopActive 
                    ? "bg-fuchsia-900/50 border-fuchsia-800 text-fuchsia-400" 
                    : "bg-fuchsia-500/10 hover:bg-fuchsia-500 text-fuchsia-500 hover:text-black border-fuchsia-500/40 hover:border-fuchsia-500 shadow-fuchsia-500/20"
                )}
                onClick={handleFullProductionLoop}
                disabled={isProductionLoopActive || isGeneratingVisuals}
              >
                {isProductionLoopActive ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                <span className="relative z-10">Ignite Production Loop</span>
                {isProductionLoopActive && (
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-fuchsia-400 transition-all duration-500" 
                    style={{ width: `${productionProgress}%` }} 
                  />
                )}
              </Button>

              {onNext && (
                <Button 
                  className="h-11 px-6 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/10 transition-all duration-300"
                  onClick={onNext}
                >
                  Next <ChevronRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

