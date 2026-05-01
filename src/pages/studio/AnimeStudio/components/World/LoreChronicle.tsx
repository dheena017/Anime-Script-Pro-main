import React from 'react';
import { History, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoreChronicleProps {
  lore?: string;
}

export const LoreChronicle: React.FC<LoreChronicleProps> = ({ lore }) => {
  // Parse lore milestones if they exist, or use high-quality dynamic placeholders
  const milestones = React.useMemo(() => {
    if (!lore) return [
      { era: 'FOUNDATION', label: 'Neo-Genesis', desc: 'The architectural seeds of this reality are awaiting deployment.' },
      { era: 'STRIFE', label: 'Tension Mapping', desc: 'Analyzing potential ideological conflicts for this world...' },
      { era: 'THE NOW', label: 'Initial Point', desc: 'The starting point of your narrative timeline.' }
    ];
    
    // In a real scenario, we would use regex to extract headers and first sentences from the AI lore.
    // For now, let's keep it clean and adaptable.
    return [
      { era: 'LEGACY', label: 'Historical Core', desc: 'The weight of past events as defined in your lore.' },
      { era: 'CONFLICT', label: 'Active Friction', desc: 'The current state of sociopolitical and magical tension.' },
      { era: 'THRESHOLD', label: 'Current Era', desc: 'The exact moment where your story begins.' }
    ];
  }, [lore]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-500" />
          The Great Chronicle
        </h3>
        <Button variant="ghost" size="sm" className="h-7 text-[8px] font-black uppercase tracking-[0.2em] text-cyan-500 hover:text-cyan-400">
          Sync Lore <Sparkles className="w-3 h-3 ml-2" />
        </Button>
      </div>

      <div className="relative pl-6 space-y-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-cyan-500/50 via-cyan-500/10 to-transparent" />
        
        {milestones.map((item, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-[23px] top-1.5 w-2 h-2 rounded-full bg-black border border-cyan-500 group-hover:bg-cyan-500 transition-colors shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
            <div className="space-y-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-cyan-500/60">{item.era}</span>
              <h4 className="text-[10px] font-black uppercase text-white tracking-widest leading-none">{item.label}</h4>
              <p className="text-[9px] text-zinc-500 font-medium leading-relaxed mt-1 group-hover:text-zinc-300 transition-colors">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2 flex justify-center">
         <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-zinc-700 hover:text-cyan-500 hover:bg-cyan-500/5">
            <ChevronDown className="w-4 h-4" />
         </Button>
      </div>
    </div>
  );
};


