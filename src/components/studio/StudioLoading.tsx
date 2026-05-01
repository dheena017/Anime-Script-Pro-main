import { motion } from 'framer-motion';


import { Loader2, Zap, Database, Globe } from 'lucide-react';

interface StudioLoadingProps {
  message?: string;
  submessage?: string;
  fullPage?: boolean;
}

export function StudioLoading({ 
  message = "Establishing Neural Link", 
  submessage = "Synchronizing with God Mode Orchestrator...",
  fullPage = true 
}: StudioLoadingProps) {
  return (
    <div className={`${fullPage ? 'fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl' : 'w-full py-40 bg-zinc-950/20 border-2 border-dashed border-zinc-900 rounded-[3rem]'} flex flex-col items-center justify-center space-y-8 overflow-hidden`}>
      {/* Background Ambience */}
      {fullPage && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        </>
      )}

      {/* Core Loader */}
      <div className="relative">
        {/* Outer Rotating Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-t-2 border-r-2 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        />
        
        {/* Inner Counter-Rotating Ring */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-b-2 border-l-2 border-fuchsia-500/40 shadow-[0_0_20px_rgba(162,28,175,0.2)]"
        />

        {/* Central Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </motion.div>
        </div>
      </div>

      {/* Text Info */}
      <div className="text-center space-y-3 relative z-10">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-black uppercase tracking-[0.3em] text-white drop-shadow-lg"
        >
          {message}
        </motion.h3>
        
        <div className="flex items-center justify-center gap-4">
           <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-500/50" />
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-[10px] font-black uppercase tracking-[0.15em] text-cyan-500/60"
           >
             {submessage}
           </motion.p>
           <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-cyan-500/50" />
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-6 pt-4">
        {[
          { icon: Database, label: "DB-SYNC" },
          { icon: Globe, label: "NET-LINK" },
          { icon: Loader2, label: "PROC-INIT", spin: true }
        ].map((item, i) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="flex items-center gap-2"
          >
            <item.icon className={`w-3 h-3 text-zinc-700 ${item.spin ? 'animate-spin' : ''}`} />
            <span className="text-[8px] font-bold text-zinc-800 uppercase tracking-widest">{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Scanning Bar Animation */}
      <motion.div 
        animate={{ translateY: ['-100%', '1000%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-20 w-full pointer-events-none"
      />
    </div>
  );
}


