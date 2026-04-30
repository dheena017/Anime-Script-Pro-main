import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Mail,
  LifeBuoy,
  Video,
  Globe,
  BookOpen,
  Play,
  Users,
  CreditCard,
  ArrowRight,
  Sparkles,
  Search,
  Menu,
  X,
  CheckCircle,
  Palette,
  Download,
  Code,
  ExternalLink,
  Send,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// -------------------------------------------------
// Types
// -------------------------------------------------
interface GalleryItem {
  src: string;
  prompt: string;
}

// -------------------------------------------------
// Sub-components
// -------------------------------------------------
const NavItem = ({
  label,
  children,
  isOpen,
  onClick,
}: {
  label: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        {label}
        {children && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {children && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-0 mt-2 w-64 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl z-50"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const DropdownLink = ({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}) => (
  <a
    href={href}
    className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group"
  >
    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-studio group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
      <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white" />
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-bold text-white group-hover:text-studio transition-colors">
        {title}
      </span>
      <span className="text-[11px] text-zinc-500 leading-tight">{description}</span>
    </div>
  </a>
);

const SpeedLines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-studio/20"
        style={{
          width: '1px',
          height: '150px',
          left: `${Math.random() * 100}%`,
          top: '-20%',
        }}
        animate={{
          top: '120%',
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 0.3 + Math.random() * 0.4,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const DigitalScanline = () => (
  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-10">
    <motion.div
      className="w-full h-[2px] bg-studio shadow-[0_0_15px_rgba(6,182,212,0.8)]"
      animate={{ top: ['-5%', '105%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ position: 'absolute' }}
    />
  </div>
);

const HUDDecoration = () => (
  <div className="fixed inset-y-0 left-0 w-2 z-[90] pointer-events-none hidden 2xl:flex flex-col items-center justify-center gap-12 opacity-20">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="w-px h-24 bg-gradient-to-b from-transparent via-studio to-transparent" />
    ))}
  </div>
);

// -------------------------------------------------
// Gallery data using local assets
// -------------------------------------------------
const GALLERY_DATA: GalleryItem[] = [
  { src: '/cyberpunk_thumbnail_1776537282821.png', prompt: 'A neon-lit cyberpunk city at night with rain reflections' },
  { src: '/dark_isekai_thumbnail_1776537262155.png', prompt: 'A cel-shaded fantasy warrior wielding a glowing katana' },
  { src: '/magical_girl_thumbnail_1776537629295.png', prompt: 'Watercolor-style sakura blossoms falling over a quiet temple' },
  { src: '/mecha_rebellion_thumbnail_1776537334398.png', prompt: 'A massive mecha battle in a ruined metropolis, 90s anime style' },
  { src: '/sports_anime_thumbnail_1776537646600.png', prompt: 'An anime girl watching the ocean sunset from a cliff, Studio Ghibli style' },
  { src: '/steampunk_chronicle_thumbnail_1776586554491.png', prompt: 'Interior of a futuristic space station with holographic displays' },
];

// -------------------------------------------------
// Main Component
// -------------------------------------------------
// Style chips for the prompt bar
const STYLE_OPTIONS = [
  { label: 'Cyberpunk', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20' },
  { label: '90s Cel-Shaded', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' },
  { label: 'Watercolor', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20' },
  { label: 'Studio Ghibli', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' },
  { label: 'Dark Fantasy', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20' },
  { label: 'Noir', color: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20 hover:bg-zinc-500/20' },
  { label: 'Chibi', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' },
  { label: 'Retro Manga', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20' },
  { label: 'Synthwave', color: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 hover:bg-fuchsia-500/20' },
  { label: 'Ukiyo-e', color: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' },
  { label: 'Steampunk', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20' },
  { label: 'Vaporwave', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20' },
];

const PLACEHOLDER_PROMPTS = [
  'A samurai standing in a bamboo forest at sunset...',
  'A futuristic Tokyo skyline with flying cars...',
  'An underwater kingdom with bioluminescent creatures...',
  'A dragon rider soaring above snow-covered mountains...',
  'A magical girl transformation scene with sparkles...',
];

export function LandingPage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [galleryImages] = useState<GalleryItem[]>(GALLERY_DATA);
  const [activePrompt, setActivePrompt] = useState<string>('');
  const [promptText, setPromptText] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Cyberpunk');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Cycle placeholder text
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = () => {
    // Navigate to login with the prompt encoded in the URL so it can be used after auth
    navigate(`/login?prompt=${encodeURIComponent(promptText || PLACEHOLDER_PROMPTS[placeholderIndex])}&style=${encodeURIComponent(selectedStyle)}`);
  };

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 selection:bg-studio/30 selection:text-studio overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-studio/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <SpeedLines />
        <DigitalScanline />
        <HUDDecoration />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-black/50 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="flex items-center gap-3 no-underline group">
              <span className="text-xl font-black tracking-tighter uppercase text-white">
                AnimeScript <span className="text-studio">Pro</span>
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-2">
              <NavItem
                label="Support"
                isOpen={activeMenu === 'support'}
                onClick={() => toggleMenu('support')}
              >
                <DropdownLink
                  icon={LifeBuoy}
                  title="Contact support"
                  description="Get help from our technical specialists."
                  href="#"
                />
                <DropdownLink
                  icon={Mail}
                  title="Email us"
                  description="Direct line to our support inbox."
                  href="mailto:support@animescript.pro"
                />
              </NavItem>

              <NavItem
                label="Tutorials"
                isOpen={activeMenu === 'tutorials'}
                onClick={() => toggleMenu('tutorials')}
              >
                <DropdownLink
                  icon={BookOpen}
                  title="Learn"
                  description="Master the God Mode engine mechanics."
                  href="/tutorials"
                />
                <DropdownLink
                  icon={Video}
                  title="Youtube Channel"
                  description="Visual guides and production workflows."
                  href="https://youtube.com"
                />
                <DropdownLink
                  icon={Globe}
                  title="Instagram Inspiration"
                  description="Daily art and narrative snippets."
                  href="https://instagram.com"
                />
              </NavItem>

              <a
                href="/community"
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors no-underline"
              >
                Community
              </a>
              <a
                href="/pricing"
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors no-underline"
              >
                Pricing
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              Login
            </button>
            <Button
              onClick={() => navigate('/login')}
              className="bg-white text-black hover:bg-zinc-200 font-bold rounded-full px-6 transition-all transform hover:scale-105"
            >
              Sign up
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/5 bg-black/90 backdrop-blur-xl px-6 py-6 space-y-4"
            >
              <a href="/community" className="block text-sm font-medium text-zinc-400 hover:text-white no-underline">Community</a>
              <a href="/pricing" className="block text-sm font-medium text-zinc-400 hover:text-white no-underline">Pricing</a>
              <a href="/tutorials" className="block text-sm font-medium text-zinc-400 hover:text-white no-underline">Tutorials</a>
              <Button onClick={() => navigate('/login')} className="w-full bg-studio text-black font-bold">
                Get Started
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio/10 border border-studio/20 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-studio" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-studio-glow">
              Autonomous Production Engine v2.0
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-[0.9] text-white relative"
          >
            <span className="relative z-10">TURN YOUR IMAGINATION</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-purple-500 to-studio drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] relative z-10">
              INTO STUDIO-QUALITY ANIME.
            </span>
            <div className="absolute inset-0 -z-0 bg-studio/5 blur-[100px] rounded-full scale-110 animate-pulse" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl font-medium leading-relaxed"
          >
            The fastest AI generator for anime, manga, and concept art. Type a prompt. Get perfect anime art in seconds. Start creating for free.
          </motion.p>

          {/* AI PROMPT BAR */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-5xl mx-auto w-full"
          >
            {/* Main Input Container */}
            <div className="relative group">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-studio/50 via-purple-500/50 to-studio/50 rounded-[1.75rem] blur-sm opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[1.75rem] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                <div className="flex items-start gap-3">
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                    placeholder={PLACEHOLDER_PROMPTS[placeholderIndex]}
                    rows={3}
                    className="flex-1 bg-transparent border-none outline-none text-white text-base md:text-lg font-medium placeholder:text-zinc-600 py-3 px-2 resize-none max-h-[9rem] overflow-y-auto hide-scrollbar leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-end pt-2 px-1">
                  <Button
                    onClick={handleGenerate}
                    className="h-12 px-8 rounded-xl bg-studio text-black hover:bg-studio/90 font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95 shrink-0 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg] z-0" />
                    <span className="relative z-10 flex items-center">
                      <Send className="w-4 h-4 mr-2" />
                      Generate
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Style Chips — Below the prompt bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest shrink-0 mr-1">Style:</span>
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.label}
                  onClick={() => setSelectedStyle(style.label)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${selectedStyle === style.label
                      ? style.color + ' ring-1 ring-white/20 scale-105'
                      : 'bg-zinc-800/50 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                    }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
          >
            <Button
              onClick={() => navigate('/login')}
              className="h-16 px-10 rounded-2xl bg-studio text-black hover:bg-studio/90 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95"
            >
              Start Generating for Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-sm transition-all"
            >
              Watch Demo <Play className="ml-2 w-5 h-5 fill-white" />
            </Button>
          </motion.div>

          {/* Video Demo Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="max-w-5xl mx-auto py-16"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)] group">
              {/* Added Icon and Image Overlay elements */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Video className="w-4 h-4 text-studio" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live Demo</span>
              </div>
              <video
                className="w-full h-auto aspect-video object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="/cyberpunk_thumbnail_1776537282821.png"
              >
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <Button className="w-20 h-20 rounded-full bg-studio text-black hover:scale-110 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center">
                  <Play className="w-10 h-10 fill-black translate-x-1" />
                </Button>
              </div>
            </div>
          </motion.section>

          {/* How It Works Section */}
          <section className="max-w-7xl mx-auto py-20">
            <h2 className="text-4xl font-black text-center text-white uppercase tracking-wider mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-studio/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.15)] transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center mb-6 group-hover:bg-studio/20 group-hover:scale-110 transition-all">
                  <Code className="w-8 h-8 text-studio" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Describe</h3>
                <p className="text-zinc-400">Type your prompt or describe your scene.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-studio/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.15)] transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center mb-6 group-hover:bg-studio/20 group-hover:scale-110 transition-all">
                  <Palette className="w-8 h-8 text-studio" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Customize</h3>
                <p className="text-zinc-400">Choose your style – Cyberpunk, 90s Cel‑Shaded, Watercolor, etc.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-studio/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.15)] transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center mb-6 group-hover:bg-studio/20 group-hover:scale-110 transition-all">
                  <Download className="w-8 h-8 text-studio" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Download</h3>
                <p className="text-zinc-400">Get high‑res, royalty‑free anime art in seconds.</p>
              </motion.div>
            </div>
          </section>

          {/* Showcase / Inspiration Gallery */}
          <section className="max-w-7xl mx-auto py-20">
            <h2 className="text-4xl font-black text-center text-white uppercase tracking-wider mb-4">
              Inspiration Gallery
            </h2>
            <p className="text-zinc-500 text-center mb-12 text-sm font-medium">
              <Search className="w-4 h-4 inline-block mr-1" />
              Hover over any image to see the exact prompt used
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((item: GalleryItem, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative group cursor-pointer rounded-2xl overflow-hidden hover:shadow-[0_10px_30px_rgba(6,182,212,0.2)] hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-studio/30"
                  onClick={() => setActivePrompt(item.prompt)}
                >
                  <img
                    src={item.src}
                    alt="Generated anime art"
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 p-6">
                    <span className="text-white text-sm font-medium text-center leading-relaxed translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      "{item.prompt}"
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Active Prompt Display */}
            <AnimatePresence>
              {activePrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-8 p-6 rounded-2xl bg-zinc-900/60 border border-studio/20 text-center"
                >
                  <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">Selected Prompt</p>
                  <p className="text-white font-medium">"{activePrompt}"</p>
                  <Button
                    onClick={() => navigate('/login')}
                    className="mt-4 bg-studio text-black font-bold rounded-xl px-6 hover:bg-studio/90"
                  >
                    Try This Prompt <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Features & Use Cases */}
          <section className="max-w-7xl mx-auto py-20">
            <h2 className="text-4xl font-black text-center text-white uppercase tracking-wider mb-12">
              Why Choose AnimeScript Pro?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: 'Speed & Quality', text: 'Lightning‑fast generation with 4K upscaling capabilities.' },
                { icon: Users, title: 'Storyteller Friendly', text: 'Consistent character panels, dynamic backgrounds, VTuber avatars.' },
                { icon: Palette, title: 'Style Variety', text: 'Cyberpunk, Cel‑Shaded, Watercolor, and many more anime styles.' },
                { icon: CheckCircle, title: 'Commercial Rights', text: 'Full ownership of every image you generate. Use anywhere.' },
                { icon: CreditCard, title: 'Flexible Credits', text: '10 free credits daily. Upgrade anytime for unlimited generation.' },
                { icon: ExternalLink, title: 'Easy Export', text: 'Download in PNG, WebP, or SVG. Share directly to social media.' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-studio/20 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-studio/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
                    <f.icon className="w-6 h-6 text-zinc-400 group-hover:text-studio transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-studio transition-colors">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.text}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Pricing Summary */}
          <section className="max-w-7xl mx-auto py-20 text-center">
            <h2 className="text-4xl font-black text-white uppercase tracking-wider mb-8">Pricing</h2>
            <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
              Free tier gives you 10 credits daily. Upgrade for unlimited generations, private mode, and commercial rights.
            </p>
            <Button
              onClick={() => navigate('/pricing')}
              className="h-14 px-12 rounded-2xl bg-studio text-black font-black uppercase tracking-widest hover:bg-studio/90 transition-all hover:scale-105"
            >
              View Plans <CreditCard className="ml-2 w-5 h-5" />
            </Button>
          </section>

          {/* FAQ Section */}
          <section className="max-w-7xl mx-auto py-20">
            <h2 className="text-4xl font-black text-center text-white uppercase tracking-wider mb-12">FAQ</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                { q: 'Do I own the images I generate?', a: 'Yes – you receive full commercial rights for all creations on paid plans. Free-tier images are for personal use.' },
                { q: 'What happens when I run out of credits?', a: 'You can wait for your daily refresh (resets at midnight UTC) or upgrade to a Pro plan for unlimited usage.' },
                { q: 'Are there content restrictions?', a: 'Yes. Our safety filters block NSFW and illegal content to keep the community safe and compliant.' },
                { q: 'Can I use this for manhwa / manga panels?', a: 'Absolutely. Our engine supports consistent character generation across multiple panels, perfect for sequential art.' },
                { q: 'What resolution are the generated images?', a: 'Standard output is 1024×1024. Pro and Master plans include 4K upscaling up to 4096×4096.' },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="bg-zinc-900/40 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group"
                >
                  <summary className="text-white font-bold cursor-pointer flex items-center justify-between">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-zinc-400 mt-4 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
            <div className="space-y-6">
              <a href="/" className="flex items-center gap-3 no-underline group">
                <span className="text-lg font-black tracking-tighter uppercase text-white">
                  AnimeScript <span className="text-studio">Pro</span>
                </span>
              </a>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                The world's first autonomous production engine for anime and manga. Built for architects of the new digital age.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-studio/20 hover:text-studio transition-all text-zinc-400">
                  <Video className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-studio/20 hover:text-studio transition-all text-zinc-400">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-studio/20 hover:text-studio transition-all text-zinc-400">
                  <X className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Platform</h4>
              <ul className="space-y-4">
                <li><a href="/anime" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">God Mode Engine</a></li>
                <li><a href="/pricing" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">Pricing Plans</a></li>
                <li><a href="/community" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">Social Hub</a></li>
                <li><a href="/library" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">Asset Library</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Resources</h4>
              <ul className="space-y-4">
                <li><a href="/tutorials" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">Learn / Documentation</a></li>
                <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">Youtube Guides</a></li>
                <li><a href="/api-reference" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">API Reference</a></li>
                <li><a href="/lore-database" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">Lore Database</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Support</h4>
              <ul className="space-y-4">
                <li><a href="/contact" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">Contact Support</a></li>
                <li><a href="/help" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">Neural Help Center</a></li>
                <li><a href="/status" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">Status Portal</a></li>
                <li><a href="/terms" className="text-zinc-500 hover:text-studio text-sm font-medium transition-colors no-underline">Terms of Protocol</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
              © 2026 AnimeScript Pro. Engineered by DeepMind Swarm.
            </span>
            <div className="flex items-center gap-8">
              <a href="#" className="text-zinc-600 hover:text-zinc-400 text-[10px] font-black uppercase tracking-widest transition-colors no-underline">
                Privacy Core
              </a>
              <a href="/terms" className="text-zinc-600 hover:text-zinc-400 text-[10px] font-black uppercase tracking-widest transition-colors no-underline">
                Terms of Service
              </a>
            </div>
            <Button
              onClick={() => navigate('/login')}
              className="h-12 px-8 rounded-xl bg-white text-black font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
