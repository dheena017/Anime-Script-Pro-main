import React from 'react';
import '@/styles/creative-engine.css';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/hooks/useGenerator';
import {
  ScrollText,
  UserPlus,
  Layers,
  Play,
  Globe,
  Zap,
  PanelRightOpen,
  PanelRightClose,
  ChevronDown,
  Loader2,
  LayoutGrid,
  Search,
  ImageIcon,
  Lock
} from 'lucide-react';

const STUDIO_NAV = [
  { id: 'world', icon: Globe, label: 'Anime World', path: '/world' },
  { id: 'beats', icon: Zap, label: 'Beats', path: '/beats' },
  { id: 'cast', icon: UserPlus, label: 'Cast', path: '/cast' },
  { id: 'series', icon: Layers, label: 'Series', path: '/series' },
  { id: 'script', icon: ScrollText, label: 'Script', path: '/script' },
  { id: 'storyboard', icon: LayoutGrid, label: 'Storyboard', path: '/storyboard' },
  { id: 'seo', icon: Search, label: 'SEO', path: '/seo' },
  { id: 'prompts', icon: ImageIcon, label: 'Prompts', path: '/prompts' },
  { id: 'screening', icon: Play, label: 'Screening', path: '/screening' },
];

export const AnimeStudioNavigation: React.FC<{
  basePath: string;
  handleGenerate?: () => void;
  isLoading?: boolean;
  rightSidebarOpen?: boolean;
  onToggleRightSidebar?: () => void;
}> = ({
  basePath,
  handleGenerate,
  isLoading,
  rightSidebarOpen,
  onToggleRightSidebar
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const location = useLocation();
    const { 
      generatedWorld, 
      narrativeBeats, 
      generatedCharacters, 
      generatedSeriesPlan, 
      generatedScript, 
      visualData, 
      generatedMetadata, 
      generatedImagePrompts,
      showNotification
    } = useGenerator();

    const checkStepStatus = (id: string) => {
      switch (id) {
        case 'world': return true; // First step always open
        case 'beats': return !!generatedWorld;
        case 'cast': return !!narrativeBeats;
        case 'series': return !!generatedCharacters;
        case 'script': return !!generatedSeriesPlan && generatedSeriesPlan.length > 0;
        case 'storyboard': return !!generatedScript;
        case 'seo': return Object.keys(visualData || {}).length > 0;
        case 'prompts': return !!generatedMetadata;
        case 'screening': return !!generatedImagePrompts;
        default: return false;
      }
    };

    const activeItem = STUDIO_NAV.find(item => location.pathname.endsWith(item.path)) || STUDIO_NAV[0];

    const handleNavClick = (e: React.MouseEvent, item: typeof STUDIO_NAV[0]) => {
      if (!checkStepStatus(item.id)) {
        e.preventDefault();
        showNotification?.(`Access Restricted: Complete the previous phase to unlock ${item.label}.`, 'error');
      }
    };

    return (
      <div className="w-full px-4 pt-4 pb-2 relative z-[100]">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex items-center justify-between h-16 px-3 bg-black/60 backdrop-blur-3xl border border-white/5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Top light trace */}
            <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
              {STUDIO_NAV.map((item) => {
                const isUnlocked = checkStepStatus(item.id);
                return (
                  <NavLink
                    key={item.path}
                    to={isUnlocked ? `${basePath}${item.path}` : '#'}
                    onClick={(e) => handleNavClick(e, item)}
                    end={item.path === ''}
                    className={({ isActive }) => cn(
                      "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                      isActive ? "text-cyan-400" : isUnlocked ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/5" : "text-zinc-800 cursor-not-allowed"
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {!isUnlocked ? (
                          <Lock className="w-3.5 h-3.5 text-zinc-800" />
                        ) : (
                          <item.icon className={cn("w-3.5 h-3.5", isActive ? "text-cyan-400" : "text-zinc-600")} />
                        )}
                        <span className="relative z-10">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* MOBILE NAVIGATION TRIGGER (Hidden on Desktop) */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <activeItem.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Active Phase</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{activeItem.label}</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform duration-300", isMobileMenuOpen && "rotate-180")} />
              </button>
            </div>

            {/* ACTION BUTTONS (Always Visible) */}
            <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 border-l border-white/10 ml-2">
              {onToggleRightSidebar && (
                <button
                  onClick={onToggleRightSidebar}
                  className={cn(
                    "flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl transition-all duration-300 group",
                    rightSidebarOpen
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                      : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                  )}
                >
                  {rightSidebarOpen ? <PanelRightClose className="w-4 h-4 lg:w-4 lg:h-4" /> : <PanelRightOpen className="w-4 h-4 lg:w-4 lg:h-4" />}
                  <span className="text-[10px] font-black uppercase tracking-widest hidden xl:inline">Engine</span>
                </button>
              )}

              <Button
                variant="default"
                size="sm"
                onClick={handleGenerate}
                disabled={isLoading}
                className="relative h-10 px-4 lg:px-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden group transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="inline">Generate All</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90]"
              />
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-24 left-4 right-4 bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 shadow-2xl z-[100] max-h-[70vh] overflow-y-auto overflow-x-hidden"
              >
                <div className="grid grid-cols-2 gap-3">
                  {STUDIO_NAV.map((item) => {
                    const isActive = location.pathname.endsWith(item.path);
                    const isUnlocked = checkStepStatus(item.id);
                    return (
                      <NavLink
                        key={item.path}
                        to={isUnlocked ? `${basePath}${item.path}` : '#'}
                        onClick={(e) => {
                          handleNavClick(e, item);
                          if (isUnlocked) setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300",
                          isActive
                            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                            : isUnlocked ? "bg-white/5 border-transparent text-zinc-500" : "bg-black/20 border-white/5 text-zinc-800 cursor-not-allowed"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                          isActive ? "bg-cyan-500/20 border-cyan-500/40" : isUnlocked ? "bg-black/40 border-white/5" : "bg-black/20 border-white/5"
                        )}>
                          {!isUnlocked ? <Lock className="w-5 h-5 text-zinc-800" /> : <item.icon className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

