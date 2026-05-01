import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Cpu, Sparkles } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';

export const EngineCalibration: React.FC = () => {
  const { 
    temperature = 0.85, setTemperature,
    maxTokens = 2048, setMaxTokens,
    topP = 0.95, setTopP,
    topK = 40, setTopK
  } = useGenerator();

  const parameters = [
    { 
      id: 'temp', 
      label: 'Creativity Temperature', 
      value: temperature, 
      min: 0, 
      max: 1.5, 
      step: 0.05,
      desc: 'Controls randomness: Higher values = More creative, Lower = More stable.',
      icon: Zap,
      color: 'text-amber-400'
    },
    { 
      id: 'tokens', 
      label: 'Neural Buffer (Max Tokens)', 
      value: maxTokens, 
      min: 256, 
      max: 8192, 
      step: 256,
      desc: 'Sets output length limit. Higher values allow longer scripts.',
      icon: Cpu,
      color: 'text-blue-400'
    },
    { 
      id: 'topP', 
      label: 'Nucleus Sampling (Top-P)', 
      value: topP, 
      min: 0, 
      max: 1, 
      step: 0.01,
      desc: 'Filters the cumulative probability of top tokens. Refines focus.',
      icon: Target,
      color: 'text-fuchsia-400'
    },
    { 
      id: 'topK', 
      label: 'Token Diversity (Top-K)', 
      value: topK, 
      min: 1, 
      max: 100, 
      step: 1,
      desc: 'Limits the AI to the top K most likely words. Coherence booster.',
      icon: Sparkles,
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">Neural Calibration</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            ENGINE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400">PARAMETERS</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-10">
          {parameters.map((param) => (
            <div key={param.id} className="space-y-6 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all group-hover:border-amber-500/30", param.color)}>
                    <param.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">{param.label}</h4>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 italic">{param.desc}</p>
                  </div>
                </div>
                <div className="text-xl font-black text-white font-mono bg-white/[0.02] px-4 py-2 rounded-xl border border-white/5">
                  {param.value}
                </div>
              </div>
              
              <div className="relative pt-2">
                <input 
                  type="range" 
                  min={param.min} 
                  max={param.max} 
                  step={param.step}
                  value={param.value}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (param.id === 'temp') setTemperature?.(val);
                    if (param.id === 'tokens') setMaxTokens?.(val);
                    if (param.id === 'topP') setTopP?.(val);
                    if (param.id === 'topK') setTopK?.(val);
                  }}
                  className="w-full h-1.5 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between mt-3 text-[8px] font-black text-zinc-600 uppercase tracking-widest px-1">
                  <span>MIN: {param.min}</span>
                  <span>MAX: {param.max}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="p-8 bg-zinc-950/50 border border-white/5 rounded-3xl space-y-6">
            <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-3">
              <Target className="w-4 h-4 text-amber-500" />
              Optimization Strategy
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  setTemperature?.(0.85);
                  setTopP?.(0.95);
                  setTopK?.(40);
                }}
                className={cn(
                  "p-4 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all hover:scale-[1.02]",
                  temperature === 0.85 ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]" : "bg-white/5 text-zinc-400 border border-white/5"
                )}
              >
                Balanced Mode
              </button>
              <button 
                onClick={() => {
                  setTemperature?.(1.15);
                  setTopP?.(0.98);
                  setTopK?.(60);
                }}
                className={cn(
                  "p-4 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all hover:scale-[1.02]",
                  temperature === 1.15 ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]" : "bg-white/5 text-zinc-400 border border-white/5"
                )}
              >
                Creative Overdrive
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-10 bg-black/40 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px] pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Calibration Status</h3>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Active Neural Profile</span>
                <p className="text-xs font-black text-amber-400 uppercase mt-1">High-Fidelity Anime Synthesis</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                  <span>Sync Stability</span>
                  <span className="text-amber-500">98.2%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '98.2%' }}
                    className="h-full bg-amber-500"
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              <p className="text-[10px] text-zinc-500 leading-relaxed italic uppercase font-bold border-t border-white/5 pt-6">
                * Note: Changes to calibration parameters take effect on the next generation cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


