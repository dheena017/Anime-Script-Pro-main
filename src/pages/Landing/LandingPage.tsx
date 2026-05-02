import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LifeBuoy,
  Mail,
  BookOpen,
  Video,
  Globe,
  X,
  Menu, 
  Sparkles, 
  ArrowRight, 
  Play, 
  CreditCard,
  Code,
  Palette,
  Download,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Modular UI Components
import { NavItem, DropdownLink } from './ui/NavComponents';
import { HeroPromptBar } from './ui/HeroPromptBar';

const Gallery = lazy(() => import('./ui/Gallery').then(m => ({ default: m.Gallery })));
const Features = lazy(() => import('./ui/Features').then(m => ({ default: m.Features })));
const FAQ = lazy(() => import('./ui/FAQ').then(m => ({ default: m.FAQ })));
const Footer = lazy(() => import('./ui/Footer').then(m => ({ default: m.Footer })));

// Data & Constants
import { 
  GALLERY_DATA, 
  PLACEHOLDER_PROMPTS, 
  GalleryItem 
} from './constants';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [galleryImages] = useState<GalleryItem[]>(GALLERY_DATA);
  const [promptText, setPromptText] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Cyberpunk');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [stats, setStats] = useState({ transmissions: 1240582, nodes: 842, uptime: 99.98 });

  // Cycle placeholder text and simulate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
      setStats(prev => ({
        ...prev,
        transmissions: prev.transmissions + Math.floor(Math.random() * 5)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = () => {
    if (!promptText.trim() && !PLACEHOLDER_PROMPTS[placeholderIndex]) return;
    navigate(`/login?prompt=${encodeURIComponent(promptText || PLACEHOLDER_PROMPTS[placeholderIndex])}&style=${encodeURIComponent(selectedStyle)}`);
  };

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 selection:bg-studio/30 selection:text-studio overflow-x-hidden font-sans">
      
      {/* 0. SYSTEM STATUS BANNER */}
      <div className="bg-studio/5 border-b border-studio/10 py-2 relative z-[110]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-studio/80">Secure Neural Link Active</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-l border-white/5 pl-4">
               <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Protocol v2.0.4 Encrypted</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
             <span>Latency: 14ms</span>
             <span className="hidden sm:inline text-zinc-700">//</span>
             <span className="hidden sm:inline">Region: Tokyo-Node-01</span>
          </div>
        </div>
      </div>

      {/* 1. NAVIGATION PROTOCOL */}
      <header className="fixed top-10 left-0 right-0 z-[100] px-6">
        <nav className="max-w-7xl mx-auto h-20 px-8 rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-12">
            <a href="/" className="flex items-center gap-3 no-underline group">
              <div className="w-8 h-8 rounded-lg bg-studio flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:rotate-12 transition-transform">
                 <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase text-white italic">
                ANIME<span className="text-studio">SCRIPT</span> PRO
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              <NavItem
                label="SOLUTIONS"
                isOpen={activeMenu === 'support'}
                onClick={() => toggleMenu('support')}
              >
                <DropdownLink icon={LifeBuoy} title="Master Support" description="Elite technical assistance for studio architects." href="#" />
                <DropdownLink icon={Mail} title="Direct Uplink" description="Encrypted communication line to our team." href="#" />
              </NavItem>

              <NavItem
                label="ACADEMY"
                isOpen={activeMenu === 'tutorials'}
                onClick={() => toggleMenu('tutorials')}
              >
                <DropdownLink icon={BookOpen} title="Production Docs" description="Master the engine mechanics from A to Z." href="/tutorials" />
                <DropdownLink icon={Video} title="Visual Logs" description="Step-by-step production walkthroughs." href="#" />
              </NavItem>

              <a href="/pricing" className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors no-underline">Pricing</a>
              <a href="/community" className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors no-underline">Community</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors hidden sm:block"
            >
              Access Terminal
            </button>
            <Button
              onClick={() => navigate('/login')}
              className="bg-white text-black hover:bg-studio hover:text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-full px-8 h-11 transition-all transform hover:scale-105 shadow-xl"
            >
              Initialize Sync
            </Button>
            <button
              className="lg:hidden p-2 text-zinc-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden mt-4 rounded-3xl border border-white/5 bg-black/90 backdrop-blur-2xl px-8 py-8 space-y-6 shadow-3xl"
            >
              <a href="/community" className="block text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-white no-underline">Community</a>
              <a href="/pricing" className="block text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-white no-underline">Pricing</a>
              <Button onClick={() => navigate('/login')} className="w-full h-14 bg-studio text-black font-black uppercase tracking-widest rounded-2xl">
                Get Started
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO PRODUCTION LAYER */}
      <main className="pt-52 pb-32 px-6 relative">
        {/* Background Grid & FX */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-studio/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-studio animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-studio shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              ENGINE v2.0.4 // PRODUCTION READY
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-[0.85] text-white uppercase">
              <span className="block opacity-90">ARCHITECT YOUR</span> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-fuchsia-500 to-studio bg-[length:200%_auto] animate-gradient shadow-studio-glow">
                ANIME REALITY
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl font-medium uppercase tracking-tight leading-relaxed">
              The elite AI engine for professional anime production. Type a directive. Establish visual consistency. Export studio-grade assets.
            </p>
          </motion.div>

          {/* AI PROMPT TERMINAL */}
          <div className="max-w-4xl mx-auto relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-studio/50 to-fuchsia-500/50 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
             <HeroPromptBar
                promptText={promptText}
                setPromptText={setPromptText}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                placeholderIndex={placeholderIndex}
                handleGenerate={handleGenerate}
             />
          </div>

          {/* REAL-TIME TELEMETRY */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5 bg-white/[0.02] rounded-[3rem] backdrop-blur-sm"
          >
             <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">Transmissions</span>
                <span className="text-2xl font-black text-white italic tracking-tighter">{stats.transmissions.toLocaleString()}</span>
             </div>
             <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">Neural Nodes</span>
                <span className="text-2xl font-black text-studio italic tracking-tighter">{stats.nodes}</span>
             </div>
             <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">System Uptime</span>
                <span className="text-2xl font-black text-emerald-500 italic tracking-tighter">{stats.uptime}%</span>
             </div>
             <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">Global Load</span>
                <span className="text-2xl font-black text-fuchsia-500 italic tracking-tighter">Minimal</span>
             </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Button
              onClick={() => navigate('/login')}
              className="h-20 px-12 rounded-[2rem] bg-studio text-black hover:bg-studio/90 font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_50px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-4"
            >
              INITIALIZE PRODUCTION <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="h-20 px-12 rounded-[2rem] border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center gap-4"
            >
              WATCH MASTERCLASS <Play className="w-5 h-5 fill-white" />
            </Button>
          </div>
        </div>
      </main>

      {/* 3. CORE FEATURES LAYER */}
      <section className="py-32 px-6 relative z-10 bg-black/40">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
             <div className="flex justify-center mb-6">
                <div className="p-3 rounded-2xl bg-studio/10 border border-studio/20">
                   <Activity className="w-6 h-6 text-studio" />
                </div>
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">HOW THE ENGINE WORKS</h2>
             <p className="text-zinc-500 uppercase text-[10px] tracking-[0.4em] font-bold">Standardized production workflows for modern architects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Code, title: "Neural Directive", desc: "Type your production requirements. Our LLM-driven engine parses every stylistic nuance.", color: "text-studio" },
              { icon: Palette, title: "Style Synthesis", desc: "Select from curated shonen, cyberpunk, or watercolor models. Or train your own visual DNA.", color: "text-fuchsia-500" },
              { icon: Download, title: "Asset Export", desc: "Download high-fidelity, royalty-free assets in 4K resolution, ready for any studio project.", color: "text-emerald-500" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative p-12 rounded-[3rem] bg-[#0a0a0b] border border-white/5 hover:border-studio/30 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="w-6 h-6 text-zinc-800" />
                </div>
                <div className={cn("w-20 h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center mb-10 transition-transform group-hover:scale-110", feature.color)}>
                  <feature.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed uppercase tracking-tight group-hover:text-zinc-300 transition-colors">
                   {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MODULAR LAYERS */}
      <div className="space-y-32 py-32">
        <Suspense fallback={<div className="h-96" />}>
          <Gallery images={galleryImages} activePrompt={''} setActivePrompt={() => {}} onTryPrompt={() => navigate('/login')} />
        </Suspense>

        <Suspense fallback={<div className="h-96" />}>
          <Features />
        </Suspense>

        {/* PRICE LOCK PROTOCOL */}
        <section className="max-w-7xl mx-auto px-6">
           <div className="relative rounded-[4rem] overflow-hidden p-20 border border-studio/20 bg-studio/[0.02] text-center space-y-10 group">
              <div className="absolute inset-0 bg-gradient-to-br from-studio/5 via-transparent to-fuchsia-500/5 opacity-50" />
              <div className="relative z-10 space-y-4">
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter">AUTHORIZE FULL ACCESS</h2>
                 <p className="text-zinc-500 max-w-2xl mx-auto uppercase text-[10px] tracking-[0.4em] font-bold leading-relaxed">
                    10 Daily Transmissions included in the base protocol. <br /> Upgrade for unlimited neural power and commercial licensing.
                 </p>
              </div>
              <Button
                onClick={() => navigate('/pricing')}
                className="relative z-10 h-20 px-16 rounded-[2rem] bg-studio text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all hover:scale-105 shadow-2xl"
              >
                VIEW PRICING PROTOCOL <CreditCard className="ml-4 w-5 h-5" />
              </Button>
           </div>
        </section>

        <Suspense fallback={<div className="h-64" />}>
          <FAQ />
        </Suspense>
      </div>

      <Suspense fallback={<div className="h-64" />}>
        <Footer />
      </Suspense>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
        .shadow-studio-glow {
           filter: drop-shadow(0 0 20px rgba(6,182,212,0.3));
        }
      `}</style>
    </div>
  );
}


