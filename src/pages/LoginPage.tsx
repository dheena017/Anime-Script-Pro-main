import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, Zap, ArrowLeft, Play, Cpu, Camera, Film } from 'lucide-react';
import { AuthCard } from '../components/auth/AuthCard.jsx';
import { LoginForm } from '../components/auth/LoginForm.jsx';
import { SocialLoginButton } from '../components/auth/SocialLoginButton.jsx';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/')}
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
              <img src={`/${src}`} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-100 mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[900px] flex flex-col items-center"
      >
        <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Visual Content Section */}
          <div className="hidden md:flex flex-col gap-6 w-1/2">
             <div className="relative group rounded-[2rem] overflow-hidden border border-zinc-800/50 bg-black/40 backdrop-blur-3xl p-1">
                <div className="relative aspect-video rounded-[1.8rem] overflow-hidden bg-zinc-900">
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                      <div className="w-16 h-16 rounded-full bg-studio/20 backdrop-blur-md flex items-center justify-center border border-studio/30 group-hover:scale-110 transition-transform">
                         <Play className="w-6 h-6 text-studio fill-studio" />
                      </div>
                   </div>
                   <img 
                      src="/shonen_battle_thumbnail_1776537245370.png" 
                      className="w-full h-full object-cover opacity-60"
                      alt="Production Preview"
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
                         <span>Neural Processing</span>
                         <span className="text-studio">65% ACTIVE</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Cpu, label: "AI Core" },
                  { icon: Camera, label: "Engine" },
                  { icon: Film, label: "Render" }
                ].map((item, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center gap-2 group hover:border-studio/30 transition-all">
                     <item.icon className="w-5 h-5 text-zinc-500 group-hover:text-studio transition-colors" />
                     <span className="text-[8px] uppercase font-bold tracking-widest text-zinc-600 group-hover:text-zinc-400">{item.label}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="w-full md:w-[440px]">
            <AuthCard title="Architect Login" description="Protocol Alpha / Neural Access">
            <LoginForm />

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800/50" />
              </div>
              <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest">
                <span className="bg-[#020203] px-4 text-zinc-600">Secure Access Point</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <SocialLoginButton icon={GithubIcon}>
                Github
              </SocialLoginButton>
              <SocialLoginButton icon={LogIn}>
                Sign Up
              </SocialLoginButton>
            </div>
            </AuthCard>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="w-full mt-12 flex flex-col sm:flex-row items-center justify-between px-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
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
           <p className="text-[9px] uppercase tracking-[0.3em] font-black text-zinc-600 mt-4 sm:mt-0">
              Studio Architect v2.0
           </p>
        </div>
      </motion.div>
    </div>
  );
}
