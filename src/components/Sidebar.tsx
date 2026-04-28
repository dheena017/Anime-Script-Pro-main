import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import {
  ScrollText,
  History,
  Settings2,
  LayoutDashboard,
  Users,
  Brain,
  BookOpen,
  X,
  Compass,
  Layers,
  Search,
  ImageIcon,
  Layout as LayoutIcon,
  Play,
  UserPlus,
  Zap,
  Globe,
  Activity,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: History, label: 'My Library', path: '/library' },
  { icon: Compass, label: 'Discover', path: '/discover' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: BookOpen, label: 'Tutorials', path: '/tutorials' },
  { icon: Settings2, label: 'Settings', path: '/settings' },
];




interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const getPrefix = () => {
    if (location.pathname.startsWith('/anime')) return '/anime';
    if (location.pathname.startsWith('/manhwa')) return '/manhwa';
    if (location.pathname.startsWith('/comic')) return '/comic';
    return '/anime';
  };

  const prefix = getPrefix();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const foundationItems = [
    { icon: Globe, label: 'Anime World', path: 'world' },
  ];

  const architectureItems = [

    { icon: UserPlus, label: 'Cast', path: 'cast' },
    { icon: Layers, label: 'Series', path: 'series' },
  ];

  const generationItems = [
    { icon: ScrollText, label: 'Script', path: 'script' },
    { icon: LayoutIcon, label: 'Storyboard', path: 'storyboard' },
  ];

  const distributionItems = [
    { icon: Search, label: 'SEO', path: 'seo' },
    { icon: ImageIcon, label: 'Prompts', path: 'prompts' },
    { icon: Play, label: 'Screening Room', path: 'screening' },
  ];

  const renderNavGroup = (items: any[], title: string) => (
    <div className="space-y-1 mt-6">
      <p className="px-4 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
        <span className="w-4 h-[1px] bg-zinc-800" /> {title}
      </p>
      {items.map((item) => {
        const fullPath = `${prefix}/${item.path}`;
        const isActive = location.pathname === fullPath || (location.pathname === prefix && item.path === 'script' && title.includes("GENERATION"));
        // Add data-testid for Playwright selectors
        const testId = `sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`;
        return (
          <NavLink
            key={item.path}
            to={fullPath}
            onClick={onClose}
            data-testid={testId}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 group uppercase tracking-widest",
              isActive
                ? "bg-red-600/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50"
            )}
          >
            <item.icon className={cn(
              "w-4 h-4",
              isActive ? "text-red-500" : "text-zinc-600 group-hover:text-zinc-300",
              "group-hover:scale-110 transition-transform"
            )} />
            {item.label}
          </NavLink>
        );
      })}
    </div>
  );

  const isStudioMode = location.pathname.startsWith('/anime') || 
                      location.pathname.startsWith('/manhwa') || 
                      location.pathname.startsWith('/comic');

  const content = (
    <div className="flex flex-col h-full bg-[#050505]">
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-10">
        <nav className="p-4">
          {!isStudioMode ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="px-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Core Hub</p>
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 group uppercase tracking-widest",
                      isActive
                        ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 text-zinc-600 group-hover:text-zinc-200",
                      "group-hover:scale-110 transition-transform"
                    )} />
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <div className="space-y-1">
                <p className="px-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">System & Support</p>
                {[
                  { icon: BookOpen, label: 'Docs', path: '/documentation' },
                  { icon: Activity, label: 'System Health', path: '/status' },
                  { icon: History, label: 'Changelog', path: '/changelog' },
                  { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
                ].map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 group uppercase tracking-widest",
                      isActive
                        ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 text-zinc-600 group-hover:text-zinc-200",
                      "group-hover:scale-110 transition-transform"
                    )} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1 mb-8">
              <p className="px-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Studio Environment</p>
              <NavLink
                to="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 group uppercase tracking-widest text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50"
              >
                <LayoutDashboard className="w-4 h-4 text-zinc-600 group-hover:text-zinc-200" />
                Return to Hub
              </NavLink>
              <div className="h-[1px] bg-zinc-900 mx-4 my-6" />
              
              {renderNavGroup(foundationItems, "PHASE 1: FOUNDATION")}
              {renderNavGroup(architectureItems, "PHASE 2: ARCHITECTURE")}
              {renderNavGroup(generationItems, "PHASE 3: GENERATION")}
              {renderNavGroup(distributionItems, "PHASE 4: DISTRIBUTION")}
            </div>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800/50 bg-black/40">
        <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Neural Engine</span>
          </div>
          <p className="text-[9px] text-zinc-500 leading-relaxed mb-3">
            Advanced AI models & Multi-Session persistence enabled.
          </p>
          <button className="w-full py-2 bg-red-600/10 border border-red-600/30 hover:bg-red-600/20 text-red-500 text-[10px] font-black rounded-lg transition-all tracking-widest">
            UPGRADE ACCESS
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Unifed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[290]"
          />

          {/* Sidebar Overlay */}
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="border-r border-zinc-800/50 bg-[#050505] flex flex-col fixed top-0 left-0 bottom-0 w-72 lg:w-80 z-[300] shadow-[10px_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="w-full h-full flex flex-col">
              <div className="flex items-center gap-3 px-6 h-[60px] border-b border-zinc-800/50 shrink-0">
                <div className="w-7 h-7 bg-black border border-[#bd4a4a] rounded flex items-center justify-center shadow-[0_0_15px_rgba(189,74,74,0.3)]">
                  <ScrollText className="text-[#bd4a4a] w-4 h-4" />
                </div>
                <span className="font-black tracking-tighter text-xs uppercase text-white">Studio <span className="text-[#bd4a4a]">Architect</span></span>
                <button
                  onClick={onClose}
                  className="ml-auto p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {content}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
