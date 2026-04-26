import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Camera, Sparkles, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { settingsService } from '../../services/settingsService';
import { StudioLoading } from '../../components/studio/StudioLoading';


export function ProfileSettings() {
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || user?.user_metadata?.display_name || '');
  const [role, setRole] = useState('Executive Producer');
  const [timezone, setTimezone] = useState('GMT-8 (Pacific Studio Time)');
  const [vision, setVision] = useState('');
  const [publicVisible, setPublicVisible] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    async function hydrate() {
      const dbSettings = await settingsService.getSettings();
      if (dbSettings && dbSettings.profile) {
        const p = dbSettings.profile;
        if (p.display_name) setDisplayName(p.display_name);
        if (p.role) setRole(p.role);
        if (p.timezone) setTimezone(p.timezone);
        if (p.vision) setVision(p.vision);
        if (p.public_visible !== undefined) setPublicVisible(p.public_visible);
      }
      setLoading(false);
    }
    hydrate();
  }, []);

  const syncToCloud = useCallback(async (payloadOverrides = {}) => {
    setIsSaving(true);
    await settingsService.updateSettings({
      profile: {
        display_name: displayName,
        role,
        timezone,
        vision,
        public_visible: publicVisible,
        ...payloadOverrides
      }
    });
    setIsSaving(false);
  }, [displayName, role, timezone, vision, publicVisible]);

  if (loading) {
     return <StudioLoading fullPage={false} message="Hydrating Profile..." submessage="Syncing identity metadata with the production cloud..." />;
  }


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      {isSaving && (
         <div className="absolute top-4 right-8 z-50 flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full animate-pulse transition-all">
            <Save className="w-3 h-3 text-red-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white">Syncing ID...</span>
         </div>
      )}

      <Card className="bg-[#0a0a0a]/80 backdrop-blur-3xl border-zinc-800/50 shadow-2xl relative overflow-hidden group rounded-3xl">
        <div className="absolute top-0 right-0 p-32 bg-red-600/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-red-600/10 transition-colors duration-700" />
        
        <CardHeader className="relative z-10 border-b border-zinc-900 pb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <Sparkles className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black text-white tracking-widest uppercase">Public Identity</CardTitle>
              <CardDescription className="text-zinc-500 font-medium">Your universal signature across the Anime Script Pro network.</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-10 pt-8">
          <div className="flex items-center gap-8 p-6 bg-black/40 rounded-2xl border border-zinc-800/50 hover:border-red-500/30 transition-colors duration-500">
            <div className="relative group/avatar cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-red-600 to-fuchsia-600 rounded-full blur opacity-40 group-hover/avatar:opacity-75 transition duration-500"></div>
              <div className="relative w-28 h-28 rounded-full bg-zinc-900 border-2 border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                   <span className="text-4xl font-black text-zinc-700">{(user?.user_metadata?.full_name || user?.user_metadata?.display_name)?.[0] || 'U'}</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-zinc-200">Neural Network Avatar</h3>
              <div className="flex items-center gap-3">
                <Button className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-bold uppercase tracking-widest text-[10px]">Upload Mesh</Button>
                <Button variant="ghost" className="text-zinc-500 hover:text-red-400 font-bold uppercase tracking-widest text-[10px]">Remove</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 relative group/input">
              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Director Name</label>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} onBlur={() => syncToCloud()} type="text" className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm font-medium text-white focus:border-red-500 focus:outline-none transition-all" />
            </div>

            <div className="space-y-3 relative group/input opacity-70">
              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Contact Node</label>
              <input type="email" defaultValue={user?.email || 'dheena@gmail.com'} readOnly className="w-full p-4 bg-black/40 border border-zinc-800/50 rounded-xl text-sm font-medium text-zinc-500 cursor-not-allowed" />
            </div>

            <div className="space-y-3 relative group/input">
              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Production Role</label>
              <select value={role} onChange={(e) => { setRole(e.target.value); syncToCloud({role: e.target.value}); }} className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm font-medium text-white focus:border-red-500 focus:outline-none">
                <option>Executive Producer</option>
                <option>Lead Screenwriter</option>
                <option>Art Director</option>
                <option>Showrunner</option>
                <option>Solo Creator</option>
              </select>
            </div>

            <div className="space-y-3 relative group/input">
              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Studio Base (Timezone)</label>
              <select value={timezone} onChange={(e) => { setTimezone(e.target.value); syncToCloud({timezone: e.target.value}); }} className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm font-medium text-white focus:border-red-500 focus:outline-none">
                <option>GMT-8 (Pacific Studio Time)</option>
                <option>GMT-5 (Eastern Hub)</option>
                <option>GMT+0 (London Central)</option>
                <option>GMT+9 (Tokyo / Global East)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 relative group/input border-t border-zinc-900/50 pt-6">
             <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Vision Statement / Bio</label>
             <textarea value={vision} onChange={(e) => setVision(e.target.value)} onBlur={() => syncToCloud()} rows={4} className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm font-medium text-white focus:border-red-500 focus:outline-none transition-all resize-none" />
          </div>

          <div className="pt-6 border-t border-zinc-900/50 space-y-6">
             <div className="flex items-center justify-between">
                <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><Eye className="w-4 h-4 text-green-500" /> Public Portfolio Visibility</h4>
                   <p className="text-[11px] text-zinc-500 font-bold uppercase mt-1">Allow other creators to view your generated works.</p>
                </div>
                <div onClick={() => { setPublicVisible(!publicVisible); syncToCloud({public_visible: !publicVisible}); }} className={`w-12 h-6 rounded-full relative cursor-pointer border border-zinc-700 transition-colors ${publicVisible ? 'bg-green-600' : 'bg-zinc-800'}`}>
                  <div className={`absolute top-[2px] w-5 h-5 bg-white rounded-full transition-transform ${publicVisible ? 'left-[calc(100%-22px)]' : 'left-[2px]'}`} />
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
