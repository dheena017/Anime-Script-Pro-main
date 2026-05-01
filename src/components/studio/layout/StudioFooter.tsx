import React from 'react';
import { Globe, Cpu, Zap } from 'lucide-react';

export const StudioFooter: React.FC = () => {
  return (
    <footer className="h-[40px] bg-black/40 backdrop-blur-md border-t border-zinc-800/50 px-6 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 group cursor-help">
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="group-hover:text-emerald-500 transition-colors">Neural Link: Synchronized</span>
        </div>
        <div className="flex items-center gap-2 group cursor-help">
          <Cpu className="w-3 h-3 text-zinc-700 group-hover:text-blue-500 transition-colors" />
          <span className="group-hover:text-blue-500 transition-colors">Engine: V3.24-Stable</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-zinc-700" />
          <span>Region: Tokyo-Prime-01</span>
        </div>
        <div className="flex items-center gap-2 group cursor-help">
          <Zap className="w-3 h-3 text-zinc-700 group-hover:text-amber-500 transition-colors" />
          <span className="group-hover:text-amber-500 transition-colors">System Load: 14%</span>
        </div>
        <div className="h-3 w-px bg-zinc-800" />
        <span className="text-zinc-700">© 2026 Studio Architect</span>
      </div>
    </footer>
  );
};
