import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { createClient } from '../supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LogIn,
  ShieldCheck,
  Zap,
  ArrowRight,
  Mail,
  Lock,
  Cpu
} from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

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
        <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden rounded-[2.5rem]">
          {/* Top Scanner Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-studio to-transparent shadow-[0_0_15px_rgba(220,38,38,0.8)]" />

          <CardHeader className="space-y-6 pb-8 pt-12 text-center relative">
             <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.1)] relative group">
                <div className="absolute inset-0 bg-studio/5 rounded-2xl animate-ping opacity-50" />
                <Cpu className="h-8 w-8 text-studio drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]" />
             </div>

            <div className="space-y-2">
              <CardTitle className="text-3xl font-black tracking-tighter text-white uppercase italic">
                Architect <span className="text-studio">Login</span>
              </CardTitle>
              <CardDescription className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[9px]">
                Protocol Alpha / Neural Access
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-10 pb-12">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black ml-1">Identity Vector</Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="architect@studio.pro"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="h-12 bg-zinc-900/50 border-zinc-800/80 focus:border-studio/50 focus:ring-0 transition-all rounded-xl pl-10 text-zinc-200 placeholder:text-zinc-700 font-medium text-sm"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-studio transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">Neural Key</Label>
                  <span className="text-[9px] uppercase font-bold text-zinc-700 hover:text-studio cursor-pointer transition-colors">Recover</span>
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="h-12 bg-zinc-900/50 border-zinc-800/80 focus:border-studio/50 focus:ring-0 transition-all rounded-xl pl-10 text-zinc-200 placeholder:text-zinc-700 font-medium text-sm"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-studio transition-colors" />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                >
                  <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-studio hover:bg-studio/90 text-white font-black uppercase tracking-[0.2em] h-12 rounded-xl shadow-[0_10px_30px_rgba(220,38,38,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                {loading ? 'Synchronizing...' : 'Initialize Session'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800/50" />
              </div>
              <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest">
                <span className="bg-[#020203] px-4 text-zinc-600">Secure Access Point</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-11 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all rounded-xl text-[9px] font-black uppercase tracking-widest"
              >
                <GithubIcon className="mr-2 h-3.5 w-3.5" /> Github
              </Button>
              <Button 
                variant="outline" 
                className="h-11 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all rounded-xl text-[9px] font-black uppercase tracking-widest"
              >
                <LogIn className="mr-2 h-3.5 w-3.5" /> Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>

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
