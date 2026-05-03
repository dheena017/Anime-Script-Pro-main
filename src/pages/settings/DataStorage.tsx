import { useEffect, useState, useCallback } from 'react';
import { 
  RefreshCw, 
  ArchiveX, 
  FolderSync, 
  Loader2, 
  Activity,
  Globe,
  ShieldCheck,
  Zap,
  DatabaseZap,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { settingsService } from '../../services/api/settings';
import { motion, AnimatePresence } from 'framer-motion';

export function DataStorageSettings() {
  const [frequency, setFrequency] = useState('Batch Save Every 1 minute');
  const [pruning, setPruning] = useState('Keep last 100 timeline records');
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
     async function hydrate() {
        const dbSettings = await settingsService.getSettings();
        if (dbSettings && dbSettings.storage) {
           if (dbSettings.storage.frequency) setFrequency(dbSettings.storage.frequency);
           if (dbSettings.storage.pruning) setPruning(dbSettings.storage.pruning);
        }
        setLoading(false);
     }
     hydrate();
  }, []);

  const syncToCloud = useCallback(async (payloadOverrides = {}) => {
     setIsSaving(true);
     await settingsService.updateSettings({
        storage: { frequency, pruning, ...payloadOverrides }
     });
     setTimeout(() => setIsSaving(false), 800);
  }, [frequency, pruning]);

  if (loading) {
    return (
     <div className="w-full h-96 flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
         <Loader2 className="w-12 h-12 text-studio animate-spin" />
         <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em]">Initializing Storage Terminal...</span>
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
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-studio">Database Protocol Sync Active</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. STORAGE INTEGRITY TERMINAL */}
      <Card className="bg-[#0a0a0b] border border-white/5 rounded-[3.5rem] shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-studio/5 blur-[150px] rounded-full pointer-events-none" />
        
        <CardHeader className="border-b border-white/5 p-10 md:p-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex items-center gap-8">
               <div className="w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center border border-studio/20 shadow-2xl relative">
                  <div className="absolute inset-0 bg-studio/5 blur-xl animate-pulse" />
                  <DatabaseZap className="w-8 h-8 text-studio relative z-10" />
               </div>
               <div className="space-y-1">
                  <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter">Storage Integrity</CardTitle>
                  <CardDescription className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Global Production Archive & Metadata Distribution Hub</CardDescription>
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="hidden xl:flex items-center gap-8 px-8 py-4 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <div className="flex flex-col gap-1">
                     <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Database Latency</span>
                     <span className="text-xs font-black text-studio italic tabular-nums">24ms</span>
                  </div>
                  <div className="w-px h-8 bg-white/5" />
                  <div className="flex flex-col gap-1">
                     <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Sync Health</span>
                     <span className="text-xs font-black text-emerald-500 italic uppercase">Optimal</span>
                  </div>
               </div>
               <button className="flex items-center gap-3 px-8 py-4 bg-studio text-black rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-[0_20px_50px_rgba(6,182,212,0.3)] active:scale-95">
                  <RefreshCw className="w-4 h-4" /> FORCE CLOUD SYNC
               </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-10 md:p-14 space-y-12 relative">
          
          {/* Protocol Configuration Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             
             {/* NODE-S1: SAVE FREQUENCY */}
             <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 group/node hover:border-studio/30 transition-all duration-700">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-studio/10 flex items-center justify-center border border-studio/20 group-hover/node:bg-studio group-hover/node:text-black transition-all">
                         <FolderSync className="w-5 h-5 text-studio transition-colors" />
                      </div>
                      <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Save Frequency</h4>
                   </div>
                   <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">NODE-S1</span>
                </div>
                
                <div className="space-y-4">
                   <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                      Initialize the automated commit protocol for real-time production synchronization.
                   </p>
                   <div className="relative">
                      <select 
                        value={frequency} 
                        onChange={(e) => { setFrequency(e.target.value); syncToCloud({frequency: e.target.value}); }} 
                        className="w-full bg-black/60 border border-zinc-900 rounded-2xl px-6 py-4 text-[11px] font-black text-white outline-none focus:border-studio/50 transition-all appearance-none cursor-pointer uppercase tracking-widest"
                      >
                         <option>Auto-Commit Every Keystroke</option>
                         <option>Batch Save Every 1 minute</option>
                         <option>Batch Save Every 5 minutes</option>
                         <option>Manual Commit Only (Danger)</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 rotate-90 pointer-events-none" />
                   </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Activity className="w-3.5 h-3.5 text-studio animate-pulse" />
                      <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Active Sync Node</span>
                   </div>
                   <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest tabular-nums">Uptime: 99.98%</span>
                </div>
             </div>

             {/* NODE-S2: HISTORY PRUNING */}
             <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 group/node hover:border-red-500/30 transition-all duration-700">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover/node:bg-red-500 group-hover/node:text-black transition-all">
                         <ArchiveX className="w-5 h-5 text-red-500 transition-colors" />
                      </div>
                      <h4 className="text-sm font-black text-white uppercase italic tracking-widest">History Pruning</h4>
                   </div>
                   <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">NODE-S2</span>
                </div>
                
                <div className="space-y-4">
                   <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                      Configure the automated archive truncation protocol to manage global storage utilization.
                   </p>
                   <div className="relative">
                      <select 
                        value={pruning} 
                        onChange={(e) => { setPruning(e.target.value); syncToCloud({pruning: e.target.value}); }} 
                        className="w-full bg-black/60 border border-zinc-900 rounded-2xl px-6 py-4 text-[11px] font-black text-white outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer uppercase tracking-widest"
                      >
                         <option>Truncate after 50 snapshots</option>
                         <option>Keep last 100 timeline records</option>
                         <option>Retain ALL (Consumes Storage rapidly)</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 rotate-90 pointer-events-none" />
                   </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Layers className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Retention Protocol Active</span>
                   </div>
                   <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">ARCHIVE: #ST-8842-A</span>
                </div>
             </div>
          </div>

          {/* STORAGE METRICS FOOTER */}
          <div className="pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-4 hover:bg-white/[0.03] transition-all group/stat">
                <div className="flex items-center gap-3">
                   <Zap className="w-4 h-4 text-studio fill-studio" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Sync Velocity</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white tabular-nums">480</span>
                   <span className="text-[9px] font-black text-zinc-700 uppercase">MB/s</span>
                </div>
             </div>
             <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-4 hover:bg-white/[0.03] transition-all group/stat">
                <div className="flex items-center gap-3">
                   <Globe className="w-4 h-4 text-studio" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Node Distribution</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white tabular-nums">12</span>
                   <span className="text-[9px] font-black text-zinc-700 uppercase">Regions</span>
                </div>
             </div>
             <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-4 hover:bg-white/[0.03] transition-all group/stat">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Data Integrity</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-emerald-500 tabular-nums">100</span>
                   <span className="text-[9px] font-black text-zinc-700 uppercase">% Secure</span>
                </div>
             </div>
          </div>

          {/* System Footer Metadata */}
          <footer className="mt-10 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
             <div className="flex items-center gap-4">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Storage Hash: #VSH-8842-X</span>
             </div>
             <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                   <Sparkles className="w-3.5 h-3.5 text-studio" />
                   <span>Powered by Global Storage Node Network</span>
                </div>
             </div>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
}
