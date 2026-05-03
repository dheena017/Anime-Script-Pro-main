import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { CastHeader } from './components/CastHeader';
import { CastToolbar, CastTab } from './components/CastToolbar';
import { generateCharacters } from '../../../../services/api/gemini';

export const CastContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function CastLayout() {
  const navigate = useNavigate();
  const [handlers, setHandlers] = React.useState<any>({});

  const { showNotification } = useApp();
  const {
    prompt, selectedModel, contentType, generatedWorld,
    session, episode, generatedCharacters, isSaving, isGeneratingCharacters
  } = useGeneratorState();

  const {
    setIsGeneratingCharacters, setCastData, setCastList,
    setGeneratedCharacters, setCharacterRelationships, syncCore
  } = useGeneratorDispatch();

  useAuth();

  const handleSave = async () => {
    await syncCore();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first before creating characters.', 'error');
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
      showNotification?.('Characters created successfully!', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('Failed to create characters: ' + (e.message || 'Unknown error'), 'error');
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

        <Outlet context={{ activeTab }} />
      </div>
    </CastContext.Provider>
  );
}




