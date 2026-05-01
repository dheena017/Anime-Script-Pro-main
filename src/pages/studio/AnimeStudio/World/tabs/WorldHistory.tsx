import React from 'react';
import { motion } from 'motion/react';
import { History, Hourglass, Landmark, ScrollText } from 'lucide-react';

export const WorldHistory: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full">
            <History className="w-3 h-3 text-fuchsia-500" />
            <span className="text-[9px] font-black text-fuchsia-500 uppercase tracking-[0.2em]">Temporal Archivist</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            CHRONICLED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-500 to-fuchsia-400">ERAS</span>
          </h1>
        </div>
      </div>

      <div className="relative border-l border-white/5 ml-4 pl-12 space-y-16">
        {[
          { era: 'The First Spark', date: '3000 B.E.', desc: 'The discovery of the Etheric core and the dawn of high-fantasy civilizations.', icon: Landmark },
          { era: 'The Great Regression', date: '500 B.E.', desc: 'A global conflict that shattered the old kingdoms and led to the current neon-metropolis age.', icon: ScrollText },
          { era: 'Current Epoch', date: 'Year 0', desc: 'The stabilization of the mega-metropolises and the rise of corporate neural governance.', icon: Hourglass },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="relative"
          >
            <div className="absolute -left-[61px] top-0 w-6 h-6 rounded-full bg-zinc-950 border-2 border-fuchsia-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
            </div>
            <div className="space-y-3 p-8 bg-zinc-950/50 border border-white/5 rounded-3xl group hover:border-fuchsia-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest">{item.date}</span>
                <item.icon className="w-4 h-4 text-zinc-700" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{item.era}</h3>
              <p className="text-sm font-medium text-zinc-400 leading-relaxed max-w-2xl">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


