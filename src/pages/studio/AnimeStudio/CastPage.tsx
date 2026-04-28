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

      <div className="flex justify-center mb-6 relative z-10">
         <div className="flex p-1.5 bg-[#0a0a0a]/90 border border-zinc-800/80 rounded-2xl backdrop-blur-xl shadow-2xl relative">
            <button 
              onClick={() => setSearchParams({})}
              className={cn(
                "relative px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                activeTab === 'profiles' ? "text-studio" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {activeTab === 'profiles' && (
                <motion.div 
                  layoutId="cast-tab-indicator"
                  className="absolute inset-0 bg-studio/10 border border-studio/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Character Profiles
              </span>
            </button>
            <button 
              onClick={() => setSearchParams({ tab: 'relationships' })}
              className={cn(
                "relative px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                activeTab === 'relationships' ? "text-fuchsia-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {activeTab === 'relationships' && (
                <motion.div 
                  layoutId="cast-tab-indicator"
                  className="absolute inset-0 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                Relationship Matrix
              </span>
            </button>
         </div>
      </div>

      <Card className={cn(
        "bg-[#030303] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700",
        activeTab === 'profiles' 
          ? "border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] hover:border-studio/50" 
          : "border-fuchsia-500/30 shadow-[0_0_40px_rgba(217,70,239,0.1)] hover:border-fuchsia-500/50"
      )}>
        <div className={cn(
          "absolute inset-0 border-[1px] rounded-[2.5rem] pointer-events-none transition-colors duration-700",
          activeTab === 'profiles' ? "border-studio/20 group-hover/card:border-studio/40" : "border-fuchsia-500/20 group-hover/card:border-fuchsia-500/40"
        )} />
        <div className={cn(
          "absolute -top-[1px] left-10 right-10 h-[1px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700",
          activeTab === 'profiles' ? "bg-gradient-to-r from-transparent via-studio/60 to-transparent" : "bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent"
        )} />
        
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
