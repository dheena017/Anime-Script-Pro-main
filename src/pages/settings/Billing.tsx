import { useEffect, useState, useCallback } from 'react';
import { 
  CreditCard, 
  Rocket, 
  Check, 
  Zap, 
  Grip, 
  TerminalSquare, 
  Leaf, 
  Loader2, 
  Activity,
  Database,
  Globe,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Lock,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { settingsService } from '../../services/api/settings';
import { motion, AnimatePresence } from 'framer-motion';

export function BillingSettings() {
  const [carbonOffset, setCarbonOffset] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
     async function hydrate() {
        const dbSettings = await settingsService.getSettings();
        if (dbSettings && dbSettings.billing) {
           if (dbSettings.billing.carbon_offset !== undefined) setCarbonOffset(dbSettings.billing.carbon_offset);
        }
        setLoading(false);
     }
     hydrate();
  }, []);

  const syncToCloud = useCallback(async (overrides: any) => {
     setIsSaving(true);
     await settingsService.updateSettings({
        billing: { carbon_offset: carbonOffset, ...overrides }
     });
     setTimeout(() => setIsSaving(false), 800);
  }, [carbonOffset]);

  if (loading) {
    return (
     <div className="w-full h-96 flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
         <Loader2 className="w-12 h-12 text-studio animate-spin" />
         <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em]">Initializing Financial Terminal...</span>
       </div>
     </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 relative selection:bg-studio/30">
      
      {/* 1. ATOMIC SYNC OVERLAY */}
      <AnimatePresence>
        {isSaving && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-8 right-8 z-[100] flex items-center gap-3 px-5 py-2.5 bg-studio/10 border border-studio/20 backdrop-blur-xl rounded-full shadow-[0_20px_50px_rgba(6,182,212,0.2)]"
          >
            <div className="w-2 h-2 rounded-full bg-studio animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-studio">Financial Sync Active</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 2. SUBSCRIPTION ROOT TERMINAL */}
        <div className="lg:col-span-8 space-y-10">
          <div className="relative overflow-hidden rounded-[3.5rem] p-[1px] bg-gradient-to-br from-studio via-studio/20 to-transparent group shadow-[0_30px_70px_rgba(6,182,212,0.15)]">
            <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <Card className="bg-[#0a0a0b] backdrop-blur-3xl border-none h-full relative z-10 m-0 rounded-[calc(3.5rem-1px)] p-10 md:p-14 overflow-hidden">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-studio/5 blur-[120px] pointer-events-none" />
               
               <CardHeader className="p-0 mb-12">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-10">
                     <div className="flex items-center gap-8">
                       <div className="w-20 h-20 bg-studio/10 border border-studio/20 rounded-[2rem] flex items-center justify-center shadow-2xl relative">
                          <div className="absolute inset-0 bg-studio/5 blur-xl animate-pulse" />
                          <Rocket className="w-10 h-10 text-studio relative z-10" />
                       </div>
                       <div className="space-y-2">
                         <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-studio uppercase tracking-[0.4em]">Active Subscription Root</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         </div>
                         <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none flex items-center gap-4">
                            Studio Pro <Zap className="w-8 h-8 text-studio fill-studio" />
                         </h2>
                       </div>
                     </div>
                     <div className="text-left md:text-right flex flex-col md:items-end gap-3">
                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Monthly Recurrence</span>
                        <div className="inline-block bg-studio/5 border border-studio/20 text-white px-8 py-4 rounded-[1.5rem] text-3xl font-black uppercase italic tracking-tighter shadow-2xl tabular-nums">
                           $49.99 <span className="text-xs text-zinc-600 font-bold tracking-widest">/ MO</span>
                        </div>
                        <p className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">Next Protocol Cycle: Oct 1, 2026</p>
                     </div>
                  </div>
               </CardHeader>
               
               <CardContent className="p-0 pt-12 border-t border-white/5 relative">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                     
                     <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center gap-4">
                           <Activity className="w-4 h-4 text-studio" />
                           <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Entitlement Registry</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {[
                              { label: 'Unlimited Neural Synthesis', desc: 'Unrestricted God Mode orchestration.' },
                              { label: '4K Production Exports', desc: 'Native high-fidelity neural rendering.' },
                              { label: 'Priority Node Uplink', desc: 'Zero-latency transmission access.' },
                              { label: 'Custom Agent DNA', desc: 'Sovereign personality architecture.' }
                           ].map((feat, i) => (
                             <div key={i} className="flex items-start gap-4 group/feat">
                                <div className="mt-1 w-5 h-5 bg-studio/10 border border-studio/20 rounded-lg flex items-center justify-center text-studio group-hover/feat:bg-studio group-hover/feat:text-black transition-all">
                                   <Check className="w-3 h-3" />
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[11px] font-black text-white uppercase tracking-widest">{feat.label}</p>
                                   <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">{feat.desc}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group/burn">
                           <div className="absolute inset-0 bg-gradient-to-br from-studio/5 to-transparent opacity-0 group-hover/burn:opacity-100 transition-opacity" />
                           <div className="flex justify-between items-center mb-6 relative z-10">
                               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><TerminalSquare className="w-4 h-4 text-studio" /> GPU Token Burn</span>
                               <span className="text-[9px] font-black text-studio bg-studio/10 px-3 py-1 rounded-full border border-studio/20 uppercase tracking-widest tabular-nums">84% Load</span>
                           </div>
                           <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden shadow-inner mb-6 border border-white/5 relative z-10 p-0.5">
                               <div className="h-full bg-studio rounded-full relative shadow-[0_0_15px_rgba(6,182,212,0.4)] w-[84%]">
                                  <div className="absolute inset-y-0 right-0 w-8 bg-white/20 animate-pulse" />
                               </div>
                           </div>
                           <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-2">
                                 <Cpu className="w-3 h-3 text-zinc-700" />
                                 <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest italic">Protocol Health: Optimal</span>
                              </div>
                              <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">REGISTRY: #ASP-8842-X</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>

        {/* 3. PAYMENT ROUTING HUB */}
        <div className="lg:col-span-4 space-y-10">
          <Card className="bg-[#0a0a0b] border border-white/5 rounded-[3.5rem] shadow-3xl h-full relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-20 bg-studio/5 blur-[100px] pointer-events-none" />
             
             <CardHeader className="p-10 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-2xl">
                    <Grip className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black text-white tracking-[0.3em] uppercase italic">Routing Matrix</CardTitle>
                    <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mt-1">Payment Method Interface</p>
                  </div>
                </div>
             </CardHeader>
             
             <CardContent className="p-10 space-y-10">
                <div className="p-8 border border-white/5 bg-white/[0.02] rounded-[2.5rem] space-y-8 hover:border-studio/30 transition-all duration-700 group/card relative overflow-hidden">
                   <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                   <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-12 bg-black border border-white/5 rounded-xl flex items-center justify-center shadow-inner group-hover/card:border-studio/30 transition-all">
                            <CreditCard className="w-6 h-6 text-zinc-600 group-hover/card:text-studio transition-colors" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Primary Link</p>
                            <p className="text-lg font-black text-white tracking-[0.3em] italic tabular-nums">•••• 4242</p>
                         </div>
                      </div>
                      <Button variant="ghost" className="h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/[0.03] hover:bg-studio hover:text-black transition-all">Swap Protocol</Button>
                   </div>
                   <div className="flex items-center gap-3 pt-6 border-t border-white/5 relative z-10">
                      <Lock className="w-3.5 h-3.5 text-studio" />
                      <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Encrypted Transmission Link Active</span>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                   <div 
                    onClick={() => { setCarbonOffset(!carbonOffset); syncToCloud({carbon_offset: !carbonOffset}); }}
                    className={cn(
                      "flex items-center justify-between p-8 rounded-[2.5rem] border transition-all duration-700 cursor-pointer group/leaf",
                      carbonOffset ? "bg-emerald-500/5 border-emerald-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                    )}
                   >
                      <div className="flex gap-5 items-center">
                         <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700", carbonOffset ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-900 text-zinc-800")}>
                            <Leaf className={cn("w-6 h-6", carbonOffset ? "animate-pulse" : "")} />
                         </div>
                         <div className="space-y-1">
                            <p className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic group-hover/leaf:text-emerald-400 transition-colors">Carbon Neutrality</p>
                            <p className="text-[9px] font-bold text-zinc-600 tracking-wider uppercase leading-relaxed max-w-[180px]">Automatically neutralize LLM compute emissions.</p>
                         </div>
                      </div>
                      <div className={cn("w-12 h-6 rounded-full relative transition-colors duration-500", carbonOffset ? "bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-zinc-900")}>
                         <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow-2xl transition-all duration-500", carbonOffset ? "left-7" : "left-1 bg-zinc-700")} />
                      </div>
                   </div>
                </div>

                {/* Billing Footer Metadata */}
                <div className="space-y-4 pt-10 border-t border-white/5">
                   <div className="flex items-center gap-4">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Sovereign Billing Active</span>
                   </div>
                   <div className="flex items-center gap-4 text-zinc-800">
                      <Globe className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Global Node Distribution</span>
                   </div>
                </div>
             </CardContent>
          </Card>

          {/* Quick Support Link */}
          <div className="p-10 bg-studio/[0.03] border border-studio/20 rounded-[3.5rem] space-y-6 group shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-16 h-16 text-studio" />
             </div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-studio flex items-center justify-center">
                   <Database className="w-4 h-4 text-black fill-black" />
                </div>
                <h5 className="text-xs font-black text-white uppercase italic tracking-tighter">Billing Protocol Support</h5>
             </div>
             <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest relative z-10">
                Facing transmission errors or payment routing delays? Initialize a support uplink with our financial architects.
             </p>
             <div className="pt-4 flex items-center gap-3 text-[10px] font-black text-studio uppercase tracking-widest relative z-10 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                OPEN FINANCIAL UPLINK <ArrowRight className="w-4 h-4" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
