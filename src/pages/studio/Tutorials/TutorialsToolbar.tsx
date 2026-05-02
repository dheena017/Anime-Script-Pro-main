import React from 'react';
import { Search, PlayCircle, Book, Award, Target } from 'lucide-react';
import { cn } from "@/lib/utils";

const paths = [
  { label: "Core Protocols", icon: Target, active: true },
  { label: "Video Courses", icon: PlayCircle, active: false },
  { label: "Documentation", icon: Book, active: false },
  { label: "Certifications", icon: Award, active: false },
];

export const TutorialsToolbar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-zinc-950 border border-white/5 rounded-[2rem] mb-8">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
        {paths.map((path) => (
          <button
            key={path.label}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl border transition-all whitespace-nowrap",
              path.active 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                : "bg-zinc-900 border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
            )}
          >
            <path.icon className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">{path.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 flex-1 md:flex-initial">
        <div className="relative flex-1 md:w-64 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Academy..." 
            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </div>
      </div>
    </div>
  );
};



