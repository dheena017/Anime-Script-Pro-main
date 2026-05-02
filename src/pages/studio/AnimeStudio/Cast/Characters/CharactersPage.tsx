import { useNavigate } from 'react-router-dom';
import { Plus, ListFilter, Search, LayoutGrid, List, User } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CastCard } from '../../components/Cast/CastCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CharactersPage() {
  const navigate = useNavigate();
  const { 
    castData, 
    castList, 
    setCastList,
    isEditing,
    contentType
  } = useGenerator();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const displayCast = castData?.characters || castList || [];

  const handleUpdateCharacter = (index: number, updates: any) => {
    const newList = [...displayCast];
    newList[index] = { ...newList[index], ...updates };
    setCastList(newList);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 bg-studio/10 border border-studio/20 rounded-full text-[10px] uppercase tracking-widest text-studio font-bold">
            Character Registry
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
            Cast <span className="text-studio">Manifest</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium max-w-md">
            Clinical profiles of the ideological conflicts and emotional DNA driving the narrative.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-zinc-800 bg-black/40 text-zinc-400 hover:text-white hover:border-zinc-700"
          >
            <ListFilter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button 
            className="bg-studio text-black font-black uppercase tracking-wider hover:bg-studio/80 shadow-studio"
            onClick={() => {/* Logic to add character */}}
          >
            <Plus className="w-4 h-4 mr-2" /> New character
          </Button>
        </div>
      </div>

      {/* Search & View Toggle */}
      <div className="flex items-center justify-between gap-4 p-4 bg-zinc-900/40 border border-white/5 rounded-2xl backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search characters by name or role..." 
            className="pl-12 bg-black/40 border-zinc-800 focus:border-studio/50"
          />
        </div>
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setViewMode('grid')}
            className={cn("w-9 h-9 rounded-lg transition-all", viewMode === 'grid' ? "bg-studio text-black hover:bg-studio" : "text-zinc-500 hover:text-white")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setViewMode('list')}
            className={cn("w-9 h-9 rounded-lg transition-all", viewMode === 'list' ? "bg-studio text-black hover:bg-studio" : "text-zinc-500 hover:text-white")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Characters List - Responsive Layout */}
      <div className={cn(
        "relative z-10",
        viewMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "flex flex-col gap-6"
      )}>
        {displayCast.length > 0 ? (
          displayCast.map((char: any, idx: number) => (
            <CastCard
              key={idx}
              character={char}
              index={idx}
              isEditing={isEditing}
              onUpdate={(updates) => handleUpdateCharacter(idx, updates)}
              onViewCharacter={(charName) => {
                navigate(`/${contentType.toLowerCase()}/cast/characters/${charName}`);
              }}
            />
          ))
        ) : (
          <div className="col-span-full h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[3rem] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
              <User className="w-8 h-8 text-zinc-700" />
            </div>
            <div className="space-y-1">
              <p className="text-white font-bold uppercase tracking-widest text-sm">No Cast Members Detected</p>
              <p className="text-zinc-600 text-xs">Initialize your character synthesis to begin sequencing the cast.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
