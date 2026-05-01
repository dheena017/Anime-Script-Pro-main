import React from 'react';
import { motion } from 'motion/react';
import { Building2, Castle, Ruler, Layers } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';

export const WorldArchitecture: React.FC = () => {
  const { worldLore } = useGenerator();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <Building2 className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">Structural Architect</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            URBAN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400">STRUCTURES</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Settlement Style', icon: Castle, val: 'Gothic-Futurism' },
          { label: 'Building Material', icon: Layers, val: 'Obsidian / Neon' },
          { label: 'Scale Factor', icon: Ruler, val: 'Mega-Metropolis' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-zinc-950/50 border border-white/5 rounded-[2rem] relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[40px] pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 text-amber-400">
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
            <div className="mt-2">
              <span className="text-2xl font-black text-white uppercase tracking-tighter">{stat.val}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-10 bg-[#050505] border border-white/5 rounded-[2.5rem] space-y-8">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-3">
            <Building2 className="w-4 h-4 text-amber-500" />
            Architecture Lore Sync
          </h4>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-400 leading-relaxed italic">
            {worldLore ? "Synthesizing structural blueprints from core world lore..." : "No world lore detected. Generate world lore to see architectural synthesis."}
          </p>
        </div>
      </div>
    </div>
  );
};


