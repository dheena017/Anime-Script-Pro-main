import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGenerator } from '@/hooks/useGenerator';
import { EngineHeader } from '../../components/Engine/EngineHeader';
import { EngineToolbar } from '../../components/Engine/EngineToolbar';
import { EngineTab } from '../../components/Engine/Tabs/EngineTabs';

export const EngineContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function EngineLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    session, episode, generatedScript
  } = useGenerator();

  const activeTab = (searchParams.get('tab') as EngineTab) || 'status';

  const handleTabChange = (tab: EngineTab) => {
    setSearchParams({ tab });
  };

  return (
    <EngineContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <EngineHeader
          session={session}
          episode={episode}
          onPrev={() => navigate('/anime/screening')}
          isGenerating={handlers.isGenerating}
        />

        <div className="flex items-center justify-center p-2 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-xl mb-8">
          <EngineToolbar
            status={generatedScript ? 'active' : 'empty'}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            session={session}
            episode={episode}
          />
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet context={{ activeTab }} />
        </motion.div>
      </div>
    </EngineContext.Provider>
  );
}
