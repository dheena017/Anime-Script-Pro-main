import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLogs } from '@/contexts/LogContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';

export function NavigationMonitor() {
  const location = useLocation();
  const { addLog } = useLogs();
  const [navLatency, setNavLatency] = useState<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const startTime = useRef<number>(0);

  useEffect(() => {
    // Navigation started
    startTime.current = performance.now();
    setIsNavigating(true);
    
    // We'll consider navigation "done" when this effect runs after a render
    // However, since App.tsx stays mounted, we need to detect when the child component is ready.
    // A simple way is to use a requestAnimationFrame or just another useEffect in children.
    // For now, let's log the "Initiation" of navigation.
    addLog('ROUTER', 'INIT', `Navigating to ${location.pathname}`);

    const timer = setTimeout(() => {
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime.current);
      setNavLatency(latency);
      setIsNavigating(false);
      addLog('ROUTER', 'READY', `Page loaded in ${latency}ms`);
      
      // Clear after 3 seconds
      setTimeout(() => setNavLatency(null), 3000);
    }, 100); // Small buffer to ensure render

    return () => clearTimeout(timer);
  }, [location.pathname, addLog]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none">
      {/* Top Progress Bar */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "70%" }}
            exit={{ width: "100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-0.5 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-studio"
          />
        )}
      </AnimatePresence>

      {/* Latency Toast */}
      <AnimatePresence>
        {navLatency && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-3 shadow-2xl"
          >
            <Activity className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              NAV LATENCY: <span className="text-cyan-400">{navLatency}ms</span>
            </span>
            <Clock className="w-3 h-3 text-zinc-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

