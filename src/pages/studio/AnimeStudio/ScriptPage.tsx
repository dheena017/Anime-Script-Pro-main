import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateMetadata, generateImagePrompts, continueScript, generateScript } from '@/services/geminiService';
import { enhanceSceneVisuals, generateSceneImage } from '@/services/generators/image';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api-utils';
import { useNavigate } from 'react-router-dom';

// Sub-components
import { ScriptToolbar } from '../components/Script/ScriptToolbar';
import { ScriptHeaderInfo } from '../components/Script/ScriptHeaderInfo';
import { ScriptView } from '../components/Script/ScriptView';
import { ScriptEmptyState } from '../components/Script/ScriptEmptyState';

export function ScriptPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = React.useState(false);
  const {
    generatedScript, setGeneratedScript,
    setGeneratedMetadata,
    setGeneratedImagePrompts,
    selectedModel,
    isLoading, setIsLoading,
    isGeneratingMetadata, setIsGeneratingMetadata,
    isGeneratingImagePrompts, setIsGeneratingImagePrompts,
    isEditing, setIsEditing,
    isSaving, setIsSaving,
    isContinuingScript, setIsContinuingScript,
    isGeneratingVisuals, setIsGeneratingVisuals,
    currentScriptId, setCurrentScriptId,
    visualData, setVisualData,
    setEpisode, setSession,
    tone, audience, prompt, episode, session, contentType, numScenes,
    generatedWorld, generatedCharacters, narrativeBeats, characterRelationships
  } = useGenerator();

  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const lastKeystrokeRef = React.useRef(Date.now());
  const lastSavedContentRef = React.useRef(generatedScript);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastType = now - lastKeystrokeRef.current;
      
      // Only save if user hasn't typed for 3 seconds and content has changed
      if (timeSinceLastType > 3000 && generatedScript !== lastSavedContentRef.current && generatedScript) {
        saveContentToLocalStorage();
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [generatedScript, currentScriptId]);

  const saveContentToLocalStorage = () => {
    if (!generatedScript) return;
    setSaveStatus('saving');
    try {
      const key = `autosave_script_${currentScriptId || 'draft'}`;
      localStorage.setItem(key, generatedScript);
      lastSavedContentRef.current = generatedScript;
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) {
      console.error("Failed to autosave:", e);
      setSaveStatus('idle');
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
    // 1. Calculate next episode/session
    let nextEp = parseInt(episode) + 1;
    let nextSess = parseInt(session);
    
    // Assume 12 episodes per session as a standard threshold for rollover
    if (nextEp > 12) {
      nextEp = 1;
      nextSess += 1;
    }

    // 2. Update state
    setEpisode(nextEp.toString());
    setSession(nextSess.toString());
    setGeneratedScript(null);
    setCurrentScriptId(null);
    setVisualData({});

    // 3. Trigger generation for the new unit
    setIsLoading(true);
    try {
      const script = await generateScript(
        prompt, tone, audience, 
        nextSess.toString(), nextEp.toString(), 
        numScenes, selectedModel, contentType, 
        'Dynamic/Hype', narrativeBeats, 
        characterRelationships, generatedWorld, generatedCharacters
      );
      setGeneratedScript(script);
      if (user) {
        await apiRequest("/api/scripts", {
          method: 'POST',
          body: JSON.stringify({ 
            user_id: user.id, 
            title: `EPISODE_${nextEp}`,
            content: script,
            metadata: {
              prompt, tone, audience, 
              episode: nextEp.toString(), 
              session: nextSess.toString(), 
              contentType, model: selectedModel
            }
          })
        });
      }
    } catch (error) {
      console.error("Failed to save new episode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const script = await generateScript(prompt, tone, audience, session, episode, numScenes, selectedModel, contentType, 'Dynamic/Hype', narrativeBeats, characterRelationships, generatedWorld, generatedCharacters);
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
    } catch (error) {
      console.error("Failed to generate and save script:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVisuals = async () => {
    if (!generatedScript) return;
    setIsGeneratingVisuals(true);
    try {
      const tableLines = generatedScript.split('\n').filter(l => l.includes('|') && !l.includes('---'));
      if (tableLines.length <= 1) {
        setVisualData({ 0: await generateSceneImage(prompt) || '' });
        return;
      }

      const rows = tableLines.slice(1).map(row => row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim()));
      const newVisualData: Record<number, string> = {};

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const sceneNum = parseInt(row[0]) || (i + 1);
        const narration = row[3] || "";
        const visualDescription = row[4] || "";
        
        // 1. Enhance
        const enhancedPrompt = await enhanceSceneVisuals(visualDescription, narration, selectedModel);
        // 2. Generate
        const imageUrl = await generateSceneImage(enhancedPrompt);
        if (imageUrl) {
          newVisualData[sceneNum] = imageUrl;
        }
      }
      setVisualData(newVisualData);
    } catch (error) {
      console.error("Error generating visuals:", error);
    } finally {
      setIsGeneratingVisuals(false);
    }
  };

  const calculateDuration = (text: string | null) => {
    if (!text) return "0:00";
    const words = text.split(/\s+/).length;
    const minutes = Math.floor(words / 150);
    const seconds = Math.floor((words % 150) / (150 / 60));
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const exportToPDF = () => {
    if (!generatedScript) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${contentType} Script Pro - Production Script`, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    const tableLines = generatedScript.split('\n').filter(l => l.includes('|') && !l.includes('---'));
    if (tableLines.length > 2) {
      const body = tableLines.slice(1).map(row => row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim()));
      autoTable(doc, { 
        startY: 40, 
        head: [['Scene #', 'Section', 'Character', 'Voiceover', 'Visuals', 'Sound', 'Time']], 
        body, 
        theme: 'grid', 
        headStyles: { fillColor: [6, 78, 94] } 
      });
    } else {
      doc.text(generatedScript, 14, 40, { maxWidth: 180 });
    }
    doc.save(`${contentType.toLowerCase()}-script.pdf`);
  };

  const handleSaveScript = async () => {
    if (!generatedScript || !user) return;
    setIsSaving(true);
    try {
      if (currentScriptId) {
        await apiRequest(`/api/scripts/${currentScriptId}`, {
          method: 'PUT',
          body: JSON.stringify({ 
            title: `EPISODE_${episode}`,
            content: generatedScript 
          })
        });
      } else {
        const response = await apiRequest<any>("/api/scripts", {
          method: 'POST',
          body: JSON.stringify({ 
            user_id: user.id, 
            title: `EPISODE_${episode}`,
            content: generatedScript 
          })
        });
        setCurrentScriptId(response.id);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save script:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateMetadata = async () => {
    if (!generatedScript) return;
    setIsGeneratingMetadata(true);
    navigate('/studio/seo');
    const metadata = await generateMetadata(generatedScript, selectedModel);
    setGeneratedMetadata(metadata);
    setIsGeneratingMetadata(false);
  };

  const handleGenerateImagePrompts = async () => {
    if (!generatedScript) return;
    setIsGeneratingImagePrompts(true);
    navigate('/studio/prompts');
    const prompts = await generateImagePrompts(generatedScript, selectedModel);
    setGeneratedImagePrompts(prompts);
    setIsGeneratingImagePrompts(false);
  };

  const playVoiceover = (text: string | null) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text.replace(/\|/g, ' '));
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" data-testid="marker-production-script">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-studio text-shadow-studio">
            <Sparkles className="w-5 h-5 text-studio" /> Production Script
          </h2>
          {saveStatus !== 'idle' && (
            <div className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded border animate-in fade-in duration-300 ${
              saveStatus === 'saving' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' : 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5'
            }`}>
              {saveStatus === 'saving' ? 'Auto-Saving...' : 'Saved to Local'}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ScriptToolbar 
            generatedScript={generatedScript}
            exportToPDF={exportToPDF}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isSaving={isSaving}
            handleSaveScript={handleSaveScript}
          />
        </div>
      </div>

      <Card className="bg-[#050505]/50 border border-studio shadow-studio overflow-hidden">
        <ScriptHeaderInfo 
          isLiked={isLiked} setIsLiked={setIsLiked}
          generatedScript={generatedScript}
          calculateDuration={calculateDuration}
          handleGenerateScript={handleGenerateScript}
          isLoading={isLoading}
          prompt={prompt}
          handleContinueScript={handleContinueScript}
          isContinuingScript={isContinuingScript}
          handleNextEpisode={handleNextEpisode}
          handleGenerateMetadata={handleGenerateMetadata}
          isGeneratingMetadata={isGeneratingMetadata}
          handleGenerateImagePrompts={handleGenerateImagePrompts}
          isGeneratingImagePrompts={isGeneratingImagePrompts}
          handleGenerateVisuals={handleGenerateVisuals}
          isGeneratingVisuals={isGeneratingVisuals}
          playVoiceover={playVoiceover}
          session={session}
          episode={episode}
          narrativeBeats={narrativeBeats}
        />
        <div className="w-full p-0">
          <div className="p-12 max-w-4xl mx-auto">
            {isEditing ? (
              <Textarea 
                className="min-h-[600px] bg-transparent border-none focus-visible:ring-0 text-zinc-300 font-mono text-sm resize-none leading-loose"
                value={generatedScript || ''}
                onChange={(e) => {
                  setGeneratedScript(e.target.value);
                  lastKeystrokeRef.current = Date.now();
                }}
              />
            ) : (
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
                    isLoading={isLoading}
                    prompt={prompt}
                    handleGenerateScript={handleGenerateScript}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
