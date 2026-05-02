import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGenerator } from '../../../../hooks/useGenerator';
import { useAuth } from '../../../../hooks/useAuth';
import { CastHeader } from '../components/Cast/CastHeader';
import { CastToolbar, CastTab } from '../components/Cast/CastToolbar';
import { generateCharacters } from '../../../../services/api/gemini';

export const CastContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function CastLayout() {
  const navigate = useNavigate();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    isGeneratingCharacters, setIsGeneratingCharacters,
    prompt, selectedModel, contentType, generatedWorld,
    setCastData, setCastList, setGeneratedCharacters, setCharacterRelationships,
    session, episode, showNotification,
    generatedCharacters,
    isSaving,
    syncCore
  } = useGenerator();

  useAuth();

  const handleSave = async () => {
    await syncCore();
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

  const location = useLocation();
  
  const getActiveTab = (): CastTab => {
    const path = location.pathname;
    if (path.includes('/cast/relationships') || path.includes('/cast/matrix')) return 'matrix';
    if (path.includes('/cast/characters')) return 'characters';
    if (path.includes('/cast/integrity')) return 'integrity';
    if (path.includes('/cast/add-lead')) return 'add-lead';
    if (path.includes('/cast/dna')) return 'dna';
    if (path.includes('/cast/dynamics')) return 'dynamics';
    
    // Default based on path
    if (path.endsWith('/cast')) return 'registry';
    
    return 'registry';
  };

  const activeTab = getActiveTab();
  
  const handleTabChange = (tab: CastTab) => {
    const base = `/${contentType.toLowerCase()}/cast`;
    if (tab === 'matrix') {
      navigate(`${base}/relationships`);
    } else if (tab === 'characters') {
      navigate(`${base}/characters`);
    } else if (tab === 'registry') {
      navigate(base);
    } else {
      navigate(`${base}/${tab}`);
    }
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



