import React from 'react';
import { 
  Play, 
  Clapperboard, 
  Monitor, 
  Download, 
  Search, 
  Tv, 
  Cpu, 
  Zap 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { apiRequest } from '@/lib/api-utils';
import { cn } from '@/lib/utils';


import ReactMarkdown from 'react-markdown';

export function ScreeningRoom() {
  const { currentScriptId, generatedScript } = useGenerator();
  const [scenes, setScenes] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRendering, setIsRendering] = React.useState(false);
  const [activeSession, setActiveSession] = React.useState(1);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [videoPrompts, setVideoPrompts] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (currentScriptId) {
      fetchScenes();
    }
  }, [currentScriptId, activeSession]);

  const fetchScenes = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest<any[]>(`/api/scenes?project_id=${currentScriptId}`);
      const filtered = data.filter(s => Math.ceil(s.scene_number / 192) === activeSession);
      setScenes(filtered);
    } catch (error) {
      console.error("Failed to load screening room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullRender = async () => {
    if (!generatedScript) return;
    setIsRendering(true);
    try {
      // 1. Synthesize Video Prompts
      const prompts = await generateVideoPrompts(generatedScript);
      setVideoPrompts(prompts);
      
      // 2. Simulate/Initiate Render
      const result: any = await simulateVideoRender(prompts);
      if (result.success) {
        setVideoUrl(result.videoUrl);
      }
    } catch (error) {
      console.error("Video synthesis failed:", error);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700" data-testid="marker-screening-room">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-studio">
            <Monitor className="w-7 h-7 text-studio" />
            Screening Room
          </h2>
          <div className="flex items-center gap-1 p-1 bg-black/40 border border-zinc-800 rounded-xl">
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onClick={() => setActiveSession(s)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeSession === s ? "bg-studio text-white shadow-studio" : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                Arc {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleFullRender}
            disabled={isRendering || !generatedScript}
            className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white uppercase tracking-widest text-[10px] font-black shadow-[0_0_15px_rgba(192,38,211,0.3)] animate-pulse"
          >
            {isRendering ? <span className="flex items-center gap-2"><Cpu className="w-3 h-3 animate-spin" /> Rendering...</span> : <><Zap className="w-3 h-3 mr-2" /> Full Production Render</>}
          </Button>
          <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:text-white uppercase tracking-widest text-[10px] font-black">
            <Download className="w-3 h-3 mr-2" /> Export Bundle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 1. MASTER VIEWPORT */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="aspect-video bg-black border-studio/20 relative overflow-hidden group shadow-2xl rounded-3xl">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
                poster="https://vjs.zencdn.net/v/oceans.png"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* NOIR SCANLINES */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-studio/10 border border-studio/30 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer backdrop-blur-xl">
                      <Play className="w-10 h-10 text-studio fill-current" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-studio font-black uppercase tracking-[0.4em] text-xs">
                        {isRendering ? "Neural Synthesis in Progress..." : "Awaiting Composition"}
                      </p>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Arc {activeSession}: {scenes.length} Units Synced</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* OVERLAY METADATA */}
            <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between pointer-events-none">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <div className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-black uppercase rounded sm">Live</div>
                   <span className="text-white font-black uppercase tracking-widest text-sm">Unit Preview Mode</span>
                </div>
                <div className="flex gap-4 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-studio" /> 4K Neural</span>
                  <span>FPS: 24 (Cinematic)</span>
                </div>
              </div>
            </div>
          </Card>

          {videoPrompts && (
            <Card className="bg-[#050505] border-fuchsia-500/20 p-6 rounded-2xl animate-in fade-in zoom-in duration-500">
               <h4 className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Director's Video Synthesis
               </h4>
               <ScrollArea className="h-32">
                  <div className="text-[11px] text-zinc-500 font-medium leading-relaxed prose prose-invert max-w-none">
                    <ReactMarkdown>{videoPrompts}</ReactMarkdown>
                  </div>
               </ScrollArea>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card className="bg-[#050505] border-zinc-800 p-6 rounded-2xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Tv className="w-12 h-12 text-studio" />
                </div>
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Neural Health</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-white font-bold tracking-tight">Sync Reliability</span>
                    <span className="text-studio text-xs font-black">99.8%</span>
                  </div>
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-studio w-[99.8%] shadow-studio" />
                  </div>
                </div>
             </Card>
             <Card className="md:col-span-2 bg-[#050505] border-zinc-800 p-6 rounded-2xl">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Phase 4 Automation Status</h4>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-white">SEO READY</span>
                    <span className="text-[9px] text-green-500 font-black uppercase">Active</span>
                  </div>
                  <div className="w-[1px] h-8 bg-zinc-800" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-white">STORYBOARD BUNDLE</span>
                    <span className={cn("text-[9px] font-black uppercase", videoUrl ? "text-green-500" : "text-yellow-500")}>
                      {videoUrl ? "PACKAGED" : "Packaging..."}
                    </span>
                  </div>
                  <div className="w-[1px] h-8 bg-zinc-800" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-white">NEURAL VIDEO</span>
                    <span className={cn("text-[9px] font-black uppercase", videoUrl ? "text-green-500" : "text-zinc-600")}>
                      {videoUrl ? "DELIVERED" : "Pending"}
                    </span>
                  </div>
                </div>
             </Card>
          </div>
        </div>

        {/* 2. SCENE TIMELINE (PHASE 3 SYNC) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black text-studio uppercase tracking-[0.2em]">Timeline Manifest</span>
            <Search className="w-4 h-4 text-zinc-600" />
          </div>
          <ScrollArea className="h-[700px] border border-zinc-800 rounded-3xl bg-black/40 backdrop-blur-xl">
            <div className="p-4 space-y-3">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-20 bg-zinc-900/50 rounded-2xl animate-pulse" />
                ))
              ) : scenes.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <Clapperboard className="w-10 h-10 text-zinc-800 mx-auto" />
                  <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">No scenes sync'd to Arc {activeSession}</p>
                </div>
              ) : (
                scenes.map((scene, idx) => (
                  <div 
                    key={scene.id}
                    className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:border-studio/40 transition-all group flex items-center gap-4 cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-black border border-zinc-800 rounded-xl flex items-center justify-center text-xs font-black text-zinc-500 group-hover:text-studio transition-colors">
                      {scene.scene_number}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Unit {idx + 1}</span>
                        <span className={cn(
                          "text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase",
                          scene.status === 'COMPLETED' ? "bg-green-500/10 text-green-500" : "bg-studio/10 text-studio"
                        )}>{scene.status}</span>
                      </div>
                      <p className="text-[11px] font-bold text-zinc-400 line-clamp-1 italic">
                        {scene.script?.slice(0, 40) || "Neural pattern generated..."}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

// Neural Simulation Helpers
async function generateVideoPrompts(_script: string) {
  // Simulate AI synthesis of cinematic video prompts
  return `### NEURAL VIDEO ARCHITECTURE
- **Visual DNA**: Cinematic High-Velocity Animation
- **Dynamic Pacing**: 24fps Kinetic Rhythmic Sync
- **Lighting**: Volumetric Cyber-Noir Neon
- **Director Tone**: Hyper-Detailed Macro Detail
- **Scene Prompts established from script...**`;
}

async function simulateVideoRender(_prompts: string) {
  // Simulate a background rendering process
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4" // Placeholder for actual generated video
      });
    }, 4500); // Simulate neural delay
  });
}
