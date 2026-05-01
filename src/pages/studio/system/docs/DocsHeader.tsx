import React from 'react';
import { FileText, Database, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

export const DocsHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 mb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 bg-zinc-500/10 rounded-2xl border border-zinc-500/20">
          <FileText className="w-6 h-6 text-zinc-400" />
        </div>
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Technical <span className="text-zinc-500">Archives</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">
            System Documentation & Protocol Specifications
          </p>
        </div>
      </motion.div>
      
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <Database className="w-3 h-3 text-zinc-600" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Index Version: 4.2.1</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <Cloud className="w-3 h-3 text-blue-500/50" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Offline Sync Active</span>
        </div>
      </div>
    </div>
  );
};


