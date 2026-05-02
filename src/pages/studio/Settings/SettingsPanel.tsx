import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import { AIModelsTab } from './tabs/AIModelsTab';
import { SecurityTab } from './tabs/SecurityTab';

interface SettingsPanelProps {
  activeTab: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ activeTab }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-[#050505]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 min-h-[500px]"
      >
        {activeTab === 'general' && (
          <div className="space-y-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic mb-8">Environmental Tuning</h3>
            
            <div className="space-y-6">
              {[
                { label: "Hardware Acceleration", desc: "Enable GPU processing for faster neural synthesis.", default: true },
                { label: "Predictive Scripting", desc: "AI-assisted script completion based on context.", default: true },
                { label: "Auto-Sync Archives", desc: "Automatically backup projects to the neural cloud.", default: true },
                { label: "Cinematic Overlays", desc: "Show real-time visual metadata during generation.", default: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-6 bg-zinc-900/40 border border-white/5 rounded-[2rem] hover:bg-zinc-900/60 transition-all group">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-studio transition-colors">{item.label}</p>
                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed pr-8">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.default} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'models' && <AIModelsTab />}
        {activeTab === 'security' && <SecurityTab />}

        {activeTab !== 'general' && activeTab !== 'models' && activeTab !== 'security' && (
          <div className="flex flex-col items-center justify-center h-full py-20 opacity-30 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">Module Locked</p>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Interface for "{activeTab}" is currently under maintenance.</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};


