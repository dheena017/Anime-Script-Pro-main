import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioSideBar as Sidebar } from '@/components/studio/layout/StudioSideBar';
import { cn } from '@/lib/utils';
import {
  User,
  HelpCircle,
  FolderGit2,
  ChevronDown,
  Search
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { NeuralConsole } from '@/components/studio/NeuralConsole';
import { NeuralErrorSentinel } from '@/components/studio/NeuralErrorSentinel';
import { NotificationCenter } from '@/components/widgets/NotificationCenter';
import { NeuralPulseLayer } from '@/components/neural/NeuralPulseLayer';
import { useGenerator } from '@/hooks/useGenerator';

export function Layout() {
  const { isFullscreen } = useGenerator();
  const location = useLocation();
  const { currentProject } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);


  const isStudioMode = location.pathname.startsWith('/anime') || 
                      location.pathname.startsWith('/manhwa') || 
                      location.pathname.startsWith('/comic');

  return (
    <div className={cn(
      "min-h-screen bg-[#050505] text-zinc-100 flex font-sans selection:bg-red-500/30 overflow-x-hidden",
      isFullscreen && "studio-fullscreen-mode"
    )}>
      {/* Background Accents - Atmospheric */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08)_0%,transparent_70%)] blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)] blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.03)_0%,transparent_70%)] blur-[80px] rounded-full mix-blend-screen" />
      </div>

      <NeuralPulseLayer />

      {/* Unified Sidebar */}
      <Sidebar collapsed={!isSidebarOpen} setCollapsed={(val) => setIsSidebarOpen(!val)} />
      
      {/* Content Backdrop / Blur when Sidebar is open */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(15px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-[450] cursor-pointer"
          />
        )}
      </AnimatePresence>

      <div 
        className="flex-1 flex flex-col min-w-0 bg-[#050505] pt-[60px] transition-all duration-300"
      >
        <header 
          className="fixed top-0 right-0 left-0 z-[400] border-b border-zinc-800/50 bg-black/40 backdrop-blur-xl shrink-0 transition-all duration-300"
        >
          <div className="max-w-full mx-auto px-4 sm:px-6 py-3 flex items-center justify-between w-full h-[60px]">
            <div className="flex items-center gap-4">
              {/* Project Selector - Studio Only */}
              {isStudioMode && (
                <Link to="/library" className={cn("hidden lg:flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group no-underline")}>
                  <FolderGit2 className="w-4 h-4 text-[#bd4a4a]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest leading-none">Architect</span>
                    <span className="text-xs font-bold text-white leading-tight">{currentProject?.title || 'Production'}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors ml-2" />
                </Link>
              )}
            </div>

            {/* Global Search Bar */}
            <div className="hidden xl:flex flex-1 max-w-md mx-8 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-red-500 transition-all duration-300" />
              <input
                type="text"
                placeholder="Global Search Manifests..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-[10px] font-black text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/30 focus:bg-white/[0.06] transition-all uppercase tracking-[0.2em] shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[8px] font-black text-zinc-500 tracking-tighter">
                ⌘ K
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* System Stats - Global */}
              <div className="hidden lg:flex items-center gap-6 px-4 border-l border-zinc-800">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Backend</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                    <span className="text-[9px] font-black text-white uppercase tracking-tighter">FastAPI</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Database</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                    <span className="text-[9px] font-black text-white uppercase tracking-tighter">SQLite</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Neural API</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-[#bd4a4a] shadow-[0_0_5px_rgba(189,74,74,0.5)]" />
                    <span className="text-[9px] font-black text-white uppercase tracking-tighter">Gemini</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="hidden sm:flex items-center gap-4 border-r border-zinc-800 pr-6 mr-2">
                {!isStudioMode && (
                  <Link to="/create-project" className="bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/30 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 no-underline">
                    New Production
                  </Link>
                )}
                <Link to="/help" className="text-zinc-400 hover:text-white transition-colors" title="Help Hub">
                  <HelpCircle className="w-5 h-5" />
                </Link>
                <NotificationCenter />
              </div>


              <Link to="/profile" className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-[#bd4a4a]/50 hover:shadow-[0_0_15px_rgba(189,74,74,0.2)] transition-all group" title="Architect Profile">
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 min-w-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-md py-8">
          <div className="max-w-full mx-auto px-4 sm:px-6 flex items-center justify-center w-full">
            <div className="flex flex-col items-center gap-1">
              <div className="text-zinc-500 text-[10px] tracking-widest uppercase font-black mb-1">
                © 2026 Studio Architect. Engineered for Creators.
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Global Uptime: 99.98%</span>
                 </div>
                 <span className="text-zinc-800 text-[8px]">•</span>
                 <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_5px_rgba(6,182,212,0.5)]" />
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Neural Link: Stable</span>
                 </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <NeuralConsole />
      <NeuralErrorSentinel />
    </div>
  );
}


