import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Camera,
  Sparkles,
  Eye,
  Globe,
  ShieldCheck,
  Zap,
  Lock,
  ChevronRight,
  User as UserIcon,
  Briefcase,
  MapPin,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { settingsService } from '../../services/api/settings';
import { StudioLoading } from '../studio/components/studio/StudioLoading';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

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
    setTimeout(() => setIsSaving(false), 800);
  }, [displayName, role, timezone, vision, publicVisible]);

  if (loading) {
    return <StudioLoading fullPage={false} message="Hydrating Identity Matrix..." submessage="Syncing architectural metadata with the production cloud..." />;
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
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-studio">Atomic Identity Sync Active</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PUBLIC IDENTITY TERMINAL */}
      <Card className="bg-[#0a0a0b] border border-white/5 rounded-[3.5rem] shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-studio/5 blur-[150px] rounded-full pointer-events-none" />

        <CardHeader className="border-b border-white/5 p-10 md:p-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center border border-studio/20 shadow-2xl relative">
                <div className="absolute inset-0 bg-studio/5 blur-xl animate-pulse" />
                <Sparkles className="w-8 h-8 text-studio relative z-10" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter">Public Identity</CardTitle>
                <CardDescription className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Universal Production Signature across the Global Architect Network</CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden xl:flex items-center gap-8 px-8 py-4 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Registry Status</span>
                  <span className="text-xs font-black text-emerald-500 italic uppercase">Verified</span>
                </div>
                <div className="w-px h-8 bg-white/5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Link Health</span>
                  <span className="text-xs font-black text-studio italic uppercase">Optimal</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-10 md:p-14 space-y-14 relative">

          {/* Avatar Mesh Section */}
          <div className="flex flex-col md:flex-row items-center gap-12 p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-studio/30 transition-all duration-700 relative overflow-hidden group/avatar-box">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover/avatar-box:opacity-10 transition-opacity">
              <UserIcon className="w-32 h-32 text-studio" />
            </div>

            <div className="relative group/avatar cursor-pointer shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-tr from-studio to-fuchsia-600 rounded-full blur opacity-20 group-hover/avatar:opacity-60 transition duration-1000"></div>
              <div className="relative w-36 h-36 rounded-full bg-black border-4 border-white/5 overflow-hidden flex items-center justify-center shadow-3xl">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-5xl font-black text-zinc-800">{(user?.user_metadata?.full_name || user?.user_metadata?.display_name)?.[0] || 'U'}</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-sm">
                  <Camera className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-6 text-center md:text-left relative z-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Neural Network Avatar</h3>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Signature ID: #ASP-{(user?.id || 'ARCHITECT').slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <button className="px-8 py-3 bg-studio text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-xl active:scale-95">Initialize Uplink</button>
                <button className="px-8 py-3 bg-white/[0.03] border border-white/10 text-zinc-500 rounded-xl font-black uppercase tracking-widest text-[10px] hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95">Purge Mesh</button>
              </div>
            </div>
          </div>

          {/* Identity Protocol Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                id: 'name',
                label: 'Director Identity',
                value: displayName,
                onChange: (val: string) => setDisplayName(val),
                icon: UserIcon,
                nodeId: 'NODE-P1',
                placeholder: 'ENTER ARCHITECT NAME...'
              },
              {
                id: 'email',
                label: 'Transmission Contact',
                value: user?.email || 'dheena@gmail.com',
                readOnly: true,
                icon: Globe,
                nodeId: 'NODE-P2'
              }
            ].map((node) => (
              <div key={node.id} className="space-y-4 group/node">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] italic flex items-center gap-3">
                    <node.icon className="w-3.5 h-3.5 text-studio" /> {node.label}
                  </label>
                  <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">{node.nodeId}</span>
                </div>
                <div className="relative">
                  <input
                    value={node.value}
                    onChange={(e) => node.onChange?.(e.target.value)}
                    onBlur={() => !node.readOnly && syncToCloud()}
                    readOnly={node.readOnly}
                    type="text"
                    placeholder={node.placeholder}
                    className={cn(
                      "w-full bg-black/60 border border-zinc-900 rounded-[1.5rem] px-8 py-5 text-sm font-black text-white focus:border-studio/50 transition-all outline-none italic tracking-widest uppercase",
                      node.readOnly ? "opacity-40 cursor-not-allowed border-dashed" : "group-hover/node:border-studio/20"
                    )}
                  />
                  {node.readOnly && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                      <Lock className="w-4 h-4 text-zinc-800" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {[
              {
                id: 'role',
                label: 'Production Role',
                value: role,
                options: ['Executive Producer', 'Lead Screenwriter', 'Art Director', 'Showrunner', 'Solo Creator'],
                onChange: (val: string) => { setRole(val); syncToCloud({ role: val }); },
                icon: Briefcase,
                nodeId: 'NODE-P3'
              },
              {
                id: 'timezone',
                label: 'Studio Base Time',
                value: timezone,
                options: ['GMT-8 (Pacific Studio Time)', 'GMT-5 (Eastern Hub)', 'GMT+0 (London Central)', 'GMT+9 (Tokyo / Global East)'],
                onChange: (val: string) => { setTimezone(val); syncToCloud({ timezone: val }); },
                icon: MapPin,
                nodeId: 'NODE-P4'
              }
            ].map((node) => (
              <div key={node.id} className="space-y-4 group/node">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] italic flex items-center gap-3">
                    <node.icon className="w-3.5 h-3.5 text-studio" /> {node.label}
                  </label>
                  <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">{node.nodeId}</span>
                </div>
                <div className="relative">
                  <select
                    value={node.value}
                    onChange={(e) => node.onChange?.(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-900 rounded-[1.5rem] px-8 py-5 text-sm font-black text-white focus:border-studio/50 transition-all appearance-none cursor-pointer uppercase italic tracking-widest"
                  >
                    {node.options?.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 rotate-90 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Vision Statement Protocol */}
          <div className="space-y-4 group/node pt-6 border-t border-white/5">
            <div className="flex items-center justify-between px-2">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] italic flex items-center gap-3">
                <FileText className="w-3.5 h-3.5 text-studio" /> Vision Directive / Bio
              </label>
              <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">NODE-P5</span>
            </div>
            <div className="relative group/prompt">
              <div className="absolute -inset-1 bg-studio/5 rounded-[2rem] blur-xl opacity-0 group-focus-within/prompt:opacity-100 transition duration-700" />
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                onBlur={() => syncToCloud()}
                rows={4}
                placeholder="ESTABLISH PRODUCTION VISION..."
                className="w-full bg-black/60 border border-zinc-900 rounded-[2rem] p-8 text-xs font-black text-studio focus:border-studio/50 focus:outline-none transition-all resize-none shadow-3xl leading-relaxed uppercase tracking-widest"
              />
            </div>
          </div>

          {/* Visibility Protocol */}
          <div className="pt-10 border-t border-white/5 space-y-8">
            <div className="flex items-center justify-between p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-emerald-500/30 transition-all duration-700 group/vis">
              <div className="flex gap-8 items-center">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700", publicVisible ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-900 text-zinc-800")}>
                  <Eye className={cn("w-8 h-8", publicVisible ? "animate-pulse" : "")} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover/vis:text-emerald-400 transition-colors">Global Portfolio Link</h4>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] leading-relaxed">Allow other creators to synchronize and view your neural generation archives.</p>
                </div>
              </div>
              <div
                onClick={() => { setPublicVisible(!publicVisible); syncToCloud({ public_visible: !publicVisible }); }}
                className={cn(
                  "w-16 h-8 rounded-full relative cursor-pointer transition-all duration-500",
                  publicVisible ? "bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-zinc-900"
                )}
              >
                <div className={cn("absolute top-1 w-6 h-6 bg-white rounded-full shadow-2xl transition-all duration-500", publicVisible ? "left-9" : "left-1 bg-zinc-700")} />
              </div>
            </div>

            {/* Identity Footer Metadata */}
            <footer className="flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Architect Hash: #ID-8842-X</span>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-studio fill-studio" />
                  <span>Production Hub: Tokyo / LA Sync Active</span>
                </div>
              </div>
            </footer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
