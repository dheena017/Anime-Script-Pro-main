import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { generateCharacters } from '@/services/geminiService';
import { cn } from '@/lib/utils';
import { useOutletContext } from 'react-router-dom';
import { CastEmptyState } from '../components/Cast/CastEmptyState';
import { CastTab } from '../components/Cast/Tabs/CastTabs';
import { Dna } from 'lucide-react';

// Modularized Tab Components
import { MatrixTab } from '../components/Cast/Tabs/MatrixTab';
import { RegistryTab } from '../components/Cast/Tabs/RegistryTab';
import { IntegrityTab } from '../components/Cast/Tabs/IntegrityTab';
import { AddLeadTab } from '../components/Cast/Tabs/AddLeadTab';
import { DNATab } from '../components/Cast/Tabs/DNATab';
import { DynamicsTab } from '../components/Cast/Tabs/DynamicsTab';

export function CastPage() {
  const { activeTab } = useOutletContext<{ activeTab: CastTab }>();
  const { 
    generatedCharacters, 
    isLiked, setIsLiked,
    setGeneratedCharacters, 
    isGeneratingCharacters, 
    setIsGeneratingCharacters,
    setCharacterRelationships,
    setCastData, setCastList,
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
        <div className="flex flex-col items-center justify-center h-[500px] text-studio">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-studio/20 border-t-studio rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
            <Dna className="absolute inset-0 m-auto w-6 h-6 text-studio animate-pulse" />
          </div>
          <p className="font-black tracking-[0.3em] text-[10px] uppercase text-studio animate-pulse">Sequencing Neural Archetypes...</p>
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
        return <MatrixTab />;
      case 'registry':
        return <RegistryTab isLiked={isLiked} setIsLiked={setIsLiked} />;
      case 'integrity':
        return <IntegrityTab />;
      case 'add-lead':
        return <AddLeadTab />;
      case 'dna':
        return <DNATab />;
      case 'dynamics':
        return <DynamicsTab />;
      default:
        return <RegistryTab isLiked={isLiked} setIsLiked={setIsLiked} />;
    }
  };


  return (
    <div data-testid="marker-character-cast">
      <Card className={cn(
        "bg-[#030303] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700",
        activeTab === 'registry' 
          ? "border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] hover:border-studio/50" 
          : "border-zinc-800/30 hover:border-zinc-700"
      )}>
        <div className={cn(
          "absolute inset-0 border-[1px] rounded-[2.5rem] pointer-events-none transition-colors duration-700",
          activeTab === 'registry' ? "border-studio/20 group-hover/card:border-studio/40" : "border-white/5"
        )} />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-[1400px] mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


