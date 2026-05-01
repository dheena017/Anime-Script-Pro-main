import { Video, Globe, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
          <div className="space-y-6">
            <a href="/" className="flex items-center gap-3 no-underline group">
              <span className="text-lg font-black tracking-tighter uppercase text-white">
                AnimeScript <span className="text-studio">Pro</span>
              </span>
            </a>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
              The world's first autonomous production engine for anime and manga. Built for architects of the new digital age.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Watch Video Guides" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-studio/20 hover:text-studio transition-all text-zinc-400">
                <Video className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Visit Global Website" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-studio/20 hover:text-studio transition-all text-zinc-400">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Follow us on X" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-studio/20 hover:text-studio transition-all text-zinc-400">
                <X className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Platform</h4>
            <ul className="space-y-4">
              <li><a href="/anime" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">God Mode Engine</a></li>
              <li><a href="/pricing" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">Pricing Plans</a></li>
              <li><a href="/community" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">Social Hub</a></li>
              <li><a href="/library" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">Asset Library</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Resources</h4>
            <ul className="space-y-4">
              <li><a href="/tutorials" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">Learn / Documentation</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">Youtube Guides</a></li>
              <li><a href="/api-reference" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">API Reference</a></li>
              <li><a href="/lore-database" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">Lore Database</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Support</h4>
            <ul className="space-y-4">
              <li><a href="/contact" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">Contact Support</a></li>
              <li><a href="/help" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">Neural Help Center</a></li>
              <li><a href="/status" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">Status Portal</a></li>
              <li><a href="/terms" className="text-zinc-400 hover:text-studio text-sm font-medium transition-colors no-underline">Terms of Protocol</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            © 2026 AnimeScript Pro. Engineered by DeepMind Swarm.
          </span>
          <div className="flex items-center gap-8">
            <a href="#" className="text-zinc-500 hover:text-zinc-400 text-[10px] font-black uppercase tracking-widest transition-colors no-underline">
              Privacy Core
            </a>
            <a href="/terms" className="text-zinc-500 hover:text-zinc-400 text-[10px] font-black uppercase tracking-widest transition-colors no-underline">
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
  );
};
