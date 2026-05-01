import { useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { apiRequest } from '@/lib/api-utils';
import { generateImagePrompts } from '@/services/api/gemini';

// Context
import { ScreeningContext } from './Screening/ScreeningLayout';

// Sub-components
import { ScreeningTab } from '../components/Screening/Tabs/ScreeningTabs';
import { ScreeningViewport } from '../components/Screening/ScreeningViewport';
import { ScreeningTimeline } from '../components/Screening/ScreeningTimeline';
import { ScreeningMetadata } from '../components/Screening/ScreeningMetadata';
import { ScreeningEmptyState } from '../components/Screening/ScreeningEmptyState';
import { RenderPhase, Scene } from '../components/Screening/types';
import { Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScreeningRoom() {
  const { activeTab } = useOutletContext<{ activeTab: ScreeningTab }>();
  const { setHandlers } = useContext(ScreeningContext);
  const { 
    currentScriptId, 
    generatedScript, 
    showNotification, 
    selectedModel, 
    session: activeSession,
    setSession 
  } = useGenerator();
  
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoPrompts, setVideoPrompts] = useState<string | null>(null);
  const [renderPhases, setRenderPhases] = useState<RenderPhase[]>([
    { id: 'lore', label: 'Lore Vault Integration', status: 'pending' },
    { id: 'cast', label: 'Character DNA Sync', status: 'pending' },
    { id: 'script', label: 'Dialogue Synthesis', status: 'pending' },
    { id: 'visuals', label: 'Cinematic Rendering', status: 'pending' },
    { id: 'integrity', label: 'Manifest Integrity Check', status: 'pending' },
  ]);

  useEffect(() => {
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
          const filtered = data.filter(s => Math.ceil(s.scene_number / 192) === parseInt(activeSession));
          setScenes(filtered);
          return;
        }
      }

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
          setScenes([]);
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
    setRenderPhases(prev => prev.map(p => ({ ...p, status: 'pending' })));

    try {
      for (let i = 0; i < renderPhases.length; i++) {
        setRenderPhases(prev => {
          const next = [...prev];
          next[i].status = 'active';
          if (i > 0) next[i-1].status = 'done';
          return next;
        });
        await new Promise(r => setTimeout(r, 1200));
      }

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

  useEffect(() => {
    setHandlers({ 
      handleFullRender,
      isRendering,
      activeSession: parseInt(activeSession),
      setActiveSession: (s: number) => setSession(String(s))
    });
  }, [generatedScript, selectedModel, isRendering, activeSession]);

  const renderTabContent = () => {
    if (activeTab === 'preview') {
      return (
        <AnimatePresence mode="wait">
          {scenes.length === 0 && !isLoading ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ScreeningEmptyState onLaunch={handleFullRender} isGenerating={isRendering} />
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <ScreeningViewport
                    videoUrl={videoUrl}
                    isRendering={isRendering}
                    renderPhases={renderPhases}
                    onRender={handleFullRender}
                    activeSession={parseInt(activeSession)}
                    sceneCount={scenes.length}
                    videoPrompts={videoPrompts}
                    generatedScript={generatedScript}
                  />
                </div>
                <div className="lg:col-span-1">
                  <ScreeningTimeline scenes={scenes} isLoading={isLoading} />
                </div>
              </div>
              <div className="mt-8">
                <ScreeningMetadata isRendering={isRendering} videoUrl={videoUrl} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
        <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center mb-8">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
            <Monitor className="w-8 h-8 opacity-20" />
          </motion.div>
        </div>
        <p className="font-black uppercase tracking-[0.3em] text-[10px] max-w-[220px] text-center leading-loose">
          The {activeTab} layer is currently being synchronized with the production core.
        </p>
      </div>
    );
  };

  return (
    <div data-testid="marker-screening-room">
      <Card className={cn(
        "bg-[#030303] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700",
        "border-studio/20 shadow-[0_0_40px_rgba(6,182,212,0.08)] hover:border-studio/40"
      )}>
        <div className="absolute inset-0 border-[1px] border-white/5 rounded-[2.5rem] pointer-events-none group-hover/card:border-white/10 transition-colors duration-700" />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderTabContent()}
          </div>
        </div>
      </Card>
    </div>
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
