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
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Modular UI Components (Lazy Loaded for Performance)
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
  const [activePrompt, setActivePrompt] = useState<string>('');
  const [promptText, setPromptText] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Cyberpunk');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Cycle placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = () => {
    navigate(`/login?prompt=${encodeURIComponent(promptText || PLACEHOLDER_PROMPTS[placeholderIndex])}&style=${encodeURIComponent(selectedStyle)}`);
  };

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 selection:bg-studio/30 selection:text-studio overflow-x-hidden">


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
              aria-label="Toggle Mobile Menu"
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
              className="lg:hidden border-t border-white/5 bg-black/90 backdrop-blur-md px-6 py-6 space-y-4"
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
            <div className="absolute inset-0 -z-0 bg-studio/5 blur-[100px] rounded-full scale-110" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl font-medium leading-relaxed"
          >
            The fastest AI generator for anime, manga, and concept art. Type a prompt. Get perfect anime art in seconds. Start creating for free.
          </motion.p>

          <a href="#how-it-works" className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:bg-studio focus:text-black focus:p-4 focus:rounded-xl">
            Skip to How It Works
          </a>

          {/* AI PROMPT BAR */}
          <HeroPromptBar
            promptText={promptText}
            setPromptText={setPromptText}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            placeholderIndex={placeholderIndex}
            handleGenerate={handleGenerate}
          />

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
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Video className="w-4 h-4 text-studio" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live Demo</span>
              </div>
              <video
                className="w-full h-auto aspect-video object-cover"
                muted
                loop
                playsInline
                width="1280"
                height="720"
                poster="/cyberpunk_thumbnail_1776537282821.png"
                preload="none"
              >
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <Button 
                  aria-label="Play Video Demo"
                  className="w-20 h-20 rounded-full bg-studio text-black hover:scale-110 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center"
                >
                  <Play className="w-10 h-10 fill-black translate-x-1" />
                </Button>
              </div>
            </div>
          </motion.section>

          {/* Modular Sections */}
          <section id="how-it-works" className="max-w-7xl mx-auto py-20">
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
                  <Code className="w-8 h-8 text-studio" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Describe</h3>
                <p className="text-zinc-400 font-medium">Type your prompt or describe your scene.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-studio/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.15)] transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center mb-6 group-hover:bg-studio/20 group-hover:scale-110 transition-all">
                  <Palette className="w-8 h-8 text-studio" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Customize</h3>
                <p className="text-zinc-400 font-medium">Choose your style – Cyberpunk, 90s Cel‑Shaded, Watercolor, etc.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-studio/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.15)] transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center mb-6 group-hover:bg-studio/20 group-hover:scale-110 transition-all">
                  <Download className="w-8 h-8 text-studio" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Download</h3>
                <p className="text-zinc-400 font-medium">Get high‑res, royalty‑free anime art in seconds.</p>
              </motion.div>
            </div>
          </section>

          <Suspense fallback={<div className="h-96" />}>
            <Gallery 
              images={galleryImages} 
              activePrompt={activePrompt} 
              setActivePrompt={setActivePrompt} 
              onTryPrompt={() => navigate('/login')} 
            />
          </Suspense>

          <Suspense fallback={<div className="h-96" />}>
            <Features />
          </Suspense>

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

          <Suspense fallback={<div className="h-64" />}>
            <FAQ />
          </Suspense>
        </div>
      </main>

      <Suspense fallback={<div className="h-64" />}>
        <Footer />
      </Suspense>
    </div>
  );
}

