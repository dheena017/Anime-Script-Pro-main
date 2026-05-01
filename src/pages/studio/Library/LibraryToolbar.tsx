import React from 'react';
import { Search, Filter, Grid, List, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const LibraryToolbar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-zinc-950 border border-white/5 rounded-[2rem] mb-8">
      <div className="flex items-center gap-4 flex-1 min-w-[300px]">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#bd4a4a] transition-colors" />
          <input 
            type="text" 
            placeholder="Search Archives..." 
            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-[#bd4a4a]/50 transition-all"
          />
        </div>
        <Button variant="outline" className="bg-zinc-900 border-white/5 rounded-xl px-4 py-6 hover:bg-zinc-800">
          <Filter className="w-4 h-4 text-zinc-400 mr-2" />
          <span className="text-[9px] font-black uppercase tracking-widest">Filter</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-zinc-900 border border-white/5 rounded-xl p-1">
          <button className="p-2.5 rounded-lg bg-[#bd4a4a] text-white">
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button className="p-2.5 rounded-lg text-zinc-500 hover:text-white transition-colors">
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="h-8 w-px bg-white/10" />
        
        <Button className="bg-[#bd4a4a] hover:bg-[#d45555] rounded-xl px-6 py-6 font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_0_20px_rgba(189,74,74,0.3)]">
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>
    </div>
  );
};


