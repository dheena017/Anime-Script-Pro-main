import React from 'react';
import { Search, Users, MessageCircle, Hash, LayoutGrid, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const modes = [
  { label: "Neural Feed", icon: Hash, active: true },
  { label: "Squads", icon: Users, active: false },
  { label: "Communications", icon: MessageCircle, active: false },
  { label: "Marketplace", icon: LayoutGrid, active: false },
];

export const CommunityToolbar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-zinc-950 border border-white/5 rounded-[2rem] mb-8">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
        {modes.map((mode) => (
          <button
            key={mode.label}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl border transition-all whitespace-nowrap",
              mode.active 
                ? "bg-purple-500/10 border-purple-500/30 text-purple-400" 
                : "bg-zinc-900 border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
            )}
          >
            <mode.icon className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">{mode.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-48 lg:w-64 group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Syndicate..." 
            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-purple-500/50 transition-all"
          />
        </div>
        <Button className="bg-purple-600 hover:bg-purple-500 rounded-xl px-6 py-6 font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_0_20px_rgba(147,51,234,0.3)]">
          <Plus className="w-4 h-4 mr-2" /> Start Transmission
        </Button>
      </div>
    </div>
  );
};



