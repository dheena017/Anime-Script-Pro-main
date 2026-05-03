import { useContext, useEffect, useState } from 'react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles, Brain, Target, Settings, Clapperboard,
  Cpu, Layout as LayoutGrid
} from 'lucide-react';
import { useTemplates, getIconComponent } from '@/hooks/useTemplates';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/hooks/useGenerator';
import { useEngineState, useEngineDispatch } from '@/contexts/generator';
import { useAuth } from '@/hooks/useAuth';
import TextareaAutosize from 'react-textarea-autosize';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Context
import { EngineContext } from './EngineLayout';

// Components
import { TemplateCard } from '../Template/TemplateCard';
import { VaultView } from '../Template/VaultView';

// Tabs
import { EngineTab } from './tabs/EngineTabs';
import { EngineConsole } from './tabs/EngineConsole';
import { EngineCalibration } from './tabs/EngineCalibration';
import { EngineOptimization } from './tabs/EngineOptimization';
import { EngineLogs } from './tabs/EngineLogs';

export function EnginePage() {
  const { activeTab } = useOutletContext<{ activeTab: EngineTab }>();
  const { setHandlers } = useContext(EngineContext);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const {
    setIsSaving,
    generatedScript,
    setCurrentScriptId,
    prompt: globalPrompt,
    setGlobalPrompt,
    setGlobalContentType,
    isGeneratingCharacters,
    isGeneratingMetadata,
    isGeneratingImagePrompts,
    isGeneratingSeries,
    isGeneratingDescription,
    isGeneratingWorld,
    isGeneratingVisuals,
    activeModelAttempt,
  } = useGenerator();

  const { tone, selectedModel, contentType: localContentType } = useEngineState();
  const { setTone, setSelectedModel, setContentType: setLocalContentType } = useEngineDispatch();

  const [prompt, setPrompt] = useState(globalPrompt || '');
  const { templates } = useTemplates();

  const isGeneratingScript = isGeneratingCharacters || isGeneratingMetadata || isGeneratingImagePrompts || isGeneratingSeries || isGeneratingDescription || isGeneratingWorld || isGeneratingVisuals;

  const handleSaveCurrent = async () => {
    if (!generatedScript || !user) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: prompt || "Untitled Script",
          content_type: localContentType,
          prompt: prompt,
          vibe: tone,
          model_used: selectedModel
        })
      });

      if (!res.ok) throw new Error("Failed to save project");
      const project = await res.json();
      setCurrentScriptId(project.id);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setHandlers({ handleSaveCurrent });
  }, [generatedScript, user, prompt, tone, selectedModel]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const renderTabContent = () => {
    if (isGeneratingScript) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] space-y-8">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-studio/20 border-t-studio rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
            <Cpu className="absolute inset-0 m-auto w-6 h-6 text-studio animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-black tracking-[0.3em] text-[10px] uppercase text-studio animate-pulse">Running Neural Synthesis...</p>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Generating cinematic narrative weights</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'status':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
            {/* 1. Header Section - Compact */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-studio/10 border border-studio/20 rounded-full">
                  <Sparkles className="w-3 h-3 text-studio" />
                  <span className="text-[9px] font-black text-studio uppercase tracking-[0.2em]">Master Engine Configuration</span>
                </div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                  PRODUCTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-fuchsia-500 to-studio">BLUEPRINT</span>
                </h1>
              </div>

              {/* Real-time Pipeline Status - Now in Header */}
              <div className="flex flex-col items-end gap-3 min-w-[200px]">
                <div className="flex items-center gap-4">
                  {[
                    { label: 'Engine', status: prompt ? 'active' : 'standby' },
                    { label: 'World', status: useGenerator().worldLore ? 'active' : 'standby' },
                    { label: 'Cast', status: useGenerator().castProfiles ? 'active' : 'standby' },
                    { label: 'Series', status: useGenerator().seriesPlan ? 'active' : 'standby' },
                  ].map((stage) => (
                    <div key={stage.label} className="flex flex-col items-center gap-1.5" title={stage.label}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-500",
                        stage.status === 'active' ? "bg-studio shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "bg-zinc-800"
                      )} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-studio uppercase tracking-widest animate-pulse">
                    {activeModelAttempt ? activeModelAttempt : 'Neural Link Stable'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Main Work Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Configuration (4 cols) */}
              <div className="lg:col-span-4 space-y-8">
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Clapperboard className="w-3 h-3" /> STUDIO
                    </label>
                    <Select value={localContentType} onValueChange={(val) => setLocalContentType(val || 'Anime')}>
                      <SelectTrigger className="h-12 bg-black border-zinc-800 text-cyan-100 rounded-xl focus:border-studio/50 transition-all text-xs">
                        <SelectValue placeholder="Anime" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-zinc-800">
                        <SelectItem value="Anime">Anime Studio</SelectItem>
                        <SelectItem value="Manhwa">Manhwa Studio</SelectItem>
                        <SelectItem value="Comic">Comic Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Settings className="w-3 h-3" /> ENGINE
                    </label>
                    <Select value={selectedModel} onValueChange={(val) => setSelectedModel(val || 'Gemini-2.5-Flash')}>
                      <SelectTrigger className="h-12 bg-black border-zinc-800 text-cyan-100 rounded-xl focus:border-studio/50 transition-all text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-zinc-800">
                        <SelectItem value="gemini-3.1-pro" className="text-fuchsia-400 font-bold">G3.1 Pro (Ultra-Gen)</SelectItem>
                        <SelectItem value="gemini-3.1-flash" className="text-cyan-400 font-bold">G3.1 Flash (Speed)</SelectItem>
                        <SelectItem value="gemini-3-pro" className="text-fuchsia-300">G3.0 Pro (Advanced)</SelectItem>
                        <SelectItem value="Gemini-2.5-Flash" className="text-zinc-400">G2.5 Flash (Default)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Brain className="w-3 h-3" /> TONE
                    </label>
                    <Select value={tone} onValueChange={(val) => setTone(val || 'Hype/Energetic')}>
                      <SelectTrigger className="h-12 bg-black border-zinc-800 text-cyan-100 rounded-xl focus:border-studio/50 transition-all text-xs">
                        <SelectValue placeholder="Hype/Energetic" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-zinc-800">
                        <SelectItem value="Hype/Energetic">Hype / Action</SelectItem>
                        <SelectItem value="Dark/Gritty">Dark / Seinen</SelectItem>
                        <SelectItem value="Emotional/Sad">Emotional / Drama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() => {
                        setGlobalPrompt(prompt);
                        setGlobalContentType(localContentType);
                        navigate('/anime/world');
                      }}
                      disabled={!prompt}
                      className={cn(
                        "btn-genesis w-full h-14 text-[10px]",
                        !prompt && "opacity-20 grayscale pointer-events-none"
                      )}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      LAUNCH GENESIS
                    </Button>
                  </div>
                </div>

                {/* Vertical Blueprints Sidebar */}
                <div className="space-y-4 px-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">DNA Blueprints</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {templates.slice(0, 6).map((t) => {
                      const isActive = prompt === t.prompt;
                      const Icon = getIconComponent(t.icon);
                      return (
                        <button
                          key={t.id}
                          onClick={() => setPrompt(t.prompt)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left border",
                            isActive
                              ? "bg-studio/10 border-studio/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                              : "bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5"
                          )}
                        >
                          <Icon className={cn("w-3.5 h-3.5", isActive ? "text-studio" : "text-zinc-600")} />
                          <span className={cn("text-[9px] font-black uppercase tracking-widest truncate", isActive ? "text-white" : "text-zinc-500")}>
                            {t.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative Canvas (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    CORE NARRATIVE CONCEPT
                  </label>
                  {prompt && (
                    <button
                      onClick={() => setPrompt('')}
                      className="text-[8px] font-black text-zinc-600 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                      Clear Canvas
                    </button>
                  )}
                </div>
                
                <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden group/textarea transition-all hover:border-white/10 shadow-2xl min-h-[550px] flex flex-col">
                  <div className="p-10 flex-1">
                    <TextareaAutosize
                      placeholder="Describe your core narrative vision, setting, and structural requirements..."
                      className="w-full bg-transparent border-none focus:ring-0 text-cyan-100 text-2xl font-medium resize-none transition-all leading-relaxed placeholder:text-zinc-800"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                  
                  {/* Visual Hint Section */}
                  <div className="p-8 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                               <Sparkles className="w-3 h-3 text-zinc-700" />
                            </div>
                          ))}
                       </div>
                       <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Awaiting prompt parameters</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-black text-studio/40 uppercase tracking-[0.2em]">Neural Capacity: 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'template':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between border-b border-white/5 pb-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full">
                  <LayoutGrid className="w-3 h-3 text-fuchsia-400" />
                  <span className="text-[9px] font-black text-fuchsia-400 uppercase tracking-[0.2em]">Blueprint Repository</span>
                </div>
                <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
                  TEMPLATE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-studio to-fuchsia-500">MATRIX</span>
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((t, idx) => (
                <TemplateCard
                  key={`${t.id}-${idx}`}
                  template={t as any}
                  idx={idx}
                  handleUsePrompt={(p) => {
                    setPrompt(p);
                    setSearchParams({ tab: 'status' });
                  }}
                  setShowTemplateDetails={(id) => setSelectedTemplateId(Number(id))}
                />
              ))}
            </div>

            {selectedTemplate && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                <div className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                  <div className="absolute top-8 right-8 z-20">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedTemplateId(null)} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white">
                      <Settings className="w-5 h-5 rotate-45" />
                    </Button>
                  </div>

                  <div className="p-12 overflow-y-auto engine-scrollbar">
                    <div className="flex flex-col md:flex-row gap-12">
                      <div className="w-full md:w-1/3 space-y-6">
                        <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center border shadow-2xl", selectedTemplate.bg, selectedTemplate.border)}>
                          {(() => {
                            const Icon = getIconComponent(selectedTemplate.icon);
                            return <Icon className={cn("w-10 h-10", selectedTemplate.color)} />;
                          })()}
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{selectedTemplate.name}</h2>
                          <p className="text-[10px] font-black text-studio uppercase tracking-[0.3em]">{selectedTemplate.category} Blueprint</p>
                        </div>
                        <div className="pt-6 space-y-4">
                          {selectedTemplate.stats && Object.entries(selectedTemplate.stats).map(([key, val]) => (
                            <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{key}</span>
                              <span className="text-[10px] font-mono font-bold text-white uppercase">{val as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Core Directive</h4>
                          <div className="p-8 bg-black border border-white/5 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-studio" />
                            <p className="text-lg text-zinc-300 font-medium leading-relaxed italic">"{selectedTemplate.prompt}"</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Neural Elements</h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedTemplate.elements.map(el => (
                              <span key={el} className="px-5 py-3 bg-studio/10 border border-studio/20 text-studio text-[10px] font-black uppercase tracking-widest rounded-xl">
                                {el}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-10 flex gap-4">
                          <Button
                            onClick={() => {
                              setPrompt(selectedTemplate.prompt);
                              setSearchParams({ tab: 'status' });
                              setSelectedTemplateId(null);
                            }}
                            className="h-16 px-12 bg-white text-black hover:bg-zinc-200 text-[11px] font-black uppercase tracking-[0.25em] rounded-full flex-1"
                          >
                            Deploy Foundation
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedTemplateId(null)}
                            className="h-16 px-10 bg-transparent border-zinc-800 text-zinc-500 hover:text-white rounded-full text-[11px] font-black uppercase tracking-[0.25em]"
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-12">
              <VaultView />
            </div>
          </div>
        );
      case 'console':
        return <EngineConsole />;
      case 'calibration':
        return <EngineCalibration />;
      case 'optimization':
        return <EngineOptimization />;
      case 'logs':
        return <EngineLogs />;
      default:
        return null;
    }
  };

  return (
    <div data-testid="marker-engine-config">
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




