import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  enhanceSceneVisuals, 
  generateSceneImage, 
  enhanceNarration, 
  rewriteForTension, 
  suggestDuration,
  generateScene
} from '@/services/geminiService';

// Sub-components
import { StoryboardHeader } from '../components/Storyboard/StoryboardHeader';
import { PlanningGuide } from '../components/Storyboard/PlanningGuide';
import { SceneCard } from '../components/Storyboard/SceneCard';
import { EmptyState } from '../components/Storyboard/EmptyState';
import { Moodboard } from '../components/Moodboard/Moodboard';
import { SceneTimeline } from '../components/Timeline/SceneTimeline';
import { SoundscapeLibrary } from '../components/Audio/SoundscapeLibrary';

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
  duration: string;
  linkedPrompt?: string;
}

export function StoryboardPage() {
  const [isLiked, setIsLiked] = useState(false);
  const { generatedScript, setGeneratedScript, visualData, setVisualData, generatedImagePrompts } = useGenerator();
  const promptList = generatedImagePrompts 
  ? generatedImagePrompts.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.includes('---')) 
  : [];
  const [isGeneratingVisuals, setIsGeneratingVisuals] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [enhancingSceneIds, setEnhancingSceneIds] = useState<Set<string>>(new Set());
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Scene>>({});
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhancingNarration, setIsEnhancingNarration] = useState(false);
  const [isRewritingTension, setIsRewritingTension] = useState(false);
  const [isSuggestingDuration, setIsSuggestingDuration] = useState(false);
  const [isEnhancingAllNarration, setIsEnhancingAllNarration] = useState(false);
  const [isEnhancingAllVisuals, setIsEnhancingAllVisuals] = useState(false);

  const isGlobalEnhancing = isEnhancingAllNarration || isEnhancingAllVisuals;
  const lastScriptRef = React.useRef<string | null>(null);

  const parseStoryboard = (script: string | null): Scene[] => {
    if (!script) return [];
    const lines = script.split('\n');
    const tableLines = lines.filter(l => l.includes('|') && !l.includes('---'));
    if (tableLines.length <= 1) return [];
    
    return tableLines.slice(1).map((row, idx) => {
      const cells = row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim());
      return {
        id: `scene-${Math.random().toString(36).substring(2, 9)}-${idx}`,
        originalIndex: idx,
        section: cells[0] || '',
        narration: cells[1] || '',
        visuals: cells[2] || '',
        sound: cells[3] || '',
        duration: cells[4] || '5s',
        linkedPrompt: cells[5] || ''
      };
    });
  };

  useEffect(() => {
    if (generatedScript !== lastScriptRef.current) {
      setScenes(parseStoryboard(generatedScript));
      lastScriptRef.current = generatedScript;
    }
  }, [generatedScript]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(scenes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setScenes(items);
    updateScriptMarkdown(items);
  };

  const updateScriptMarkdown = (items: Scene[]) => {
    let currentScript = generatedScript;
    if (!currentScript || !currentScript.includes('|')) {
      currentScript = "# Production Script\n\n| Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues | Duration | Linked Prompt |\n| :--- | :--- | :--- | :--- | :--- | :--- |";
    }
    const lines = currentScript.split('\n');
    const tableHeaderIndex = lines.findIndex(l => l.includes('|') && l.toLowerCase().includes('section'));
    if (tableHeaderIndex !== -1) {
      const preTable = lines.slice(0, tableHeaderIndex + 2);
      let tableEndIndex = tableHeaderIndex + 2;
      while (tableEndIndex < lines.length && lines[tableEndIndex].includes('|')) tableEndIndex++;
      const postTable = lines.slice(tableEndIndex);
      const newTableRows = items.map(scene => `| ${scene.section} | ${scene.narration} | ${scene.visuals} | ${scene.sound} | ${scene.duration} | ${scene.linkedPrompt || ''} |`);
      const newScript = [...preTable, ...newTableRows, ...postTable].join('\n');
      lastScriptRef.current = newScript;
      setGeneratedScript(newScript);
    }
  };

  const handleEnhanceNarration = async () => {
    if (!editForm.narration) return;
    setIsEnhancingNarration(true);
    try {
      const enhanced = await enhanceNarration(editForm.narration);
      setEditForm(prev => ({ ...prev, narration: enhanced }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancingNarration(false);
    }
  };

  const handleEnhanceVisuals = async () => {
    if (!editForm.visuals) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceSceneVisuals(editForm.visuals, editForm.narration || '');
      setEditForm(prev => ({ ...prev, visuals: enhanced }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleRewriteTension = async () => {
    if (!editForm.visuals) return;
    setIsRewritingTension(true);
    try {
      const rewritten = await rewriteForTension(editForm.visuals);
      setEditForm(prev => ({ ...prev, visuals: rewritten }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsRewritingTension(false);
    }
  };

  const handleSuggestDuration = async () => {
    if (!editForm.narration) return;
    setIsSuggestingDuration(true);
    try {
      const suggested = await suggestDuration(editForm.narration);
      setEditForm(prev => ({ ...prev, duration: suggested }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSuggestingDuration(false);
    }
  };

  const handleGenerateVisual = async (originalIndex: number, visualsDescription: string) => {
    setVisualData(prev => ({ ...prev, [originalIndex]: 'loading' }));
    try {
      const imageUrl = await generateSceneImage(visualsDescription);
      if (imageUrl) {
        setVisualData(prev => ({ ...prev, [originalIndex]: imageUrl }));
      } else {
        const seed = encodeURIComponent(visualsDescription.slice(0, 50));
        setVisualData(prev => ({ ...prev, [originalIndex]: `https://picsum.photos/seed/${seed}-${originalIndex}/800/450` }));
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
      const seed = encodeURIComponent(visualsDescription.slice(0, 50));
      setVisualData(prev => ({ ...prev, [originalIndex]: `https://picsum.photos/seed/${seed}-${originalIndex}/800/450` }));
    }
  };

  const handleGenerateAll = async () => {
    setIsGeneratingVisuals(true);
    const newVisualData = { ...visualData };
    for (const scene of scenes) {
      if (!newVisualData[scene.originalIndex] || newVisualData[scene.originalIndex] === 'loading') {
        setVisualData(prev => ({ ...prev, [scene.originalIndex]: 'loading' }));
        try {
          const promptToUse = scene.linkedPrompt || scene.visuals;
          const imageUrl = await generateSceneImage(promptToUse);
          newVisualData[scene.originalIndex] = imageUrl || `https://picsum.photos/seed/${encodeURIComponent(promptToUse.slice(0, 50))}-${scene.originalIndex}/800/450`;
        } catch (error) {
          const promptToUse = scene.linkedPrompt || scene.visuals;
          newVisualData[scene.originalIndex] = `https://picsum.photos/seed/${encodeURIComponent(promptToUse.slice(0, 50))}-${scene.originalIndex}/800/450`;
        }
        setVisualData(prev => ({ ...prev, [scene.originalIndex]: newVisualData[scene.originalIndex] }));
      }
    }
    setIsGeneratingVisuals(false);
  };

  const handleEnhanceAllNarration = async () => {
    setIsEnhancingAllNarration(true);
    try {
      const updatedScenes = await Promise.all(scenes.map(async (scene) => {
        if (!scene.narration) return scene;
        const enhanced = await enhanceNarration(scene.narration);
        return { ...scene, narration: enhanced };
      }));
      setScenes(updatedScenes);
      updateScriptMarkdown(updatedScenes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancingAllNarration(false);
    }
  };

  const handleEnhanceAllVisuals = async () => {
    setIsEnhancingAllVisuals(true);
    try {
      let currentScenes = [...scenes];
      for (let i = 0; i < currentScenes.length; i++) {
        const scene = currentScenes[i];
        if (!scene.visuals) continue;
        
        setEnhancingSceneIds(prev => {
          const next = new Set(prev);
          next.add(scene.id);
          return next;
        });

        const enhanced = await enhanceSceneVisuals(scene.visuals, scene.narration || '');
        currentScenes[i] = { ...scene, visuals: enhanced };
        
        setEnhancingSceneIds(prev => {
          const next = new Set(prev);
          next.delete(scene.id);
          return next;
        });

        setScenes([...currentScenes]);
      }
      updateScriptMarkdown(currentScenes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancingAllVisuals(false);
      setEnhancingSceneIds(new Set());
    }
  };

  const handleAddScene = () => {
    const nextIndex = scenes.length > 0 ? Math.max(...scenes.map(s => s.originalIndex)) + 1 : 0;
    const newScene: Scene = {
      id: `scene-${Math.random().toString(36).substring(2, 9)}-${nextIndex}`,
      originalIndex: nextIndex,
      section: 'New Scene',
      narration: 'Character narration or dialogue goes here...',
      visuals: 'Cinematic shot description...',
      sound: 'SFX and BGM cues',
      duration: '5s'
    };
    const updatedScenes = [...scenes, newScene];
    setScenes(updatedScenes);
    updateScriptMarkdown(updatedScenes);
  };

  const handleGenerateNewScene = async (beatDescription: string) => {
    const prompt = generatedScript || "Generate a scene";
    const generated = await generateScene(prompt, beatDescription);
    const nextIndex = scenes.length > 0 ? Math.max(...scenes.map(s => s.originalIndex)) + 1 : 0;
    const newScene: Scene = {
      id: `scene-${Math.random().toString(36).substring(2, 9)}-${nextIndex}`,
      originalIndex: nextIndex,
      section: 'AI Generated',
      narration: generated.narration,
      visuals: generated.visuals,
      sound: generated.sound,
      duration: '5s'
    };
    const updatedScenes = [...scenes, newScene];
    setScenes(updatedScenes);
    updateScriptMarkdown(updatedScenes);
  };


  const startEditing = (scene: Scene) => {
    setEditingSceneId(scene.id);
    setEditForm(scene);
  };

  const saveSceneEdits = () => {
    if (!editingSceneId) return;
    const updatedScenes = scenes.map(scene => scene.id === editingSceneId ? { ...scene, ...editForm } as Scene : scene);
    setScenes(updatedScenes);
    updateScriptMarkdown(updatedScenes);
    setEditingSceneId(null);
    setEditForm({});
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" data-testid="marker-visual-storyboard">
      <StoryboardHeader 
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        isGuideOpen={isGuideOpen}
        setIsGuideOpen={setIsGuideOpen}
        handleAddScene={handleAddScene}
        handleGenerateNewScene={handleGenerateNewScene}
        scenesLength={scenes.length}
        handleEnhanceAllVisuals={handleEnhanceAllVisuals}
        handleEnhanceAllNarration={handleEnhanceAllNarration}
        handleGenerateAll={handleGenerateAll}
        isGlobalEnhancing={isGlobalEnhancing}
        isGeneratingVisuals={isGeneratingVisuals}
        isEnhancingAllVisuals={isEnhancingAllVisuals}
        isEnhancingAllNarration={isEnhancingAllNarration}
      />

      <AnimatePresence>
        {isGuideOpen && <PlanningGuide />}
      </AnimatePresence>

      <div className="w-full pr-4 pb-20">
        {scenes.length > 0 ? (
          <div className="space-y-12">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="storyboard">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                    {scenes.map((scene, idx) => (
                      <Draggable key={scene.id} draggableId={scene.id} index={idx}>
                        {(provided, snapshot) => (
                          <SceneCard 
                            scene={scene}
                            index={idx}
                            visualData={visualData}
                            promptList={promptList}
                            editingSceneId={editingSceneId}
                            editForm={editForm}
                            isEnhancingNarration={isEnhancingNarration}
                            isEnhancing={isEnhancing}
                            isRewritingTension={isRewritingTension}
                            isSuggestingDuration={isSuggestingDuration}
                            setEditForm={setEditForm}
                            handleGenerateVisual={handleGenerateVisual}
                            startEditing={startEditing}
                            cancelEditing={() => { setEditingSceneId(null); setEditForm({}); }}
                            saveSceneEdits={saveSceneEdits}
                            handleEnhanceNarration={handleEnhanceNarration}
                            handleEnhanceVisuals={handleEnhanceVisuals}
                            handleRewriteTension={handleRewriteTension}
                            handleSuggestDuration={handleSuggestDuration}
                            dragHandleProps={provided.dragHandleProps}
                            draggableProps={provided.draggableProps}
                            innerRef={provided.innerRef}
                            isDragging={snapshot.isDragging}
                            isBulkEnhancing={enhancingSceneIds.has(scene.id)}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            <div className="pt-10 space-y-12">
              <SceneTimeline scenes={scenes} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-studio/10">
                <Moodboard />
                <SoundscapeLibrary />
              </div>
            </div>
          </div>
        ) : (
          <EmptyState handleAddScene={handleAddScene} />
        )}
      </div>
    </motion.div>
  );
}
