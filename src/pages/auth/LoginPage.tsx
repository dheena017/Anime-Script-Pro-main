import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Zap, Play, Sparkles } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard.jsx';
import { LoginForm } from '@/components/auth/LoginForm.jsx';
import { SocialLoginButton } from '@/components/auth/SocialLoginButton.jsx';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import React from 'react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && user) {
      const params = new URLSearchParams(location.search);
      const redirectPrompt = params.get('prompt');
      const redirectStyle = params.get('style');
      
      if (redirectPrompt && redirectStyle) {
        navigate(`/dashboard?prompt=${redirectPrompt}&style=${redirectStyle}`, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate, location.search]);

  return (
    <main className="min-h-screen bg-[#020203] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/')}
        aria-label="Return to landing page"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-zinc-500 hover:text-studio transition-colors group"
      >
        <div className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800/50 group-hover:border-studio/50 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Return to Base</span>
      </motion.button>

      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-studio/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-950/10 rounded-full blur-[120px]" />
        
        {/* Background Visual Grid */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-4 p-8 opacity-20">
          {[
            'cyberpunk_thumbnail_1776537282821.png',
            'dark_isekai_thumbnail_1776537262155.png',
            'shonen_battle_thumbnail_1776537245370.png',
            'mecha_rebellion_thumbnail_1776537334398.png'
          ].map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              className="relative overflow-hidden rounded-2xl border border-white/5"
            >
              <img src={`/${src}`} alt={`Anime inspiration background ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-0 opacity-[0.03] brightness-100 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10"
      >
        {/* Left Side: Brand & Visual */}
        <div className="hidden lg:flex flex-col gap-8 pr-8">
           <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studio/10 border border-studio/20"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-studio-glow">System Online</span>
              </motion.div>
              <h1 className="text-7xl font-black italic tracking-tighter leading-[0.85] text-white">
                STUDIO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-purple-500 to-studio">ARCHITECT.</span>
              </h1>
              <h2 className="text-xl font-medium text-zinc-400 max-w-md">
                Orchestrate your production <br />
                With neural-grade precision.
              </h2>
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-12 bg-studio/30" />
                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">
                  Neural Access Authorized
                </p>
              </div>
           </div>
           <div className="relative group rounded-[2rem] overflow-hidden border border-zinc-800/50 bg-black/40 backdrop-blur-3xl p-1">
              <div className="relative aspect-video rounded-[1.8rem] overflow-hidden bg-zinc-900">
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                    <div className="w-16 h-16 rounded-full bg-studio/20 backdrop-blur-md flex items-center justify-center border border-studio/30 group-hover:scale-110 transition-transform">
                       <Play className="w-6 h-6 text-studio fill-studio" />
                    </div>
                 </div>
                 <OptimizedImage 
                    src="/shonen_battle_thumbnail_1776537245370.png" 
                    className="w-full h-full object-cover opacity-60"
                    alt="Production Preview"
                    fetchPriority="high"
                    width={800}
                    height={450}
                 />
              </div>
              
              <div className="flex gap-4 p-4 mt-2">
                 <div className="flex-1 space-y-2">
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                       <motion.div 
                          className="h-full bg-studio shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                          initial={{ width: "0%" }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 2, repeat: Infinity }}
                       />
                    </div>
                    <div className="flex justify-between text-[9px] uppercase font-black tracking-widest text-zinc-500">
                       <span>Engine Warmup</span>
                       <span className="text-studio">65% READY</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between lg:hidden mb-4">
             <span className="text-xl font-black tracking-tighter uppercase text-white">
               AnimeScript <span className="text-studio">Pro</span>
             </span>
          </div>

          <AuthCard 
            title="NEURAL LOGIN" 
            description="Access the God Mode production suite"
          >
            <LoginForm />
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                <span className="bg-[#0A0A0B] px-4 text-zinc-600">Neural Link Authorization</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SocialLoginButton icon={GithubIcon}>GitHub</SocialLoginButton>
              <SocialLoginButton icon={() => (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.34-2.04 4.52-1.28 1.28-3.26 2.42-6.52 2.42-5.14 0-9.28-4.14-9.28-9.28s4.14-9.28 9.28-9.28c2.8 0 4.94 1.1 6.46 2.52l2.32-2.32c-2.02-1.92-4.9-3.48-8.78-3.48-6.62 0-12 5.38-12 12s5.38 12 12 12c3.58 0 6.3-1.18 8.44-3.4 2.22-2.22 2.92-5.32 2.92-7.82 0-.54-.04-1.04-.12-1.54h-11.24z"/>
                </svg>
              )}>Google</SocialLoginButton>
            </div>

            <p className="mt-8 text-center text-xs text-zinc-500 font-medium">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-studio hover:text-studio-glow font-bold transition-colors"
              >
                Create Account
              </button>
            </p>
          </AuthCard>

          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-zinc-600">
              <ShieldCheck className="w-3 h-3 text-studio" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-zinc-600">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>Fast Lane</span>
            </div>
          </div>
          <p className="text-center text-[9px] uppercase tracking-[0.3em] font-black text-zinc-700">
            Studio Architect v2.0
          </p>
        </div>
      </motion.div>
    </main>
  );
}
