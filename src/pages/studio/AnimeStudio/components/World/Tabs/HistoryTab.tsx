import React from 'react';
import { History } from 'lucide-react';

export const HistoryTab: React.FC = () => {
  return (
    <div className="py-12 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mx-auto">
          <History className="w-8 h-8 text-fuchsia-400" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-widest italic">Chronological Records</h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Neural timeline of epochal events and ancient lore</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {[
          { era: 'The First Dawn', event: 'Celestial Convergence', desc: 'The moment the two suns aligned, birthing the first magic users.' },
          { era: 'The Great Shattering', event: 'Continental Drift', desc: 'A massive tectonic shift that isolated the northern tribes.' },
          { era: 'Era of the Obsidian King', event: 'The Shadow War', desc: 'A century-long conflict that redefined the laws of the realm.' }
        ].map((item, i) => (
          <div key={i} className="flex gap-8 group">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)] z-10" />
              <div className="w-px h-full bg-white/5 group-last:bg-transparent" />
            </div>
            <div className="pb-12 space-y-2">
               <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">{item.era}</span>
               <h3 className="text-xl font-black text-white uppercase tracking-wider">{item.event}</h3>
               <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-2xl">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



