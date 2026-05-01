import React from 'react';
import { Settings2, Zap, Shield, Flame } from 'lucide-react';

export const SystemsTab: React.FC = () => {
  return (
    <div className="py-12 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Magic System', icon: Zap, color: 'text-emerald-400', value: 'Hard Magic', desc: 'Rules of manifestation and energy conservation.' },
          { label: 'Power Scaling', icon: Shield, color: 'text-blue-400', value: 'Tier 3', desc: 'Relative strength levels and exponential growth paths.' },
          { label: 'Energy Source', icon: Flame, color: 'text-rose-400', value: 'Etheric Core', desc: 'The fundamental substance fueling all metaphysical acts.' }
        ].map((system, i) => (
          <div key={i} className="p-8 bg-[#080808] border border-white/5 rounded-[2rem] space-y-6 hover:border-emerald-500/20 transition-all group">
            <div className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110", system.color)}>
              <system.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{system.label}</span>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">{system.value}</h3>
            </div>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">{system.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
               <Settings2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
               <h4 className="text-sm font-black text-white uppercase tracking-widest">Logic Consistency Check</h4>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Verifying metaphysical laws against world constants</p>
            </div>
         </div>
         <span className="px-6 py-2 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            Verified: 100% Stable
         </span>
      </div>
    </div>
  );
};

// Helper for cn (could also import it)
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}


