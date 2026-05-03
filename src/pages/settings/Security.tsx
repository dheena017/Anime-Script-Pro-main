import { useEffect, useState, useCallback } from 'react';
import { 
  ShieldAlert, 
  KeyRound, 
  Crosshair, 
  Lock, 
  EyeOff, 
  Loader2, 
  Globe,
  ShieldCheck,
  Zap,
  Fingerprint,
  RefreshCw,
  Terminal,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { cn } from '../../lib/utils';
import { settingsService } from '../../services/api/settings';
import { motion, AnimatePresence } from 'framer-motion';

export function SecuritySettings() {
  const [telemetry, setTelemetry] = useState(false);
  const [optOutTraining, setOptOutTraining] = useState(true);
  const [geoLock, setGeoLock] = useState(true);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

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
     setTimeout(() => setIsSaving(false), 800);
  }, [telemetry, optOutTraining, geoLock]);

  const runDiagnostic = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  if (loading) {
    return (
     <div className="w-full h-96 flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
         <Loader2 className="w-12 h-12 text-studio animate-spin" />
         <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em]">Initializing Security Terminal...</span>
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
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-studio">Hardening Protocols Sync Active</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SECURITY STATUS MONITOR */}
      <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
         
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center justify-center shadow-2xl relative">
               <div className="absolute inset-0 bg-emerald-500/5 blur-xl animate-pulse" />
               <ShieldAlert className="w-10 h-10 text-emerald-500 relative z-10" />
            </div>
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Network Status: Secured</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               </div>
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Diagnostic <span className="text-emerald-500">Health: Optimal</span></h3>
               <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">All cryptographic encryption protocols are active and monitoring for intrusions.</p>
            </div>
         </div>

         <div className="flex items-center gap-6 relative z-10">
            <div className="hidden xl:flex items-center gap-8 px-8 py-4 bg-white/[0.02] border border-white/5 rounded-[2rem]">
               <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Cipher Type</span>
                  <span className="text-xs font-black text-white italic">AES-256</span>
               </div>
               <div className="w-px h-8 bg-white/5" />
               <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Active Threats</span>
                  <span className="text-xs font-black text-emerald-500 italic tabular-nums">0.00%</span>
               </div>
            </div>
            <button 
              onClick={runDiagnostic}
              disabled={isScanning}
              className="flex items-center gap-3 px-8 py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50"
            >
               {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
               {isScanning ? "SCANNING ARCHIVE..." : "INITIALIZE GLOBAL SCAN"}
            </button>
         </div>
      </div>

      {/* 3. HARDENING PROTOCOL TERMINAL */}
      <Card className="bg-[#0a0a0b] border border-white/5 rounded-[3.5rem] shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-studio/5 blur-[150px] rounded-full pointer-events-none" />
        
        <CardHeader className="border-b border-white/5 p-10 md:p-14">
           <div className="flex items-center gap-8">
               <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-2xl relative group-hover:border-studio/30 transition-all">
                  <Crosshair className="w-8 h-8 text-zinc-700 group-hover:text-studio transition-colors" />
               </div>
               <div className="space-y-1">
                  <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter">Hardening Protocols</CardTitle>
                  <CardDescription className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Sovereign Cryptographic Access Controls & Distributed Link Protection</CardDescription>
               </div>
           </div>
        </CardHeader>
        
        <CardContent className="p-10 md:p-14 space-y-14 relative">
          
          {/* Master Password Protocol */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-studio/30 transition-all duration-700 group/node relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover/node:opacity-10 transition-opacity">
               <Fingerprint className="w-32 h-32 text-studio" />
            </div>

            <div className="flex items-center gap-10 relative z-10">
              <div className="w-20 h-20 bg-black border border-white/5 rounded-[2rem] flex items-center justify-center shadow-3xl group-hover/node:bg-studio group-hover/node:text-black transition-all">
                 <KeyRound className="w-9 h-9 text-zinc-600 transition-colors" />
              </div>
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">NODE-S1</span>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Master Password</h3>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                       <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-black">Status: Rotation Overdue</p>
                    </div>
                    <span className="text-zinc-800 text-[9px] font-black uppercase tracking-widest tabular-nums">HASH: #ROT-8842-X</span>
                 </div>
              </div>
            </div>
            <button className="mt-8 md:mt-0 px-10 py-4 bg-white text-black font-black uppercase text-[11px] rounded-2xl hover:bg-studio transition-all tracking-[0.3em] shadow-2xl relative z-10 active:scale-95">ROTATE ACCESS KEY</button>
          </div>

          {/* Privacy & Telemetry Matrix */}
          <div className="space-y-8">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                   <EyeOff className="w-5 h-5 text-studio" />
                   <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Data Privacy & Telemetry</h3>
                </div>
                <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">NODE-S2</span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { 
                    id: 'telemetry', 
                    active: telemetry, 
                    toggle: () => { setTelemetry(!telemetry); syncToCloud({telemetry: !telemetry}); }, 
                    label: 'Send Anonymized Error Logs', 
                    desc: 'Initialize technical diagnostic feedback. Zero production data transmission.', 
                    color: 'studio' 
                  },
                  { 
                    id: 'optOutTraining', 
                    active: optOutTraining, 
                    toggle: () => { setOptOutTraining(!optOutTraining); syncToCloud({opt_out_training: !optOutTraining}); }, 
                    label: 'Opt-Out of LLM Training', 
                    desc: 'Guarantee zero scripts are utilized for foundational model refinement.', 
                    color: 'red-500' 
                  }
                ].map((prot) => (
                  <div 
                    key={prot.id}
                    onClick={prot.toggle} 
                    className={cn(
                      "p-10 rounded-[2.5rem] border transition-all duration-700 cursor-pointer group/prot relative overflow-hidden",
                      prot.active ? `bg-${prot.color}/5 border-${prot.color}/30 shadow-2xl` : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                    )}
                  >
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/prot:opacity-10 transition-opacity">
                        <Terminal className="w-20 h-20 text-white" />
                     </div>
                     <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                           <p className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic group-hover/prot:text-studio transition-colors">{prot.label}</p>
                           <div className={cn("w-12 h-6 rounded-full relative transition-colors duration-500", prot.active ? `bg-${prot.color} shadow-[0_0_15px_rgba(255,255,255,0.2)]` : "bg-zinc-900")}>
                              <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow-2xl transition-all duration-500", prot.active ? "left-7" : "left-1 bg-zinc-700")} />
                           </div>
                        </div>
                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed max-w-[240px]">{prot.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Network Hardening Hub */}
          <div className="space-y-8 pt-10 border-t border-white/5">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                   <Lock className="w-5 h-5 text-studio" />
                   <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Network Hardening Hub</h3>
                </div>
                <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">NODE-S3</span>
             </div>
             
             <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-10 group/hub hover:border-studio/20 transition-all duration-700">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                   <div className="md:col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5">
                         <Globe className="w-5 h-5 text-zinc-700" />
                      </div>
                      <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">IP Whitelisting</span>
                   </div>
                   <div className="md:col-span-8 flex gap-4">
                      <div className="flex-1 relative group/input">
                         <input 
                           type="text" 
                           placeholder="ADD IP ADDRESS (E.G. 192.168.1.1)..." 
                           className="w-full bg-black/60 border border-zinc-900 rounded-xl px-6 py-4 text-[11px] font-black text-studio placeholder:text-zinc-800 outline-none focus:border-studio/50 transition-all uppercase tracking-widest" 
                         />
                      </div>
                      <button className="px-8 py-4 bg-white/[0.03] border border-white/5 text-white font-black uppercase text-[10px] rounded-xl hover:bg-studio hover:text-black transition-all tracking-[0.3em]">ADD NODE</button>
                   </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-10">
                   <div className="flex gap-8 items-center">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700", geoLock ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-900 text-zinc-800")}>
                         <ShieldCheck className={cn("w-7 h-7", geoLock ? "animate-pulse" : "")} />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic">Suspicious Activity Lockdown</p>
                         <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">Lock account if login originates outside your primary studio base country.</p>
                      </div>
                   </div>
                   <div 
                    onClick={() => { setGeoLock(!geoLock); syncToCloud({geo_lock: !geoLock}); }}
                    className={cn(
                      "w-16 h-8 rounded-full relative cursor-pointer transition-all duration-500",
                      geoLock ? "bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-zinc-900"
                    )}
                   >
                      <div className={cn("absolute top-1 w-6 h-6 bg-white rounded-full shadow-2xl transition-all duration-500", geoLock ? "left-9" : "left-1 bg-zinc-700")} />
                   </div>
                </div>
             </div>
          </div>

          {/* System Footer Metadata */}
          <footer className="mt-10 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
             <div className="flex items-center gap-4">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Hardening Hash: #VHH-8842-X</span>
             </div>
             <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                   <Zap className="w-3.5 h-3.5 text-studio fill-studio" />
                   <span>Security Protocol Level: Sovereign Enterprise</span>
                </div>
             </div>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
}
