import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGenerator } from '@/hooks/useGenerator';
import { CastHeader } from '@/pages/studio/components/Cast/CastHeader';
import { CastToolbar, CastTab } from '@/pages/studio/components/Cast/CastToolbar';
import { generateCharacters } from '@/services/geminiService';

export const CastContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function CastLayout() {
  const navigate = useNavigate();
  const [handlers, setHandlers] = React.useState<any>({});
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    isGeneratingCharacters, setIsGeneratingCharacters,
    prompt, selectedModel, contentType, generatedWorld,
    setCastData, setCastList, setGeneratedCharacters, setCharacterRelationships,
    session, episode, showNotification,
    generatedCharacters,
    isSaving, setIsSaving
  } = useGenerator();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      showNotification?.('Cast Manifest Synchronized', 'success');
    } catch (e) {
      showNotification?.('Sync Error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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

  const activeTab = (searchParams.get('tab') as CastTab) || 'registry';
  
  const handleTabChange = (tab: CastTab) => {
    setSearchParams({ tab });
  };


  return (
    <CastContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <CastHeader
            isGenerating={handlers.isGenerating || isGeneratingCharacters}
            onRegenerate={handlers.handleGenerateCharacter || handleGenerate}
            session={session}
            episode={episode}
            onPrev={() => navigate('/anime/world')}
            onNext={() => navigate('/anime/series')}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedCharacters}
          />
        </div>

        <div className="studio-module-toolbar flex items-center justify-center p-2 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-xl mb-8">
          <CastToolbar
            status={generatedCharacters ? 'active' : 'empty'}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            session={session}
            episode={episode}
            content={generatedCharacters}
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
    </CastContext.Provider>
  );
}

