import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
   User,
   Zap,
   LogOut,
   Calendar,
   Award,
   Save,
   Loader2,
   Camera,
   AtSign,
   Activity,
   Star,
   Grid,
   ExternalLink,
   BookOpen,
   Users,
   Layout,
   Command,
   Bell,
   Lock,
   Moon,
   Sun,
   ShieldAlert,
   Mail,
   Trash2,
   FileText
} from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '../hooks/useAuth';
import { StudioLoading } from '../components/studio/StudioLoading';


// Custom GitHub Icon SVG since Lucide-react doesn't include brand icons
const GithubIcon = ({ className }: { className?: string }) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
   </svg>
);

export function ProfilePage() {
   const { user, loading: authLoading, signOut } = useAuth();
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [activeTab, setActiveTab] = useState<'generations' | 'library' | 'config' | 'security'>('generations');
   const [vaultFilter, setVaultFilter] = useState<'all' | 'favorites'>('all');

   // Dialog States
   const [showPromptModal, setShowPromptModal] = useState(false);
   const [showDNAModal, setShowDNAModal] = useState(false);
   const [newPrompt, setNewPrompt] = useState({ label: '', text: '' });
   const [newDNA, setNewDNA] = useState({ name: '', prompt: '', seed: 12345 });

   // Profile State
   const [displayName, setDisplayName] = useState('');
   const [handle, setHandle] = useState('');
   const [bio, setBio] = useState('');
   const [avatarUrl, setAvatarUrl] = useState('');
   const [bannerUrl, setBannerUrl] = useState('');
   const [joinDate, setJoinDate] = useState('');

   // Library State
   const [savedPrompts, setSavedPrompts] = useState<any[]>([]);
   const [characters, setCharacters] = useState<any[]>([]);
   const [generations, setGenerations] = useState<any[]>([]);
   const [favorites, setFavorites] = useState<any[]>([]);

   // Config & Security State
   const [aspectRatio, setAspectRatio] = useState('16:9');
   const [defaultModelStyle, setDefaultModelStyle] = useState('Shonen');
   const [theme, setTheme] = useState<'dark' | 'light'>('dark');
   const [emailAlerts, setEmailAlerts] = useState({ upscale: true, generation: false, security: true });

   // Stats
   const [credits, setCredits] = useState(0);
   const [tier, setTier] = useState('Free');

   useEffect(() => {
      const fetchEverything = async () => {
         if (!user) {
            if (!authLoading) setLoading(false);
            return;
         }
         try {
            const [profileRes, balanceRes, assetsRes, favRes, promptsRes, charsRes, settingsRes] = await Promise.all([
               fetch(`http://localhost:8001/api/profiles/${user.id}`),
               fetch(`http://localhost:8001/api/balances/${user.id}`),
               fetch(`http://localhost:8001/api/assets/${user.id}`),
               fetch(`http://localhost:8001/api/favorites/${user.id}`),
               fetch(`http://localhost:8001/api/library/prompts/${user.id}`),
               fetch(`http://localhost:8001/api/library/characters/${user.id}`),
               fetch(`http://localhost:8001/api/settings/${user.id}`)
            ]);

            const profile = await profileRes.json();
            const balance = await balanceRes.json();
            const settings = await settingsRes.json();

            setDisplayName(profile.display_name || 'Shogun Architect');
            setHandle(profile.handle || `architect_${user.id.slice(0, 5)}`);
            setBio(profile.bio || 'Architect of neural narratives.');
            setAvatarUrl(profile.avatar_url || '');
            setBannerUrl(profile.banner_url || '');
            setJoinDate(new Date(profile.join_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

            setCredits(balance.credits || 0);
            setTier(balance.current_tier || 'Free');

            setGenerations(await assetsRes.json() || []);
            setFavorites(await favRes.json() || []);
            setSavedPrompts(await promptsRes.json() || []);
            setCharacters(await charsRes.json() || []);

            if (settings.studio_defaults) {
               setAspectRatio(settings.studio_defaults.aspectRatio || '16:9');
               setDefaultModelStyle(settings.studio_defaults.defaultModelStyle || 'Shonen');
               setTheme(settings.studio_defaults.theme || 'dark');
               if (settings.studio_defaults.theme === 'light') {
                  document.documentElement.classList.remove('dark');
               } else {
                  document.documentElement.classList.add('dark');
               }
            }
            if (settings.notifications) {
               setEmailAlerts(settings.notifications.email || { upscale: true, generation: false, security: true });
            }

         } catch (error) {
            console.error("Neural fetch failed:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchEverything();
   }, [user]);

   const handleSave = async () => {
      if (!user) return;
      setSaving(true);
      try {
         await fetch(`http://localhost:8001/api/profiles/${user.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               display_name: displayName, handle, bio, avatar_url: avatarUrl, banner_url: bannerUrl
            })
         });
         await fetch(`http://localhost:8001/api/settings/${user.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               studio_defaults: { aspectRatio, defaultModelStyle, theme },
               notifications: { email: emailAlerts }
            })
         });
      } finally {
         setTimeout(() => setSaving(false), 800);
      }
   };

   const addPrompt = async () => {
      if (!user || !newPrompt.label) return;
      const res = await fetch(`http://localhost:8001/api/library/prompts`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ ...newPrompt, user_id: user.id, prompt_text: newPrompt.text })
      });
      if (res.ok) {
         const saved = await res.json();
         setSavedPrompts([...savedPrompts, saved]);
         setShowPromptModal(false);
         setNewPrompt({ label: '', text: '' });
      }
   };

   const addDNA = async () => {
      if (!user || !newDNA.name) return;
      const res = await fetch(`http://localhost:8001/api/library/characters`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ ...newDNA, user_id: user.id, visual_prompt: newDNA.prompt })
      });
      if (res.ok) {
         const saved = await res.json();
         setCharacters([...characters, saved]);
         setShowDNAModal(false);
         setNewDNA({ name: '', prompt: '', seed: 12345 });
      }
   };

   const toggleTheme = (newTheme: 'dark' | 'light') => {
      setTheme(newTheme);
      if (newTheme === 'dark') {
         document.documentElement.classList.add('dark');
      } else {
         document.documentElement.classList.remove('dark');
      }
   };

   if (authLoading || (user && loading)) {
      return <StudioLoading message="Syncing Architect Node..." submessage="Establishing secure neural link and retrieving vault data..." />;
   }



   const tabs = [
      { id: 'generations', label: 'Vault', icon: Grid },
      { id: 'library', label: 'Library', icon: BookOpen },
      { id: 'config', label: 'Commands', icon: Command },
      { id: 'security', label: 'Defense', icon: Lock }
   ];

   const displayedGenerations = vaultFilter === 'all' ? generations : favorites;

   return (
      <div className={`max-w-[1400px] mx-auto space-y-12 pb-32 font-sans select-none ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-zinc-50 text-black'}`}>
         {/* 1. HERO HEADER */}
         <div className="relative rounded-[4rem] overflow-hidden border border-zinc-800/50 bg-black shadow-2xl group/hero">
            <div className="relative h-[480px] overflow-hidden">
               {bannerUrl ? (
                  <img src={bannerUrl} className="w-full h-full object-cover opacity-60" alt="Banner" />
               ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-[#bd4a4a]/20" />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

               <div className="absolute bottom-16 left-16 right-16 flex items-end justify-between">
                  <div className="flex items-end gap-12">
                     <div className="w-48 h-48 rounded-[3rem] bg-zinc-950 border-[6px] border-zinc-950 shadow-2xl overflow-hidden relative group/avatar">
                        {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full flex items-center justify-center"><User className="w-20 h-20 text-zinc-900" /></div>}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center cursor-pointer"><Camera className="w-8 h-8 text-white" /></div>
                     </div>
                     <div className="pb-4 space-y-4">
                        <div className="flex items-center gap-6">
                           <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-transparent border-none p-0 h-auto text-5xl font-black tracking-tighter text-white uppercase italic focus:outline-none w-auto max-w-xl" placeholder="Architect Name" />
                           <div className="px-4 py-1 bg-[#bd4a4a] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(189,74,74,0.3)]">{tier} Tier</div>
                        </div>
                        <div className="flex items-center gap-6 text-zinc-500 font-black uppercase tracking-widest text-[10px]">
                           <div className="flex items-center gap-2 bg-white/5 py-1 px-4 rounded-xl border border-white/5 backdrop-blur-md px-6">
                              <AtSign className="w-3.5 h-3.5 text-[#bd4a4a]" />
                              <input value={handle} onChange={(e) => setHandle(e.target.value)} className="bg-transparent border-none p-0 h-auto text-xs font-bold text-zinc-400 focus:outline-none w-32 lowercase tracking-widest" placeholder="handle" />
                           </div>
                           <div className="flex items-center gap-2 bg-zinc-900/40 py-1 px-4 rounded-xl border border-white/5 hover:border-[#bd4a4a]/40 transition-all cursor-pointer">
                              <GithubIcon className="w-3.5 h-3.5 text-zinc-500" />
                              <span className="text-[9px] lowercase tracking-widest">github.com/{handle}</span>
                           </div>
                           <Calendar className="w-3.5 h-3.5 text-[#bd4a4a]/40" /> Activated {joinDate}
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <Button onClick={signOut} variant="outline" className="border-zinc-800 text-zinc-500 hover:text-white hover:bg-white/5 rounded-[2rem] px-8 h-16 font-black uppercase tracking-widest text-[9px] flex gap-3 transition-all">
                        <LogOut className="w-3.5 h-3.5" /> Deactivate
                     </Button>
                     <Button onClick={handleSave} disabled={saving} className="bg-[#bd4a4a] hover:bg-[#d45555] rounded-[2rem] px-12 h-16 font-black uppercase tracking-widest text-[10px] flex gap-4 transition-all shadow-2xl text-white">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Sync Identity
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. TABS */}
         <div className="flex justify-center">
            <div className="flex bg-zinc-900/40 p-1.5 rounded-[2.5rem] border border-zinc-800/50 backdrop-blur-3xl">
               {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-400'}`}>
                     {activeTab === tab.id && <motion.div layoutId="tab-pill" className="absolute inset-0 bg-white/5 rounded-[2.2rem] border border-white/10" />}
                     <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? 'text-[#bd4a4a]' : ''}`} />
                     <span className="text-[10px] font-black uppercase tracking-widest relative z-10">{tab.label}</span>
                  </button>
               ))}
            </div>
         </div>

         {/* 3. CONTENT */}
         <div className="px-6 min-h-[500px]">
            <AnimatePresence mode="wait">
               {activeTab === 'generations' && (
                  <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                     <div className="flex items-center gap-4">
                        <button onClick={() => setVaultFilter('all')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${vaultFilter === 'all' ? 'bg-[#bd4a4a] text-white shadow-lg' : 'bg-zinc-900/40 text-zinc-500 hover:text-zinc-300'}`}>All Records</button>
                        <button onClick={() => setVaultFilter('favorites')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${vaultFilter === 'favorites' ? 'bg-yellow-500 text-black shadow-lg' : 'bg-zinc-900/40 text-zinc-500 hover:text-zinc-300'}`}>Bookmarked Visions ({favorites.length})</button>
                     </div>

                     <div className="grid grid-cols-4 gap-8">
                        {displayedGenerations.length > 0 ? displayedGenerations.map((g, i) => (
                           <div key={i} className="aspect-[3/4] bg-zinc-900/20 rounded-[2.5rem] border border-zinc-800/50 overflow-hidden relative group hover:border-[#bd4a4a]/30 transition-all">
                              <img src={g.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Gen" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all">
                                 <p className="text-[9px] font-black text-white uppercase tracking-widest mb-1 italic line-clamp-2">"{g.prompt}"</p>
                                 <div className="flex items-center justify-between">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <div className="flex gap-2">
                                       <span title="Commit to Repository"><GithubIcon className="w-3.5 h-3.5 text-zinc-400 hover:text-white cursor-pointer transition-colors" /></span>
                                       <span title="View Source"><ExternalLink className="w-3.5 h-3.5 text-zinc-400 hover:text-white cursor-pointer transition-colors" /></span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )) : (
                           <div className="col-span-full py-40 text-center space-y-4 opacity-40">
                              <Grid className="w-16 h-16 text-zinc-800 mx-auto" />
                              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Vault Memories Empty</p>
                           </div>
                        )}
                     </div>
                  </motion.div>
               )}

               {activeTab === 'library' && (
                  <motion.div key="lib" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-2 gap-12">
                     <Card className="bg-zinc-900/10 border-zinc-800 rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-zinc-900/50">
                           <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><Command className="w-4 h-4 text-[#bd4a4a]" /> Saved Templates</CardTitle>
                              <Button onClick={() => setShowPromptModal(true)} variant="ghost" className="text-[9px] font-black uppercase text-[#bd4a4a] hover:bg-[#bd4a4a]/10">+ Deploy Node</Button>
                           </div>
                           <CardDescription className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Reusable neural blueprints for rapid world-building.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                           {savedPrompts.map((p, i) => (
                              <div key={i} className="p-6 bg-zinc-900/20 border border-zinc-800/40 rounded-3xl hover:border-[#bd4a4a]/20 transition-all cursor-pointer group">
                                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 group-hover:text-[#bd4a4a] transition-colors">{p.label}</p>
                                 <p className="text-sm text-zinc-300 font-medium italic line-clamp-2">"{p.prompt_text}"</p>
                              </div>
                           ))}
                           {savedPrompts.length === 0 && <div className="p-20 text-center border border-zinc-900 border-dashed rounded-[3rem] text-[9px] font-black text-zinc-700 uppercase tracking-widest">Architectural Templates Empty</div>}
                        </CardContent>
                     </Card>

                     <Card className="bg-zinc-900/10 border-zinc-800 rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-zinc-900/50">
                           <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><Users className="w-4 h-4 text-[#bd4a4a]" /> DNA Cards</CardTitle>
                              <Button onClick={() => setShowDNAModal(true)} variant="ghost" className="text-[9px] font-black uppercase text-[#bd4a4a] hover:bg-[#bd4a4a]/10">+ Forge Hybrid</Button>
                           </div>
                           <CardDescription className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Visual signatures for recurring character consistency.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                           <div className="grid grid-cols-2 gap-6">
                              {characters.map((c, i) => (
                                 <div key={i} className="bg-zinc-900/20 border border-zinc-800/40 rounded-[2rem] p-5 space-y-4 hover:border-[#bd4a4a]/20 transition-all">
                                    <div className="w-full aspect-square bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-900">
                                       {c.reference_image_url ? <img src={c.reference_image_url} className="w-full h-full object-cover" alt="Char" /> : <div className="w-full h-full flex items-center justify-center"><User className="w-10 h-10 text-zinc-800" /></div>}
                                    </div>
                                    <p className="text-xs font-black text-white uppercase tracking-tighter truncate italic">{c.name}</p>
                                 </div>
                              ))}
                              {characters.length === 0 && <div className="col-span-full py-20 text-center border border-zinc-900 border-dashed rounded-[2rem] text-[9px] font-black text-zinc-700 uppercase tracking-widest">Character DNA Empty</div>}
                           </div>
                        </CardContent>
                     </Card>

                     <Card className="col-span-full bg-[#bd4a4a]/5 border border-[#bd4a4a]/20 rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-[#bd4a4a]/10">
                           <CardTitle className="text-sm font-black text-[#bd4a4a] uppercase tracking-[0.3em] flex items-center gap-3 italic"><FileText className="w-4 h-4" /> Production Logs</CardTitle>
                           <CardDescription className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Detailed technical blueprints and narrative scripts exported from the studio.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-12 text-center space-y-4 opacity-30">
                           <FileText className="w-12 h-12 text-[#bd4a4a] mx-auto" />
                           <p className="text-[9px] font-black uppercase tracking-[0.4em]">No Production Exports Detected</p>
                        </CardContent>
                     </Card>
                  </motion.div>
               )}

               {activeTab === 'config' && (
                  <motion.div key="conf" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-5xl mx-auto space-y-12 pt-8">
                     <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-10">
                           <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><Layout className="w-4 h-4 text-[#bd4a4a]" /> Workspace Geometry</h4>
                           <div className="flex gap-4">
                              {['16:9', '9:16', '1:1'].map((ratio) => (
                                 <div key={ratio} onClick={() => setAspectRatio(ratio)} className={`flex-1 p-6 rounded-[2rem] border transition-all cursor-pointer text-center ${aspectRatio === ratio ? 'bg-[#bd4a4a]/10 border-[#bd4a4a] text-white shadow-xl' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'}`}>
                                    <p className="text-xs font-black tracking-widest">{ratio}</p>
                                 </div>
                              ))}
                           </div>
                           <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><Moon className="w-4 h-4 text-[#bd4a4a]" /> Visual Mode</h4>
                           <div className="flex gap-4">
                              <button onClick={() => toggleTheme('dark')} className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-[2rem] border transition-all ${theme === 'dark' ? 'bg-[#bd4a4a]/10 border-[#bd4a4a] text-white' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'}`}>
                                 <Moon className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Midnight (Dark)</span>
                              </button>
                              <button onClick={() => toggleTheme('light')} className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-[2rem] border transition-all ${theme === 'light' ? 'bg-zinc-200 border-zinc-300 text-black shadow-lg' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'}`}>
                                 <Sun className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Radiant (Light)</span>
                              </button>
                           </div>
                        </div>
                        <div className="space-y-10">
                           <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><Bell className="w-4 h-4 text-[#bd4a4a]" /> Transmission Alerts</h4>
                           <div className="space-y-4">
                              {Object.entries(emailAlerts).map(([key, val]) => (
                                 <div key={key} onClick={() => setEmailAlerts({ ...emailAlerts, [key]: !val })} className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl flex items-center justify-between cursor-pointer group hover:border-[#bd4a4a]/20">
                                    <div className="flex items-center gap-4">
                                       <div className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-700'}`} />
                                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-white transition-colors">{key} Notifications</p>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${val ? 'bg-[#bd4a4a]' : 'bg-zinc-800'}`}>
                                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${val ? 'right-1' : 'left-1'}`} />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-8 pt-12 border-t border-zinc-900">
                        <Card className="bg-zinc-900/20 border-zinc-800 p-8 rounded-[3rem] space-y-4">
                           <CardHeader className="p-0 space-y-1">
                              <div className="flex items-center justify-between">
                                 <CardTitle className="text-[10px] font-black text-[#bd4a4a] uppercase tracking-widest">Neural Balance</CardTitle>
                                 <Zap className="w-4 h-4 text-[#bd4a4a]" />
                              </div>
                              <CardDescription className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Refill in 6 hours</CardDescription>
                           </CardHeader>
                           <CardContent className="p-0">
                              <p className="text-4xl font-black text-white italic tracking-tighter">{credits.toLocaleString()} <span className="text-[10px] not-italic text-zinc-600">Credits</span></p>
                           </CardContent>
                        </Card>
                        <Card className="bg-zinc-900/20 border-zinc-800 p-8 rounded-[3rem] space-y-4">
                           <CardHeader className="p-0 space-y-1">
                              <div className="flex items-center justify-between">
                                 <CardTitle className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Production Rank</CardTitle>
                                 <Award className="w-4 h-4 text-blue-500" />
                              </div>
                              <CardDescription className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Top 5% Globally</CardDescription>
                           </CardHeader>
                           <CardContent className="p-0">
                              <p className="text-4xl font-black text-white italic tracking-tighter">{tier} <span className="text-[10px] not-italic text-zinc-600">Architect</span></p>
                           </CardContent>
                        </Card>
                        <Card className="bg-zinc-900/20 border-zinc-800 p-8 rounded-[3rem] space-y-4">
                           <CardHeader className="p-0 space-y-1">
                              <div className="flex items-center justify-between">
                                 <CardTitle className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Studio Uptime</CardTitle>
                                 <Activity className="w-4 h-4 text-emerald-500" />
                              </div>
                              <CardDescription className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Nodes Active</CardDescription>
                           </CardHeader>
                           <CardContent className="p-0">
                              <p className="text-4xl font-black text-white italic tracking-tighter">99.9<span className="text-xl">%</span></p>
                           </CardContent>
                        </Card>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'security' && (
                  <motion.div key="sec" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-4xl mx-auto space-y-12 pt-8">
                     <div className="grid grid-cols-2 gap-12">
                        <Card className="bg-zinc-900/10 border-zinc-800 p-10 rounded-[3rem] space-y-8">
                           <CardHeader className="p-0">
                              <CardTitle className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><ShieldAlert className="w-4 h-4 text-orange-500" /> Identity Protection</CardTitle>
                              <CardDescription className="text-[9px] font-bold text-zinc-600 uppercase mt-2">Manage your multi-factor credentials and linked identities.</CardDescription>
                           </CardHeader>
                           <CardContent className="p-0 space-y-4">
                              <Button variant="outline" className="w-full h-14 bg-zinc-900/60 border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all">Update Credentials</Button>
                              <div className="flex gap-4">
                                 <Button className="flex-1 h-14 bg-zinc-900/40 border border-zinc-800 text-zinc-300 text-[9px] font-black uppercase tracking-widest flex gap-2 justify-center items-center"><GithubIcon className="w-4 h-4" /> Link GitHub</Button>
                                 <Button className="flex-1 h-14 bg-zinc-900/40 border border-zinc-800 text-zinc-300 text-[9px] font-black uppercase tracking-widest flex gap-2 justify-center items-center"><Mail className="w-4 h-4" /> Link Google</Button>
                              </div>
                           </CardContent>
                        </Card>
                        <Card className="bg-red-500/5 border border-red-500/20 p-10 rounded-[3rem] space-y-8">
                           <CardHeader className="p-0">
                              <CardTitle className="text-xs font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-3 italic"><Trash2 className="w-4 h-4" /> Destructive Protocols</CardTitle>
                              <CardDescription className="text-[9px] font-bold text-zinc-700 uppercase mt-2">Permanently purge your architect node from the neural network.</CardDescription>
                           </CardHeader>
                           <CardContent className="p-0 space-y-4">
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">Warning: Initiating node deletion will permanently purge all neural generation history, character DNA, and credit balances.</p>
                              <Button className="w-full h-14 bg-red-600/20 border border-red-600/40 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all">TERMINATE ARCHITECT NODE</Button>
                           </CardContent>
                        </Card>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* 4. MODALS */}
         <Dialog open={showPromptModal} onOpenChange={setShowPromptModal}>
            <DialogContent className="bg-zinc-950 border-zinc-800 rounded-[3rem] p-10 font-sans max-w-xl text-white">
               <DialogHeader className="space-y-3">
                  <DialogTitle className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                     <Command className="w-7 h-7 text-[#bd4a4a]" /> Forge Template
                  </DialogTitle>
                  <DialogDescription className="text-xs font-black text-zinc-600 uppercase tracking-widest">Define a reusable neural blueprint for rapid generation.</DialogDescription>
               </DialogHeader>
               <div className="space-y-8 py-8">
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Template Label</Label>
                     <Input value={newPrompt.label} onChange={(e) => setNewPrompt({ ...newPrompt, label: e.target.value })} className="bg-zinc-900 border-zinc-800 rounded-2xl h-14 text-white font-bold" placeholder="Cyberpunk 1990s Noir" />
                  </div>
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Directives (Prompt)</Label>
                     <textarea value={newPrompt.text} onChange={(e) => setNewPrompt({ ...newPrompt, text: e.target.value })} className="w-full bg-zinc-900 border-zinc-800 rounded-2xl p-6 text-white font-medium text-sm min-h-[150px] focus:outline-none focus:border-[#bd4a4a]/50" placeholder="1990s cel-shaded anime style, gritty city streets, neon haze..." />
                  </div>
               </div>
               <DialogFooter>
                  <Button onClick={addPrompt} className="w-full h-16 bg-[#bd4a4a] text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-[2rem] shadow-2xl">Initialize Template</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         <Dialog open={showDNAModal} onOpenChange={setShowDNAModal}>
            <DialogContent className="bg-zinc-950 border-zinc-800 rounded-[3rem] p-10 font-sans max-w-2xl text-white">
               <DialogHeader className="space-y-3">
                  <DialogTitle className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                     <Users className="w-7 h-7 text-[#bd4a4a]" /> Forge DNA Sheet
                  </DialogTitle>
                  <DialogDescription className="text-xs font-black text-zinc-600 uppercase tracking-widest">Lock in visual consistency for a reusable cast member.</DialogDescription>
               </DialogHeader>
               <div className="grid grid-cols-2 gap-10 py-8">
                  <div className="space-y-8">
                     <div className="space-y-3">
                        <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Character Identity</Label>
                        <Input value={newDNA.name} onChange={(e) => setNewDNA({ ...newDNA, name: e.target.value })} className="bg-zinc-900 border-zinc-800 rounded-2xl h-14 text-white font-bold" placeholder="Protagonist X" />
                     </div>
                     <div className="space-y-3">
                        <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Seed</Label>
                        <Input type="number" value={newDNA.seed} onChange={(e) => setNewDNA({ ...newDNA, seed: parseInt(e.target.value) })} className="bg-zinc-900 border-zinc-800 rounded-2xl h-14 text-white font-bold" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visual DNA (Prompt)</Label>
                     <textarea value={newDNA.prompt} onChange={(e) => setNewDNA({ ...newDNA, prompt: e.target.value })} className="w-full bg-zinc-900 border-zinc-800 rounded-2xl p-6 text-white font-medium text-sm min-h-[185px] focus:outline-none focus:border-[#bd4a4a]/50" placeholder="A teenage shonen protagonist with spiky white hair, wearing a red techwear jacket..." />
                  </div>
               </div>
               <DialogFooter>
                  <Button onClick={addDNA} className="w-full h-16 bg-[#bd4a4a] text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-[2rem] shadow-2xl">Authorize DNA Transfer</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
