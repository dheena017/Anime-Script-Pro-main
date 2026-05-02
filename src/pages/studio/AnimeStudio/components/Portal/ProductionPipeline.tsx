import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface Phase {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ProductionPipelineProps {
  phases: Phase[];
  currentStep: number;
}

export const ProductionPipeline = React.memo(({ phases, currentStep }: ProductionPipelineProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {phases.map((phase, idx) => {
        const isActive = currentStep === idx;
        const isDone = currentStep > idx;
        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "p-4 rounded-3xl border transition-all duration-500 flex flex-col items-center text-center gap-2 relative overflow-hidden",
              isActive ? "bg-studio/10 border-studio shadow-studio/20 scale-105 z-10" :
                isDone ? "bg-zinc-900/50 border-studio/20 opacity-60" : "bg-black/20 border-zinc-900 opacity-30"
            )}
          >
            {isActive && <div className="absolute inset-0 bg-studio/5 animate-pulse" />}
            <div className={cn(
              "p-2.5 rounded-xl border transition-all",
              isActive ? "bg-studio text-black border-studio shadow-studio" :
                isDone ? "bg-studio/20 text-studio border-studio/20" : "bg-zinc-950 text-zinc-800 border-zinc-900"
            )}>
              <phase.icon className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className={cn("text-[8px] font-black uppercase tracking-widest", isActive ? "text-studio" : "text-zinc-600")}>
                {isDone ? 'COMPLETE' : isActive ? 'PROCESSING' : `STEP 0${idx + 1}`}
              </p>
              <h4 className="text-[10px] font-black text-white uppercase tracking-tighter line-clamp-1">{phase.label}</h4>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

ProductionPipeline.displayName = 'ProductionPipeline';

