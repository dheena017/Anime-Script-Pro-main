import React from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { generateCharacters } from '@/services/geminiService';
import { cn } from '@/lib/utils';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Sub-components
import { CastHeader } from '../components/Cast/CastHeader';
import { CastView } from '../components/Cast/CastView';
import { CastEmptyState } from '../components/Cast/CastEmptyState';
import { RelationshipLab } from '../components/Cast/RelationshipLab';

export function CastPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'relationships' ? 'relationships' : 'profiles';
  const [activeTab, setActiveTab] = React.useState<'profiles' | 'relationships'>(initialTab);

  // Update tab when search params change
  React.useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'relationships') {
      setActiveTab('relationships');
    } else {
      setActiveTab('profiles');
    }
  }, [searchParams]);
  const [isLiked, setIsLiked] = React.useState(false);
  const { 
    generatedCharacters, 
    setGeneratedCharacters, 
    isGeneratingCharacters, 
    setIsGeneratingCharacters,
    setCharacterRelationships,
    setCastData, setCastList,
    prompt,
    selectedModel,
    contentType,
    generatedWorld,
    narrativeBeats,
    session,
    episode,
    showNotification
  } = useGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to manifest character souls.', 'error');
      return;
    }
    setIsGeneratingCharacters(true);
    try {
      const result = await generateCharacters(prompt, selectedModel, contentType, generatedWorld || undefined, narrativeBeats || undefined);
      
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


  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" data-testid="marker-character-cast">
      <CastHeader 
        isGeneratingCharacters={isGeneratingCharacters}
        handleGenerate={handleGenerate}
        prompt={prompt}
        session={session}
        episode={episode}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        onNext={() => {
          const type = contentType.toLowerCase();
          navigate(`/${type}/assets`);
        }}
      />

      <div className="flex justify-center mb-6">
         <div className="flex p-1 bg-[#0a0a0a]/80 border border-zinc-800 rounded-2xl backdrop-blur-xl">
            <button 
              onClick={() => setSearchParams({})}
              className={cn(
                "px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'profiles' ? "bg-studio/20 text-studio shadow-studio/20" : "text-zinc-500 hover:text-studio"
              )}
            >
              Character Profiles
            </button>
            <button 
              onClick={() => setSearchParams({ tab: 'relationships' })}
              className={cn(
                "px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'relationships' ? "bg-fuchsia-500/20 text-fuchsia-400 shadow-fuchsia-500/20" : "text-zinc-500 hover:text-fuchsia-400"
              )}
            >
              Relationship Matrix
            </button>
         </div>
      </div>

      <Card className="bg-[#030303] border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 hover:border-studio/50">
        <div className="absolute inset-0 border-[1px] border-studio/20 rounded-[2.5rem] pointer-events-none group-hover/card:border-studio/40 transition-colors duration-700" />
        <div className="absolute -top-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-studio/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-[1400px] mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {activeTab === 'relationships' ? (
                <RelationshipLab />
              ) : isGeneratingCharacters ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-studio">
                  <div className="w-10 h-10 border-2 border-studio/30 border-t-studio rounded-full animate-spin mb-6 shadow-studio" />
                  <p className="font-sans font-medium tracking-widest text-xs uppercase text-shadow-studio">Sketching character souls...</p>
                </div>
              ) : generatedCharacters ? (
                <CastView 
                  isLiked={isLiked}
                  setIsLiked={setIsLiked}
                />
              ) : (
                <CastEmptyState 
                  onLaunch={handleGenerate}
                  isGenerating={isGeneratingCharacters}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
