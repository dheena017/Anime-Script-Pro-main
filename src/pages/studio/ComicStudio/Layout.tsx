import { useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * ComicLayout - Production Node v1.0 (Scaffold)
 * Dedicated environment for Traditional Page / Graphic Novel production.
 */
export default function ComicLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const { setContentType, showNotification, isLoading, setIsLoading, addLog, prompt } = useGenerator();

  useEffect(() => {
    setContentType('Comic');
  }, [setContentType]);

  const handleMasterGenerate = useCallback(async () => {
    if (!prompt.trim() || !user) {
      showNotification?.('Missing Core Parameter: Enter a production prompt.', 'error');
      return;
    }
    setIsLoading(true);
    addLog("COMIC_CORE", "INITIALIZED", "Orchestrating Comic Production Cycle...");
    // Future: Add Comic-specific synthesis logic here
    setTimeout(() => {
      setIsLoading(false);
      showNotification?.('Comic Synthesis Scaffold Complete', 'success');
    }, 2000);
  }, [prompt, user, setIsLoading, addLog, showNotification]);

  return (
    <div className="fixed inset-0 bg-[#0d0a05] flex overflow-hidden z-[1000] comic-studio-root">
      {/* Sidebar Placeholder */}
      <div className="w-20 bg-black/40 border-r border-amber-500/20 flex flex-col items-center py-8 gap-8">
        <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(245,158,11,0.3)]">C</div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Top Bar Placeholder */}
        <div className="h-[60px] bg-black/20 backdrop-blur-md border-b border-amber-500/10 flex items-center px-8 justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Comic Architect</span>
            <span className="text-zinc-500 text-[10px]">/ Production Unit 03</span>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Atmospheric Layer */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="w-full max-w-7xl mx-auto px-6 py-8 relative z-10">
            <div className="w-full min-h-[600px] bg-[#1a150b]/80 backdrop-blur-3xl border border-amber-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] p-12 relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
               
               <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="w-full h-full relative z-10"
                  >
                    <div className="flex flex-col items-center justify-center h-[500px] space-y-10">
                       <div className="relative group">
                         <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                         <div className="relative w-32 h-32 rounded-[3rem] bg-black/40 border border-amber-500/30 flex items-center justify-center shadow-2xl">
                           <h1 className="text-6xl font-black text-white italic">C</h1>
                         </div>
                       </div>
                       
                       <div className="text-center space-y-4">
                         <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Comic Studio</h2>
                         <p className="text-amber-400 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Graphic Novel Production Engine / Online</p>
                       </div>

                       <Button
                         onClick={handleMasterGenerate}
                         disabled={isLoading}
                         className="h-16 px-12 rounded-3xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest text-xs gap-4 shadow-xl shadow-amber-600/20 transition-all hover:scale-105 active:scale-95"
                       >
                         {isLoading ? (
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         ) : (
                           <Sparkles className="w-5 h-5" />
                         )}
                         {isLoading ? 'Synthesizing Comic...' : 'Initiate Comic Genesis'}
                       </Button>
                    </div>
                    <Outlet />
                  </motion.div>
               </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
