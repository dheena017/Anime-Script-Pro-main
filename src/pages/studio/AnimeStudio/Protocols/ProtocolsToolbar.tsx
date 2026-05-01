import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { 
  ScrollText, 
  Globe, 
  UserPlus, 
  ImageIcon, 
  Zap, 
  Layers, 
  Search, 
  SlidersHorizontal 
} from 'lucide-react';

const PROTOCOL_TABS = [
  { id: 'script', label: 'Script', path: 'script', icon: ScrollText },
  { id: 'world', label: 'World', path: 'world', icon: Globe },
  { id: 'cast', label: 'Cast', path: 'cast', icon: UserPlus },
  { id: 'visual', label: 'Visual', path: 'visual', icon: ImageIcon },
  { id: 'motion', label: 'Motion', path: 'motion', icon: Zap },
  { id: 'series', label: 'Series', path: 'series', icon: Layers },
  { id: 'seo', label: 'SEO', path: 'seo', icon: Search },
  { id: 'utils', label: 'Utils', path: 'utils', icon: SlidersHorizontal },
];

export function ProtocolsToolbar() {
  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1">
      {PROTOCOL_TABS.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) => cn(
            "relative flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap",
            isActive ? "text-studio" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
          )}
        >
          {({ isActive }) => (
            <>
              <tab.icon className={cn("w-3.5 h-3.5 relative z-10 transition-colors duration-500", isActive ? "text-studio" : "text-zinc-600")} />
              <span className="relative z-10">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="protocol-active-pill"
                  className="absolute inset-0 bg-studio/10 border border-studio/30 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-studio/20 to-transparent opacity-50 rounded-xl" />
                </motion.div>
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}


