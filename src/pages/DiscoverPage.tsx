import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  Filter, 
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const categories = ["All", "Shonen", "Isekai", "Cyberpunk", "Horror", "Romance", "Mecha"];

const featuredScripts: any[] = [];

export function DiscoverPage() {
  const navigate = useNavigate();
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4 text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Compass className="w-12 h-12 text-cyan-500" />
            Discover
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs pl-1">
            Explore the latest high-engagement recaps from the community.
          </p>
        </div>
        <div className="p-1 bg-[#0a0a0a] rounded-full border border-zinc-800 flex gap-2 shadow-2xl">
          {categories.map((cat) => (
             <button 
               key={cat} 
               className={cn(
                 "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                 cat === "All" ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "text-zinc-500 hover:text-white"
               )}
             >
               {cat}
             </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-9 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-700 group-hover:text-cyan-400 transition-colors" />
          <Input 
            placeholder="Search the neural network for scripts, authors, or genres..." 
            className="pl-14 h-14 bg-[#050505] border-zinc-800 focus:border-cyan-500/50 text-[13px] rounded-2xl shadow-inner font-bold uppercase tracking-wider"
          />
        </div>
        <Button className="md:col-span-3 h-14 bg-[#0a0a0a] border border-zinc-800 text-zinc-400 hover:text-white hover:border-cyan-500/30 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl transition-all">
          <Filter className="w-4 h-4 mr-3" /> Filter Matrix
        </Button>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white">
            <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
            Featured Protocols
          </h2>
          <Button variant="ghost" className="text-cyan-500 text-[10px] font-black uppercase tracking-widest hover:text-cyan-400">
            Expand Library <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredScripts.length > 0 ? featuredScripts.map((script) => (
             // ... existing mapping logic
             <div key={script.id} />
          )) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-[3rem] bg-[#050505]/30">
               <Compass className="w-16 h-16 text-zinc-800 mb-6" />
               <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-2">No Discoverable Assets</h3>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-xs text-center">
                 The neural network is currently clear. Synthesize your first masterpiece in any studio to broadcast it here.
               </p>
               <Button 
                onClick={() => navigate('/dashboard')}
                className="mt-8 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] h-10 px-8 rounded-xl shadow-studio"
               >
                 Launch Studio
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
