import { Brain, ChevronRight, Sparkles, Heart, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EngineHeaderProps {
  onNext: () => void;
  session: string;
  episode: string;
  isLiked?: boolean;
  setIsLiked?: (liked: boolean) => void;
}

export const EngineHeader: React.FC<EngineHeaderProps> = ({
  onNext,
  session,
  episode,
  isLiked,
  setIsLiked
}) => {
  return (
    <div className="relative group">
      {/* Cinematic Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-studio/20 via-fuchsia-500/10 to-studio/20 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

      <div className="relative flex flex-col md:flex-row items-center justify-between p-6 bg-[#050505]/80 backdrop-blur-3xl border border-studio/20 rounded-[2rem] shadow-2xl overflow-hidden">
        {/* Background Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none animate-scanline" />
        
        <div className="flex items-center gap-8 z-10 w-full md:w-auto">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-studio/10 border border-studio/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] group/icon overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-studio/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
              <Brain className="w-7 h-7 text-studio relative z-10 animate-pulse-slow" />
              <div className="absolute inset-0 border-2 border-studio/50 rounded-2xl animate-ping opacity-20" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
                Creative Engine
              </h1>
              <div className="px-2 py-0.5 rounded-full bg-studio/10 border border-studio/20 flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-studio shadow-[0_0_8px_#06b6d4] animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-studio/80">
                  Engine_Active
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Cpu className="w-3 h-3 text-studio/40" />
              <p className="text-[9px] font-black text-studio/40 uppercase tracking-[0.4em]">Master Orchestration Hub // V4.0 Final_Build</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6 md:mt-0 z-10 w-full md:w-auto justify-between md:justify-end">
          {/* Production Unit Badge */}
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-black/60 border border-zinc-800/50 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-studio/60" />
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter leading-none mb-1">Active Manifest</span>
                <span className="text-xs font-black text-white font-mono tracking-widest uppercase">S{session}-E{episode}</span>
              </div>
            </div>
            
            {setIsLiked && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-xl transition-all duration-500 border border-zinc-800/50",
                  isLiked 
                    ? "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.2)]" 
                    : "text-zinc-600 hover:text-fuchsia-400 hover:bg-fuchsia-500/5 hover:border-fuchsia-500/10"
                )}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={cn("w-4.5 h-4.5 transition-transform duration-300 active:scale-125", isLiked && "fill-current")} />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button 
              className={cn(
                "relative h-11 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-2xl gap-3 overflow-hidden group/next border",
                "bg-studio/10 hover:bg-studio text-studio hover:text-black border-studio/40 hover:border-studio shadow-studio/20"
              )}
              onClick={onNext}
            >
              <span className="relative z-10 flex items-center gap-2">
                Next: Anime World <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/next:translate-x-full transition-transform duration-1000" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
