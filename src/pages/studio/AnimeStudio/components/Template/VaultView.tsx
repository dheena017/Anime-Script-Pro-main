import React from 'react';
import { Layout, Brain, Smartphone, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const VaultView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-10 glass-panel border border-cyan-500/10 rounded-[3rem] text-center relative overflow-hidden group">
       <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,var(--cyan-500)_0%,transparent_70%)] group-hover:opacity-[0.05] transition-opacity duration-1000" />
       
       <div className="relative">
         <div className="w-32 h-32 rounded-full bg-cyan-500/5 flex items-center justify-center border border-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.1)] group-hover:scale-110 transition-transform duration-700">
            <Lock className="w-12 h-12 text-cyan-500/50 group-hover:text-cyan-400 group-hover:rotate-12 transition-all" />
         </div>
         <div className="absolute -top-2 -right-2 p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Sparkles className="w-4 h-4 text-cyan-400" />
         </div>
       </div>

       <div className="space-y-4 max-w-lg px-6 relative z-10">
         <div className="inline-block px-4 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-black mb-2 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
           Private Encryption Layer
         </div>
         <h3 className="text-4xl font-black text-white uppercase tracking-tighter glow-text">The Private Vault</h3>
         <p className="text-sm text-zinc-500 leading-relaxed font-medium">
           Secure your custom prompt architectures and personal blueprints in an encrypted personal library. Advanced prompt versioning and variable support coming in <span className="text-cyan-400 font-black glow-text">Studio v2.0</span>.
         </p>
       </div>

       <Button className="bg-black/40 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 font-black uppercase tracking-[0.25em] h-14 px-12 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.1)] active:scale-95 transition-all hover:-translate-y-1 neo-border">
         Authorize Vault Access
       </Button>

       <div className="grid grid-cols-3 gap-12 pt-10 opacity-20 group-hover:opacity-60 transition-opacity duration-1000">
          <div className="flex flex-col items-center gap-3">
            <Layout className="w-7 h-7 text-cyan-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Modular</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Brain className="w-7 h-7 text-cyan-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Neural</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Smartphone className="w-7 h-7 text-cyan-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Sync</span>
          </div>
       </div>
    </div>
  );
};


