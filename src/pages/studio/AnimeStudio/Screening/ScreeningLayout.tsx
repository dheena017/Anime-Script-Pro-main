import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MonitorPlay } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { ScreeningHeader } from '../../components/Screening/ScreeningHeader';
import { ScreeningToolbar } from '../../components/Screening/ScreeningToolbar';

export default function ScreeningLayout() {
  const navigate = useNavigate();
  const { session, episode, generatedScript } = useGenerator();
  const [activeSession, setActiveSession] = React.useState(1);
  const [isRendering, setIsRendering] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      <ScreeningHeader
        activeSession={activeSession}
        setActiveSession={setActiveSession}
        isRendering={isRendering}
        onRender={() => { }} // Controlled by child or context
        hasScript={!!generatedScript}
        session={session}
        episode={episode}
        onPrev={() => navigate('/anime/seo')}
      />

      <div className="flex items-center justify-between p-4 bg-[#050505]/60 backdrop-blur-xl border border-studio/20 rounded-2xl mb-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="flex items-center gap-12 z-10 w-full">
          <div className="flex items-center gap-3 px-4 py-2 bg-studio/10 border border-studio/20 rounded-xl">
            <MonitorPlay className="w-4 h-4 text-studio" />
            <span className="text-[10px] font-black text-studio uppercase tracking-[0.2em]">Screening_Nexus</span>
          </div>

          <ScreeningToolbar
            session={activeSession.toString()}
            episode="1"
            status={videoUrl ? 'active' : 'empty'}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet context={{ activeSession, setActiveSession, setIsRendering, setVideoUrl, videoUrl }} />
      </motion.div>
    </div>
  );
}
