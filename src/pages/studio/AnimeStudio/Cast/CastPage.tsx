import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { useCastState, useCastDispatch, useEngineState } from '@/contexts/generator';
import { generateCharacters } from '@/services/api/gemini';
import { MOCK_STORY_BIBLE } from '@/services/generators/mockData';
import { cn } from '@/lib/utils';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { CastEmptyState } from './components/CastEmptyState';
import { CastTab } from './Tabs/CastTabs';
import { Dna, Layout as LayoutGrid, List, Sparkles, Globe2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CastHeader } from './components/CastHeader';
import { CastToolbar } from './components/CastToolbar';

// Modularized Tab Components
import { RegistryTab } from './Tabs/RegistryTab';
import { IntegrityTab } from './Tabs/IntegrityTab';
import { AddLeadTab } from './Tabs/AddLeadTab';
import { DNATab } from './Tabs/DNATab';
import { DynamicsTab } from './Tabs/DynamicsTab';
import CharactersPage from './Characters/CharactersPage';
import RelationshipsPage from './Tabs/Relationships/RelationshipsPage';

export default function CastPage() {
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useOutletContext<{ activeTab: CastTab, setActiveTab: (tab: CastTab) => void }>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const {
    isLiked, setIsLiked,
    prompt,
    generatedWorld,
    episode,
    session,
    isLoading,
    showNotification
  } = useGenerator();

  const { generatedCharacters, isGeneratingCharacters } = useCastState();
  const {
    setGeneratedCharacters,
    setIsGeneratingCharacters,
    setCastData, setCastList,
    setCharacterRelationships
  } = useCastDispatch();

  const { selectedModel, contentType } = useEngineState();

  const handleNext = () => navigate('/anime/series');
  const handlePrev = () => navigate('/anime/world');

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
          setGeneratedCharacters?.(JSON.stringify(result, null, 2));
        }
        if ('markdown' in result) {
          setGeneratedCharacters?.(result.markdown as string);
        }
        if (result.relationships) {
          setCharacterRelationships(JSON.stringify(result.relationships));
        }
      } else {
        setGeneratedCharacters?.(result as string);
      }
      showNotification?.('Characters created successfully!', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('Failed to create characters: ' + (e.message || 'Unknown error'), 'error');
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
    <div data-testid="marker-character-cast" className="space-y-8">
      <CastHeader
        onRegenerate={handleGenerate}
        isGenerating={isGeneratingCharacters || isLoading}
        onNext={handleNext}
        onPrev={handlePrev}
        session={session}
        episode={episode}
        hasContent={!!generatedCharacters}
      />

      <CastToolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        status={generatedCharacters ? 'active' : 'empty'}
      />

      <div className="grid gap-4 rounded-[2rem] border border-studio/20 bg-studio/5 p-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-studio">
            <Sparkles className="w-4 h-4" />
            Shared story bible
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
            {MOCK_STORY_BIBLE.title}
          </h2>
          <p className="max-w-3xl text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            {MOCK_STORY_BIBLE.logline}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-center">
            <Globe2 className="mx-auto mb-2 h-4 w-4 text-studio" />
            {MOCK_STORY_BIBLE.worldName}
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-center">
            <ShieldCheck className="mx-auto mb-2 h-4 w-4 text-emerald-400" />
            {MOCK_STORY_BIBLE.powerSystem}
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-center">
            <Dna className="mx-auto mb-2 h-4 w-4 text-fuchsia-400" />
            {MOCK_STORY_BIBLE.theme}
          </div>
        </div>
      </div>

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






