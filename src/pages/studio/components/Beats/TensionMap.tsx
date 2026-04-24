import React from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface TensionMapProps {
  currentBeats: any[];
  activeBeatIndex: number | null;
  setActiveBeatIndex: (index: number) => void;
}

export const TensionMap: React.FC<TensionMapProps> = ({
  currentBeats,
  activeBeatIndex,
  setActiveBeatIndex
}) => {
  const generateWavePath = (beats: any[]) => {
    if (!beats || beats.length === 0) return "";
    const points = beats.map((b: any, i: number) => {
      const x = (i / (beats.length - 1)) * 100;
      const y = 100 - (b.intensity || 5) * 10;
      return `${x},${y}`;
    });
    return `M 0,100 ` + points.map((p: string) => {
      const [x, y] = p.split(',');
      return `L ${x} ${y}`;
    }).join(' ') + ` L 100,100 Z`;
  };

  return (
    <Card className="bg-[#050505]/50 border-zinc-800 p-10 overflow-hidden relative group rounded-[2.5rem] shadow-2xl">
       <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
       <div className="relative z-10 space-y-12">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase tracking-[0.2em] text-zinc-100">Global Tension Map</h4>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em]">Simulated High-Retention Engagement Wave</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Emotional Peak</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-studio shadow-studio" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pacing Flow</span>
              </div>
            </div>
          </div>

          <div className="h-[250px] w-full relative px-6">
             <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--studio-primary)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--studio-primary)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--studio-primary)" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="var(--studio-primary)" />
                  </linearGradient>
                </defs>
                <path
                  d={generateWavePath(currentBeats)}
                  fill="url(#waveGradient)"
                  className="transition-all duration-1000 ease-in-out"
                />
                <path
                  d={generateWavePath(currentBeats).replace(/ L \d+,\d+ Z$/, "")}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-in-out"
                />
                
                {currentBeats.map((b: any, i: number) => {
                  const x = (i / (currentBeats.length - 1)) * 100;
                  const y = 100 - (b.intensity || 5) * 10;
                  return (
                    <g key={i} className="group/dot cursor-pointer" onClick={() => setActiveBeatIndex(i)}>
                      <circle 
                        cx={`${x}%`} 
                        cy={`${y}%`} 
                        r="8" 
                        fill="#000" 
                        stroke={activeBeatIndex === i ? "var(--studio-primary)" : "#f97316"} 
                        strokeWidth="3" 
                        className={cn("transition-all group-hover/dot:scale-150 shadow-2xl", activeBeatIndex === i && "shadow-studio")}
                      />
                      <text 
                        x={`${x}%`} 
                        y={`${y - 20}%`} 
                        textAnchor="middle" 
                        className="text-[10px] font-black fill-studio opacity-0 group-hover/dot:opacity-100 transition-opacity uppercase tracking-widest drop-shadow-md"
                      >
                        {b.label}
                      </text>
                    </g>
                  );
                })}
             </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-10">
             {currentBeats.map((beat: any, idx: number) => (
               <div 
                key={idx} 
                onClick={() => setActiveBeatIndex(idx)}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer group/card relative overflow-hidden",
                  activeBeatIndex === idx ? "bg-cyan-500/5 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)]" : "bg-black/40 border-zinc-900 hover:border-zinc-800"
                )}
               >
                 <div className="flex items-center justify-between mb-3 relative z-10">
                   <span className={cn("text-[10px] font-black uppercase tracking-widest", activeBeatIndex === idx ? "text-cyan-400" : "text-zinc-600")}>Phase 0{idx+1}</span>
                   <span className="text-[9px] font-mono text-zinc-700 font-bold">{beat.duration}</span>
                 </div>
                 <h5 className="text-[12px] font-black uppercase tracking-wide text-zinc-300 group-hover/card:text-studio/90 transition-colors truncate relative z-10">{beat.label}</h5>
                 <div className={cn("absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-500", activeBeatIndex === idx ? "w-full opacity-100" : "w-0 opacity-0")} style={{ width: `${beat.intensity * 10}%` }} />
               </div>
             ))}
          </div>
       </div>
    </Card>
  );
};
