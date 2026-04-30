import React from 'react';

import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { continueScript, generateScript, generateMetadata, generateImagePrompts } from '@/services/geminiService';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api-utils';

// Sub-components
import { ScriptView } from '../components/Script/ScriptView';
import { ScriptEmptyState } from '../components/Script/ScriptEmptyState';
import { ScriptContext } from './Script/ScriptLayout';

export function ScriptPage() {
  const { user } = useAuth();
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
    generatedWorld, generatedCharacters, characterRelationships,
    generatedSeriesPlan,
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
    const maxEpisodes = generatedSeriesPlan ? generatedSeriesPlan.length : 12;
    if (nextEp > maxEpisodes) {
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
      const currentEpisodePlan = generatedSeriesPlan?.find(ep => parseInt(ep.episode) === nextEp);
      const targetSceneCount = currentEpisodePlan?.asset_matrix?.scene_count?.toString() || numScenes;
      const script = await generateScript(prompt, tone, audience, nextSess.toString(), nextEp.toString(), targetSceneCount, selectedModel, contentType, recapperPersona, characterRelationships, generatedWorld, generatedCharacters, currentEpisodePlan ? JSON.stringify(currentEpisodePlan) : null);
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

  const handlePrevEpisode = async () => {
    let prevEp = parseInt(episode) - 1;
    let prevSess = parseInt(session);
    if (prevEp < 1) {
      if (prevSess > 1) {
        prevSess -= 1;
        const maxEpisodes = generatedSeriesPlan ? generatedSeriesPlan.length : 12;
        prevEp = maxEpisodes;
      } else {
        showNotification?.('Already at the first episode.', 'info');
        return;
      }
    }

    setEpisode(prevEp.toString());
    setSession(prevSess.toString());
    setGeneratedScript(null);
    setCurrentScriptId(null);
    setVisualData({});
    setIsLoading(true);
    
    try {
      if (user) {
        const scripts = await apiRequest<any[]>("/api/scripts");
        const foundScript = scripts.find(s => s.title === `EPISODE_${prevEp}`);
        if (foundScript) {
          setGeneratedScript(foundScript.content);
          setCurrentScriptId(foundScript.id);
          showNotification?.(`Loaded Episode ${prevEp} from Archives`, 'success');
          setIsLoading(false);
          return;
        }
      }
      
      // If not found in DB or no user, generate it using the series plan
      const currentEpisodePlan = generatedSeriesPlan?.find(ep => parseInt(ep.episode) === prevEp);
      const targetSceneCount = currentEpisodePlan?.asset_matrix?.scene_count?.toString() || numScenes;
      const script = await generateScript(prompt, tone, audience, prevSess.toString(), prevEp.toString(), targetSceneCount, selectedModel, contentType, recapperPersona, characterRelationships, generatedWorld, generatedCharacters, currentEpisodePlan ? JSON.stringify(currentEpisodePlan) : null);
      setGeneratedScript(script);
      if (user) {
        await apiRequest("/api/scripts", {
          method: 'POST',
          body: JSON.stringify({ 
            user_id: user.id, 
            title: `EPISODE_${prevEp}`,
            content: script,
            metadata: { prompt, tone, audience, episode: prevEp.toString(), session: prevSess.toString(), contentType, model: selectedModel }
          })
        });
      }
      showNotification?.(`Episode ${prevEp} Synchronized`, 'success');
    } catch (error: any) {
      console.error("Failed to load prev episode:", error);
      showNotification?.('Failed to load previous episode.', 'error');
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
      const currentEpisodePlan = generatedSeriesPlan?.find(ep => parseInt(ep.episode) === parseInt(episode));
      const targetSceneCount = currentEpisodePlan?.asset_matrix?.scene_count?.toString() || numScenes;
      const script = await generateScript(prompt, tone, audience, session, episode, targetSceneCount, selectedModel, contentType, recapperPersona, characterRelationships, generatedWorld, generatedCharacters, currentEpisodePlan ? JSON.stringify(currentEpisodePlan) : null);
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
      showNotification?.('Navigating to Storyboard Generator...', 'success');
      window.location.href = '/studio/storyboard';
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

  const { setHandlers } = React.useContext<any>(ScriptContext);

  React.useEffect(() => {
    setHandlers({
      exportToPDF,
      handleGenerateSEO,
      handleGeneratePrompts,
      handleGenerateVisuals,
      handleContinueScript,
      handleNextEpisode,
      handlePrevEpisode,
      playVoiceover: () => playVoiceover(generatedScript)
    });
  }, [generatedScript, visualData, episode, session]);

  return (
    <div data-testid="marker-production-script">

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
                generatedScript.startsWith("Error:") ? (
                  <div className="text-red-500 font-bold text-center py-8 text-lg">
                    {generatedScript}
                  </div>
                ) : (
                  <ScriptView
                    generatedScript={generatedScript}
                    prompt={prompt}
                    session={session}
                    episode={episode}
                    audience={audience}
                    visualData={visualData} />
                )
              ) : (
                <ScriptEmptyState
                  onLaunch={handleGenerateScript}
                  isGenerating={isLoading} />
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

