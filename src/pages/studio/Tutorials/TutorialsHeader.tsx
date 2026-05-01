import React from 'react';
import { GraduationCap, Trophy, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export const TutorialsHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 mb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
          <GraduationCap className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Architect <span className="text-amber-500">Academy</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">
            Master Neural Scripting & Cinematic Production Protocols
          </p>
        </div>
      </motion.div>
      
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-3 h-3 text-amber-500/50" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Certificates Earned: 12</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <BookOpen className="w-3 h-3 text-zinc-600" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">48 Lessons Available</span>
        </div>
      </div>
    </div>
  );
};


