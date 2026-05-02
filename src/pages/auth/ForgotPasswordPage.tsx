import { motion } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#020203] flex items-center justify-center p-4 relative overflow-hidden font-sans">


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
    </main>
  );
}

