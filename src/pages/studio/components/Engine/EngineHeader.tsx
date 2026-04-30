import React from 'react';
import { Settings, Cpu, ChevronRight, ChevronLeft, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EngineHeaderProps {
  session: string;
  episode: string;
  onNext?: () => void;
  onPrev?: () => void;
  isGenerating?: boolean;
}

export const EngineHeader: React.FC<EngineHeaderProps> = ({
  session,
  episode,
  onNext,
  onPrev,
  isGenerating = false
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
              <Cpu className="w-7 h-7 text-studio relative z-10 animate-pulse-slow" />
              <div className="absolute inset-0 border-2 border-studio/50 rounded-2xl animate-ping opacity-20" />
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-white italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400">
                Engine Architect
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Settings className="w-3.5 h-3.5 text-studio/40 shrink-0" />
              <p className="text-[8px] md:text-[9px] font-black text-studio/40 uppercase tracking-[0.2em] md:tracking-[0.4em]">S{session} // EP{episode} // Neural Core V5.1 // Production_Active</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
          {onPrev && (
            <Button 
              variant="outline" 
              className="relative w-full sm:w-auto h-11 px-6 bg-black/60 border-zinc-800 text-zinc-400 hover:text-studio hover:border-studio/30 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all duration-300 backdrop-blur-md overflow-hidden group/back"
              onClick={onPrev}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform" />
              PREVIOUS: SCREENING
            </Button>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="relative w-full sm:w-auto h-11 px-6 bg-black/60 border-zinc-800 text-zinc-400 hover:text-studio hover:border-studio/30 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all duration-300 backdrop-blur-md overflow-hidden group/btn"
              onClick={() => {}} // Placeholder for engine actions
              disabled={isGenerating}
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2 text-studio group-hover/btn:scale-110 transition-transform" />}
              LAUNCH NEURAL CORE
            </Button>

            <Button 
              className="relative w-full sm:w-auto h-11 px-8 rounded-2xl bg-black/60 border-zinc-800 text-zinc-400 hover:text-studio hover:border-studio/30 font-black uppercase tracking-widest text-[10px] transition-all duration-300 backdrop-blur-md overflow-hidden group/next"
              onClick={onNext}
            >
              <span className="relative z-10 flex items-center gap-2">
                DISTRIBUTION <ChevronRight className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/10 to-transparent -translate-x-full group-hover/next:translate-x-full transition-transform duration-1000" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
