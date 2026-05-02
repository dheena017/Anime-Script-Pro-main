import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, ShieldCheck } from 'lucide-react';

export const WorldSystems: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <Cpu className="w-3 h-3 text-cyan-500" />
            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em]">Mechanical Logic</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            WORLD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-500 to-cyan-400">DYNAMICS</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: 'Power System', desc: 'Neural-Arcana: The ability to manipulate digital ether through cognitive overloading.', icon: Zap, color: 'text-amber-400' },
          { title: 'Economy', desc: 'Credits & Karma: A dual-currency system based on financial wealth and social contribution.', icon: Activity, color: 'text-blue-400' },
          { title: 'Governance', desc: 'Algorithm Sovereignty: State-level decisions made by an un-biased planetary AI core.', icon: ShieldCheck, color: 'text-emerald-400' },
          { title: 'Social Strata', desc: 'The Indexed vs The Ghost: Those within the neural net versus those who live outside it.', icon: Cpu, color: 'text-cyan-400' },
        ].map((sys, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 bg-[#050505] border border-white/5 rounded-[2.5rem] space-y-6 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[60px] pointer-events-none" />
            <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center ${sys.color}`}>
              <sys.icon className="w-7 h-7" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-white uppercase tracking-widest">{sys.title}</h3>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed">{sys.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};



