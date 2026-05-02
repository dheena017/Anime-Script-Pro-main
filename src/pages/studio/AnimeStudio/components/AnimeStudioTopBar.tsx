import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  Maximize2,
  SlidersHorizontal,
  Bell,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AnimeStudioTopBarProps {
  onToggleEngine: () => void;
  isEngineOpen: boolean;
}

export function AnimeStudioTopBar({ onToggleEngine, isEngineOpen }: AnimeStudioTopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current phase from path
  const currentPath = location.pathname.split('/').pop() || 'world';
  const phaseLabel = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  return (
    <header className="h-[70px] bg-[#020203] border-b border-zinc-800/50 flex items-center justify-between px-4 md:px-8 relative z-20">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <Cpu className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hidden xs:inline">Anime Studio</span>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-700 hidden sm:block" />
        <div className="flex flex-col">
          <h1 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] text-white leading-none">New Production</h1>
          <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Phase: {phaseLabel}</p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:mr-4 md:pr-4 md:border-r border-zinc-800/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleEngine}
            className={cn(
              "h-9 px-2 md:px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300",
              isEngineOpen
                ? "bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 md:mr-2" />
            <span className="hidden md:inline">Creative Engine</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 hidden sm:flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Bell className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 hidden sm:flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="ml-2 w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-red-500/50 transition-all p-0.5"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Architect" alt="Profile" className="w-full h-full object-cover rounded-lg" />
          </button>
        </div>
      </div>
    </header>
  );
}

