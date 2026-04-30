import React from 'react';
import { Outlet, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { CastHeader } from '@/pages/studio/components/Cast/CastHeader';
import { CastToolbar } from '@/pages/studio/components/Cast/CastToolbar';
import { generateCharacters } from '@/services/geminiService';
import { ViewerToolbar } from '@/pages/studio/components/Layout/ViewerToolbar';

export const CastContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function CastLayout() {
  const navigate = useNavigate();
  const [handlers, setHandlers] = React.useState<any>({});
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    isGeneratingCharacters, setIsGeneratingCharacters,
    prompt, selectedModel, contentType, generatedWorld,
    setCastData, setCastList, setGeneratedCharacters, setCharacterRelationships,
    session, episode, showNotification,
    generatedCharacters
  } = useGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to manifest character souls.', 'error');
      return;
    }
    setIsGeneratingCharacters(true);
    try {
      const result = await generateCharacters(prompt, selectedModel, contentType, generatedWorld || undefined);

      if (typeof result === 'object' && result !== null) {
        if ('characters' in result) {
          setCastData(result);
          setCastList(result.characters);
          setGeneratedCharacters(JSON.stringify(result, null, 2));
        }
        if ('markdown' in result) {
          setGeneratedCharacters(result.markdown as string);
        }
        if (result.relationships) {
          setCharacterRelationships(JSON.stringify(result.relationships));
        }
      } else {
        setGeneratedCharacters(result as string);
      }
      showNotification?.('Neural Synthesis Complete: Cast Genesis Manifested', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('Synthesis Failure: ' + (e.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingCharacters(false);
    }
  };

  // Determine active tab based on path or search params
  const activeTab = searchParams.get('tab') === 'relationships' ? 'relationships' : 'profiles';

  const handleTabChange = (tab: 'profiles' | 'relationships') => {
    if (location.pathname !== '/anime/cast') {
      navigate('/anime/cast' + (tab === 'relationships' ? '?tab=relationships' : ''));
    } else {
      if (tab === 'profiles') {
        setSearchParams({});
      } else {
        setSearchParams({ tab: 'relationships' });
      }
    }
  };

  return (
    <CastContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <CastHeader
          isGeneratingCharacters={handlers.isGenerating || isGeneratingCharacters}
          handleGenerate={handlers.handleGenerateCharacter || handleGenerate}
          prompt={prompt}
          session={session}
          episode={episode}
          onPrev={() => navigate('/anime/world')}
          onNext={() => navigate('/anime/series')}
        />

        <ViewerToolbar
          content={generatedCharacters}
          nexusLabel="Cast_Nexus"
          session={session}
          episode={episode}
        />

        <div className="flex items-center justify-center p-2 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-xl mb-8">
          <CastToolbar
            session={session}
            episode={episode}
            status={generatedCharacters ? 'active' : 'empty'}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
        </div>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </CastContext.Provider>
  );
}
