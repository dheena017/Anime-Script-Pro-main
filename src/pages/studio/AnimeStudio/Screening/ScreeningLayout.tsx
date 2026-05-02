import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { ScreeningHeader } from '../components/Screening/ScreeningHeader';
import { ScreeningToolbar } from '../components/Screening/ScreeningToolbar';
import { ScreeningTab } from '../components/Screening/Tabs/ScreeningTabs';

export const ScreeningContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function ScreeningLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    session, episode, isSaving, setIsSaving, showNotification, generatedScript,
    castProfiles, castData, generatedSeriesPlan, generatedMetadata
  } = useGenerator();

  const { user } = useAuth();

  const handleSave = async () => {
    if (!user?.id) {
      showNotification?.('Authentication Required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const { productionApi } = await import('@/services/api/production');
      await productionApi.updateContent(user.id, {
        cast_profiles: castProfiles,
        cast_data: castData,
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata
      });
      showNotification?.('Production Preview Synchronized', 'success');
    } catch (e) {
      console.error("Manual sync failed:", e);
      showNotification?.('Sync Error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
            onRender={handlers.handleFullRender}
            isRendering={handlers.isRendering}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedScript}
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



