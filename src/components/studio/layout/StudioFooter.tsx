import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGenerator } from '@/hooks/useGenerator';
import { Loader2 } from 'lucide-react';

const StatusIndicator = ({ label, status, colorClass, glowColor }: { label: string, status: string, colorClass: string, glowColor: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-[7px] font-black text-zinc-700 tracking-widest mb-1.5 uppercase">{label}</span>
    <div className="flex items-center gap-2">
      <div className={`w-1 h-1 ${colorClass} rounded-full`} style={{ boxShadow: `0 0 8px ${glowColor}` }} />
      <span className="text-[8px] font-black text-zinc-500 tracking-wider uppercase">{status}</span>
    </div>
  </div>
);

export const StudioFooter: React.FC = () => {
  const { syncCore, isSaving } = useGenerator();

  return (
    <footer className="bg-black/80 backdrop-blur-2xl border-t border-white/5 p-8 pb-6 relative z-50">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
        {/* Brand Section */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,1)]" />
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
              STUDIO <span className="text-emerald-500">ARCHITECT</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-[11px] leading-relaxed max-w-sm font-medium tracking-tight uppercase opacity-70">
            The next-generation production environment for creators. 
            Harnessing neural infrastructure to manifest stories into reality. 
            Experience the future of narrative synthesis with precision 
            and knowledge.
          </p>
        </div>

        {/* Ecosystem */}
        <div className="md:col-span-2">
          <h3 className="text-[10px] font-black text-zinc-400 tracking-[0.3em] mb-6 uppercase">Ecosystem</h3>
          <ul className="space-y-3">
            {['Discover', 'Community', 'Library'].map((item) => (
              <li key={item}>
                <Link to="#" className="text-[10px] font-bold text-zinc-600 hover:text-emerald-400 transition-colors uppercase tracking-widest">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Protocol */}
        <div className="md:col-span-2">
          <h3 className="text-[10px] font-black text-zinc-400 tracking-[0.3em] mb-6 uppercase">Protocol</h3>
          <ul className="space-y-3">
            {['Documentation', 'System Diagnostics', 'Real-time Metrics', 'Access Logs', 'Assistance'].map((item) => (
              <li key={item}>
                <Link to="#" className="text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* System Status & Action */}
        <div className="md:col-span-3 flex flex-col items-end justify-between py-1">
          <div className="flex gap-8">
            <StatusIndicator label="BACKEND" status="ONLINE" colorClass="bg-emerald-500" glowColor="rgba(16,185,129,0.8)" />
            <StatusIndicator label="DATABASE" status="VALIDE" colorClass="bg-blue-500" glowColor="rgba(59,130,246,0.8)" />
            <StatusIndicator label="NEURAL API" status={isSaving ? "SYNCING" : "DORMANT"} colorClass={isSaving ? "bg-amber-500" : "bg-red-500"} glowColor={isSaving ? "rgba(245,158,11,0.8)" : "rgba(239,68,68,0.8)"} />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(16,185,129,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={syncCore}
            disabled={isSaving}
            className="flex items-center gap-3 px-6 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-full group transition-all duration-300 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
            ) : (
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            )}
            <span className="text-[10px] font-black text-emerald-500 tracking-[0.25em] uppercase">
              {isSaving ? "Synchronizing..." : "Core Synchronized"}
            </span>
          </motion.button>

          <div className="text-right">
            <span className="block text-[8px] font-black text-zinc-700 tracking-[0.3em] uppercase mb-1">Region/Operate</span>
            <span className="block text-[11px] font-black text-zinc-500 tracking-[0.2em] uppercase">TKO-PRIME-V3</span>
          </div>
        </div>
      </div>

      {/* Footer Metadata Bottom Row */}
      <div className="max-w-[1600px] mx-auto pt-8 border-t border-white/5 flex flex-wrap justify-between items-end gap-6 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-800">
        <div className="flex items-center gap-10">
          <span className="text-zinc-700">© 2026 STUDIO ARCHITECT. ENGINEERED FOR CREATORS.</span>
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-emerald-500/40 rounded-full" />
            <span>GLOBAL UPTIME: 99.99%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-blue-500/40 rounded-full" />
            <span>NEURAL LINK: STABLE</span>
          </div>
        </div>

        <div className="flex items-center gap-12 text-right">
          <div className="flex flex-col gap-1">
            <span className="text-zinc-800 opacity-50">Build: Main-Root</span>
            <span className="text-zinc-600">V3.24.8-Free</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-800 opacity-50">Legacy Protocol</span>
            <span className="text-emerald-500/50">EndOfFile-Act-214</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
