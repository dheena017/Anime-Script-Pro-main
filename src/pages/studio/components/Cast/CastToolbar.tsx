import React from 'react';
import { Activity, UserPlus, Fingerprint, Settings2, ShieldCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface CastToolbarProps {
  session: string;
  episode: string;
  status: 'active' | 'draft' | 'empty';
  activeTab: 'profiles' | 'relationships';
  setActiveTab: (tab: 'profiles' | 'relationships') => void;
}

export const CastToolbar: React.FC<CastToolbarProps> = ({
  status,
  activeTab,
  setActiveTab
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-8">
        <div className="flex p-1 bg-[#0a0a0a]/40 border border-zinc-800/50 rounded-xl backdrop-blur-md relative">
          <button
            onClick={() => setActiveTab('profiles')}
            className={cn(
              "relative px-6 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
              activeTab === 'profiles' ? "text-studio" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {activeTab === 'profiles' && (
              <motion.div
                layoutId="cast-tab-indicator"
                className="absolute inset-0 bg-studio/10 border border-studio/20 rounded-lg"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Profiles
            </span>
          </button>
          <button
            onClick={() => setActiveTab('relationships')}
            className={cn(
              "relative px-6 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
              activeTab === 'relationships' ? "text-fuchsia-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {activeTab === 'relationships' && (
              <motion.div
                layoutId="cast-tab-indicator"
                className="absolute inset-0 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Fingerprint className="w-3.5 h-3.5" />
              Matrix
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Activity className={cn("w-3 h-3", status === 'active' ? "text-cyan-500" : "text-zinc-600")} />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-none">
              {status === 'active' ? 'Neural Registry Active' : 'Registry Standby'}
            </span>
            <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">Character Database Integrity: Verified</span>
          </div>
          {status === 'active' && <ShieldCheck className="w-3 h-3 text-emerald-500/50" />}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/anime/cast/create')}
          className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group"
        >
          <UserPlus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[9px]">Add Lead</span>
        </button>
        <button
          onClick={() => navigate('/anime/cast/dna')}
          className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group"
        >
          <Fingerprint className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[9px]">DNA Analysis</span>
        </button>
        <button
          onClick={() => navigate('/anime/cast/dynamics')}
          className="flex items-center gap-2 text-zinc-600 hover:text-studio transition-colors group"
        >
          <Settings2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[9px]">Dynamics</span>
        </button>
      </div>
    </div>
  );
};
