import React from 'react';
import { Map, Compass, Globe, Navigation } from 'lucide-react';

export const WorldAtlas: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Map className="w-3 h-3 text-blue-500" />
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Geographic Cartographer</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            REALM <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-400">CARTOGRAPHY</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="p-10 bg-[#050505] border border-white/5 rounded-[2.5rem] flex items-center justify-center min-h-[400px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 blur-[100px] group-hover:bg-blue-500/10 transition-all duration-700" />
          <div className="relative z-10 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-pulse">
              <Globe className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Neural Map Synthesis</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
              Generating topological data from narrative coordinates. Regional boundaries pending synthesis.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {[
            { label: 'Primary Continent', val: 'Neo-Pangea', icon: Compass },
            { label: 'Climate Profile', val: 'Bioluminescent Tropical', icon: Navigation },
            { label: 'Resource Density', val: 'High / Etheric', icon: Map },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-zinc-950/50 border border-white/5 rounded-[2rem] flex items-center gap-6 group hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</span>
                <p className="text-lg font-black text-white uppercase tracking-tighter mt-1">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
