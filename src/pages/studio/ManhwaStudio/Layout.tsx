import { useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudioFooter } from '@/components/studio/layout/StudioFooter';
import { SessionLogs } from '../AnimeStudio/components/Layout/SessionLogs';

/**
 * ManhwaLayout - Production Node v1.0 (Scaffold)
 * Dedicated environment for Vertical Scroll / Webtoon production.
 */
export default function ManhwaLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const { 
    setContentType, showNotification, isLoading, setIsLoading, addLog, prompt,
    history, setPrompt, setTone, setAudience, setEpisode, setSession, 
    setSelectedModel, setGeneratedMetadata 
  } = useGenerator();

  useEffect(() => {
    setContentType('Manhwa');
  }, [setContentType]);

  const handleMasterGenerate = useCallback(async () => {
    if (!prompt.trim() || !user) {
      showNotification?.('Missing Core Parameter: Enter a production prompt.', 'error');
      return;
    }
    setIsLoading(true);
    addLog("MANHWA_CORE", "INITIALIZED", "Orchestrating Manhwa Production Cycle...");
    // Future: Add Manhwa-specific synthesis logic here
    setTimeout(() => {
      setIsLoading(false);
      showNotification?.('Manhwa Synthesis Scaffold Complete', 'success');
    }, 2000);
  }, [prompt, user, setIsLoading, addLog, showNotification]);

  return (
    <div className="fixed inset-0 bg-[#0a0510] flex flex-col overflow-hidden z-[1000] manhwa-studio-root">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Placeholder */}
        <div className="w-20 bg-black/40 border-r border-violet-500/20 flex flex-col items-center py-8 gap-8">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(139,92,246,0.3)]">M</div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 relative h-full">
          {/* Top Bar Placeholder */}
          <div className="h-[60px] bg-black/20 backdrop-blur-md border-b border-violet-500/10 flex items-center px-8 justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Manhwa Architect</span>
              <span className="text-zinc-500 text-[10px]">/ Production Unit 02</span>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="flex-1 overflow-y-auto relative no-scrollbar">
            {/* Atmospheric Layer */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="w-full max-w-7xl mx-auto px-6 py-8 relative z-10">
              <div className="w-full min-h-[600px] bg-[#100b1a]/80 backdrop-blur-3xl border border-violet-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] p-12 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
                
                <AnimatePresence>
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      className="w-full h-full relative z-10"
                    >
                      <div className="flex flex-col items-center justify-center h-[500px] space-y-10">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-violet-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative w-32 h-32 rounded-[3rem] bg-black/40 border border-violet-500/30 flex items-center justify-center shadow-2xl">
                            <h1 className="text-6xl font-black text-white italic">M</h1>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-4">
                          <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Manhwa Studio</h2>
                          <p className="text-violet-400 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Vertical Scroll Engine / Online</p>
                        </div>

                        <Button
                          onClick={handleMasterGenerate}
                          disabled={isLoading}
                          className="h-16 px-12 rounded-3xl bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-xs gap-4 shadow-xl shadow-violet-600/20 transition-all hover:scale-105 active:scale-95"
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Sparkles className="w-5 h-5" />
                          )}
                          {isLoading ? 'Sequencing Manhwa...' : 'Initiate Manhwa Genesis'}
                        </Button>
                      </div>
                      <Outlet />
                    </motion.div>
                </AnimatePresence>
              </div>

              {/* Intelligence Console */}
              <div className="mt-8">
                <SessionLogs
                  history={history}
                  setPrompt={setPrompt}
                  setTone={setTone}
                  setAudience={setAudience}
                  setEpisode={setEpisode}
                  setSession={setSession}
                  setContentType={setContentType}
                  setSelectedModel={setSelectedModel}
                  setGeneratedMetadata={setGeneratedMetadata}
                />
              </div>

              {/* Studio Footer with Gap */}
              <div className="mt-40 mb-10">
                <StudioFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
