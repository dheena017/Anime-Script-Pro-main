import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, BrainCircuit, Activity, Database, ArrowRight, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-hidden relative selection:bg-fuchsia-500/30">
      {/* Heavy God Mode Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-sky-600/10 blur-[150px] rounded-full animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
      </div>

      {/* Top Navbar */}
      <nav className="relative z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
         <Link 
           to="/"
           className="flex items-center gap-3 group no-underline"
         >
            <div className="w-10 h-10 bg-fuchsia-600 rounded-xl shadow-[0_0_20px_rgba(192,38,211,0.4)] flex items-center justify-center group-hover:scale-110 transition-transform">
               <Wand2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-[0.2em] uppercase text-white">God Mode <span className="opacity-50">Engine</span></span>
         </Link>
         <div className="flex gap-4">
            <Button variant="ghost" className="text-zinc-400 hover:text-white uppercase tracking-widest text-[10px] font-black">Architecture</Button>
            <Button variant="ghost" className="text-zinc-400 hover:text-white uppercase tracking-widest text-[10px] font-black">Neural Core</Button>
            <Button onClick={() => navigate('/login')} className="bg-white text-black hover:bg-zinc-200 uppercase tracking-widest text-[10px] font-black px-6 h-9 rounded-xl">Initialize System</Button>
         </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* God Mode Hero Section */}
        <div className="text-center space-y-8 mb-32 relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/10 to-sky-500/0 blur-[100px] -z-10" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(192,38,211,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-100">System v2.0 Operational</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl lg:text-[140px] font-black uppercase tracking-tighter leading-[0.85] drop-shadow-2xl"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-300 to-zinc-700">Autonomous</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-sky-400 to-fuchsia-500">Creation.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400 text-lg lg:text-xl font-bold max-w-3xl mx-auto leading-relaxed uppercase tracking-widest mt-8"
          >
            A multi-agent production environment for Anime & Manga. Architect vast universes, auto-generate scripts via Swarm Logic, and render 4K video all from a single terminal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-6 mt-12"
          >
             <Button 
                onClick={() => navigate('/anime')}
                className="h-16 px-12 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-sky-600 text-white font-black uppercase tracking-[0.2em] text-[12px] hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(192,38,211,0.3)] border border-fuchsia-400/50 transition-all duration-300"
             >
                Enter God Mode <ArrowRight className="ml-3 w-5 h-5" />
             </Button>
          </motion.div>
        </div>

        {/* Feature Grid corresponding to Settings Engine */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <motion.div initial={{ opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="bg-black/40 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-colors group">
              <div className="w-12 h-12 bg-fuchsia-500/10 rounded-2xl flex items-center justify-center mb-6 border border-fuchsia-500/20 group-hover:scale-110 transition-transform"><BrainCircuit className="text-fuchsia-500 w-6 h-6" /></div>
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">Multi-Agent Swarm</h3>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider leading-relaxed">Deploy specialized sub-agents to debate, refine, and stress-test your narrative logic before generating the final script.</p>
           </motion.div>

           <motion.div initial={{ opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay:0.1}} viewport={{once:true}} className="bg-black/40 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-colors group">
              <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 border border-sky-500/20 group-hover:scale-110 transition-transform"><Database className="text-sky-500 w-6 h-6" /></div>
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">PostgreSQL Clusters</h3>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider leading-relaxed">Deep database integration. Every keystroke is saved via Hybrid Cloud Blob Storage with military-grade AES-256 encryption.</p>
           </motion.div>

           <motion.div initial={{ opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay:0.2}} viewport={{once:true}} className="bg-black/40 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform"><Activity className="text-emerald-500 w-6 h-6" /></div>
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">Cinematic Enforcer</h3>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider leading-relaxed">Matrix-level hardware constraints force LLMs to output purely Hollywood-grade terminology (e.g. Volumetric Fog, Sakuga).</p>
           </motion.div>
        </div>

      </main>
    </div>
  );
}
