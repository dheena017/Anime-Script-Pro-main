import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { useOutletContext } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  enhanceSceneVisuals, 
  generateSceneImage, 
  enhanceNarration, 
  rewriteForTension, 
  suggestDuration,
  generateSceneVideo
} from '@/services/geminiService';
import { StoryboardTab } from '../components/Storyboard/Tabs/StoryboardTabs';

// Sub-components
import { PlanningGuide } from '../components/Storyboard/PlanningGuide';
import { SceneCard } from '../components/Storyboard/SceneCard';
import { EmptyState } from '../components/Storyboard/EmptyState';
import { Moodboard } from '../components/Moodboard/Moodboard';
import { SceneTimeline } from '../components/Timeline/SceneTimeline';
import { SoundscapeLibrary } from '../components/Audio/SoundscapeLibrary';
import { StoryboardContext } from './Storyboard/StoryboardLayout';

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
  const { 
    generatedScript, setGeneratedScript, 
    visualData, setVisualData, 
    videoData, setVideoData,
    generatedImagePrompts, 
    selectedModel,
    isGeneratingVisuals,
    setIsGeneratingVisuals
  } = useGenerator();
  const promptList = generatedImagePrompts 
  ? generatedImagePrompts.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.includes('---')) 
  : [];
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
  const [isProductionLoopActive, setIsProductionLoopActive] = useState(false);
  const [productionProgress, setProductionProgress] = useState(0);

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
      currentScript = "# Anime Script\n\n| Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues | Duration | Linked Prompt |\n| :--- | :--- | :--- | :--- | :--- | :--- |";
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
    setVisualData(prev => ({ ...prev, [originalIndex]: ['loading'] }));
    try {
      const promises = Array(4).fill(0).map((_, i) => generateSceneImage(`${visualsDescription} Variation ${i+1}`, selectedModel));
      const results = await Promise.all(promises);
      const images = results.map((url, i) => url || `https://picsum.photos/seed/${encodeURIComponent(visualsDescription.slice(0, 50))}-${originalIndex}-${i}/800/450`);
      setVisualData(prev => ({ ...prev, [originalIndex]: images }));
    } catch (error) {
      console.error("Failed to generate image:", error);
      const seed = encodeURIComponent(visualsDescription.slice(0, 50));
      const fallbacks = Array(4).fill(0).map((_, i) => `https://picsum.photos/seed/${seed}-${originalIndex}-${i}/800/450`);
      setVisualData(prev => ({ ...prev, [originalIndex]: fallbacks }));
    }
  };

  const handleGenerateVideo = async (originalIndex: number, _imageUrl: string, prompt: string) => {
    setVideoData(prev => ({ ...prev, [originalIndex]: 'loading' }));
    try {
      const videoUrl = await generateSceneVideo(prompt, selectedModel);
      if (videoUrl) {
        setVideoData(prev => ({ ...prev, [originalIndex]: videoUrl }));
      } else {
        setVideoData(prev => ({ ...prev, [originalIndex]: "https://vjs.zencdn.net/v/oceans.mp4" }));
      }
    } catch (error) {
      console.error("Failed to generate video:", error);
      setVideoData(prev => ({ ...prev, [originalIndex]: "https://vjs.zencdn.net/v/oceans.mp4" }));
    }
  };

  const handleGenerateAll = async () => {
    setIsGeneratingVisuals(true);
    const newVisualData = { ...visualData };
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      if (!newVisualData[scene.originalIndex] || newVisualData[scene.originalIndex].length === 0 || newVisualData[scene.originalIndex][0] === 'loading') {
        setVisualData(prev => ({ ...prev, [scene.originalIndex]: ['loading'] }));
        try {
          const promptToUse = scene.linkedPrompt || scene.visuals;
          const promises = Array(4).fill(0).map((_, idx) => generateSceneImage(`${promptToUse} Variation ${idx+1}`, selectedModel));
          const results = await Promise.all(promises);
          newVisualData[scene.originalIndex] = results.map((url, idx) => url || `https://picsum.photos/seed/${encodeURIComponent(promptToUse.slice(0, 50))}-${scene.originalIndex}-${idx}/800/450`);
        } catch (error) {
          const promptToUse = scene.linkedPrompt || scene.visuals;
          newVisualData[scene.originalIndex] = Array(4).fill(0).map((_, idx) => `https://picsum.photos/seed/${encodeURIComponent(promptToUse.slice(0, 50))}-${scene.originalIndex}-${idx}/800/450`);
        }
        setVisualData(prev => ({ ...prev, [scene.originalIndex]: newVisualData[scene.originalIndex] }));
      }
    }
    setIsGeneratingVisuals(false);
  };

  const handleFullProductionLoop = async () => {
    setIsProductionLoopActive(true);
    setProductionProgress(0);
    
    try {
      // Phase 1: Synthesize All Images
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        setProductionProgress(((i + 0.5) / scenes.length) * 50);
        await handleGenerateVisual(scene.originalIndex, scene.linkedPrompt || scene.visuals);
      }
      
      // Phase 2: Ignite All Motion Engines (Video)
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        setProductionProgress(50 + ((i + 0.5) / scenes.length) * 50);
        const currentVisuals = visualData[scene.originalIndex] || [];
        const imageUrl = currentVisuals[0] && currentVisuals[0] !== 'loading' ? currentVisuals[0] : `https://picsum.photos/seed/scene-${scene.originalIndex}/800/450`;
        await handleGenerateVideo(scene.originalIndex, imageUrl, scene.linkedPrompt || scene.visuals);
      }
    } catch (error) {
      console.error("Full Production Loop failed:", error);
    } finally {
      setIsProductionLoopActive(false);
      setProductionProgress(100);
    }
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

  const { setHandlers } = React.useContext<any>(StoryboardContext);
  const { activeTab } = useOutletContext<{ activeTab: StoryboardTab }>();

  React.useEffect(() => {
    setHandlers({
      handleEnhanceAllNarration,
      handleEnhanceAllVisuals,
      handleFullProductionLoop,
      handleGenerateAll,
      handleAddScene,
      isGlobalEnhancing,
      isProductionLoopActive,
      productionProgress,
      isGuideOpen,
      setIsGuideOpen,
      scenesLength: scenes.length,
      isGenerating: isGeneratingVisuals
    });
  }, [isGlobalEnhancing, scenes, isProductionLoopActive, productionProgress, isGuideOpen, isGeneratingVisuals]);

  const framesView = (
    <div className="space-y-12">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="storyboard">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-10">
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
                      handleGenerateVideo={handleGenerateVideo}
                      videoData={videoData}
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
                      isBulkEnhancing={enhancingSceneIds.has(scene.id)} />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );

  const renderTabContent = () => {
    if (scenes.length === 0 && activeTab === 'frames') {
      return <EmptyState handleAddScene={handleAddScene} />;
    }
    switch (activeTab) {
      case 'frames': return framesView;
      case 'angles': return (
        <div className="py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-[2rem] bg-studio/10 border border-studio/20 flex items-center justify-center mx-auto">
            <span className="text-2xl">🎥</span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Shot Angles</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] max-w-md mx-auto">Camera blocking, Dutch angles, and cinematic framing guides for each scene node.</p>
        </div>
      );
      case 'composition': return (
        <div className="pt-8 space-y-12">
          <SceneTimeline scenes={scenes} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-white/5">
            <Moodboard />
            <SoundscapeLibrary />
          </div>
        </div>
      );
      case 'animatic': return (
        <div className="py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <span className="text-2xl">🎬</span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Animatic Preview</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] max-w-md mx-auto">Sequential frame preview with timing overlays. Connect generated video nodes to render the full animatic.</p>
        </div>
      );
      case 'audio': return <SoundscapeLibrary />;
      default: return framesView;
    }
  };

  return (
    <div data-testid="marker-visual-storyboard">
      <AnimatePresence>
        {isGuideOpen && <PlanningGuide />}
      </AnimatePresence>

      <Card className={cn(
        "bg-[#030303] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700",
        activeTab === 'frames'
          ? "border-fuchsia-500/20 shadow-[0_0_40px_rgba(217,70,239,0.08)] hover:border-fuchsia-500/40"
          : "border-zinc-800/30 hover:border-zinc-700"
      )}>
        <div className="w-full p-0">
          <div className="p-12 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderTabContent()}
          </div>
        </div>
      </Card>
    </div>
  );
}
