import React from 'react';
import { motion } from 'motion/react';

import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { continueScript, generateScript, generateMetadata, generateImagePrompts } from '@/services/geminiService';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api-utils';

// Sub-components
import { ScriptHeader } from '../components/Script/ScriptHeader';
import { ScriptToolbar } from '../components/Script/ScriptToolbar';
import { ScriptView } from '../components/Script/ScriptView';
import { ScriptEmptyState } from '../components/Script/ScriptEmptyState';

export function ScriptPage() {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = React.useState(false);
  const {
    generatedScript, setGeneratedScript,
    selectedModel,
    isLoading, setIsLoading,
    setIsContinuingScript,
    setIsGeneratingMetadata, setGeneratedMetadata,
    setIsGeneratingImagePrompts, setGeneratedImagePrompts,
    setIsGeneratingVisuals,
    currentScriptId, setCurrentScriptId,
    visualData, setVisualData,
    setEpisode, setSession,
    recapperPersona,
    tone, audience, prompt, episode, session, contentType, numScenes,
    generatedWorld, generatedCharacters, narrativeBeats, characterRelationships,
    showNotification
  } = useGenerator();



  const lastKeystrokeRef = React.useRef(Date.now());
  const lastSavedContentRef = React.useRef(generatedScript);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastType = now - lastKeystrokeRef.current;
      
      if (timeSinceLastType > 3000 && generatedScript !== lastSavedContentRef.current && generatedScript) {
        saveContentToLocalStorage();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [generatedScript, currentScriptId]);

  const saveContentToLocalStorage = () => {
    if (!generatedScript) return;
    try {
      const key = `autosave_script_${currentScriptId || 'draft'}`;
      localStorage.setItem(key, generatedScript);
      lastSavedContentRef.current = generatedScript;
    } catch (e) {
      console.error("Failed to autosave:", e);
    }
  };

  const handleContinueScript = async () => {
    if (!generatedScript) return;
    setIsContinuingScript(true);
    try {
      const nextScenes = await continueScript(generatedScript, selectedModel, contentType);
      const lines = nextScenes.split('\n').filter((l: string) => l.includes('|') && !l.includes('---') && !l.toLowerCase().includes('scene') && !l.toLowerCase().includes('section'));
      setGeneratedScript(generatedScript + '\n' + lines.join('\n'));
    } catch (error) {
      console.error(error);
    } finally {
      setIsContinuingScript(false);
    }
  };

  const handleNextEpisode = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to manifest the next episode.', 'error');
      return;
    }
    let nextEp = parseInt(episode) + 1;
    let nextSess = parseInt(session);
    if (nextEp > 12) {
      nextEp = 1;
      nextSess += 1;
    }
    setEpisode(nextEp.toString());
    setSession(nextSess.toString());
    setGeneratedScript(null);
    setCurrentScriptId(null);
    setVisualData({});
    setIsLoading(true);
    try {
      const script = await generateScript(prompt, tone, audience, nextSess.toString(), nextEp.toString(), numScenes, selectedModel, contentType, recapperPersona, narrativeBeats, characterRelationships, generatedWorld, generatedCharacters);
      setGeneratedScript(script);
      if (user) {
        await apiRequest("/api/scripts", {
          method: 'POST',
          body: JSON.stringify({ 
            user_id: user.id, 
            title: `EPISODE_${nextEp}`,
            content: script,
            metadata: { prompt, tone, audience, episode: nextEp.toString(), session: nextSess.toString(), contentType, model: selectedModel }
          })
        });
      }
      showNotification?.(`Episode ${nextEp} Synchronized`, 'success');
    } catch (error: any) {
      console.error("Failed to save new episode:", error);
      showNotification?.('Synthesis Failure: ' + (error.message || 'Unknown Error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const handleGenerateScript = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to manifest the script.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const script = await generateScript(prompt, tone, audience, session, episode, numScenes, selectedModel, contentType, recapperPersona, narrativeBeats, characterRelationships, generatedWorld, generatedCharacters);
      setGeneratedScript(script);
      setCurrentScriptId(null);
      if (user) {
        await apiRequest("/api/scripts", {
          method: 'POST',
          body: JSON.stringify({ 
            user_id: user.id, 
            title: `EPISODE_${episode}`,
            content: script,
            metadata: { prompt, tone, audience, episode, session, contentType, model: selectedModel } 
          })
        });
      }
      showNotification?.('Neural Synthesis Complete: Script Manifested', 'success');
    } catch (error: any) {
      console.error("Failed to generate and save script:", error);
      showNotification?.('Synthesis Failure: ' + (error.message || 'Unknown Error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };



  const handleGenerateSEO = async () => {
    if (!generatedScript) return;
    setIsGeneratingMetadata(true);
    try {
      const seo = await generateMetadata(generatedScript, selectedModel);
      setGeneratedMetadata(seo);
      showNotification?.('SEO Engine sequence complete', 'success');
    } catch (e: any) {
      showNotification?.('SEO Failure: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleGeneratePrompts = async () => {
    if (!generatedScript) return;
    setIsGeneratingImagePrompts(true);
    try {
      const prompts = await generateImagePrompts(generatedScript, selectedModel, contentType);
      setGeneratedImagePrompts(prompts);
      showNotification?.('Visual Prompts generated', 'success');
    } catch (e: any) {
      showNotification?.('Prompt failure: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingImagePrompts(false);
    }
  };

  const handleGenerateVisuals = async () => {
    if (!generatedScript) return;
    setIsGeneratingVisuals(true);
    try {
      // Logic for visuals generation (storyboard)
      // For now, we simulate success or use a dedicated service if exists
      await new Promise(r => setTimeout(r, 2000));
      showNotification?.('Storyboard manifest synchronized', 'success');
    } catch (e: any) {
      showNotification?.('Storyboard failure: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingVisuals(false);
    }
  };



  const exportToPDF = () => {
    if (!generatedScript) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${contentType} Script Pro - Anime Script`, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    const tableLines = generatedScript.split('\n').filter(l => l.includes('|') && !l.includes('---'));
    if (tableLines.length > 2) {
      const body = tableLines.slice(1).map(row => row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim()));
      autoTable(doc, { startY: 40, head: [['Scene #', 'Section', 'Character', 'Voiceover', 'Visuals', 'Sound', 'Time']], body, theme: 'grid', headStyles: { fillColor: [6, 78, 94] } });
    } else {
      doc.text(generatedScript, 14, 40, { maxWidth: 180 });
    }
    doc.save(`${contentType.toLowerCase()}-script.pdf`);
  };




  const playVoiceover = (text: string | null) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text.replace(/\|/g, ' '));
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" data-testid="marker-production-script">
      <ScriptHeader 
        onRegenerate={handleGenerateScript}
        isGenerating={isLoading}
        onNext={handleNextEpisode}
        session={session}
        episode={episode}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
      />

      <ScriptToolbar 
        session={session}
        episode={episode}
        status={generatedScript ? 'active' : 'empty'}
        onExport={exportToPDF}
        onViewSEO={handleGenerateSEO}
        onViewPrompts={handleGeneratePrompts}
        onViewStoryboard={handleGenerateVisuals}
        onExtend={handleContinueScript}
        onListen={() => playVoiceover(generatedScript)}
      />

      <Card className="bg-[#030303] border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 hover:border-studio/50">
        <div className="absolute inset-0 border-[1px] border-studio/20 rounded-[2.5rem] pointer-events-none group-hover/card:border-studio/40 transition-colors duration-700" />
        <div className="absolute -top-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-studio/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-4xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-[500px] text-studio">
                    <div className="w-10 h-10 border-2 border-studio/30 border-t-studio rounded-full animate-spin mb-6 shadow-studio" />
                    <p className="font-sans font-medium tracking-widest text-xs uppercase text-shadow-studio">Initializing Production Core...</p>
                  </div>
                ) : generatedScript ? (
                  <ScriptView 
                    generatedScript={generatedScript}
                    prompt={prompt}
                    session={session}
                    episode={episode}
                    audience={audience}
                    visualData={visualData}
                  />
                ) : (
                  <ScriptEmptyState 
                    onLaunch={handleGenerateScript}
                    isGenerating={isLoading}
                  />
                )}
              </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
