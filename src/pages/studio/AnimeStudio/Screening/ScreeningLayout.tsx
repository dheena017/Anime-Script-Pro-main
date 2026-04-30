import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGenerator } from '@/hooks/useGenerator';
import { ScreeningHeader } from '../../components/Screening/ScreeningHeader';
import { ScreeningToolbar } from '../../components/Screening/ScreeningToolbar';
import { ScreeningTab } from '../../components/Screening/Tabs/ScreeningTabs';

export const ScreeningContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function ScreeningLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    session, episode,
  } = useGenerator();

  const activeTab = (searchParams.get('tab') as ScreeningTab) || 'preview';

  const handleTabChange = (tab: ScreeningTab) => {
    setSearchParams({ tab });
  };

  return (
    <ScreeningContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <ScreeningHeader
            session={session}
            episode={episode}
            onPrev={() => navigate('/anime/prompts')}
            onNext={() => navigate('/anime/engine')}
          />
        </div>

        <div className="studio-module-toolbar flex items-center justify-center p-2 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-xl mb-8">
          <ScreeningToolbar
            status="active"
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            session={session}
            episode={episode}
            activeSession={handlers.activeSession}
            setActiveSession={handlers.setActiveSession}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet context={{ activeTab }} />
        </motion.div>
      </div>
    </ScreeningContext.Provider>
  );
}
