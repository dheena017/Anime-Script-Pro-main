import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Terminal, 
  Fingerprint, 
  Cpu,
  Globe,
  Lock,
  ArrowRight
} from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate successful login to the mock session
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#020203] overflow-hidden p-4 font-sans">
      {/* 1. LAYERED DEPTH BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {/* Dynamic Nebula Effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#bd4a4a]/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-950/10 rounded-full blur-[120px]" />
        
        {/* Scanning Line Animation */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(189,74,74,0.03)_50%,transparent_100%)] bg-[length:100%_20px] animate-[scan_8s_linear_infinite] opacity-50" />
        
        {/* Neural Grid Mask */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-50 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020203_100%)]" />
      </div>

      {/* 2. MAIN CONSOLE CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden rounded-[2.5rem]">
          {/* Aesthetic Scanner Bar */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#bd4a4a] to-transparent shadow-[0_0_15px_rgba(189,74,74,0.8)]" />
          
          <CardHeader className="space-y-6 pb-8 pt-10 text-center relative">
            {/* Neural Hub Icon */}
            <motion.div 
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1, type: 'spring' }}
              className="mx-auto w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-[0_0_30px_rgba(189,74,74,0.1)] relative group"
            >
              <div className="absolute inset-0 bg-[#bd4a4a]/5 rounded-3xl animate-ping group-hover:animate-none opacity-50" />
              <Cpu className="h-10 w-10 text-[#bd4a4a] drop-shadow-[0_0_10px_rgba(189,74,74,0.4)]" />
            </motion.div>

            <div className="space-y-2">
              <CardTitle className="text-4xl font-black tracking-tighter text-white uppercase italic">
                Architect <span className="text-[#bd4a4a]">Node</span>
              </CardTitle>
              <div className="flex items-center justify-center gap-2">
                <span className="h-[1px] w-8 bg-zinc-800" />
                <CardDescription className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">
                  Protocol Authorization Required
                </CardDescription>
                <span className="h-[1px] w-8 bg-zinc-800" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8 px-10 pb-12">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                   <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">Node Identity (Email)</Label>
                   <Terminal className="w-3 h-3 text-zinc-700" />
                </div>
                <div className="relative group">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="shogun@architect.pro"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className="h-14 bg-zinc-900/50 border-zinc-800/80 focus:border-[#bd4a4a]/50 focus:ring-0 transition-all rounded-2xl pl-12 text-zinc-200 placeholder:text-zinc-700 font-medium"
                  />
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#bd4a4a] transition-colors" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">Cryptographic Key</Label>
                  <span className="text-[9px] uppercase font-bold text-zinc-700 hover:text-[#bd4a4a] cursor-pointer transition-colors">Lost Key?</span>
                </div>
                <div className="relative group">
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    placeholder="••••••••"
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    className="h-14 bg-zinc-900/50 border-zinc-800/80 focus:border-[#bd4a4a]/50 focus:ring-0 transition-all rounded-2xl pl-12 text-zinc-200 placeholder:text-zinc-700 font-medium"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#bd4a4a] transition-colors" />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#bd4a4a] hover:bg-[#d45555] text-white font-black uppercase tracking-[0.2em] h-14 rounded-2xl shadow-[0_10px_30px_rgba(189,74,74,0.2)] transition-all active:scale-[0.98] group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Decrypting...
                    </>
                  ) : (
                    <>
                      Establish Neural Link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>
            </form>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 border-zinc-800/50 bg-black/20 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest">
                <Fingerprint className="mr-2 h-4 w-4 text-[#bd4a4a]" /> Biometrics
              </Button>
              <Button variant="outline" className="h-12 border-zinc-800/50 bg-black/20 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="mr-2 h-4 w-4 text-blue-500" /> Multi-Sig
              </Button>
            </div>

            <p className="text-center text-[10px] text-zinc-700 font-bold uppercase tracking-widest">
              Need fresh authorization? <span className="text-[#bd4a4a] hover:underline cursor-pointer">Re-Sync Node</span>
            </p>
          </CardContent>
        </Card>

        {/* Console Meta Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-800">
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                <span>Asia-South-1</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                <span>Encrypted</span>
             </div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-800">
            God Mode v2.04
          </p>
        </motion.div>
      </motion.div>
      
      {/* Structural Decor */}
      <div className="fixed top-20 right-20 opacity-[0.03] rotate-12 pointer-events-none scale-150">
        <Sparkles className="text-[#bd4a4a] h-64 w-64 blur-[2px]" />
      </div>
      <div className="fixed bottom-20 left-20 opacity-[0.03] -rotate-12 pointer-events-none scale-150">
        <Zap className="text-[#bd4a4a] h-64 w-64 blur-[2px]" />
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
}
