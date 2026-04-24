import React from 'react';
import { useGenerator } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  Target, 
  Skull, 
  MessageSquare, 
  User, 
  Sparkles,
  Search,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CastViewProps {
  isLiked: boolean;
  setIsLiked: (l: boolean) => void;
}

export const CastView: React.FC<CastViewProps> = ({
  isLiked,
  setIsLiked
}) => {
  const { castData, castList, setCastList, isEditing, setIsEditing } = useGenerator();

  // Combine data sources
  const displayCast = castData?.characters || castList || [];

  const handleUpdateCharacter = (index: number, updates: any) => {
    const newList = [...displayCast];
    newList[index] = { ...newList[index], ...updates };
    setCastList(newList);
  };

  return (
    <div className="space-y-12">
      <div className="border-b border-zinc-800/80 pb-12 mb-12 text-center space-y-4 relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="inline-block px-3 py-1 bg-zinc-800/20 border border-zinc-800/50 rounded-full text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            High-Fidelity Cast Specification
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-300",
              isLiked ? "text-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_10px_rgba(217,70,239,0.2)]" : "text-zinc-600 hover:text-fuchsia-400 hover:bg-[#0a0a0a]"
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
        </div>
        <h1 className="text-5xl font-black text-white leading-tight uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          The Cast of Characters
        </h1>
        <div className="flex flex-col items-center gap-6">
          <p className="text-zinc-500 italic max-w-lg mx-auto font-medium">
            Clinical profiles of the ideological conflicts and emotional DNA driving the narrative.
          </p>
          <Button
            variant="outline"
            className={cn(
              "h-12 px-10 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all duration-300",
              isEditing ? "bg-studio text-black border-studio shadow-studio" : "bg-white/5 border-white/10 text-zinc-400 hover:text-studio hover:border-studio/30"
            )}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Save Cast Bios" : "Custom Manual Edit"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {displayCast.length === 0 ? (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
             <User className="w-16 h-16 mx-auto mb-6 text-zinc-900" />
             <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-sm italic">
               Waiting for Neural Casting to Initialize...
             </p>
          </div>
        ) : (
          displayCast.map((char: any, idx: number) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={char.name + idx}
              className="group relative bg-[#050505] border border-zinc-900 rounded-[2.5rem] overflow-hidden hover:border-studio/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(var(--studio-rgb),0.05)]"
            >
              {/* Header / Identity */}
              <div className="p-8 border-b border-zinc-900 bg-studio/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 mr-4">
                    {isEditing ? (
                      <input 
                        className="w-full bg-black/60 border border-studio/20 rounded-xl px-4 py-2 text-2xl font-black text-white uppercase focus:border-studio/50 focus:outline-none mb-2"
                        value={char.name}
                        onChange={(e) => handleUpdateCharacter(idx, { name: e.target.value })}
                      />
                    ) : (
                      <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{char.name}</h3>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {isEditing ? (
                        <div className="flex gap-2 w-full">
                          <input 
                            className="bg-black/40 border border-studio/10 rounded-lg px-3 py-1 text-[9px] uppercase font-black text-studio focus:outline-none flex-1"
                            value={char.archetype}
                            onChange={(e) => handleUpdateCharacter(idx, { archetype: e.target.value })}
                          />
                          <input 
                            className="bg-black/40 border border-studio/10 rounded-lg px-3 py-1 text-[9px] uppercase font-bold text-zinc-500 focus:outline-none flex-1"
                            value={char.personality}
                            onChange={(e) => handleUpdateCharacter(idx, { personality: e.target.value })}
                          />
                        </div>
                      ) : (
                        <>
                          <span className="text-[10px] uppercase tracking-widest font-black text-studio">{char.archetype || "Main Protocol"}</span>
                          <div className="w-1 h-1 rounded-full bg-zinc-800" />
                          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">{char.personality || "Underspecified"}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-studio group-hover:border-studio/30 transition-colors shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 bg-zinc-950 p-4 rounded-3xl border border-zinc-900/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-3 h-3 text-studio" />
                          <span className="text-[8px] uppercase font-black tracking-widest text-zinc-500">Core Objective</span>
                        </div>
                        {isEditing ? (
                          <textarea 
                            className="w-full bg-black/40 border border-white/5 rounded-xl p-2 text-[10px] text-zinc-400 font-medium italic focus:outline-none min-h-[60px] resize-none"
                            value={char.goal}
                            onChange={(e) => handleUpdateCharacter(idx, { goal: e.target.value })}
                          />
                        ) : (
                          <p className="text-[11px] text-zinc-400 font-medium leading-relaxed leading-snug italic">
                            "{char.goal || "Redacted"}"
                          </p>
                        )}
                      </div>
                      <div className="flex-1 bg-zinc-950 p-4 rounded-3xl border border-zinc-900/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Skull className="w-3 h-3 text-fuchsia-500" />
                          <span className="text-[8px] uppercase font-black tracking-widest text-zinc-500">Genetic Flaw</span>
                        </div>
                        {isEditing ? (
                          <textarea 
                            className="w-full bg-black/40 border border-white/5 rounded-xl p-2 text-[10px] text-zinc-400 font-medium italic focus:outline-none min-h-[60px] resize-none"
                            value={char.flaw}
                            onChange={(e) => handleUpdateCharacter(idx, { flaw: e.target.value })}
                          />
                        ) : (
                          <p className="text-[11px] text-zinc-400 font-medium leading-relaxed leading-snug italic">
                            "{char.flaw || "Perfect Model"}"
                          </p>
                        )}
                      </div>
                   </div>
                </div>
              </div>

              {/* Body / Detail Grid */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                 {!isEditing && <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-zinc-900 hidden md:block" />}

                 <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-700 tracking-[0.2em]">
                        <Search className="w-3 h-3" /> Visual DNA
                      </div>
                      {isEditing ? (
                        <textarea 
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] text-zinc-500 font-medium focus:outline-none min-h-[80px] resize-none"
                          value={char.appearance}
                          onChange={(e) => handleUpdateCharacter(idx, { appearance: e.target.value })}
                        />
                      ) : (
                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                          {char.appearance || "Standard aesthetic parameters."}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-700 tracking-[0.2em]">
                        <MessageSquare className="w-3 h-3" /> Communication Style
                      </div>
                      {isEditing ? (
                        <input 
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-zinc-400 font-medium italic focus:outline-none"
                          value={char.speakingStyle}
                          onChange={(e) => handleUpdateCharacter(idx, { speakingStyle: e.target.value })}
                        />
                      ) : (
                        <p className="text-[10px] text-zinc-400 font-medium italic">
                          "{char.speakingStyle || "Clinical and precise."}"
                        </p>
                      )}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-700 tracking-[0.2em]">
                        <Sparkles className="w-3 h-3 text-studio" /> Narrative Conflict
                      </div>
                      {isEditing ? (
                        <textarea 
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] text-zinc-500 font-medium focus:outline-none min-h-[80px] resize-none"
                          value={char.conflict}
                          onChange={(e) => handleUpdateCharacter(idx, { conflict: e.target.value })}
                        />
                      ) : (
                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                          {char.conflict || "Primary ideological battleground."}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-700 tracking-[0.2em]">
                        <EyeOff className="w-3 h-3 text-orange-500/50" /> Hidden Secret
                      </div>
                      <div className={cn("bg-orange-500/5 border border-orange-500/10 p-3 rounded-2xl transition-all duration-700 cursor-help", !isEditing && "blur-[2px] hover:blur-none")}>
                        {isEditing ? (
                          <textarea 
                            className="w-full bg-transparent border-none p-0 text-[9px] text-orange-400/80 font-black uppercase tracking-tighter italic focus:outline-none min-h-[40px] resize-none"
                            value={char.secret}
                            onChange={(e) => handleUpdateCharacter(idx, { secret: e.target.value })}
                          />
                        ) : (
                          <p className="text-[9px] text-orange-400/80 font-black uppercase tracking-tighter italic">
                            {char.secret || "No classified data found."}
                          </p>
                        )}
                      </div>
                    </div>
                 </div>
              </div>

              {/* Visual Prompt / DNA String Footer */}
              <div className="p-6 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-studio shadow-studio" />
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest truncate max-w-[200px]">
                    DNA: {char.visualPrompt || "GENETIC_HASH_PENDING"}
                  </span>
                </div>
                <div className="text-[9px] font-black text-studio uppercase px-3 py-1 bg-studio/10 rounded-full border border-studio/20">
                  Ready for Manifestation
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-24 pt-12 border-t border-zinc-800/50 text-center">
        <p className="text-[10px] text-zinc-500/50 uppercase tracking-[0.5em] font-bold">
          End of Character Specification Archive
        </p>
      </div>
    </div>
  );
};
