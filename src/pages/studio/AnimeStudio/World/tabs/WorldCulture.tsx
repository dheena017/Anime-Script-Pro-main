import React from 'react';
import { motion } from 'motion/react';
import { Users, Music, Utensils, Heart } from 'lucide-react';

export const WorldCulture: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
            <Users className="w-3 h-3 text-rose-500" />
            <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em]">Societal Pulse</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            CULTURAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-500 to-rose-400">ETHOS</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Traditions', val: 'Neo-Matsuri', icon: Heart, color: 'text-rose-400' },
          { label: 'Cuisine', val: 'Synthetic Soul', icon: Utensils, color: 'text-orange-400' },
          { label: 'Arts', val: 'Holographic Echo', icon: Music, color: 'text-fuchsia-400' },
          { label: 'Identity', val: 'Neural Nomad', icon: Users, color: 'text-blue-400' },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-zinc-950/50 border border-white/5 rounded-3xl flex flex-col items-center text-center space-y-6 hover:bg-white/[0.02] transition-colors"
          >
            <div className={`w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center ${item.color}`}>
              <item.icon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">{item.label}</span>
              <p className="text-xl font-black text-white uppercase tracking-tighter">{item.val}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-10 bg-[#050505] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute inset-0 bg-rose-500/5 blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            <Heart className="w-5 h-5 text-rose-500" />
            Societal Core
          </h3>
          <p className="text-zinc-400 font-medium leading-relaxed max-w-3xl">
            The culture is defined by a paradoxical mix of ancient ancestor worship and cutting-edge neural integration. Technology is seen as a bridge to the spiritual realm, leading to a society that is both deeply traditional and radically futuristic.
          </p>
        </div>
      </div>
    </div>
  );
};
