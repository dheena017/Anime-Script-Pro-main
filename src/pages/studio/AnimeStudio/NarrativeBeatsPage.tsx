import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { generateNarrativeBeats, refineSingleBeat } from '@/services/geminiService';
import { BeatsHeader } from '../components/Beats/BeatsHeader';
import { BeatsEmptyState } from '../components/Beats/BeatsEmptyState';
import { MastermindCore } from '../components/Beats/MastermindCore';
import { TensionMap } from '../components/Beats/TensionMap';
import { BeatsArchitectureList } from '../components/Beats/BeatsArchitectureList';
import { BeatsToolbar } from '../components/Beats/BeatsToolbar';

export function NarrativeBeatsPage() {
  const { 
    setNarrativeBeats, 
    prompt, selectedModel, contentType, 
    setGeneratedScript,
    session,
    episode,
    generatedWorld,
    generatedCharacters,
    showNotification
  } = useGenerator();
  
  const navigate = useNavigate();
  const [selectedBeatKey, setSelectedBeatKey] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [aiBeats, setAiBeats] = React.useState<any[] | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'timeline' | 'mastermind'>('mastermind');
  const [activeBeatIndex, setActiveBeatIndex] = React.useState<number | null>(null);

  const currentBeats = selectedBeatKey === 'AI_GENERATED' ? aiBeats : null;

  const [refinementPrompt, setRefinementPrompt] = React.useState('');
  const [isRefining, setIsRefining] = React.useState<number | null>(null);

  const handleRefineSingleBeat = async (index: number) => {
    if (!aiBeats || !refinementPrompt.trim()) return;
    setIsRefining(index);
    try {
      const refined = await refineSingleBeat(aiBeats[index], refinementPrompt, prompt, selectedModel, contentType);
      if (refined) {
        const newBeats = [...aiBeats];
        newBeats[index] = refined;
        setAiBeats(newBeats);
        setRefinementPrompt('');
        showNotification?.('Beat Refined Successfully', 'success');
      }
    } catch (e: any) {
      showNotification?.('Refinement Failed: ' + (e.message || 'Unknown Error'), 'error');
    } finally {
      setIsRefining(null);
    }
  };

  const handleUpdateBeat = (index: number, updates: any) => {
    if (!aiBeats) return;
    const newBeats = [...aiBeats];
    newBeats[index] = { ...newBeats[index], ...updates };
    setAiBeats(newBeats);
  };

  const handleApplyBeat = (beats: any[]) => {
    const formatted = beats.map((b, i: number) => `${i + 1}. ${b.label} (${b.duration}): ${b.description}`).join('\n');
    setNarrativeBeats(formatted);
    showNotification?.('Beats applied to production buffer', 'success');
  };

  const handleGenerateAIBeats = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to blueprint the narrative.', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const beats = await generateNarrativeBeats(prompt, selectedModel, contentType, generatedWorld, generatedCharacters);
      if (beats) {
        setAiBeats(beats);
        setSelectedBeatKey('AI_GENERATED');
        showNotification?.('Neural Synthesis Complete: Narrative Architecture Synced', 'success');
      }
    } catch (e: any) {
      console.error(e);
      showNotification?.('Synthesis Failure: ' + (e.message || 'Unknown Error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };


  const isContextLocked = !!(generatedWorld && generatedCharacters);

  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" data-testid="marker-narrative-beats">
      <BeatsHeader 
        session={session}
        episode={episode}
        isContextLocked={isContextLocked}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onGenerate={handleGenerateAIBeats}
        isGenerating={isGenerating}
        canGenerate={!!prompt.trim()}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
      />

      <BeatsToolbar 
        session={session}
        episode={episode}
        status={aiBeats ? 'active' : 'empty'}
      />

      <Card className="bg-[#030303] border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 hover:border-studio/50">
        <div className="absolute inset-0 border-[1px] border-studio/20 rounded-[2.5rem] pointer-events-none group-hover/card:border-studio/40 transition-colors duration-700" />
        <div className="absolute -top-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-studio/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-[1400px] mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {!aiBeats && !isGenerating ? (
                <BeatsEmptyState 
                  onGenerate={handleGenerateAIBeats}
                  isGenerating={isGenerating}
                  canGenerate={!!prompt.trim()}
                />
              ) : (
                <div className="space-y-12">
                  {viewMode === 'mastermind' && (
                    <MastermindCore 
                      aiBeats={aiBeats}
                      isGenerating={isGenerating}
                      onGenerate={handleGenerateAIBeats}
                    />
                  )}

                  {viewMode === 'timeline' && currentBeats && (
                    <TensionMap 
                      currentBeats={currentBeats}
                      activeBeatIndex={activeBeatIndex}
                      setActiveBeatIndex={setActiveBeatIndex}
                    />
                  )}

                  <AnimatePresence mode="wait">
                    {selectedBeatKey && currentBeats && (
                      <motion.div
                        key={selectedBeatKey}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-8"
                      >
                        <BeatsArchitectureList 
                          currentBeats={currentBeats}
                          activeBeatIndex={activeBeatIndex}
                          setActiveBeatIndex={setActiveBeatIndex}
                          onReset={() => setSelectedBeatKey(null)}
                          onApplySchema={() => handleApplyBeat(currentBeats)}
                          onGenerateScene={() => {
                            setGeneratedScript(null);
                            navigate('/studio/script');
                          }}
                          onDeleteBeat={(idx) => {
                            const updatedBeats = currentBeats.filter((_: any, i: number) => i !== idx);
                            setNarrativeBeats(JSON.stringify(updatedBeats));
                            if (activeBeatIndex === idx) setActiveBeatIndex(null);
                          }}
                          isRefining={isRefining}
                          refinementPrompt={refinementPrompt}
                          setRefinementPrompt={setRefinementPrompt}
                          onApplyRefinement={handleRefineSingleBeat}
                          onUpdateBeat={handleUpdateBeat}
                          onNavigateToScript={() => {
                            setGeneratedScript(null);
                            navigate('/studio/script');
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
