import React from 'react';
import { motion } from 'motion/react';
import { Activity, Trash2, Camera, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ArchitectureCardProps {
  idx: number;
  beat: any;
  isActive: boolean;
  onActive: () => void;
  onGenerateScene: () => void;
  onDelete: () => void;
  isRefining: boolean;
  refinementPrompt: string;
  setRefinementPrompt: (val: string) => void;
  onApplyRefinement: () => void;
  onUpdate: (updates: any) => void;
}

export const ArchitectureCard: React.FC<ArchitectureCardProps> = ({
  idx,
  beat,
  isActive,
  onActive,
  onGenerateScene,
  onDelete,
  isRefining,
  refinementPrompt,
  setRefinementPrompt,
  onApplyRefinement,
  onUpdate
}) => {
  const [isEditingManual, setIsEditingManual] = React.useState(false);

  return (
    <Card 
      onClick={onActive}
      className={cn(
        "relative overflow-hidden transition-all duration-500 border border-zinc-900 group/beat",
        isActive ? "bg-[#0a0a0a] border-studio/40 ring-1 ring-studio/10 shadow-studio/20 scale-[1.01]" : "bg-[#050505]/40 hover:bg-[#070707] border-transparent"
      )}
    >
      <div className="flex flex-col md:flex-row p-8 gap-8">
         <div className="flex flex-col items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-[13px] font-black transition-all border shadow-lg",
              isActive ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "bg-zinc-900/50 text-zinc-600 border-zinc-800"
            )}>
              0{idx+1}
            </div>
            <div className={cn("w-[2px] flex-1 bg-gradient-to-b from-zinc-800 to-transparent min-h-[50px] transition-all", isActive && "from-cyan-500/50")} />
         </div>

         <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="space-y-1.5 flex-1">
                  {isEditingManual ? (
                    <input 
                      className="w-full bg-black/60 border border-studio/20 rounded-xl px-4 py-2 text-sm text-white font-black uppercase tracking-wider focus:border-studio/50 focus:outline-none transition-all"
                      value={beat.label}
                      onChange={(e) => onUpdate({ label: e.target.value })}
                    />
                  ) : (
                    <h5 className="text-base font-black uppercase tracking-widest text-zinc-50 group-hover/beat:text-cyan-400 transition-colors">{beat.label}</h5>
                  )}
                  <div className="flex items-center gap-3">
                     <span className="text-[11px] text-zinc-500 uppercase font-black tracking-[0.3em] italic">{beat.duration}</span>
                     <div className="w-1 h-1 rounded-full bg-zinc-800" />
                     <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Intensity {beat.intensity}/10</span>
                     </div>
                  </div>
               </div>
               <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className={cn(
                      "font-black uppercase tracking-[0.2em] text-[9px] h-10 px-6 rounded-xl border transition-all",
                      isEditingManual ? "bg-studio text-black border-studio" : "bg-black/40 border-zinc-800 text-zinc-500 hover:text-studio hover:border-studio/30"
                    )}
                    onClick={(e) => { e.stopPropagation(); setIsEditingManual(!isEditingManual); }}
                  >
                    {isEditingManual ? "Save" : "Custom Edit"}
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-studio/10 hover:bg-studio text-studio hover:text-black font-black uppercase tracking-[0.2em] text-[9px] h-10 px-6 rounded-xl border border-studio/30 transition-all shadow-studio/20"
                    onClick={onGenerateScene}
                  >
                     Generate Scene
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-10 w-10 rounded-2xl text-zinc-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  >
                     <Trash2 className="w-4 h-4" />
                  </Button>
               </div>
            </div>

            {isRefining && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 bg-orange-500/5 p-4 rounded-2xl border border-orange-500/20"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-[9px] font-black uppercase tracking-widest text-orange-400">Refinement Matrix</p>
                <div className="flex gap-2">
                  <input 
                    className="flex-1 bg-black/60 border border-orange-500/30 rounded-xl px-4 py-2 text-xs text-orange-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                    placeholder="Specify refinement constraints (tone, pacing, detail level)..."
                    value={refinementPrompt}
                    onChange={(e) => setRefinementPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onApplyRefinement()}
                  />
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-500 text-white font-black"
                    onClick={onApplyRefinement}
                  >
                    Apply
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="relative">
              {isEditingManual ? (
                <textarea 
                  className="w-full bg-black/60 border border-studio/20 rounded-2xl p-6 text-[13px] text-zinc-300 leading-relaxed font-medium focus:border-studio/50 focus:outline-none transition-all min-h-[100px] resize-none"
                  value={beat.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                />
              ) : (
                <p className="text-[13px] text-zinc-400 leading-relaxed font-medium italic border-l-2 border-cyan-500/10 pl-6 py-1">"{beat.description}"</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-studio/5">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shrink-0 shadow-lg">
                     <Camera className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div>
                     <p className="text-[9px] font-black uppercase tracking-[0.25em] text-fuchsia-500/60 mb-1.5">Visual Aesthetic</p>
                     <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wide truncate max-w-[250px]">{beat.vfx || 'High Contrast Noir Style'}</p>
                  </div>
               </div>
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 shadow-lg">
                      <Volume2 className="w-5 h-5 text-orange-400" />
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-500/60">Acoustic Logic</p>
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">{beat.tone || 'Dynamic'}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wide truncate">{beat.music || beat.audio || 'Atmospheric BGM'}</p>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </Card>
  );
};
