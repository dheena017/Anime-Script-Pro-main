import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   User,
   LogOut,
   Calendar,
   Save,
   Loader2,
   Camera,
   AtSign,
   Grid,
   BookOpen,
   Users,
   Command,
   Lock,
   Mail,
   Zap} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { StudioLoading } from '@/components/studio/StudioLoading';
import { ProfileVault } from '@/components/profile/ProfileVault';
import { ProfileLibrary } from '@/components/profile/ProfileLibrary';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { ProfileSecurity } from '@/components/profile/ProfileSecurity';


// Custom GitHub Icon SVG since Lucide-react doesn't include brand icons

export function ProfilePage() {
   const { user, loading: authLoading, signOut } = useAuth();
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [activeTab, setActiveTab] = useState<'vault' | 'library' | 'config' | 'security'>('vault');

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
   const [level, setLevel] = useState(1);
   const [experience, setExperience] = useState(0);

   useEffect(() => {
      const fetchEverything = async () => {
         if (!user) {
            if (!authLoading) setLoading(false);
            return;
         }
         const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
         const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

         try {
            const [profileRes, balanceRes, assetsRes, favRes, promptsRes, charsRes, settingsRes] = await Promise.all([
               fetch(`/api/profiles/${user.id}`, { headers }),
               fetch(`/api/balances/${user.id}`, { headers }),
               fetch(`/api/assets/${user.id}`, { headers }),
               fetch(`/api/favorites/${user.id}`, { headers }),
               fetch(`/api/library/prompts/${user.id}`, { headers }),
               fetch(`/api/library/characters/${user.id}`, { headers }),
               fetch(`/api/settings/${user.id}`, { headers })
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
            setLevel(balance.level || 1);
            setExperience(balance.experience || 0);

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
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const headers: HeadersInit = { 
         'Content-Type': 'application/json',
         ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      try {
         await fetch(`/api/profiles/${user.id}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
               display_name: displayName, handle, bio, avatar_url: avatarUrl, banner_url: bannerUrl
            })
         });
         await fetch(`/api/settings/${user.id}`, {
            method: 'POST',
            headers,
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
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch(`/api/library/prompts`, {
         method: 'POST',
         headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
         },
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
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch(`/api/library/characters`, {
         method: 'POST',
         headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
         },
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
      { id: 'vault', label: 'Vault', icon: Grid },
      { id: 'library', label: 'Library', icon: BookOpen },
      { id: 'config', label: 'Commands', icon: Command },
      { id: 'security', label: 'Defense', icon: Lock }
   ];



   return (
      <div className={`max-w-[1400px] mx-auto space-y-12 pb-32 font-sans select-none ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-zinc-50 text-black'}`}>
         {/* 1. HERO HEADER */}
         <div className="relative rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-zinc-800/50 bg-black shadow-2xl group/hero">
            <div className="relative min-h-[400px] md:h-[520px] overflow-hidden flex flex-col">
               {bannerUrl ? (
                  <img src={bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 md:opacity-60" alt="Banner" />
               ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-[#bd4a4a]/20" />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
               
               <div className="relative z-10 mt-auto p-6 md:p-16 flex flex-col md:flex-row items-start md:items-end gap-8 md:gap-12 w-full">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl md:rounded-[3rem] bg-zinc-950 border-[4px] md:border-[6px] border-zinc-950 shadow-2xl overflow-hidden relative group/avatar shrink-0">
                     {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full flex items-center justify-center"><User className="w-12 md:w-20 h-12 md:h-20 text-zinc-900" /></div>}
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center cursor-pointer"><Camera className="w-6 md:w-8 h-6 md:h-8 text-white" /></div>
                  </div>
                  
                  <div className="flex-1 space-y-4 md:space-y-6 w-full">
                     <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-transparent border-none p-0 h-auto text-3xl md:text-6xl font-black tracking-tighter text-white uppercase italic focus:outline-none w-full max-w-xl" placeholder="Architect Name" />
                        <div className="flex gap-3">
                           <div className="px-4 py-1 bg-[#bd4a4a] text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(189,74,74,0.3)]">{tier} Tier</div>
                           <div className="px-4 py-1 bg-zinc-900 border border-white/10 text-zinc-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2">
                              <Zap className="w-3 h-3 text-[#bd4a4a]" />
                              {credits.toLocaleString()} Credits
                           </div>
                        </div>
                     </div>

                     <div className="flex flex-wrap items-center gap-3 md:gap-6 text-zinc-500 font-black uppercase tracking-widest text-[8px] md:text-[10px]">
                        <div className="flex items-center gap-2 bg-white/5 py-1 px-4 rounded-xl border border-white/5 backdrop-blur-md">
                           <AtSign className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#bd4a4a]" />
                           <input value={handle} onChange={(e) => setHandle(e.target.value)} className="bg-transparent border-none p-0 h-auto text-[10px] md:text-xs font-bold text-zinc-400 focus:outline-none w-24 md:w-32 lowercase tracking-widest" placeholder="handle" />
                        </div>
                        <div className="hidden sm:flex items-center gap-2 bg-zinc-900/40 py-1 px-4 rounded-xl border border-white/5">
                           <Mail className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-500/40" />
                           <span className="text-[8px] md:text-[9px] lowercase tracking-widest">{user?.email || 'architect@studio.pro'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#bd4a4a]/40" /> 
                           <span className="whitespace-nowrap italic">Activated {joinDate}</span>
                        </div>
                     </div>

                     <div className="max-w-2xl">
                        <textarea 
                           value={bio} 
                           onChange={(e) => setBio(e.target.value)}
                           className="bg-transparent border-none p-0 h-auto text-xs md:text-sm font-medium text-zinc-400 focus:outline-none w-full resize-none italic leading-relaxed"
                           placeholder="Describe your architectural vision..."
                           rows={2}
                        />
                     </div>

                     <div className="pt-2 md:pt-4 space-y-3">
                        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">
                           <span>Architect Level {level}</span>
                           <span>{experience.toLocaleString()} / {(level * 1000).toLocaleString()} EXP</span>
                        </div>
                        <div className="h-1.5 md:h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((experience / (level * 1000)) * 100, 100)}%` }}
                              className="h-full bg-gradient-to-r from-[#bd4a4a] to-[#ff5f5f] shadow-[0_0_15px_rgba(189,74,74,0.5)]"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto pt-4 md:pt-0">
                     <Button onClick={signOut} variant="outline" className="flex-1 md:flex-none border-zinc-800 text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl md:rounded-[2rem] px-6 md:px-8 h-12 md:h-16 font-black uppercase tracking-widest text-[8px] md:text-[9px] flex gap-3 transition-all">
                        <LogOut className="w-3 h-3 md:w-3.5 md:h-3.5" /> Deactivate
                     </Button>
                     <Button onClick={handleSave} disabled={saving} className="flex-[2] md:flex-none bg-[#bd4a4a] hover:bg-[#d45555] rounded-2xl md:rounded-[2rem] px-8 md:px-12 h-12 md:h-16 font-black uppercase tracking-widest text-[9px] md:text-[10px] flex gap-4 transition-all shadow-2xl text-white">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Sync
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex justify-center px-4 overflow-x-auto no-scrollbar">
            <div className="flex bg-zinc-900/40 p-1.5 rounded-3xl md:rounded-[2.5rem] border border-zinc-800/50 backdrop-blur-md shrink-0">
               {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-[2rem] transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
                     {activeTab === tab.id && <motion.div layoutId="tab-pill" className="absolute inset-0 bg-white/5 rounded-2xl md:rounded-[2.2rem] border border-white/10" />}
                     <tab.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 relative z-10 ${activeTab === tab.id ? 'text-[#bd4a4a]' : ''}`} />
                     <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest relative z-10">{tab.label}</span>
                  </button>
               ))}
            </div>
         </div>

         {/* 3. CONTENT */}
         <div className="px-6 min-h-[500px]">
            <AnimatePresence mode="wait">
               {activeTab === 'vault' && (
                  <ProfileVault 
                     generations={generations} 
                     favorites={favorites} 
                  />
               )}

               {activeTab === 'library' && (
                  <ProfileLibrary 
                     savedPrompts={savedPrompts} 
                     characters={characters} 
                     onAddPrompt={() => setShowPromptModal(true)} 
                     onAddDNA={() => setShowDNAModal(true)} 
                  />
               )}

               {activeTab === 'config' && (
                  <ProfileSettings 
                     aspectRatio={aspectRatio} 
                     setAspectRatio={setAspectRatio} 
                     theme={theme} 
                     toggleTheme={toggleTheme} 
                     emailAlerts={emailAlerts} 
                     setEmailAlerts={setEmailAlerts} 
                  />
               )}

               {activeTab === 'security' && (
                  <ProfileSecurity onDeactivate={signOut} />
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




