import React from 'react';
import { RefreshCw, Zap, Monitor, Cpu, ChevronRight } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { cn } from '@/lib/utils';

interface ScreeningHeaderProps {
  activeSession?: number;
  setActiveSession?: (session: number) => void;
  isRendering?: boolean;
  onRender?: () => void;
  hasScript?: boolean;
  session: string;
  episode: string;
  onPrev?: () => void;
  onNext?: () => void;
  isLiked?: boolean;
  setIsLiked?: (liked: boolean) => void;
}

export const ScreeningHeader: React.FC<ScreeningHeaderProps> = ({
  activeSession = 1,
  setActiveSession = () => {},
  isRendering = false,
  onRender = () => {},
  hasScript = true,
  session,
  episode,
  onPrev,
  onNext
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
              <Monitor className="w-7 h-7 text-studio relative z-10 animate-pulse-slow" />
              <div className="absolute inset-0 border-2 border-studio/50 rounded-2xl animate-ping opacity-20" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400">
                Screening Architect
              </h1>
              <div className="px-2.5 py-1 rounded-full bg-studio/20 border border-studio/30 flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", isRendering ? "bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" : "bg-studio shadow-[0_0_8px_#06b6d4]")} />
                <span className="text-[9px] font-black uppercase tracking-widest text-studio">
                  {isRendering ? 'RENDERING' : 'RENDER_READY'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Cpu className="w-3.5 h-3.5 text-studio/40" />
              <p className="text-[9px] font-black text-studio/40 uppercase tracking-[0.4em]">S{session} // EP{episode} // Neural Synthesis Engine V2.1</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 mt-6 md:mt-0 z-10 w-full md:w-auto justify-between md:justify-end">
          {onPrev && (
            <Button 
              variant="outline" 
              className="h-11 px-6 bg-white/5 border-white/10 text-zinc-500 hover:text-studio hover:border-studio/30 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all group/back"
              onClick={onPrev}
            >
              PREVIOUS: PROMPTS
            </Button>
          )}

          {/* Session Navigation */}
          <div className="flex bg-black/40 border border-white/5 p-1 rounded-2xl backdrop-blur-xl">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setActiveSession(s)}
                className={cn(
                  "relative h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                  activeSession === s 
                    ? "text-black bg-studio shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                    : "text-zinc-500 hover:text-studio/80 hover:bg-studio/5"
                )}
              >
                S{s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="relative h-11 px-6 bg-black/60 border-zinc-800 text-zinc-400 hover:text-studio hover:border-studio/30 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all duration-300 backdrop-blur-md overflow-hidden group/btn"
              onClick={onRender}
              disabled={isRendering || !hasScript}
            >
              {isRendering ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2 text-studio group-hover/btn:scale-110 transition-transform" />}
              INITIATE RENDER
            </Button>

            <Button 
              className={cn(
                "relative h-11 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-2xl gap-3 overflow-hidden group/next border",
                "bg-studio/10 hover:bg-studio text-studio hover:text-black border-studio/40 hover:border-studio shadow-studio/20"
              )}
              onClick={onNext}
            >
              <span className="relative z-10 flex items-center gap-2">
                NEXT: ENGINE <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/next:translate-x-full transition-transform duration-1000" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

