import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { StudioToolbar as EngineToolbar } from '../../components/Layout/StudioToolbar';
import { EngineHeader } from '../../components/Engine/EngineHeader';

export default function EngineLayout() {
  const navigate = useNavigate();
  const { session, episode } = useGenerator();

  return (
    <div className="space-y-6">
      <EngineHeader
        session={session}
        episode={episode}
        onPrev={() => navigate('/anime/screening')}
      />

      <div className="flex items-center justify-between p-4 bg-[#050505]/60 backdrop-blur-xl border border-studio/20 rounded-2xl mb-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="flex items-center gap-12 z-10 w-full">
          <div className="flex items-center gap-3 px-4 py-2 bg-studio/10 border border-studio/20 rounded-xl">
            <Settings className="w-4 h-4 text-studio" />
            <span className="text-[10px] font-black text-studio uppercase tracking-[0.2em]">Engine_Nexus</span>
          </div>

          <EngineToolbar
            session={session}
            episode={episode}
            content={null}
            filename={''}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
