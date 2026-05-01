import React from 'react';
import { Terminal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { signalBus, NeuralSignalEvent } from '@/lib/api-utils';

export function NeuralConsole() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [logs, setLogs] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Add initial boot logs
    const bootLogs = [
      "GOD MODE ENGINE v2.0 INITIALIZED",
      "CORE LORE: [ACTIVE]",
      "NEURAL ANALYTICS: [SYNCED]",
      "MASS PRODUCTION SCAFFOLD: 960 UNITS READY",
      "STUDIO ARCHITECT ONLINE."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLogs.length) {
        setLogs(prev => [...prev.slice(-4), `SYSTEM: ${bootLogs[i]}`]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    const handleSignal = (e: any) => {
      const { signalId, method, url, status, duration } = e.detail as NeuralSignalEvent;
      const cleanUrl = url.split('?')[0].slice(0, 20);
      const logMsg = `[${signalId}] ${method} ${cleanUrl} -> ${status} (${duration}ms)`;
      setLogs(prev => [...prev.slice(-8), logMsg]);
    };

    signalBus.addEventListener('neural_signal', handleSignal);

    return () => {
      clearInterval(interval);
      signalBus.removeEventListener('neural_signal', handleSignal);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: 240, opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            className="w-80 bg-black/90 backdrop-blur-2xl border border-studio/30 rounded-2xl mb-4 overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col"
          >
            <div className="p-3 border-b border-studio/20 flex items-center justify-between bg-studio/5">
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3 text-studio" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-studio">Neural Console</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-[10px] space-y-2 overflow-y-auto no-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-studio font-bold">#</span>
                  <span className={cn(
                    "uppercase tracking-tighter",
                    log.includes("INITIALIZED") || log.includes("READY") || log.includes("200") ? "text-emerald-500" : 
                    log.includes("404") || log.includes("500") ? "text-red-500" : "text-zinc-400"
                  )}>{log}</span>
                </div>
              ))}
              <div className="flex gap-2 items-center text-studio animate-pulse">
                <span>_</span>
              </div>
            </div>
            <div className="p-2 border-t border-zinc-800/50 bg-black/40 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-studio" />
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
              </div>
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">v2.0-STABLE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl relative group",
          isOpen ? "bg-studio text-white" : "bg-[#0a0a0a] border border-zinc-800 text-zinc-500 hover:border-studio/50 hover:text-studio"
        )}
      >
        {isOpen ? <ChevronDown className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
        {!isOpen && (
          <div className="absolute left-full ml-4 px-3 py-1.5 bg-black border border-zinc-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Open Neural Console</span>
          </div>
        )}
      </button>
    </div>
  );
}


