import React from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { MapPin, Users, Heart, Target } from 'lucide-react';

export const PlanningGuide: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <Card className="bg-[#0c0d11]/50 backdrop-blur-3xl border-white/5 p-10 relative overflow-hidden rounded-[3rem]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-studio/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4 uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          <div className="w-12 h-[2px] bg-gradient-to-r from-studio to-transparent rounded-full" />
          Strategic Directive
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4 group/item">
            <div className="flex items-center gap-3 text-studio font-black tracking-[0.3em] uppercase text-[10px] group-hover:scale-105 transition-transform duration-500">
              <div className="p-2 bg-studio/10 rounded-xl border border-studio/20 group-hover:border-studio/40 transition-colors">
                <MapPin className="w-4 h-4 text-studio" />
              </div>
              Atmosphere
            </div>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-loose pl-1">
              Define the environment, time of day, and atmosphere. How does the location reflect the scene's tone?
            </p>
          </div>
          <div className="space-y-4 group/item">
            <div className="flex items-center gap-3 text-blue-400 font-black tracking-[0.3em] uppercase text-[10px] group-hover:scale-105 transition-transform duration-500">
              <div className="p-2 bg-blue-400/10 rounded-xl border border-blue-400/20 group-hover:border-blue-400/40 transition-colors">
                <Users className="w-4 h-4" />
              </div>
              Manifest
            </div>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-loose pl-1">
              Who is present? What are their current states, motivations, and power dynamics in this specific moment?
            </p>
          </div>
          <div className="space-y-4 group/item">
            <div className="flex items-center gap-3 text-fuchsia-400 font-black tracking-[0.3em] uppercase text-[10px] group-hover:scale-105 transition-transform duration-500">
              <div className="p-2 bg-fuchsia-400/10 rounded-xl border border-fuchsia-400/20 group-hover:border-fuchsia-400/40 transition-colors">
                <Heart className="w-4 h-4" />
              </div>
              Resonance
            </div>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-loose pl-1">
              Establish the emotional tone. Is it tense, melancholic, or mysterious? Use lighting to convey this.
            </p>
          </div>
          <div className="space-y-4 group/item">
            <div className="flex items-center gap-3 text-emerald-400 font-black tracking-[0.3em] uppercase text-[10px] group-hover:scale-105 transition-transform duration-500">
              <div className="p-2 bg-emerald-400/10 rounded-xl border border-emerald-400/20 group-hover:border-emerald-400/40 transition-colors">
                <Target className="w-4 h-4" />
              </div>
              Objective
            </div>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-loose pl-1">
              What changes by the end? Note any information revealed, character growth, or plot advancement.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
