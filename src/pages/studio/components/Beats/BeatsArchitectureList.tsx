import React from 'react';
import { Layers, Zap, Wand2, Volume2, Cloud } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArchitectureCard } from './ArchitectureCard';

interface BeatsArchitectureListProps {
  currentBeats: any[];
  activeBeatIndex: number | null;
  setActiveBeatIndex: (index: number | null) => void;
  onReset: () => void;
  onApplySchema: () => void;
  onGenerateScene: (index: number) => void;
  onDeleteBeat: (index: number) => void;
  isRefining: number | null;
  refinementPrompt: string;
  setRefinementPrompt: (val: string) => void;
  onApplyRefinement: (index: number) => void;
  onUpdateBeat: (index: number, updates: any) => void;
  onNavigateToScript: () => void;
}

export const BeatsArchitectureList: React.FC<BeatsArchitectureListProps> = ({
  currentBeats,
  activeBeatIndex,
  setActiveBeatIndex,
  onReset,
  onApplySchema,
  onGenerateScene,
  onDeleteBeat,
  isRefining,
  refinementPrompt,
  setRefinementPrompt,
  onApplyRefinement,
  onUpdateBeat,
  onNavigateToScript
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-6">
         <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
               <Layers className="w-6 h-6 text-studio" />
               <h4 className="text-lg font-black uppercase tracking-[0.25em] text-zinc-50 text-shadow-studio">Component Architecture</h4>
            </div>
            <div className="flex gap-4">
              <Button
                size="sm"
                variant="outline"
                className="bg-[#050505] border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-orange-400 hover:border-orange-500/30 transition-all h-10 px-6 rounded-xl"
                onClick={onReset}
              >
                Reset Matrix
              </Button>
              <Button
                size="sm"
                className="bg-studio hover:bg-studio/80 text-white font-black uppercase tracking-widest text-xs h-10 px-8 rounded-xl shadow-studio active:scale-95 transition-all"
                onClick={onApplySchema}
              >
                <Zap className="w-4 h-4 mr-2" />
                Apply Schema
              </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6">
            {currentBeats.map((beat, idx) => (
              <ArchitectureCard
                key={idx}
                idx={idx}
                beat={beat}
                isActive={activeBeatIndex === idx}
                onActive={() => setActiveBeatIndex(idx)}
                onGenerateScene={() => onGenerateScene(idx)}
                onDelete={() => onDeleteBeat(idx)}
                isRefining={isRefining === idx}
                refinementPrompt={refinementPrompt}
                setRefinementPrompt={setRefinementPrompt}
                onApplyRefinement={() => onApplyRefinement(idx)}
                onUpdate={(updates: any) => onUpdateBeat(idx, updates)}
              />
            ))}
         </div>
      </div>

      <div className="space-y-8">
         <div className="p-8 rounded-[2.5rem] bg-[#050505]/80 border border-zinc-800/50 space-y-8 shadow-2xl relative overflow-hidden group/panel">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-studio/10 blur-[100px] rounded-full pointer-events-none group-hover/panel:bg-orange-500/10 transition-colors duration-1000" />
            
            <div className="space-y-3">
               <h5 className="text-[11px] font-black uppercase tracking-[0.25em] text-studio flex items-center gap-3">
                  <Wand2 className="w-5 h-5" /> Visual Intelligence
               </h5>
               <div className="p-5 rounded-2xl bg-black/60 border border-studio/10 text-[11px] text-zinc-500 leading-relaxed font-mono shadow-inner group-hover/panel:border-studio/30 transition-all">
                  {activeBeatIndex != null ? (
                     `Anime Cinematics, ${currentBeats[activeBeatIndex].label}, direction by Master Architect, ${currentBeats[activeBeatIndex].vfx}, intensity scale ${currentBeats[activeBeatIndex].intensity}, 8k ultra-noir, atmospheric fog --niji 6 --ar 21:9`
                  ) : (
                     "Select an architectural segment to generate a neural prompt..."
                  )}
               </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-zinc-900">
               <h5 className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-400 flex items-center gap-3">
                  <Volume2 className="w-5 h-5" /> Audio Engineering
               </h5>
               <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 group-hover/panel:border-orange-500/30 transition-all">
                  <p className="text-[11px] text-orange-100/60 font-black uppercase tracking-[0.15em] leading-relaxed italic">
                     {activeBeatIndex != null ? (
                        `Recommended frequency: ${currentBeats[activeBeatIndex].intensity * 12 + 70} BPM pulse. Dynamic filter on ${currentBeats[activeBeatIndex].audio}. Pacing: ${currentBeats[activeBeatIndex].duration}.`
                     ) : (
                        "Selecting a segment reveals acoustic theory data..."
                     )}
                  </p>
               </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-900">
               <Button 
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.3em] text-[11px] h-14 rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.2)] active:scale-95 transition-all"
                  onClick={onNavigateToScript}
               >
                  Neural Synthesis: All Scenes
               </Button>
               <Button 
                  className="w-full bg-studio hover:bg-studio/80 text-white font-black uppercase tracking-[0.3em] text-[11px] h-14 rounded-2xl shadow-studio active:scale-95 transition-all"
                  onClick={onApplySchema}
               >
                  Deploy Schema to Production
               </Button>
            </div>
         </div>

         <Card className="border-dashed border-zinc-800 bg-transparent flex flex-col items-center justify-center p-10 space-y-6 group hover:border-fuchsia-500/30 transition-all rounded-[2rem]">
            <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 group-hover:border-fuchsia-500/30 transition-all shadow-xl">
              <Cloud className="w-8 h-8 text-zinc-700 group-hover:text-fuchsia-400 transition-all" />
            </div>
            <div className="text-center space-y-2">
               <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-fuchsia-300">Neural Archive Node</p>
               <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest italic leading-relaxed">Persist your logical variations to the neural cloud.</p>
            </div>
         </Card>
      </div>
    </div>
  );
};
