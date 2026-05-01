import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  Filter, 
  Flame,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { fetchTemplates, ProductionTemplate } from '@/services/api/templates';
import { StudioLoading } from '@/components/studio/StudioLoading';


const categories = ["All", "Shonen", "Isekai", "Cyberpunk", "Horror", "Romance", "Mecha"];

export function DiscoverPage() {
  const navigate = useNavigate();
  const [protocols, setProtocols] = React.useState<ProductionTemplate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProtocols = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTemplates();
        setProtocols(data);
      } catch (e: any) {
        console.error("Failed to fetch discovery protocols:", e);
        setError(e.message || "Failed to synchronize with discovery network");
      } finally {
        setLoading(false);
      }
    };
    fetchProtocols();
  }, []);


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

        <div className="hidden lg:flex items-center gap-6 px-8 border-l border-zinc-900/50 h-fit">
           <div className="flex flex-col items-start px-4">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1.5">Discovery Backend</span>
              <div className="flex items-center gap-1.5">
                 <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                 <span className="text-[9px] font-bold text-white uppercase tracking-tighter">NODE_UP</span>
              </div>
           </div>
           <div className="flex flex-col items-start px-6 border-l border-zinc-900/50">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1.5">Asset DB</span>
              <div className="flex items-center gap-1.5">
                 <div className="w-1 h-1 rounded-full bg-cyan-500" />
                 <span className="text-[9px] font-bold text-white uppercase tracking-tighter">DATA_SYNCED</span>
              </div>
           </div>
           <div className="flex flex-col items-start px-6 border-l border-zinc-900/50">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1.5">Neural API</span>
              <div className="flex items-center gap-1.5">
                 <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                 <span className="text-[9px] font-bold text-white uppercase tracking-tighter">GEMINI_READY</span>
              </div>
           </div>
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
          <Button 
            onClick={() => navigate('/anime/template')}
            variant="ghost" 
            className="text-cyan-500 text-[10px] font-black uppercase tracking-widest hover:text-cyan-400"
          >
            Expand Library <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full">
              <StudioLoading fullPage={false} message="Discovering Protocols..." submessage="Syncing with the Blueprint Forge..." />
            </div>
          ) : error ? (

            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-red-900/30 rounded-[3rem] bg-red-900/5">
               <AlertCircle className="w-12 h-12 text-red-500 mb-6" />
               <h3 className="text-sm font-black text-red-500 uppercase tracking-[0.3em] mb-2">Discovery Offline</h3>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-xs text-center">{error}</p>
               <Button onClick={() => window.location.reload()} variant="outline" className="mt-6 border-red-500/30 text-red-400 hover:bg-red-500/10">Re-Sync Discovery</Button>
            </div>
          ) : protocols.length > 0 ? protocols.map((protocol) => (
             <div 
              key={protocol.id} 
              onClick={() => navigate(`/anime/template`)}
              className="group relative h-[320px] rounded-[2.5rem] bg-zinc-950 border border-zinc-900 overflow-hidden cursor-pointer hover:border-cyan-500/30 transition-all shadow-2xl"
             >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                   <div className="px-3 py-1 rounded-full bg-black/80 border border-cyan-500/20 text-[8px] font-black text-cyan-400 uppercase tracking-widest">
                      {protocol.category}
                   </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 z-20 space-y-3">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-cyan-400 transition-colors">
                      {protocol.name}
                   </h3>
                   <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
                      {protocol.description}
                   </p>
                   <div className="flex items-center gap-4 pt-2">
                      <span className="text-[9px] font-black text-cyan-500 uppercase flex items-center gap-1.5">
                        <Flame className="w-3 h-3" /> Trending
                      </span>
                      <span className="text-[9px] font-black text-zinc-600 uppercase">
                        {protocol.vibe}
                      </span>
                   </div>
                </div>
             </div>
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
