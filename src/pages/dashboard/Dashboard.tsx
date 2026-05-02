import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Activity,
  LayoutGrid,
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { TodoWidget } from '@/components/widgets/TodoWidget';
import { projectService, Project } from '@/services/api/projects';
import { StudioLoading } from '@/components/studio/StudioLoading';
import { logsApi, SystemLog } from '@/services/api/logs';
import { 
  BarChart3, 
  History, 
  Layers, 
  Terminal as TerminalIcon,
  ShieldCheck,
  SignalHigh
} from 'lucide-react';


export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, week: 0, recent: null as Project | null });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Failsafe: if the orchestrator is stuck for more than 10 seconds, force yield to UI
    const timeout = setTimeout(() => {
      if (dataLoading) {
        console.warn("Dashboard failsafe triggered: forcing dataLoading to false");
        setDataLoading(false);
        if (!stats.total && !systemLogs.length) {
          setError("Neural latency detected. Systems are operating in offline mode.");
        }
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [dataLoading, stats.total, systemLogs.length]);

  const fetchStats = async () => {
    if (authLoading) return;

    if (!user) {
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    setError(null);
    try {
      const [projects, logs] = await Promise.all([
        projectService.getProjects().catch(err => {
          console.error("Project fetch failed:", err);
          return [] as Project[];
        }),
        logsApi.getLogs(5).catch(err => {
          console.error("Logs fetch failed:", err);
          return [] as SystemLog[];
        })
      ]);

      if (projects.length === 0 && logs.length === 0) {
        // If both failed or are empty, we might have a connection issue
        const isBackendUp = await fetch('/api/health').then(r => r.ok).catch(() => false);
        if (!isBackendUp) {
          throw new Error("Intelligence Layer (FastAPI) unreachable.");
        }
      }

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
    } catch (e: any) {
      console.error("Dashboard fetchStats error:", e);
      setError(e.message || "Neural sync disruption detected. Please re-initialize.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id, retryCount]);

  const isLoading = authLoading || (user && dataLoading && !error);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

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
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 bg-studio/10 border border-studio/20 rounded-full backdrop-blur-md"
            >
              <div className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.8)]",
                error ? "bg-amber-500 shadow-amber-500/80" : "bg-studio"
              )} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.3em]",
                error ? "text-amber-500" : "text-studio"
              )}>
                {error ? "Neural Latency Detected" : "Neural Link Established"}
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-[-0.04em] leading-[0.85]">
              GREETINGS,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-fuchsia-500 to-studio drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                {user?.email?.split('@')[0] || 'ARCHITECT'}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-8 text-right">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Neural Stability</p>
              <p className={cn(
                "text-xs font-bold uppercase tracking-tighter",
                error ? "text-amber-400" : "text-emerald-400"
              )}>
                {error ? "DEGRADED" : "OPTIMAL SYNC"}
              </p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="space-y-1">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Active Node</p>
              <p className="text-xs font-bold text-studio uppercase tracking-tighter">CENTRAL HUB-01</p>
            </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 rounded-[3rem] border border-amber-500/20 bg-amber-500/5 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <Brain className="w-8 h-8 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">System Desync</h3>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">{error}</p>
              </div>
            </div>
            <Button 
              onClick={handleRetry}
              variant="outline"
              className="bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-500 px-8 h-14 rounded-2xl font-black uppercase tracking-widest transition-all"
            >
              Retry Sync Transmission
            </Button>
          </motion.div>
        )}

        {/* 2. CORE STATS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Production Archives', val: stats.total, sub: 'Online', icon: Activity, color: 'from-studio/20 to-transparent', border: 'hover:border-studio/40' },
            { label: 'Neural Activity', val: stats.week, sub: 'Active', icon: Zap, color: 'from-fuchsia-500/20 to-transparent', border: 'hover:border-fuchsia-500/40' },
            { label: 'Latency', val: error ? 'INF' : '24ms', sub: error ? 'DISRUPTED' : 'STABLE', icon: SignalHigh, color: 'from-emerald-500/20 to-transparent', border: 'hover:border-emerald-500/40' },
            { label: 'Active Blueprint', val: stats.recent?.title?.substring(0, 8) || 'N/A', sub: 'SYNCED', icon: Cpu, color: 'from-violet-500/20 to-transparent', border: 'hover:border-violet-500/40' },
          ].map((stat, i) => (
            <Card key={i} className={cn("glass p-8 flex flex-col justify-between group transition-all duration-500 relative overflow-hidden rounded-[2.5rem] border-white/5", stat.border)}>
              <div className="scanline" />
              <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700", stat.color)} />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em]">{stat.label}</p>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition-colors">
                  <stat.icon className="w-4 h-4 text-zinc-600 group-hover:text-white transition-all duration-500 group-hover:scale-110" />
                </div>
              </div>
              
              <div className="space-y-2 relative z-10">
                <div className="text-4xl font-black text-white tracking-tighter truncate leading-none group-hover:translate-x-1 transition-transform duration-500">{stat.val}</div>
                <div className="flex items-center gap-2 text-[9px] text-emerald-500 font-black tracking-[0.2em] uppercase">
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", error ? "bg-amber-500" : "bg-emerald-500")} />
                  {stat.sub}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 3. CORE WORKSPACE GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: BLUEPRINTS & TELEMETRY */}
          <div className="xl:col-span-8 space-y-12">
            
            {/* BLUEPRINT HUB */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <History className="w-5 h-5 text-studio" />
                  <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em]">Blueprint Registry</h2>
                </div>
                <button 
                  onClick={() => navigate('/projects')}
                  className="text-[9px] font-black text-zinc-600 hover:text-studio uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  View Full Archive <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <Card key={project.id} className="glass p-6 group hover:border-studio/30 transition-all rounded-[2rem] border-white/5 cursor-pointer" onClick={() => navigate(`/anime/script?id=${project.id}`)}>
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-studio/20 transition-colors">
                          <Layers className="w-6 h-6 text-zinc-600 group-hover:text-studio transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="text-sm font-bold text-white uppercase truncate tracking-tight">{project.title}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{project.model_used || 'GPT-4O'}</span>
                            <div className="w-1 h-1 rounded-full bg-zinc-800" />
                            <span className="text-[9px] font-black text-studio uppercase tracking-widest">Active</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 p-12 rounded-[2rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                    <FolderGit2 className="w-8 h-8 text-zinc-800" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">No blueprints found in registry.</p>
                    <Button onClick={() => navigate('/projects/new')} variant="outline" className="h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest border-zinc-800 hover:bg-studio/5">Create First Blueprint</Button>
                  </div>
                )}
              </div>
            </div>

            {/* STUDIO SELECTOR */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <LayoutGrid className="w-5 h-5 text-fuchsia-500" />
                <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em]">Environmental Nodes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Anime Studio', type: 'Anime', path: '/anime', icon: Sparkles, color: 'hover:border-studio/50', glow: 'bg-studio/5', desc: 'Animation frames & lore.' },
                  { name: 'World Oracle', type: 'Manhwa', path: '/world', icon: Brain, color: 'hover:border-fuchsia-500/50', glow: 'bg-fuchsia-500/5', desc: 'World narrative scaffolding.' },
                  { name: 'Protocol Hub', type: 'Comic', path: '/anime/protocols', icon: ShieldCheck, color: 'hover:border-emerald-500/50', glow: 'bg-emerald-500/5', desc: 'System governance & rules.' },
                ].map((studio) => (
                  <button
                    key={studio.type}
                    onClick={() => navigate(studio.path)}
                    className={cn(
                      "p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] transition-all text-left group hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden",
                      studio.color
                    )}
                  >
                    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none", studio.glow)} />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-2.5 bg-black/40 border border-white/10 rounded-xl">
                        <studio.icon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-white transition-all" />
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-1 relative z-10">{studio.name}</h3>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest relative z-10">{studio.desc}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: TELEMETRY & STATUS */}
          <div className="xl:col-span-4 space-y-12">
            
            {/* SYSTEM TELEMETRY */}
            <Card className="glass rounded-[3rem] p-10 space-y-8 border-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BarChart3 className="w-32 h-32 text-studio" />
              </div>
              
              <div className="space-y-1 relative z-10">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Neural Telemetry</h2>
                <p className="text-[9px] font-bold text-studio/60 uppercase">Real-time Node Status</p>
              </div>

              <div className="space-y-6 relative z-10">
                {[
                  { label: 'Orchestrator Load', val: 12, unit: '%', color: 'bg-studio' },
                  { label: 'Neural Throughput', val: 88, unit: '%', color: 'bg-fuchsia-500' },
                  { label: 'Memory Allocation', val: 45, unit: '%', color: 'bg-emerald-500' },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-zinc-500">{metric.label}</span>
                      <span className="text-white">{metric.val}{metric.unit}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.val}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full rounded-full shadow-[0_0_8px_rgba(6,182,212,0.4)]", metric.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Uptime</p>
                  <p className="text-xs font-bold text-zinc-300">14:22:04</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Region</p>
                  <p className="text-xs font-bold text-zinc-300 uppercase">AS-S1</p>
                </div>
              </div>
            </Card>

            {/* NEURAL FEED (SYSTEM LOGS) */}
            <Card className="glass rounded-[3rem] p-10 space-y-8 border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TerminalIcon className="w-4 h-4 text-studio" />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Neural Feed</h2>
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-studio animate-pulse" />
                  <div className="w-1 h-1 rounded-full bg-fuchsia-500 animate-pulse delay-75" />
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-150" />
                </div>
              </div>
              
              <div className="space-y-6">
                {systemLogs.length > 0 ? (
                  systemLogs.map((log, idx) => (
                    <div key={log.id || idx} className="flex items-start gap-4 group/log">
                      <div className={cn(
                        "w-1 h-1 rounded-full mt-2 shrink-0 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]",
                        log.level === 'CRITICAL' ? 'bg-red-500 shadow-red-500/50' :
                          log.level === 'WARNING' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-studio shadow-studio/50'
                      )} />
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-zinc-300 leading-relaxed uppercase tracking-tight group-hover/log:text-white transition-colors">
                          {log.message}
                        </p>
                        <p className="text-[8px] text-zinc-600 font-medium uppercase tracking-widest">
                          {log.source} // {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'JUST NOW'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 rounded-2xl border border-dashed border-white/5 text-center">
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Neural stream quiet.</p>
                  </div>
                )}
              </div>
            </Card>

            <TodoWidget />
          </div>
        </div>

        {/* 4. FLOATING ACTION BUTTON (REPLACED WITH FIXED FOOTER BAR) */}
        <div className="fixed bottom-8 right-8 z-[50]">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/projects/new')}
            className="w-16 h-16 rounded-3xl bg-studio text-white shadow-[0_20px_50px_rgba(6,182,212,0.4)] flex items-center justify-center relative group"
          >
            <div className="absolute inset-0 bg-white/20 rounded-3xl scale-0 group-hover:scale-100 transition-transform duration-500" />
            <PlusSquare className="w-8 h-8 relative z-10" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}





