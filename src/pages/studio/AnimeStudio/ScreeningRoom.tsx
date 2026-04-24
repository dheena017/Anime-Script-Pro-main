import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { apiRequest } from '@/lib/api-utils';
import { generateImagePrompts } from '@/services/geminiService';

// Sub-components
import { ScreeningHeader } from '../components/Screening/ScreeningHeader';
import { ScreeningToolbar } from '../components/Screening/ScreeningToolbar';
import { ScreeningViewport } from '../components/Screening/ScreeningViewport';
import { ScreeningTimeline } from '../components/Screening/ScreeningTimeline';
import { ScreeningMetadata } from '../components/Screening/ScreeningMetadata';
import { ScreeningEmptyState } from '../components/Screening/ScreeningEmptyState';
import { RenderPhase, Scene } from '../components/Screening/types';

export function ScreeningRoom() {
  const { currentScriptId, generatedScript, session, episode, showNotification, selectedModel } = useGenerator();
  const [isLiked, setIsLiked] = React.useState(false);
  const [scenes, setScenes] = React.useState<Scene[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRendering, setIsRendering] = React.useState(false);
  const [activeSession, setActiveSession] = React.useState(1);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [videoPrompts, setVideoPrompts] = React.useState<string | null>(null);
  const [renderPhases, setRenderPhases] = React.useState<RenderPhase[]>([
    { id: 'lore', label: 'Lore Vault Integration', status: 'pending' },
    { id: 'cast', label: 'Character DNA Sync', status: 'pending' },
    { id: 'beats', label: 'Narrative Scaffolding', status: 'pending' },
    { id: 'script', label: 'Dialogue Synthesis', status: 'pending' },
    { id: 'visuals', label: 'Cinematic Rendering', status: 'pending' },
    { id: 'integrity', label: 'Manifest Integrity Check', status: 'pending' },
  ]);

  React.useEffect(() => {
    if (currentScriptId || generatedScript) {
      fetchScenes();
    }
  }, [currentScriptId, activeSession, generatedScript]);

  const fetchScenes = async () => {
    setIsLoading(true);
    try {
      if (currentScriptId) {
        const data = await apiRequest<any[]>(`/api/scenes?project_id=${currentScriptId}`);
        if (data && data.length > 0) {
          const filtered = data.filter(s => Math.ceil(s.scene_number / 192) === activeSession);
          setScenes(filtered);
          setIsLoading(false);
          return;
        }
      }

      // Fallback: Parse from generatedScript
      if (generatedScript) {
        const lines = generatedScript.split('\n');
        const tableLines = lines.filter(l => l.includes('|') && !l.includes('---'));
        if (tableLines.length > 1) {
          const parsed = tableLines.slice(1).map((row, idx) => {
            const cells = row.split('|').filter(cell => cell.trim() !== "").map(cell => cell.trim());
            return {
              id: `temp-${idx}`,
              scene_number: idx + 1,
              status: 'SYNCED',
              script: cells[3] || cells[1] || 'Dialogue sync in progress...'
            } as Scene;
          });
          setScenes(parsed);
        } else {
          setScenes([]); // Ensure scenes is empty if no table lines found
        }
      } else {
        setScenes([]);
      }
    } catch (error) {
      console.error("Failed to load screening room:", error);
      setScenes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullRender = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before cinematic rendering.', 'error');
      return;
    }
    setIsRendering(true);
    setVideoUrl(null);
    
    // Reset phases
    setRenderPhases(prev => prev.map(p => ({ ...p, status: 'pending' })));

    try {
      // 1. Sequence through phases
      for (let i = 0; i < renderPhases.length; i++) {
        setRenderPhases(prev => {
          const next = [...prev];
          next[i].status = 'active';
          if (i > 0) next[i-1].status = 'done';
          return next;
        });
        await new Promise(r => setTimeout(r, 1200)); // Simulate neural processing
      }

      // 2. Final Synthesis
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setVideoPrompts(prompts);
      
      const result: any = await simulateVideoRender(prompts);
      if (result.success) {
        setVideoUrl(result.videoUrl);
        setRenderPhases(prev => prev.map(p => ({ ...p, status: 'done' })));
        showNotification?.('Cinematic Rendering Complete: Unit Preview Active', 'success');
      }
    } catch (error: any) {
      console.error("Production synthesis failed:", error);
      showNotification?.('Rendering Failure: ' + (error.message || 'Unknown Error'), 'error');
    } finally {
      setIsRendering(false);
    }
  };


  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" data-testid="marker-screening-room">
      <ScreeningHeader 
        activeSession={activeSession}
        setActiveSession={setActiveSession}
        isRendering={isRendering}
        onRender={handleFullRender}
        hasScript={!!generatedScript}
        session={session}
        episode={episode}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
      />

      <ScreeningToolbar 
        session={activeSession.toString()}
        episode="1" // Default or based on activeSession
        status={videoUrl || scenes.length > 0 ? 'active' : 'empty'}
      />

      <Card className="bg-[#030303] border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 hover:border-studio/50">
        <div className="absolute inset-0 border-[1px] border-studio/20 rounded-[2.5rem] pointer-events-none group-hover/card:border-studio/40 transition-colors duration-700" />
        <div className="absolute -top-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-studio/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-[1400px] mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <AnimatePresence mode="wait">
                {scenes.length === 0 && !isLoading ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ScreeningEmptyState 
                      onLaunch={handleFullRender}
                      isGenerating={isRendering}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                      <div className="lg:col-span-3">
                        <ScreeningViewport 
                          videoUrl={videoUrl}
                          isRendering={isRendering}
                          renderPhases={renderPhases}
                          onRender={handleFullRender}
                          activeSession={activeSession}
                          sceneCount={scenes.length}
                          videoPrompts={videoPrompts}
                        />
                      </div>

                      <div className="lg:col-span-1">
                        <ScreeningTimeline 
                          scenes={scenes}
                          isLoading={isLoading}
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <ScreeningMetadata 
                        isRendering={isRendering}
                        videoUrl={videoUrl}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Neural Simulation Helpers
async function simulateVideoRender(_prompts: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4"
      });
    }, 2000);
  });
}
