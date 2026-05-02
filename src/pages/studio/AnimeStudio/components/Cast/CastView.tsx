import React from 'react';
import { useGenerator } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  User
} from 'lucide-react';
import { CastCard } from './CastCard';

interface CastViewProps {
  isLiked: boolean;
  setIsLiked: (l: boolean) => void;
  onViewCharacter?: (charName: string) => void;
  viewMode?: 'grid' | 'list';
}

export const CastView: React.FC<CastViewProps> = ({
  isLiked,
  setIsLiked,
  onViewCharacter,
  viewMode = 'grid'
}: CastViewProps) {
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
          <div className="flex items-center gap-3">
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
      </div>

      <div className={cn(
        "relative z-10",
        viewMode === 'grid' ? "grid grid-cols-1 xl:grid-cols-2 gap-8" : "flex flex-col gap-6"
      )}>
        {displayCast.length === 0 ? (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
             <User className="w-16 h-16 mx-auto mb-6 text-zinc-900" />
             <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-sm italic">
               Waiting for Neural Casting to Initialize...
             </p>
          </div>
        ) : (
          displayCast.map((char: any, idx: number) => (
            <CastCard 
              key={char.name + idx}
              character={char}
              index={idx}
              isEditing={isEditing}
              onUpdate={(updates) => handleUpdateCharacter(idx, updates)}
              onViewCharacter={onViewCharacter}
            />
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


