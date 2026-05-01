import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, 
  UserPlus, 
  Layers, 
  ScrollText, 
  LayoutGrid, 
  Search, 
  Play, 
  Zap,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const PHASES = [
  { id: 'world', icon: Globe, label: 'World Lore', path: '/world', phase: '01' },
  { id: 'cast', icon: UserPlus, label: 'Cast DNA', path: '/cast', phase: '02' },
  { id: 'series', icon: Layers, label: 'Story Beats', path: '/series', phase: '03' },
  { id: 'script', icon: ScrollText, label: 'Script Synthesis', path: '/script', phase: '04' },
  { id: 'storyboard', icon: LayoutGrid, label: 'Visual DNA', path: '/storyboard', phase: '05' },
  { id: 'seo', icon: Search, label: 'SEO Matrix', path: '/seo', phase: '06' },
  { id: 'prompts', icon: Sparkles, label: 'Neural Prompts', path: '/prompts', phase: '07' },
  { id: 'protocols', icon: ShieldCheck, label: 'Logic Protocols', path: '/protocols', phase: '08' },
  { id: 'screening', icon: Play, label: 'Final Cut', path: '/screening', phase: '09' },
];

interface AnimeStudioSideBarProps {
  basePath: string;
  handleGenerate: () => void;
  isLoading: boolean;
}

export function AnimeStudioSideBar({ basePath, handleGenerate, isLoading }: AnimeStudioSideBarProps) {
  const location = useLocation();

  return (
    <aside className="w-72 h-full flex flex-col bg-[#050505] border-r border-zinc-800/50 relative z-20">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-zinc-800/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <Sparkles className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Production</h2>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">Control Deck</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
            <span>Project Pulse</span>
            <span className="text-red-500 animate-pulse">Online</span>
          </div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]" 
            />
          </div>
        </div>
      </div>

      {/* Phase Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        {PHASES.map((phase) => {
          const fullPath = `${basePath}${phase.path}`;
          const isActive = location.pathname.startsWith(fullPath);

          return (
            <NavLink
              key={phase.id}
              to={fullPath}
              className={({ isActive: _isActive }) => cn(
                "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "bg-red-500/10 text-white border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02] border border-transparent"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500",
                isActive ? "bg-red-500/20 text-red-500 shadow-inner" : "bg-zinc-900/50 text-zinc-600 group-hover:text-zinc-400"
              )}>
                <phase.icon className={cn("w-4 h-4", isActive && "animate-pulse-slow")} />
              </div>
              
              <div className="flex flex-col">
                <span className="text-[7px] font-black uppercase tracking-widest opacity-50 mb-0.5">Phase {phase.phase}</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{phase.label}</span>
              </div>

              {isActive && (
                <motion.div 
                  layoutId="active-chevron"
                  className="ml-auto"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 bg-zinc-950/50 border-t border-zinc-800/50">
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full h-12 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_30px_rgba(220,38,38,0.2)] transition-all active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Zap className="w-4 h-4 mr-2 fill-current" />
          {isLoading ? "Synthesizing..." : "Master Generate"}
        </Button>
      </div>
    </aside>
  );
}
