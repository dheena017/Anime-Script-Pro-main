import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { RadioTower, MonitorPlay, MessageSquareWarning, Users, Smartphone, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { cn } from '../../lib/utils';
import { settingsService } from '../../services/settingsService';

export function NotificationSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  if (!user) return null;
  const [channels, setChannels] = useState({
    render: true, alerts: true, collab: true, mobile: true
  });
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function hydrate() {
      const dbSettings = await settingsService.getSettings();
      if (dbSettings && dbSettings.notifications) {
        setChannels({ ...channels, ...dbSettings.notifications });
      }
      setLoading(false);
    }
    hydrate();
  }, []);

  const syncToCloud = useCallback(async (overrides: any) => {
    setIsSaving(true);
    const newConfig = { ...channels, ...overrides };
    await settingsService.updateSettings({ notifications: newConfig });
    setChannels(newConfig);
    setIsSaving(false);
  }, [channels]);

  if (loading) return <div className="w-full h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      {isSaving && (
         <div className="absolute top-4 right-8 z-50 flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/50 rounded-full animate-pulse transition-all">
            <Save className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white">Syncing Pings...</span>
         </div>
      )}

      <Card className="bg-[#0a0a0a]/80 backdrop-blur-3xl border-zinc-800/50 shadow-2xl relative overflow-hidden group rounded-3xl">
        <div className="absolute top-0 right-1/4 p-32 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        <CardHeader className="relative z-10 border-b border-zinc-900 pb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <RadioTower className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black text-white tracking-widest uppercase">Communication Sync</CardTitle>
              <CardDescription className="text-zinc-500 font-medium">Tune your frequency for incoming studio transmissions.</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-4 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className={cn("flex flex-col justify-between p-5 rounded-2xl border transition-all duration-500", channels.render ? "bg-red-500/5 border-red-500/30" : "bg-black/40 border-zinc-800/50")}>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <MonitorPlay className={cn("w-5 h-5", channels.render ? "text-red-500" : "text-zinc-500")} />
                   <p className="text-xs font-black text-white uppercase tracking-widest">Neural Render Triggers</p>
                 </div>
                 <ToggleSwitch active={channels.render} toggle={() => syncToCloud({render: !channels.render})} color="red" />
               </div>
             </div>

             <div className={cn("flex flex-col justify-between p-5 rounded-2xl border transition-all duration-500", channels.collab ? "bg-fuchsia-500/5 border-fuchsia-500/30" : "bg-black/40 border-zinc-800/50")}>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Users className={cn("w-5 h-5", channels.collab ? "text-fuchsia-500" : "text-zinc-500")} />
                   <p className="text-xs font-black text-white uppercase tracking-widest">Team Collab Pings</p>
                 </div>
                 <ToggleSwitch active={channels.collab} toggle={() => syncToCloud({collab: !channels.collab})} color="fuchsia" />
               </div>
             </div>

             <div className={cn("flex flex-col justify-between p-5 rounded-2xl border transition-all duration-500", channels.alerts ? "bg-yellow-500/5 border-yellow-500/30" : "bg-black/40 border-zinc-800/50")}>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <MessageSquareWarning className={cn("w-5 h-5", channels.alerts ? "text-yellow-500" : "text-zinc-500")} />
                   <p className="text-xs font-black text-white uppercase tracking-widest">Critical API Limits</p>
                 </div>
                 <ToggleSwitch active={channels.alerts} toggle={() => syncToCloud({alerts: !channels.alerts})} color="yellow" />
               </div>
             </div>

             <div className={cn("flex flex-col justify-between p-5 rounded-2xl border transition-all duration-500", channels.mobile ? "bg-emerald-500/5 border-emerald-500/30" : "bg-black/40 border-zinc-800/50")}>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Smartphone className={cn("w-5 h-5", channels.mobile ? "text-emerald-500" : "text-zinc-500")} />
                   <p className="text-xs font-black text-white uppercase tracking-widest">Mobile Push Sync</p>
                 </div>
                 <ToggleSwitch active={channels.mobile} toggle={() => syncToCloud({mobile: !channels.mobile})} color="emerald" />
               </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleSwitch({ active, toggle, color }: { active: boolean, toggle: () => void, color: string }) {
  const colorMap: Record<string, string> = { blue: "bg-blue-600", red: "bg-red-600", fuchsia: "bg-fuchsia-600", yellow: "bg-yellow-500", emerald: "bg-emerald-500" };
  return (
    <button onClick={toggle} className={cn("w-10 h-5 rounded-full relative transition-colors focus:outline-none flex-shrink-0 cursor-pointer shadow-inner border border-zinc-800/50", active ? colorMap[color] : "bg-zinc-800")}>
      <div className={cn("absolute top-[2px] w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm", active ? "left-[calc(100%-16px)] shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "left-[4px]")} />
    </button>
  );
}
