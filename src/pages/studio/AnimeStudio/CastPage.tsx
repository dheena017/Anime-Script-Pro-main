import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { generateCharacters } from '@/services/geminiService';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';
import { CastView } from '../components/Cast/CastView';
import { CastEmptyState } from '../components/Cast/CastEmptyState';
import { RelationshipLab } from '../components/Cast/RelationshipLab';

export function CastPage() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'relationships' ? 'relationships' : 'profiles';
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


  return (
    <div data-testid="marker-character-cast">


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
    </div>
  );
}
