import { Globe2, Users, Languages, Landmark } from 'lucide-react';

export const CultureTab: React.FC = () => {
  return (
    <div className="py-12 space-y-12">
      <div className="flex items-center gap-6 border-b border-white/5 pb-10">
         <div className="w-16 h-16 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Globe2 className="w-8 h-8 text-blue-400" />
         </div>
         <div className="space-y-1">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Cultural Manifest</h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Profiling societal norms, linguistics, and belief systems</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {[
           { icon: Users, label: 'Social Hierarchy', desc: 'The society is structured around meritocratic guilds, where reputation is the primary currency.' },
           { icon: Languages, label: 'Linguistics', desc: 'Three primary dialects exist, all descending from a singular ancient glyph-based tongue.' },
           { icon: Landmark, label: 'Religion', desc: 'Worship centers around the Dual Suns, viewed as the eyes of an ancient sleeping god.' }
         ].map((item, i) => (
           <div key={i} className="flex gap-6 p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/[0.08] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                 <item.icon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest">{item.label}</h3>
                 <p className="text-zinc-500 text-xs font-medium leading-relaxed italic">"{item.desc}"</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
