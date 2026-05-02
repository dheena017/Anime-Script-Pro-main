import React, { useEffect, useState } from 'react';
import { Sparkles, Fingerprint, Star, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/hooks/useGenerator';
import { CastContext } from './CastLayout';
import { generateCharacters } from '@/services/api/gemini';

export function CharacterCreationPage() {
  const {
    showNotification,
    prompt,
    selectedModel,
    setCastList,
    setCastData,
    contentType,
    generatedWorld
  } = useGenerator();
  const { setHandlers } = React.useContext(CastContext);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCharacter = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to manifest character souls.', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateCharacters(prompt, selectedModel, contentType, generatedWorld || undefined);
      if (typeof result === 'object' && result !== null) {
        setCastData(result);
        if ('characters' in result) setCastList(result.characters);
      }
      showNotification?.('Neural Synthesis Complete: Character Prototypes Generated', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Synthesis Failure: ' + (error.message || 'Unknown Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Initialize handlers
  useEffect(() => {
    if (!setHandlers) return;
    setHandlers({
      handleGenerateCharacter,
      isGenerating
    });
  }, [setHandlers, isGenerating, prompt]);

  return (
    <div className="space-y-12 pb-20">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[
          { icon: Star, title: "Shonen Lead", desc: "High determination, latent power, strong moral compass." },
          { icon: Zap, title: "Anti-Hero", desc: "Dark past, pragmatic methods, complex moral gray areas." },
          { icon: Fingerprint, title: "Mystic Prodigy", desc: "Genius intellect, detached personality, hidden lineage." }
        ].map((archetype, idx) => (
          <Card key={idx} className="bg-[#030303] border-studio/20 p-8 rounded-[2rem] hover:border-studio/50 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <archetype.icon className="w-12 h-12 text-studio/40 mb-6 group-hover:text-studio group-hover:scale-110 transition-all duration-500" />
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-3">{archetype.title}</h3>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-8">{archetype.desc}</p>
            <Button className="w-full h-12 bg-studio/10 hover:bg-studio text-studio hover:text-black border border-studio/20 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all">
              Initialize Prototype
            </Button>
          </Card>
        ))}
      </div>

      <Card className="bg-[#050505]/50 border border-studio/10 p-12 rounded-[3rem] text-center space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-studio/5 opacity-20 blur-3xl animate-pulse" />
        <div className="relative z-10">
          <Sparkles className="w-16 h-16 text-studio mx-auto mb-6 opacity-40" />
          <h2 className="text-3xl font-black text-white uppercase tracking-widest">Advanced DNA Sculpting</h2>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto font-medium italic">
            "Use the neural sliders to fine-tune character traits, motivations, and aesthetic parameters for a truly unique lead."
          </p>
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-2xl h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="w-[40%] h-full bg-studio shadow-[0_0_10px_#06b6d4]" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}



