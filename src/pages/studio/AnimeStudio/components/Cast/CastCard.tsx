import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Target, 
  Skull, 
  MessageSquare, 
  User, 
  Sparkles,
  Search,
  EyeOff,
  Eye
} from 'lucide-react';

interface CastCardProps {
  character: any;
  index: number;
  isEditing: boolean;
  onUpdate: (updates: any) => void;
  onViewCharacter?: (charName: string) => void;
}

export const CastCard: React.FC<CastCardProps> = ({
  character,
  index,
  isEditing,
  onUpdate,
  onViewCharacter
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-[#050505] border border-zinc-900 rounded-[2.5rem] overflow-hidden hover:border-studio/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(var(--studio-rgb),0.05)] h-full flex flex-col"
    >
      {/* Header / Identity */}
      <div className="p-8 border-b border-zinc-900 bg-gradient-to-br from-zinc-950 to-[#050505] relative overflow-hidden">
        {/* Subtle background glow based on edit state */}
        {isEditing && <div className="absolute inset-0 bg-studio/5 animate-pulse pointer-events-none" />}
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex-1 mr-4">
            {isEditing ? (
              <input 
                className="w-full bg-black/80 border border-studio/40 rounded-xl px-4 py-2 text-2xl font-black text-white uppercase focus:border-studio focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:outline-none mb-3 transition-all"
                value={character.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
              />
            ) : (
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter uppercase drop-shadow-lg mb-2">
                {character.name}
              </h3>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {isEditing ? (
                <div className="flex gap-2 w-full">
                  <input 
                    className="bg-black/40 border border-studio/10 rounded-lg px-3 py-1 text-[9px] uppercase font-black text-studio focus:outline-none flex-1"
                    value={character.archetype}
                    onChange={(e) => onUpdate({ archetype: e.target.value })}
                    placeholder="Archetype"
                  />
                  <input 
                    className="bg-black/40 border border-studio/10 rounded-lg px-3 py-1 text-[9px] uppercase font-bold text-zinc-500 focus:outline-none flex-1"
                    value={character.personality}
                    onChange={(e) => onUpdate({ personality: e.target.value })}
                    placeholder="Personality"
                  />
                </div>
              ) : (
                <>
                  <span className={cn(
                    "text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border shadow-sm",
                    character.archetype?.toLowerCase().includes('protagonist') || character.archetype?.toLowerCase().includes('hero') ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-cyan-500/20' :
                    character.archetype?.toLowerCase().includes('antagonist') || character.archetype?.toLowerCase().includes('villain') ? 'text-red-400 bg-red-500/10 border-red-500/30 shadow-red-500/20' :
                    character.archetype?.toLowerCase().includes('mentor') || character.archetype?.toLowerCase().includes('master') ? 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-amber-500/20' :
                    character.archetype?.toLowerCase().includes('rival') ? 'text-orange-400 bg-orange-500/10 border-orange-500/30 shadow-orange-500/20' :
                    'text-studio bg-studio/10 border-studio/30 shadow-studio/20'
                  )}>
                    {character.archetype || "Main Protocol"}
                  </span>
                  
                  <span className={cn(
                    "text-[9px] uppercase tracking-[0.1em] font-bold px-3 py-1 rounded-full border",
                    character.personality?.toLowerCase().includes('dere') ? 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30' : 'text-zinc-400 bg-zinc-900 border-zinc-800'
                  )}>
                    {character.personality || "Underspecified"}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="relative group/avatar shrink-0">
            <div className="absolute inset-0 bg-studio/20 blur-xl rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover/avatar:text-studio group-hover/avatar:border-studio/50 transition-all duration-500 relative z-10 shadow-xl">
              <User className="w-7 h-7" />
            </div>
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
                    value={character.goal}
                    onChange={(e) => onUpdate({ goal: e.target.value })}
                  />
                ) : (
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed leading-snug italic">
                    "{character.goal || "Redacted"}"
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
                    value={character.flaw}
                    onChange={(e) => onUpdate({ flaw: e.target.value })}
                  />
                ) : (
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed leading-snug italic">
                    "{character.flaw || "Perfect Model"}"
                  </p>
                )}
              </div>
           </div>
        </div>
      </div>

      {/* Body / Detail Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative flex-1">
         {!isEditing && <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-zinc-900 hidden md:block" />}

         <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-700 tracking-[0.2em]">
                <Search className="w-3 h-3" /> Visual DNA
              </div>
              {isEditing ? (
                <textarea 
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] text-zinc-500 font-medium focus:outline-none min-h-[80px] resize-none"
                  value={character.appearance}
                  onChange={(e) => onUpdate({ appearance: e.target.value })}
                />
              ) : (
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                  {character.appearance || "Standard aesthetic parameters."}
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
                  value={character.speakingStyle}
                  onChange={(e) => onUpdate({ speakingStyle: e.target.value })}
                />
              ) : (
                <p className="text-[10px] text-zinc-400 font-medium italic">
                  "{character.speakingStyle || "Clinical and precise."}"
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
                  value={character.conflict}
                  onChange={(e) => onUpdate({ conflict: e.target.value })}
                />
              ) : (
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                  {character.conflict || "Primary ideological battleground."}
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
                    value={character.secret}
                    onChange={(e) => onUpdate({ secret: e.target.value })}
                  />
                ) : (
                  <p className="text-[9px] text-orange-400/80 font-black uppercase tracking-tighter italic">
                    {character.secret || "No classified data found."}
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
            DNA: {character.visualPrompt || "GENETIC_HASH_PENDING"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button 
              onClick={() => onViewCharacter?.(character.name)}
              className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase px-3 py-1 bg-white/5 rounded-full border border-white/10 hover:text-white hover:bg-white/10 transition-all"
            >
              <Eye className="w-3 h-3" />
              View Bio
            </button>
          )}
          <div className="text-[9px] font-black text-studio uppercase px-3 py-1 bg-studio/10 rounded-full border border-studio/20">
            Ready for Manifestation
          </div>
        </div>
      </div>
    </motion.div>
  );
};


