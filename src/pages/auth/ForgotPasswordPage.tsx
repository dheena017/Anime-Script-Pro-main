import { motion } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-studio/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-950/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] brightness-100 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <AuthCard title="Account Recovery" description="Protocol Alpha / Identity Restoration">
          <ForgotPasswordForm />
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



