import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Activity,
  LayoutGrid,
  ScrollText,
  Zap,
  ChevronRight,
  FolderGit2,
  PlusSquare,
  Cpu,
  Sparkles,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { TodoWidget } from '@/components/widgets/TodoWidget';
import { projectService, Project } from '@/services/api/projects';
import { StudioLoading } from '@/components/studio/StudioLoading';
import { logsApi, SystemLog } from '@/services/api/logs';


export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, week: 0, recent: null as Project | null });
  const [, setRecentProjects] = useState<Project[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // Failsafe: if the orchestrator is stuck for more than 8 seconds, force yield to UI
    const timeout = setTimeout(() => {
      if (dataLoading) {
        console.warn("Dashboard failsafe triggered: forcing dataLoading to false");
        setDataLoading(false);
      }
    }, 8000);
    return () => clearTimeout(timeout);
  }, [dataLoading]);

  const fetchStats = async () => {
    if (authLoading) return;

    if (!user) {
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    try {
      const [projects, logs] = await Promise.all([
        projectService.getProjects(),
        logsApi.getLogs(5)
      ]);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weekCount = projects.filter(p => new Date(p.updated_at) > weekAgo).length;

      setStats({
        total: projects.length,
        week: weekCount,
        recent: projects[0] || null
      });
      setRecentProjects(projects.slice(0, 4));
      setSystemLogs(logs);
    } catch (e) {
      console.error("Dashboard fetchStats error:", e);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  const isLoading = authLoading || (user && dataLoading);

  return (
    <div className={cn("min-h-screen bg-[#050505] text-zinc-100 max-w-[1600px] mx-auto relative overflow-hidden")}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <StudioLoading message="Initializing Orchestrator..." submessage="Syncing neural status and production nodes..." />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("space-y-12 pt-16 pb-20 px-6 transition-all duration-1000", isLoading ? "opacity-0 scale-95 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0")}>
        {/* 1. TOP HEADER / NEURAL STATUS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-16 relative">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="space-y-6 relative">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-studio/10 border border-studio/20 rounded-full backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
              <span className="text-[9px] font-black text-studio uppercase tracking-[0.3em]">Neural Link Established</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-[-0.04em] leading-[0.85]">
              GREETINGS,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-fuchsia-500 to-studio drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                {user?.email?.split('@')[0] || 'ARCHITECT'}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-8 text-right">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Neural Status</p>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">OPTIMAL SYNC</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="space-y-1">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Active Node</p>
              <p className="text-xs font-bold text-studio uppercase tracking-tighter">CENTRAL HUB-01</p>
            </div>
          </div>
        </div>

        {/* 2. CORE STATS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Production Archives', val: stats.total, sub: 'Online', icon: Activity, color: 'from-studio/20 to-transparent', border: 'hover:border-studio/40' },
            { label: 'Neural Activity (Week)', val: stats.week, sub: 'Active', icon: Zap, color: 'from-fuchsia-500/20 to-transparent', border: 'hover:border-fuchsia-500/40' },
            { label: 'Latest Blueprint', val: stats.recent?.title || 'N/A', sub: stats.recent?.model_used || 'STABLE', icon: Cpu, color: 'from-violet-500/20 to-transparent', border: 'hover:border-violet-500/40' },
          ].map((stat, i) => (
            <Card key={i} className={cn("glass p-12 flex flex-col justify-between group transition-all duration-500 relative overflow-hidden rounded-[3rem] border-white/5", stat.border)}>
              <div className="scanline" />
              <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700", stat.color)} />
              
              <div className="flex items-center justify-between mb-10 relative z-10">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">{stat.label}</p>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition-colors">
                  <stat.icon className="w-5 h-5 text-zinc-600 group-hover:text-white transition-all duration-500 group-hover:scale-110" />
                </div>
              </div>
              
              <div className="space-y-3 relative z-10">
                <div className="text-6xl font-black text-white tracking-tighter truncate leading-none group-hover:translate-x-1 transition-transform duration-500">{stat.val}</div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-black tracking-[0.2em] uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  {stat.sub}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 2.1 STUDIO SELECTOR */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LayoutGrid className="w-5 h-5 text-studio" />
              <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em]">Initialize Environment</h2>
            </div>
            <div className="h-[1px] flex-1 bg-white/5 mx-8 hidden md:block" />
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Select Production Mode</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Anime Studio', type: 'Anime', path: '/anime', icon: Sparkles, color: 'hover:border-studio/50', glow: 'bg-studio/5', desc: 'Japanese style animation frames & lore.' },
              { name: 'World Lore', type: 'Manhwa', path: '/world', icon: Brain, color: 'hover:border-fuchsia-500/50', glow: 'bg-fuchsia-500/5', desc: 'World building and narrative scaffolding.' },
              { name: 'Archive Room', type: 'Comic', path: '/projects', icon: FolderGit2, color: 'hover:border-zinc-500/50', glow: 'bg-zinc-500/5', desc: 'Review and manage existing blueprint archives.' },
            ].map((studio) => (
              <button
                key={studio.type}
                onClick={() => navigate(studio.path)}
                aria-label={`Initialize ${studio.name}`}
                className={cn(
                  "p-10 rounded-[3rem] border border-white/5 bg-white/[0.01] transition-all text-left group hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden",
                  studio.color
                )}
              >
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none", studio.glow)} />
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="p-3 bg-black/40 border border-white/10 rounded-2xl">
                    <studio.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 block relative z-10">{studio.name}</h3>
                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed uppercase tracking-widest relative z-10">{studio.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 3. MAIN WORKSPACE SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          <div className="xl:col-span-3 space-y-12">
            <div className="flex items-center gap-4">
              <Zap className="w-6 h-6 text-studio fill-studio/20" />
              <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Neural Actions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'New Blueprint', desc: 'Initialize fresh project.', icon: PlusSquare, color: 'text-studio', path: '/projects/new', level: 'L1 ARCHITECT' },
                { title: 'Resume Script', desc: 'Continue transmissions.', icon: ScrollText, color: 'text-fuchsia-500', path: '/anime/script', level: 'L2 WRITER' },
                { title: 'Archive', desc: 'Access history.', icon: FolderGit2, color: 'text-zinc-400', path: '/projects', level: 'L3 ADMIN' },
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(item.path)}
                  aria-label={item.title}
                  className="flex flex-col text-left p-10 glass border border-white/5 rounded-[3rem] group relative overflow-hidden aspect-[4/3] justify-between transition-all"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-studio/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between">
                    <div className={cn("p-4 rounded-2xl bg-black/40 border border-white/5 transition-all group-hover:scale-110", item.color)}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{item.level}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white tracking-tighter leading-none group-hover:text-studio transition-colors">{item.title}</h3>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{item.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="glass rounded-[3rem] p-12 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">System Logs</h2>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-studio" />
                    <div className="w-1 h-1 rounded-full bg-fuchsia-500" />
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                  </div>
                </div>
                <div className="p-8 bg-black/40 border border-white/5 rounded-[2rem] space-y-6">
                  {systemLogs.length > 0 ? (
                    systemLogs.map((log, idx) => (
                      <div key={log.id || idx} className="flex items-start gap-4 group/log">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full mt-2 shrink-0 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]",
                          log.level === 'CRITICAL' ? 'bg-red-500 shadow-red-500/50' :
                            log.level === 'WARNING' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-studio shadow-studio/50'
                        )} />
                        <div className="space-y-1">
                          <p className="text-[12px] font-bold text-zinc-200 leading-relaxed uppercase tracking-tight group-hover/log:text-white transition-colors">
                            {log.message}
                          </p>
                          <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-[0.1em]">
                            {log.source} // {log.level} // {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'JUST NOW'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-zinc-800 mt-2 shrink-0" />
                      <div className="space-y-2">
                        <p className="text-[13px] font-bold text-zinc-500 leading-relaxed uppercase">
                          System Standby. No neural logs detected.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="glass rounded-[3rem] p-12 space-y-8">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Fast Lane</h2>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: 'Character Cast', path: '/anime/cast' },
                    { label: 'Storyboard Gallery', path: '/anime/storyboard' },
                    { label: 'Studio Wiki', path: '/tutorials' },
                  ].map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(step.path)}
                      className="w-full flex items-center justify-between p-6 bg-black/20 border border-white/5 rounded-2xl hover:bg-studio/5 hover:border-studio/20 transition-all group"
                    >
                      <span className="text-[11px] font-black text-zinc-300 group-hover:text-white transition-colors uppercase tracking-[0.2em]">{step.label}</span>
                      <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-studio group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-12">
            <TodoWidget />
          </div>
        </div>
      </div>
    </div>
  );
}




