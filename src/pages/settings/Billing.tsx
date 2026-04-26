import { useEffect, useState, useCallback } from 'react';
import { CreditCard, Rocket, Check, Zap, Grip, TerminalSquare, Leaf, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { settingsService } from '../../services/settingsService';

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
     setIsSaving(false);
  }, [carbonOffset]);

  if (loading) return <div className="w-full h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-yellow-500 animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      {isSaving && (
         <div className="absolute top-4 right-8 z-50 flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/50 rounded-full animate-pulse transition-all">
            <Save className="w-3 h-3 text-yellow-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white">Syncing Matrix...</span>
         </div>
      )}
      
      {/* Premium Hero Card */}
      <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-b from-yellow-500/50 via-red-500/20 to-zinc-900 group shadow-[0_0_50px_rgba(234,179,8,0.15)]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        
        <Card className="bg-black/95 backdrop-blur-xl border-none h-full relative z-10 m-0 rounded-[calc(1.5rem-1px)]">
          <CardHeader className="pb-4">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-tr from-yellow-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-600/30">
                     <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-yellow-500 tracking-[0.4em] uppercase mb-1">Active Subscription Root</h3>
                    <h2 className="text-4xl font-black text-white uppercase tracking-widest flex items-center gap-2">Studio Pro <Zap className="w-6 h-6 text-yellow-500 fill-current" /></h2>
                  </div>
                </div>
                <div className="text-left md:text-right flex flex-col md:items-end gap-2">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Billing Recurrence</p>
                   <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-4 py-2 rounded-xl text-lg font-black uppercase tracking-wider shadow-inner">$49.99 / mo</div>
                   <p className="text-[9px] text-zinc-600 uppercase font-black">Renews on Oct 1, 2026</p>
                </div>
             </div>
          </CardHeader>
          <CardContent className="pt-6 border-t border-zinc-900/80 mt-4 relative">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div className="space-y-5">
                   <div className="flex items-start gap-4">
                      <div className="bg-yellow-500/10 rounded-full p-1 border border-yellow-500/20"><Check className="w-4 h-4 text-yellow-500 shrink-0" /></div>
                      <div>
                         <p className="text-sm font-black text-white tracking-widest uppercase">Unlimited Neural Generation</p>
                         <p className="text-[11px] text-zinc-500 font-bold uppercase mt-1">Unrestricted LLM queries and God Mode orchestrations.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="bg-yellow-500/10 rounded-full p-1 border border-yellow-500/20"><Check className="w-4 h-4 text-yellow-500 shrink-0" /></div>
                      <div>
                         <p className="text-sm font-black text-white tracking-widest uppercase">4K Video Synthesizer Hooks</p>
                         <p className="text-[11px] text-zinc-500 font-bold uppercase mt-1">Direct embedded API access to Neural Video arrays.</p>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden">
                       <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 blur-[40px] pointer-events-none" />
                       <div className="flex justify-between items-center mb-3">
                           <span className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2"><TerminalSquare className="w-4 h-4 text-red-500" /> GPU Token Burn</span>
                           <span className="text-[11px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded">84% Capacity</span>
                       </div>
                       <div className="w-full h-2 bg-black rounded-full overflow-hidden shadow-inner mb-2 border border-zinc-800/50">
                           <div className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 w-[84%] relative">
                              <div className="absolute inset-y-0 right-0 w-4 bg-white/30 animate-pulse" />
                           </div>
                       </div>
                    </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <Card className="bg-[#0a0a0a]/80 backdrop-blur-3xl border-zinc-800/50 rounded-3xl h-full">
               <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-black text-white tracking-widest uppercase flex items-center gap-2"><Grip className="w-4 h-4 text-zinc-500"/> Central Payment Routing</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="p-5 border border-zinc-800 bg-zinc-900/30 rounded-2xl flex items-center justify-between hover:border-zinc-700 transition-colors">
                     <div className="flex items-center gap-4">
                     <div className="w-14 h-10 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center border border-zinc-700 shadow-inner">
                        <CreditCard className="w-5 h-5 text-zinc-400" />
                     </div>
                     <div>
                        <p className="text-sm font-black text-white tracking-widest uppercase">•••• 4242</p>
                     </div>
                     </div>
                     <Button variant="ghost" className="text-zinc-400 hover:text-white uppercase text-[10px] font-black tracking-widest bg-zinc-800/50">Swap</Button>
                  </div>

                  <div className="pt-4 border-t border-zinc-900/80">
                     <div className="flex justify-between items-center p-4 bg-emerald-950/10 border border-emerald-900/30 rounded-xl hover:bg-emerald-900/10 transition-colors cursor-pointer group" onClick={() => { setCarbonOffset(!carbonOffset); syncToCloud({carbon_offset: !carbonOffset}); }}>
                        <div>
                           <p className="text-[11px] font-black text-emerald-500 tracking-widest uppercase flex items-center gap-2 group-hover:text-emerald-400 transition-colors"><Leaf className="w-3 h-3" /> Carbon Offset Neutrality</p>
                           <p className="text-[9px] font-bold text-zinc-500 tracking-wider mt-1">Automatically donate 1% of sub to remove LLM compute emissions.</p>
                        </div>
                        <div className={cn("w-8 h-4 rounded-full relative transition-colors", carbonOffset ? "bg-emerald-600" : "bg-zinc-800")}>
                           <div className={cn("absolute top-[2px] w-3 h-3 bg-white rounded-full shadow-sm transition-transform", carbonOffset ? "left-[calc(100%-14px)]" : "left-[2px]")} />
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
