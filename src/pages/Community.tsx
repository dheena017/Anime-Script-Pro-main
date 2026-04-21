import { TrendingUp, Users, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const trendingScripts: any[] = [];

export function CommunityPage() {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-zinc-900 pb-10">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4 text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Users className="w-12 h-12 text-cyan-500" />
            Social Hub
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs pl-1">Sync with the global collective of script architects.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-widest text-xs h-12 px-8 rounded-2xl shadow-[0_8px_20px_rgba(6,182,212,0.3)] transition-all active:scale-95">
            <Share2 className="w-4 h-4 mr-3" />
            Broadcast Script
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white">
              <TrendingUp className="w-6 h-6 text-orange-500 animate-pulse" />
              Neural Trending
            </h2>
            <Button variant="ghost" className="text-cyan-500 text-[10px] font-black uppercase tracking-widest hover:text-cyan-400">
              Expore More <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trendingScripts.length > 0 ? trendingScripts.map((_, idx) => (
               <div key={idx} />
            )) : (
              <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-[3rem] bg-[#050505]/20">
                 <TrendingUp className="w-16 h-16 text-zinc-800 mb-6" />
                 <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-2">No Trending Patterns</h3>
                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-xs text-center">
                   Broadcast your latest AI production to start a global trend.
                 </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white">
            <Users className="w-6 h-6 text-fuchsia-500" />
            Top Architects
          </h2>
          <div className="space-y-4">
          <div className="flex flex-col items-center justify-center py-20 border border-zinc-900 rounded-3xl opacity-40">
             <Users className="w-12 h-12 mb-4" />
             <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Connections</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
