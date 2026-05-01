import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AddLeadTab: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-12">
      <div className="text-center space-y-4">
        <UserPlus className="w-16 h-16 text-amber-500 mx-auto opacity-50" />
        <h2 className="text-3xl font-black text-white uppercase tracking-widest">Manual Manifestation</h2>
        <p className="text-zinc-500 text-sm">Directly inject a new soul into the narrative registry.</p>
      </div>
      <div className="space-y-6">
         <div className="grid grid-cols-2 gap-6">
           <div className="space-y-2">
             <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Full Name</label>
             <input className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:border-amber-500/50 outline-none transition-all font-bold" placeholder="Character Name..." />
           </div>
           <div className="space-y-2">
             <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Archetype</label>
             <input className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:border-amber-500/50 outline-none transition-all font-bold" placeholder="The Rogue, The Hero..." />
           </div>
         </div>
         <div className="space-y-2">
           <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Core Motivation</label>
           <textarea className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:border-amber-500/50 outline-none transition-all font-bold resize-none" placeholder="What drives this soul?" />
         </div>
         <Button className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            Initialize Manifestation
         </Button>
      </div>
    </div>
  );
};


