import React from 'react';
import '@/styles/creative-engine.css';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ScrollText,
  UserPlus,
  Layers,
  Play,
  Globe,
  Zap,
  ChevronDown,
  Loader2,
  LayoutGrid,
  ImageIcon,
  Settings,
  SlidersHorizontal,
  Search,
  ShieldCheck,
} from 'lucide-react';

const STUDIO_NAV = [
  { id: 'engine', icon: Settings, label: 'Engine', path: '/engine' },
  { id: 'world', icon: Globe, label: 'Anime World', path: '/world' },
  { id: 'cast', icon: UserPlus, label: 'Cast', path: '/cast' },
  { id: 'series', icon: Layers, label: 'Scenes', path: '/series' },
  { id: 'script', icon: ScrollText, label: 'Script', path: '/script' },
  { id: 'storyboard', icon: LayoutGrid, label: 'Storyboard', path: '/storyboard' },
  { id: 'seo', icon: Search, label: 'SEO', path: '/seo' },
  { id: 'prompts', icon: ImageIcon, label: 'Prompts', path: '/prompts' },
  { id: 'protocols', icon: ShieldCheck, label: 'Protocols', path: '/protocols' },
  { id: 'screening', icon: Play, label: 'Screening', path: '/screening' },

];

interface AnimeStudioNavigationProps {
  basePath: string;
  handleGenerate?: () => void;
  isLoading?: boolean;
  rightSidebarOpen?: boolean;
  onToggleRightSidebar?: () => void;
}

export function AnimeStudioNavigation({
  basePath,
  handleGenerate,
  isLoading,
  rightSidebarOpen: _rightSidebarOpen,
  onToggleRightSidebar: _onToggleRightSidebar
}: AnimeStudioNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const activeItem = STUDIO_NAV.find(item => location.pathname.endsWith(item.path)) || STUDIO_NAV[0];


  return (
    <div className="w-full px-4 pt-4 pb-2 relative z-[100] studio-navigation-bar">
      <div className="max-w-7xl mx-auto">
        <div className="relative flex items-center justify-between h-16 px-3 bg-[#050505]/80 backdrop-blur-3xl border border-studio/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Top light trace */}
          <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-studio/50 to-transparent" />
          
          {/* Background Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.02)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none" />

          {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
            {STUDIO_NAV.map((item) => {
              return (
                <NavLink
                  key={item.path}
                  to={`${basePath}${item.path}`}
                  end={item.path === ''}
                  className={({ isActive }) => cn(
                    "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                    isActive ? "text-studio" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={cn("w-3.5 h-3.5 relative z-10 transition-colors duration-500", isActive ? "text-studio" : "text-zinc-600")} />
                      <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-studio/10 border border-studio/30 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-studio/20 to-transparent opacity-50 rounded-xl" />
                        </motion.div>
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
              className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/10 rounded-xl hover:border-studio/30 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-studio/10 flex items-center justify-center border border-studio/20 group-hover:border-studio/40 transition-colors">
                <activeItem.icon className="w-4 h-4 text-studio" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Active Phase</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{activeItem.label}</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform duration-500", isMobileMenuOpen && "rotate-180")} />
            </button>
          </div>

          {/* ACTION BUTTONS (Always Visible) */}
          <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 border-l border-white/10 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={_onToggleRightSidebar}
              className={cn(
                "h-10 w-10 rounded-xl transition-all duration-500",
                _rightSidebarOpen
                  ? "bg-studio/20 text-studio border border-studio/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                  : "text-zinc-500 hover:text-studio hover:bg-studio/5 border border-transparent"
              )}
              title="Toggle Creative Engine"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleGenerate}
              disabled={isLoading}
              className="relative h-10 px-4 lg:px-8 rounded-xl bg-studio hover:bg-studio/90 text-black font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden group transition-all duration-500 active:scale-95 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-current animate-pulse" />
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
              className="absolute top-24 left-4 right-4 bg-[#050505]/95 backdrop-blur-2xl border border-studio/20 rounded-[2.5rem] p-6 shadow-2xl z-[100] max-h-[70vh] overflow-y-auto overflow-x-hidden"
            >
              <div className="grid grid-cols-2 gap-3">
                {STUDIO_NAV.map((item) => {
                  const isActive = location.pathname.endsWith(item.path);
                  return (
                    <NavLink
                      key={item.path}
                      to={`${basePath}${item.path}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-500",
                        isActive
                          ? "bg-studio/10 border-studio/30 text-studio shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                          : "bg-white/5 border-transparent text-zinc-500 hover:bg-white/10"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500",
                        isActive ? "bg-studio/20 border-studio/40 shadow-inner" : "bg-black/40 border-white/5"
                      )}>
                        <item.icon className={cn("w-6 h-6", isActive ? "text-studio animate-pulse-slow" : "text-zinc-600")} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
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

