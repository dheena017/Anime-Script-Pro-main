import React from 'react';
import { Compass, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const DiscoverHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 mb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
          <Compass className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Discover <span className="text-blue-500">Network</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">
            Global Neural Feed & Community Innovations
          </p>
        </div>
      </motion.div>
      
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-zinc-600" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Nodes Active: 4,208</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-amber-500/50" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">124 New Breakthroughs Today</span>
        </div>
      </div>
    </div>
  );
};


