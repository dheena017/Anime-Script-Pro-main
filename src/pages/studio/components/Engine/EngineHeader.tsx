import React from 'react';
import { Settings, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EngineHeaderProps {
  session: string;
  episode: string;
  onNext?: () => void;
  onPrev?: () => void;
}

export const EngineHeader: React.FC<EngineHeaderProps> = ({
  session,
  episode,
  onNext,
  onPrev
}) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-studio/20 via-fuchsia-500/10 to-studio/20 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

      <div className="relative flex flex-col md:flex-row items-center justify-between p-6 bg-[#050505]/80 backdrop-blur-3xl border border-studio/20 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none animate-scanline" />
        
        <div className="flex items-center gap-8 z-10 w-full md:w-auto">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-studio/10 border border-studio/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] group/icon overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-studio/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
              <Cpu className="w-7 h-7 text-studio relative z-10 animate-pulse-slow" />
              <div className="absolute inset-0 border-2 border-studio/50 rounded-2xl animate-ping opacity-20" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
                Production Engine
              </h1>
              <div className="px-2 py-0.5 rounded-full bg-studio/10 border border-studio/20 flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-studio shadow-[0_0_8px_#06b6d4] animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-studio/80">
                  Ready
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Settings className="w-3 h-3 text-studio/40" />
              <p className="text-[9px] font-black text-studio/40 uppercase tracking-[0.4em]">S{session} // EP{episode} // Neural_Core_v5.1</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6 md:mt-0 z-10 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-3">
            {onPrev && (
              <Button 
                variant="outline" 
                className="h-11 px-6 bg-white/5 border-white/10 text-zinc-400 hover:text-studio hover:border-studio/30 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all"
                onClick={onPrev}
              >
                Back to Screening
              </Button>
            )}

            {onNext && (
              <Button 
                className="relative h-11 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-2xl gap-3 overflow-hidden group/next border-none bg-studio text-black hover:bg-white hover:text-black"
                onClick={onNext}
              >
                Next Stage
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
