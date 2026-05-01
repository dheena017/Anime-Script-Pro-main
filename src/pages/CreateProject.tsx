import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Zap,
  Palette,
  Film,
  Clock,
  ScrollText,
  ChevronRight,
  Terminal,
  Cpu,
  Globe,
  Lock,
  Layers,
  Activity,
  Box,
  Command,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { cn } from '../lib/utils';
import { apiRequest } from '../lib/api-utils';

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

  const navigate = useNavigate();
  const { setCurrentProject, refreshAppData } = useApp();

  const handleInitialize = async () => {
    if (!title.trim()) return;

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
    } catch (err) {
      console.error('Project Initialization Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white relative overflow-hidden font-sans selection:bg-[#bd4a4a]/30">
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020203_100%)]" />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#bd4a4a]/5 rounded-full blur-[140px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col h-full">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
              <Command className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest leading-none mb-1">Project Console</span>
              <span className="text-xs font-bold text-white uppercase tracking-tighter">Production v1.0.0</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Status: Online</span>
            </div>
          </div>
        </div>

        {/* Hero Title */}
        <header className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] italic"
            >
              CREATE NEW <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bd4a4a] via-[#ff6b6b] to-[#bd4a4a]">PROJECT.</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center gap-4"
            >
              <div className="h-[2px] w-12 bg-[#bd4a4a]" />
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">START NEW PRODUCTION FLOW</p>
            </motion.div>
          </div>
          <button
            onClick={() => navigate('/library')}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 text-zinc-400 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:text-white transition-all group"
          >
            My Library
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </header>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">

          <div className="lg:col-span-8 space-y-6">

            {/* Project Name Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl hover:bg-white/[0.04] hover:border-white/10 transition-all shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#bd4a4a]/10 flex items-center justify-center border border-[#bd4a4a]/20">
                    <Terminal className="w-4 h-4 text-[#bd4a4a]" />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-white">Project Name</h2>
                </div>
                <span className="text-[10px] font-bold text-zinc-700 bg-black/40 px-3 py-1 rounded-full border border-white/5">ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
              </div>

              <div className="space-y-6">
                <div className="relative group/input">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ENTER PROJECT NAME..."
                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-8 py-6 text-2xl font-black text-white placeholder:text-zinc-800 focus:border-[#bd4a4a]/50 outline-none transition-all shadow-inner uppercase tracking-tighter"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest ml-1">Genre</label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-zinc-300 outline-none focus:border-[#bd4a4a]/50 transition-all appearance-none cursor-pointer"
                    >
                      {GENRES.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest ml-1 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Length
                    </label>
                    <div className="flex bg-black/40 border border-zinc-800 rounded-xl p-1">
                      <button
                        onClick={() => setEpisodeLength('SHORT')}
                        className={cn("flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all", episodeLength === 'SHORT' ? "bg-white/10 text-white" : "text-zinc-600 hover:text-zinc-400")}
                      >
                        Short
                      </button>
                      <button
                        onClick={() => setEpisodeLength('FULL')}
                        className={cn("flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all", episodeLength === 'FULL' ? "bg-white/10 text-white" : "text-zinc-600 hover:text-zinc-400")}
                      >
                        Full
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl hover:bg-white/[0.04] hover:border-white/10 transition-all shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Film className="w-24 h-24 text-blue-500" />
              </div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Palette className="w-4 h-4 text-blue-500" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">Visual</h2>
              </div>

              <div className="space-y-6">
                <input
                  type="text"
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  placeholder="STYLE REFERENCE..."
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder:text-zinc-800 focus:border-blue-500/50 outline-none transition-all uppercase tracking-tight"
                />
                <div className="flex flex-wrap gap-2">
                  {STYLE_PRESETS.map(s => (
                    <button
                      key={s}
                      onClick={() => setArtStyle(s)}
                      className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all",
                        artStyle === s ? "bg-blue-500 text-white border-blue-500 shadow-xl" : "bg-white/5 border-white/5 text-zinc-600 hover:text-white hover:border-white/20"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Narrative Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl hover:bg-white/[0.04] hover:border-white/10 transition-all shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <ScrollText className="w-4 h-4 text-emerald-500" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">Narrative Core description</h2>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="PROJECT DESCRIPTION..."
                rows={5}
                className="w-full bg-black/40 border border-zinc-800 rounded-3xl px-8 py-8 text-base font-medium text-white placeholder:text-zinc-800 focus:border-emerald-500/50 outline-none transition-all resize-none leading-relaxed shadow-inner"
              />
            </motion.div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-zinc-900/80 to-black/80 border border-white/10 rounded-[3rem] p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-6 rounded-md bg-[#bd4a4a] flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white fill-white" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Project Details</h3>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-zinc-600" />
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">AI Engine</span>
                  </div>
                  <span className="text-[10px] font-bold text-white">GEMINI 1.5 PRO</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-zinc-600" />
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Storage</span>
                  </div>
                  <span className="text-[10px] font-bold text-white">LOCAL SYNC</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-zinc-600" />
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Security</span>
                  </div>
                  <span className="text-[10px] font-bold text-white">PROTECTED</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-black/40 border border-white/5 mb-8">
                <h4 className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.2em] mb-4">Technical Stack</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Globe className="w-4 h-4 text-zinc-500" />
                    <span className="text-[8px] font-bold text-zinc-600 uppercase">Global</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Layers className="w-4 h-4 text-zinc-500" />
                    <span className="text-[8px] font-bold text-zinc-600 uppercase">Layers</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Box className="w-4 h-4 text-zinc-500" />
                    <span className="text-[8px] font-bold text-zinc-600 uppercase">Box</span>
                  </div>
                </div>
              </div>

              <button
                disabled={!title || loading}
                onClick={handleInitialize}
                className="w-full h-20 bg-[#bd4a4a] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-[#a33f3f] transition-all disabled:opacity-20 group relative overflow-hidden shadow-2xl active:scale-95"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      CREATING...
                    </motion.span>
                  ) : (
                    <motion.div
                      key="create"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3"
                    >
                      CREATE
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder {
          color: #27272a;
          font-weight: 900;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
}
