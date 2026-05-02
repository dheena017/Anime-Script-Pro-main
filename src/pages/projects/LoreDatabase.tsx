import { Database, Search } from 'lucide-react';

export function LoreDatabasePage() {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 py-32 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio/10 border border-studio/20">
            <Database className="w-4 h-4 text-studio" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-studio">Global Repository</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wider">Lore Database</h1>
          <p className="text-zinc-400 text-lg">Explore community-created worlds, characters, magic systems, and timelines. Connect lore fragments to build expansive universes.</p>
          
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search for worlds, characters, or concepts..." 
              className="w-full bg-zinc-900/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-studio transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Cyber-Neo Tokyo', type: 'World Setting', desc: 'A sprawling metropolis powered by soul-engines and neon magic.', items: 1204 },
            { title: 'The Void Walkers', type: 'Faction', desc: 'An ancient order capable of stepping between dimensions.', items: 85 },
            { title: 'Aetherial Resonance', type: 'Magic System', desc: 'Using musical frequencies to manipulate elemental forces.', items: 312 },
            { title: 'Project: OVERMIND', type: 'Lore Arc', desc: 'The timeline of events leading to the great AI awakening of 2099.', items: 56 },
            { title: 'Starfall Academy', type: 'Location', desc: 'A floating school for gifted youths touched by meteor shards.', items: 420 },
            { title: 'Mecha-Beasts', type: 'Bestiary', desc: 'Catalog of biomechanical creatures roaming the wasteland.', items: 890 },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-studio/30 transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.type}</span>
                <span className="text-[10px] text-studio bg-studio/10 px-2 py-1 rounded-full">{item.items} entries</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-studio transition-colors">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoreDatabasePage;




