import React from 'react';
import { Library, Database, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

export const LibraryHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 mb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 bg-[#bd4a4a]/10 rounded-2xl border border-[#bd4a4a]/20">
          <Library className="w-6 h-6 text-[#bd4a4a]" />
        </div>
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Library <span className="text-[#bd4a4a]">Vault</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">
            Centralized Asset Intelligence & Project Archives
          </p>
        </div>
      </motion.div>
      
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <Database className="w-3 h-3 text-zinc-600" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Local Cache: 1.2 GB</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <Cloud className="w-3 h-3 text-green-500/50" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Cloud Sync Active</span>
        </div>
      </div>
    </div>
  );
};


