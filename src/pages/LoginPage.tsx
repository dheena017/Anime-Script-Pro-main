import React from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, Zap } from 'lucide-react';
import { AuthCard } from '../components/auth/AuthCard';
import { LoginForm } from '../components/auth/LoginForm';
import { SocialLoginButton } from '../components/auth/SocialLoginButton';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export function LoginPage() {
  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-studio/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-950/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-100 mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <AuthCard title="Architect Login" description="Protocol Alpha / Neural Access">
          <LoginForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800/50" />
            </div>
            <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest">
              <span className="bg-[#020203] px-4 text-zinc-600">Secure Access Point</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SocialLoginButton icon={GithubIcon}>
              Github
            </SocialLoginButton>
            <SocialLoginButton icon={LogIn}>
              Sign Up
            </SocialLoginButton>
          </div>
        </AuthCard>

        {/* Footer Metrics */}
        <div className="mt-8 flex items-center justify-between px-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">
              <div className="flex items-center gap-1.5">
                 <ShieldCheck className="w-3 h-3 text-studio" />
                 <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <Zap className="w-3 h-3 text-yellow-500" />
                 <span>Fast Lane</span>
              </div>
           </div>
           <p className="text-[9px] uppercase tracking-[0.3em] font-black text-zinc-600">
              Studio Architect v2.0
           </p>
        </div>
      </motion.div>
    </div>
  );
}
