import { useEffect, useState, useCallback } from 'react';
import { ShieldAlert, KeyRound, Crosshair, Lock, EyeOff, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { settingsService } from '../../services/api/settings';

export function SecuritySettings() {

  const [telemetry, setTelemetry] = useState(false);
  const [optOutTraining, setOptOutTraining] = useState(true);
  const [geoLock, setGeoLock] = useState(true);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
     async function hydrate() {
        const dbSettings = await settingsService.getSettings();
        if (dbSettings && dbSettings.security) {
           if (dbSettings.security.telemetry !== undefined) setTelemetry(dbSettings.security.telemetry);
           if (dbSettings.security.opt_out_training !== undefined) setOptOutTraining(dbSettings.security.opt_out_training);
           if (dbSettings.security.geo_lock !== undefined) setGeoLock(dbSettings.security.geo_lock);
        }
        setLoading(false);
     }
     hydrate();
  }, []);

  const syncToCloud = useCallback(async (overrides: any) => {
     setIsSaving(true);
     await settingsService.updateSettings({
        security: { telemetry, opt_out_training: optOutTraining, geo_lock: geoLock, ...overrides }
     });
     setIsSaving(false);
  }, [telemetry, optOutTraining, geoLock]);

  if (loading) return <div className="w-full h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-green-500 animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      {isSaving && (
         <div className="absolute top-4 right-8 z-50 flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/50 rounded-full animate-pulse transition-all">
            <Save className="w-3 h-3 text-green-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white">Hardening Protocols...</span>
         </div>
      )}

      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-between shadow-[0_0_20px_rgba(34,197,94,0.1)]">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-full animate-pulse"><ShieldAlert className="w-5 h-5 text-green-500" /></div>
            <div>
               <h4 className="text-sm font-black text-green-500 uppercase tracking-widest">Network Status: Secured</h4>
               <p className="text-xs text-green-500/70 font-medium">All encryption protocols are active and monitoring.</p>
            </div>
         </div>
         <Button variant="outline" className="border-green-500/30 text-green-500 bg-green-500/10 uppercase tracking-widest font-black text-[10px]">Run Diagnostic</Button>
      </div>

      <Card className="bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-hidden group rounded-3xl">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-zinc-900/50 to-transparent pointer-events-none" />
        
        <CardHeader className="relative z-10 border-b border-zinc-900 pb-8">
           <div className="flex items-center gap-3">
               <div className="p-2.5 bg-zinc-800 rounded-xl border border-zinc-700 shadow-inner"><Crosshair className="w-5 h-5 text-zinc-300" /></div>
               <div>
               <CardTitle className="text-2xl font-black text-white tracking-widest uppercase">Security Protocols</CardTitle>
               <CardDescription className="text-zinc-500 font-medium">Cryptographic access controls for your studio.</CardDescription>
               </div>
           </div>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-4 pt-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl hover:bg-zinc-800/40 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-black border border-zinc-800 rounded-2xl flex items-center justify-center shadow-lg"><KeyRound className="w-6 h-6 text-zinc-400" /></div>
              <div>
                <p className="text-base font-black text-white uppercase tracking-widest">Master Password</p>
                <div className="flex gap-2 items-center mt-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /><p className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Last rotated 94 days ago</p></div>
              </div>
            </div>
            <Button className="mt-4 md:mt-0 bg-white text-black font-black uppercase text-[10px] h-10 px-6 rounded-xl hover:bg-zinc-200">Rotate Key</Button>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-900 space-y-6">
             <div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2"><EyeOff className="w-5 h-5 text-zinc-500" /> Data Privacy & Telemetry</h3>
                <p className="text-[11px] text-zinc-500 font-bold uppercase mt-1">Control telemetry sent to Anime Script Pro engineers.</p>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-5 bg-black/40 border border-zinc-800/50 rounded-xl cursor-pointer group hover:border-zinc-700" onClick={() => { setTelemetry(!telemetry); syncToCloud({telemetry: !telemetry}); }}>
                   <div>
                     <p className="text-sm font-bold text-white uppercase tracking-widest">Send Anonymized Error Logs</p>
                     <p className="text-[10px] text-zinc-500 font-bold">Helps us fix crashes. Contains zero script data.</p>
                   </div>
                   <div className={cn("w-10 h-5 rounded-full relative transition-colors", telemetry ? "bg-zinc-400" : "bg-zinc-800")}>
                      <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-zinc-200 transition-transform", telemetry ? "left-[calc(100%-16px)]" : "left-1")} />
                   </div>
                </div>
                <div className="flex items-center justify-between p-5 bg-black/40 border border-zinc-800/50 rounded-xl cursor-pointer group hover:border-zinc-700" onClick={() => { setOptOutTraining(!optOutTraining); syncToCloud({opt_out_training: !optOutTraining}); }}>
                   <div>
                     <p className="text-sm font-bold text-white uppercase tracking-widest">Opt-Out of LLM Training Data</p>
                     <p className="text-[10px] text-zinc-500 font-bold">Gaurantees zero scripts are used to train foundational AI models.</p>
                   </div>
                   <div className={cn("w-10 h-5 rounded-full relative shadow-inner transition-colors", optOutTraining ? "bg-red-600" : "bg-zinc-800")}>
                      <div className={cn("absolute top-[2px] w-4 h-4 rounded-full shadow-sm transition-transform bg-white", optOutTraining ? "left-[calc(100%-18px)]" : "left-[2px]")} />
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-900 space-y-6">
             <div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2"><Lock className="w-5 h-5 text-zinc-500" /> Network Hardening</h3>
                <p className="text-[11px] text-zinc-500 font-bold uppercase mt-1">Defensive measures against unauthorized access.</p>
             </div>
             
             <div className="p-5 border border-zinc-800 bg-zinc-900/30 rounded-2xl space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-white">
                   <span className="flex items-center gap-2 pr-4 tracking-widest uppercase text-xs">IP Whitelisting</span>
                   <input type="text" placeholder="Add IP (e.g., 192.168.1.1)" className="w-full bg-black/50 border border-zinc-800 rounded-lg p-2 text-xs" />
                   <Button variant="outline" className="ml-2 border-zinc-700 h-9">Add</Button>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-800/50 pt-4 mt-2 cursor-pointer group" onClick={() => { setGeoLock(!geoLock); syncToCloud({geo_lock: !geoLock}); }}>
                   <div>
                     <p className="text-xs font-bold text-white tracking-widest uppercase group-hover:text-green-500 transition-colors">Suspicious Activity Triggers</p>
                     <p className="text-[10px] text-zinc-500">Lock account if login originates outside your base country.</p>
                   </div>
                   <div className={cn("w-10 h-5 rounded-full relative transition-colors", geoLock ? "bg-green-600" : "bg-zinc-800")}>
                      <div className={cn("absolute top-[2px] w-4 h-4 rounded-full bg-white transition-transform", geoLock ? "left-[calc(100%-18px)]" : "left-[2px]")} />
                   </div>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



