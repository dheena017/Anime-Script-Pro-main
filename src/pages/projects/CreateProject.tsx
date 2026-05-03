import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Palette,
  Film,
  Clock,
  ScrollText,
  ChevronRight,
  Terminal,
  Lock,
  Layers,
  Activity,
  Command,
  Database,
  AlertCircle,
  CheckCircle2,
  CpuIcon,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api-utils';

const GENRES = [
  'Shonen', 'Seinen', 'Cyberpunk', 'Isekai', 'Slice of Life', 'Mecha', 'Psychological', 'Dark Fantasy'
];

const STYLE_PRESETS = [
  'Studio Ghibli', '90s Retro Anime', 'Ufotable Dynamic', 'Makoto Shinkai', 'Cyberpunk Edgerunners'
];

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Shonen');
  const [artStyle, setArtStyle] = useState('');
  const [description, setDescription] = useState('');
  const [episodeLength, setEpisodeLength] = useState<'SHORT' | 'FULL'>('FULL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setCurrentProject, refreshAppData } = useApp();

  const handleInitialize = async () => {
    if (!title.trim()) return;
    setError(null);
    setLoading(true);
    
    try {
      const project = await apiRequest<any>('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          title,
          genre,
          art_style: artStyle,
          description,
          episode_length: episodeLength,
          status: 'draft',
          content_type: 'ANIME'
        })
      });

      await apiRequest(`/api/generate/god-mode/${project.id}`, {
        method: 'POST'
      });

      setCurrentProject(project);
      await refreshAppData();
      navigate('/library', { state: { newlyCreated: true } });
    } catch (err: any) {
      console.error('Project Initialization Failed:', err);
      setError(err.message || 'TRANSMISSION ERROR: NODE INITIALIZATION FAILED');
    } finally {
      setLoading(false);
    }
  };

  // Complexity Calculation
  const complexity = (title.length * 2) + (description.length / 5) + (artStyle ? 20 : 0);
  const expectedNodes = Math.floor(complexity / 10) + 5;

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-studio/30">
      {/* Visual Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-studio/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col h-full space-y-16">
        
        {/* 1. TERMINAL HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center backdrop-blur-3xl shadow-2xl">
              <Command className="w-6 h-6 text-studio" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em] leading-none mb-1">Initialization Matrix</span>
              <span className="text-xs font-black text-white uppercase italic tracking-widest">Protocol v4.2.0</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-5 py-2 rounded-full bg-studio/5 border border-studio/20">
              <Activity className="w-3.5 h-3.5 text-studio animate-pulse" />
              <span className="text-[10px] font-black uppercase text-studio tracking-[0.3em]">Status: Optimal Link</span>
            </div>
          </div>
        </div>

        {/* 2. HERO TITLE SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] italic"
            >
              INITIALIZE <br />
              <span className="text-studio">PRODUCTION.</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-6"
            >
              <div className="h-[2px] w-20 bg-studio shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.4em]">Establish New Production Node</p>
            </motion.div>
          </div>
          <button
            onClick={() => navigate('/library')}
            className="flex items-center gap-4 px-8 py-4 bg-white/[0.03] text-zinc-500 border border-white/5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-studio hover:text-black transition-all group shadow-2xl"
          >
            Terminal Library
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </header>

        {/* 3. CONFIGURATION MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            
            {/* NODE-P1: PROJECT IDENTITY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0b] border border-white/5 rounded-[3rem] p-10 md:p-16 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Terminal className="w-32 h-32 text-studio" />
              </div>
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-studio/10 flex items-center justify-center border border-studio/20">
                    <Database className="w-5 h-5 text-studio" />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Project Identity</h2>
                </div>
                <span className="text-[9px] font-black text-zinc-700 bg-white/[0.02] px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">NODE-P1-REGISTRY</span>
              </div>

              <div className="space-y-10">
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ENTER PRODUCTION TITLE..."
                    className="w-full bg-black/40 border border-zinc-900 rounded-[2rem] px-10 py-8 text-3xl font-black text-white placeholder:text-zinc-800 focus:border-studio/50 outline-none transition-all shadow-inner uppercase italic tracking-tighter"
                  />
                  <AnimatePresence>
                     {title.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute right-6 top-1/2 -translate-y-1/2 text-studio">
                           <CheckCircle2 className="w-6 h-6" />
                        </motion.div>
                     )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] ml-2">Production Genre</label>
                    <div className="relative">
                       <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="w-full bg-black/60 border border-zinc-900 rounded-2xl px-6 py-4 text-[11px] font-black text-white outline-none focus:border-studio/50 transition-all appearance-none cursor-pointer uppercase tracking-widest"
                       >
                         {GENRES.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
                       </select>
                       <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.4em] ml-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Protocol Length
                    </label>
                    <div className="flex bg-black/60 border border-zinc-900 rounded-2xl p-1.5">
                      {['SHORT', 'FULL'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setEpisodeLength(type as any)}
                          className={cn(
                            "flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all",
                            episodeLength === type ? "bg-studio text-black shadow-lg" : "text-zinc-600 hover:text-zinc-400"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* NODE-P2: VISUAL DIRECTIVE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0a0a0b] border border-white/5 rounded-[3rem] p-10 md:p-16 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Palette className="w-32 h-32 text-studio" />
              </div>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 rounded-xl bg-studio/10 flex items-center justify-center border border-studio/20">
                  <Film className="w-5 h-5 text-studio" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Visual Directive</h2>
              </div>

              <div className="space-y-10">
                <input
                  type="text"
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  placeholder="STYLE REFERENCE (E.G. STUDIO GHIBLI)..."
                  className="w-full bg-black/40 border border-zinc-900 rounded-2xl px-8 py-5 text-[11px] font-black text-white placeholder:text-zinc-800 focus:border-studio/50 outline-none transition-all uppercase tracking-widest"
                />
                <div className="flex flex-wrap gap-3">
                  {STYLE_PRESETS.map(s => (
                    <button
                      key={s}
                      onClick={() => setArtStyle(s)}
                      className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-xl border transition-all duration-500",
                        artStyle === s ? "bg-studio text-black border-studio shadow-[0_10px_30px_rgba(6,182,212,0.3)]" : "bg-white/[0.02] border-white/5 text-zinc-600 hover:text-white hover:border-white/20"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* NODE-P3: NARRATIVE CORE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0a0a0b] border border-white/5 rounded-[3rem] p-10 md:p-16 relative overflow-hidden group"
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 rounded-xl bg-studio/10 flex items-center justify-center border border-studio/20">
                  <ScrollText className="w-5 h-5 text-studio" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Narrative Core</h2>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="DEFINE PRODUCTION DIRECTIVE..."
                rows={6}
                className="w-full bg-black/40 border border-zinc-900 rounded-[2.5rem] px-10 py-10 text-xs font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:border-studio/50 outline-none transition-all resize-none leading-relaxed shadow-inner"
              />
            </motion.div>
          </div>

          {/* 4. SIDEBAR: COMPLEXITY MONITOR */}
          <div className="lg:col-span-4 space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-[#0a0a0b] to-black border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-3xl sticky top-12"
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 rounded-xl bg-studio flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black fill-black" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white italic">Analysis Engine</h3>
              </div>

              <div className="space-y-4 mb-12">
                {[
                  { icon: CpuIcon, label: 'Expected Nodes', value: expectedNodes },
                  { icon: Sparkles, label: 'Complexity Index', value: `${Math.min(complexity, 100)}%` },
                  { icon: Layers, label: 'Render Protocol', value: 'ULTRA-L' },
                  { icon: Lock, label: 'Encryption', value: 'AES-256' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-4">
                      <stat.icon className="w-4 h-4 text-zinc-700" />
                      <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{stat.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-white italic tracking-widest">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Error Display Protocol */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8 flex items-start gap-4"
                  >
                     <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                     <p className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-relaxed">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                disabled={!title || loading}
                onClick={handleInitialize}
                className={cn(
                  "w-full h-24 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs transition-all relative overflow-hidden group flex items-center justify-center gap-4",
                  loading ? "bg-zinc-900 text-zinc-600" : "bg-studio text-black hover:bg-white hover:scale-[1.02] shadow-[0_20px_50px_rgba(6,182,212,0.3)] active:scale-95"
                )}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
                      <div className="w-5 h-5 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
                      INITIALIZING...
                    </motion.div>
                  ) : (
                    <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
                      INITIALIZE NODE
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
