import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Database, RefreshCw, ArchiveX, FolderSync, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { settingsService } from '../../services/settingsService';

export function DataStorageSettings() {
   const { user } = useAuth();
   const navigate = useNavigate();
   useEffect(() => {
      if (!user) {
         navigate('/auth');
      }
   }, [user, navigate]);
   if (!user) return null;
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
     setIsSaving(false);
  }, [frequency, pruning]);

  if (loading) return <div className="w-full h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-sky-500 animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      {isSaving && (
         <div className="absolute top-4 right-8 z-50 flex items-center gap-2 px-3 py-1.5 bg-sky-500/20 border border-sky-500/50 rounded-full animate-pulse transition-all">
            <Save className="w-3 h-3 text-sky-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white">Syncing DB Logic...</span>
         </div>
      )}

      <Card className="bg-[#0a0a0a]/80 backdrop-blur-3xl border-zinc-800/50 shadow-2xl relative overflow-hidden group rounded-3xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-600/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-sky-600/10 transition-colors duration-1000" />
        
        <CardHeader className="relative z-10 border-b border-zinc-900 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
                 <Database className="w-5 h-5 text-sky-400" />
               </div>
               <div>
                  <CardTitle className="text-2xl font-black text-white tracking-widest uppercase">Storage Integrity</CardTitle>
                  <CardDescription className="text-zinc-500 font-medium">Cloud footprints, archive dumps, and database infrastructure rules.</CardDescription>
               </div>
            </div>
            <Button variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-900/20 hover:bg-sky-900/40 font-black uppercase text-[10px] tracking-widest hidden md:flex"><RefreshCw className="w-3 h-3 mr-2" /> Force Cloud Sync</Button>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-10 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="space-y-3 bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800/50">
                <label className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><FolderSync className="w-3 h-3 text-sky-500"/> Continuous Save Frequency</label>
                <select value={frequency} onChange={(e) => { setFrequency(e.target.value); syncToCloud({frequency: e.target.value}); }} className="w-full bg-black border border-zinc-800 text-[11px] font-bold text-zinc-300 p-3 rounded-xl focus:border-sky-500">
                   <option>Auto-Commit Every Keystroke</option>
                   <option>Batch Save Every 1 minute</option>
                   <option>Batch Save Every 5 minutes</option>
                   <option>Manual Commit Only (Danger)</option>
                </select>
             </div>
             
             <div className="space-y-3 bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800/50">
                <label className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><ArchiveX className="w-3 h-3 text-red-400"/> Version History Pruning</label>
                <select value={pruning} onChange={(e) => { setPruning(e.target.value); syncToCloud({pruning: e.target.value}); }} className="w-full bg-black border border-zinc-800 text-[11px] font-bold text-zinc-300 p-3 rounded-xl focus:border-red-500">
                   <option>Truncate after 50 snapshots</option>
                   <option>Keep last 100 timeline records</option>
                   <option>Retain ALL (Consumes Storage rapidly)</option>
                </select>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
