import React from 'react';
import { Search, SlidersHorizontal, TrendingUp, Clock, Star, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { label: "Trending", icon: TrendingUp, active: true },
  { label: "Latest", icon: Clock, active: false },
  { label: "Featured", icon: Star, active: false },
  { label: "Neural Picks", icon: Zap, active: false },
];

export const DiscoverToolbar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-zinc-950 border border-white/5 rounded-[2rem] mb-8">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
        {categories.map((cat) => (
          <button
            key={cat.label}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl border transition-all whitespace-nowrap",
              cat.active 
                ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
                : "bg-zinc-900 border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
            )}
          >
            <cat.icon className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 flex-1 md:flex-initial">
        <div className="relative flex-1 md:w-64 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Network..." 
            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
        <Button variant="outline" className="bg-zinc-900 border-white/5 rounded-xl p-3 h-auto hover:bg-zinc-800">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
        </Button>
      </div>
    </div>
  );
};


