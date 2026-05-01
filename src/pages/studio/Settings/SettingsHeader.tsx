import React from 'react';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 mb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            System <span className="text-zinc-500">Configuration</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">
            Environment Tuning & Neural Personalization
          </p>
        </div>
      </motion.div>
    </div>
  );
};


