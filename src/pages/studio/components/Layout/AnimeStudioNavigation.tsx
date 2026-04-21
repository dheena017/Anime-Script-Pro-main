import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Brain,
  ScrollText,
  UserPlus,
  LayoutGrid,
  Layers,
  Search,
  ImageIcon,
  BookOpen,
  FileText,
  Play,
  Globe,
  Zap,
  Heart,
  PanelRightOpen,
  PanelRightClose
} from 'lucide-react';

const STUDIO_NAV = [
  { icon: Brain, label: 'Concept', path: '/concept' },
  { icon: BookOpen, label: 'Template', path: '/template' },
  { icon: FileText, label: 'Methods', path: '/framework' },
  { icon: Globe, label: 'World', path: '/world' },
  { icon: Zap, label: 'Beats', path: '/beats' },
  { icon: UserPlus, label: 'Cast', path: '/cast' }, { icon: Heart, label: 'Relations', path: '/relations' },
  { icon: Layers, label: 'Series', path: '/series' },
  { icon: ScrollText, label: 'Script', path: '/script' },
  { icon: LayoutGrid, label: 'Storyboard', path: '/storyboard' },
  { icon: Search, label: 'SEO', path: '/seo' },
  { icon: ImageIcon, label: 'Prompts', path: '/prompts' },
  { icon: Play, label: 'Screening', path: '/example' },
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
  return (
    <div className="flex bg-[#0a0a0a]/80 p-2 lg:p-3 flex-wrap lg:flex-nowrap rounded-3xl lg:rounded-[2rem] border border-zinc-800 shadow-[0_4px_25px_rgba(0,0,0,0.5)] relative justify-between items-center backdrop-blur-2xl w-full overflow-hidden">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 w-full lg:w-auto order-2 lg:order-1 pt-2 lg:pt-0">
        {STUDIO_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={`${basePath}${item.path}`}
            end={item.path === ''}
            className={({ isActive }) => cn(
              "flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.25em] transition-all whitespace-nowrap relative group border shrink-0",
              isActive
                ? "bg-studio/10 text-studio border-studio/50 shadow-studio scale-105 z-10"
                : "text-zinc-500 border-transparent hover:border-studio/20 hover:text-studio/80 hover:bg-white/[0.02]"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-3.5 h-3.5 lg:w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-studio" : "text-zinc-600")} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-studio/20 blur-xl -z-10 rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="pl-0 lg:pl-6 border-l-0 lg:border-l border-zinc-800/50 flex-shrink-0 w-full lg:w-auto order-1 lg:order-2 pb-2 lg:pb-0 flex items-center gap-3">
        {onToggleRightSidebar && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleRightSidebar}
            className={cn(
              "h-10 lg:h-12 px-4 rounded-full border-zinc-800 bg-black/40 text-cyan-500 font-black uppercase tracking-widest text-[9px] hover:bg-cyan-500/10 hover:text-cyan-400 transition-all gap-2 hidden lg:flex items-center",
              rightSidebarOpen && "border-cyan-500/50 bg-cyan-500/10"
            )}
          >
            {rightSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            <span className="hidden xl:inline">Mission Control</span>
          </Button>
        )}
        <Button
          variant="default"
          size="sm"
          onClick={handleGenerate}
          disabled={isLoading}
          className="h-10 lg:h-12 w-full lg:w-auto px-6 lg:px-8 rounded-full bg-studio hover:bg-studio/80 text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-studio active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current group-hover:animate-pulse" />
              Generate
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
