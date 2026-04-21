import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from '../components/Sidebar';
import { cn } from '../lib/utils';
import { 
  User,
  Menu,
  X,
  ScrollText,
  HelpCircle, 
  PlusSquare, 
  FolderGit2, 
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NeuralConsole } from '../components/studio/NeuralConsole';
import { NotificationCenter } from '../components/NotificationCenter';

export function Layout() {
  const location = useLocation();
  const { currentProject } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);


  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex font-sans selection:bg-red-500/30 overflow-x-hidden">
      {/* Background Accents - Atmospheric */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08)_0%,transparent_70%)] blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)] blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.03)_0%,transparent_70%)] blur-[80px] rounded-full mix-blend-screen" />
      </div>

      {/* Sidebar: show/hide on all screens */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] pt-[60px]">
        <header className="fixed top-0 right-0 left-0 z-[100] border-b border-zinc-800/50 bg-black/40 backdrop-blur-xl shrink-0">
          <div className="max-w-full mx-auto px-4 sm:px-6 py-3 flex items-center justify-between w-full h-[60px]">
            <div className="flex items-center gap-4">
              <button
                className="text-zinc-400 hover:text-white transition-colors"
                onClick={() => setIsSidebarOpen((open) => !open)}
                aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              {!isSidebarOpen && (
                <Link to="/" className="flex items-center gap-3 group no-underline ml-2">
                  <div className="w-8 h-8 bg-black border border-[#bd4a4a] rounded flex items-center justify-center shadow-[0_0_15px_rgba(189,74,74,0.3)] group-hover:scale-110 transition-transform">
                    <ScrollText className="text-[#bd4a4a] w-5 h-5" />
                  </div>
                  <span className="font-black tracking-tighter text-sm uppercase text-white">Studio <span className="text-[#bd4a4a]">Architect</span></span>
                </Link>
              )}

              {/* Project Selector - Added */}
              <Link to="/projects" className={cn("hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group no-underline", !isSidebarOpen ? "ml-8" : "ml-2")}>
                <FolderGit2 className="w-4 h-4 text-[#bd4a4a]" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest leading-none">Editing Project</span>
                  <span className="text-xs font-bold text-white leading-tight">{currentProject?.title || 'No Project Selected'}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors ml-2" />
              </Link>
            </div>

            <div className="flex items-center gap-6">
              {/* Quick Actions */}
              <div className="hidden sm:flex items-center gap-4 border-r border-zinc-800 pr-6 mr-2">
                <Link to="/create/new" className="text-zinc-400 hover:text-[#bd4a4a] transition-colors" title="Create New">
                  <PlusSquare className="w-5 h-5" />
                </Link>
                <Link to="/tutorials" className="text-zinc-400 hover:text-white transition-colors" title="Documentation">
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
          <div className="max-w-full mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-zinc-500 text-xs tracking-widest uppercase font-medium">
              © 2026 Creator Studio Pro. Built for creators.
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs tracking-widest uppercase font-medium">Terms</a>
              <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs tracking-widest uppercase font-medium">Privacy</a>
              <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs tracking-widest uppercase font-medium">Support</a>
            </div>
          </div>
        </footer>
      </div>
      <NeuralConsole />
    </div>
  );
}
