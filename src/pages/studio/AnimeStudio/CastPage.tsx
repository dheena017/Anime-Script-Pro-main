import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { generateCharacters } from '@/services/api/gemini';
import { cn } from '@/lib/utils';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { CastEmptyState } from './components/Cast/CastEmptyState';
import { CastTab } from './components/Cast/Tabs/CastTabs';
import { Dna, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Modularized Tab Components
import { RegistryTab } from './components/Cast/Tabs/RegistryTab';
import { IntegrityTab } from './components/Cast/Tabs/IntegrityTab';
import { AddLeadTab } from './components/Cast/Tabs/AddLeadTab';
import { DNATab } from './components/Cast/Tabs/DNATab';
import { DynamicsTab } from './components/Cast/Tabs/DynamicsTab';
import CharactersPage from './Cast/Characters/CharactersPage';
import RelationshipsPage from './Cast/Relationships/RelationshipsPage';

export default function CastPage() {
  const navigate = useNavigate();
  const { activeTab } = useOutletContext<{ activeTab: CastTab }>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { 
    generatedCharacters, 
    isLiked, setIsLiked,
    setGeneratedCharacters, 
    isGeneratingCharacters, 
    setIsGeneratingCharacters,
    setCastData, setCastList,
    setCharacterRelationships,
    prompt,
    selectedModel,
    contentType,
    generatedWorld,
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

  const renderTabContent = () => {
    if (isGeneratingCharacters) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] space-y-8">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-studio/20 border-t-studio rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
            <Dna className="absolute inset-0 m-auto w-6 h-6 text-studio animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-black tracking-[0.3em] text-[10px] uppercase text-studio animate-pulse">Sequencing Neural Archetypes...</p>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Architecting character souls</p>
          </div>
        </div>
      );
    }

    if (!generatedCharacters && activeTab !== 'add-lead') {
      return (
        <CastEmptyState 
          onLaunch={handleGenerate}
          isGenerating={isGeneratingCharacters}
        />
      );
    }

    switch (activeTab) {
      case 'matrix':
        return <RelationshipsPage />;
      case 'registry':
        return (
          <RegistryTab 
            isLiked={isLiked} 
            setIsLiked={setIsLiked} 
            viewMode={viewMode}
            onViewCharacter={(charName) => {
              navigate(`/${contentType.toLowerCase()}/cast/characters/${charName}`);
            }}
          />
        );
      case 'characters':
        return <CharactersPage />;
      case 'integrity':
        return <IntegrityTab />;
      case 'add-lead':
        return <AddLeadTab />;
      case 'dna':
        return <DNATab />;
      case 'dynamics':
        return <DynamicsTab />;
      default:
        return (
          <RegistryTab 
            isLiked={isLiked} 
            setIsLiked={setIsLiked} 
            onViewCharacter={(charName) => {
              navigate(`/${contentType.toLowerCase()}/cast/characters/${charName}`);
            }}
          />
        );
    }
  };


  return (
    <div data-testid="marker-character-cast">
      <Card className={cn(
        "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700",
        activeTab === 'registry' 
          ? "border-studio/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:border-studio/50" 
          : "border-zinc-800/30 hover:border-zinc-700"
      )}>
        <div className={cn(
          "absolute inset-0 border-[1px] rounded-3xl pointer-events-none transition-colors duration-700",
          activeTab === 'registry' ? "border-studio/20 group-hover/card:border-studio/40" : "border-white/5"
        )} />
        
        <div className="w-full p-8 lg:p-10 max-w-[1400px] mx-auto">
          {activeTab === 'registry' && (
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode('grid')}
                  className={cn("w-9 h-9 rounded-lg transition-all", viewMode === 'grid' ? "bg-studio text-black hover:bg-studio" : "text-zinc-500 hover:text-white")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode('list')}
                  className={cn("w-9 h-9 rounded-lg transition-all", viewMode === 'list' ? "bg-studio text-black hover:bg-studio" : "text-zinc-500 hover:text-white")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
}





