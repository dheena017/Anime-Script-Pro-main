import { useContext, useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Sparkles, Brain, Target, Settings, Clapperboard,
  Sword, Globe, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/hooks/useGenerator';
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
import { EngineContext } from './Engine/EngineLayout';

// Tabs
import { EngineTab } from '@/pages/studio/components/Engine/Tabs/EngineTabs';
import { EngineConsole } from './Engine/tabs/EngineConsole';
import { EngineCalibration } from './Engine/tabs/EngineCalibration';
import { EngineOptimization } from './Engine/tabs/EngineOptimization';
import { EngineLogs } from './Engine/tabs/EngineLogs';
import { motion } from 'motion/react';


const ANIME_TEMPLATES = [
  { id: 'shonen', label: 'Shonen Catalyst', icon: Sword, prompt: 'Synthesize a high-velocity battle narrative focused on elemental energy mastery and hierarchical tournament structures.', color: 'text-orange-500' },
  { id: 'isekai', label: 'Isekai Revision', icon: Globe, prompt: 'Architect a cross-dimensional regression saga featuring a modern-day specialist navigating a low-fantasy political landscape.', color: 'text-purple-500' },
  { id: 'cyberpunk', label: 'Cyber Pulse', icon: Sword, prompt: 'Design a gritty neon-metropolis investigation involving neural-interface conspiracy and megacorporation dominance.', color: 'text-cyan-500' },
  { id: 'slice', label: 'Ghost Resonance', icon: Sword, prompt: 'Generate a supernatural school-life drama centering on localized urban legends and group-based mystery solving.', color: 'text-green-500' },
  { id: 'psych', label: 'Synapse Thriller', icon: Brain, prompt: 'Engineer a psychological thriller exploring reality-bending dream manipulation and forensic memory analysis.', color: 'text-blue-500' },
];

export function EnginePage() {
  const { activeTab } = useOutletContext<{ activeTab: EngineTab }>();
  const { setHandlers } = useContext(EngineContext);
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    tone, setTone,
    setIsSaving,
    generatedScript,
    setCurrentScriptId,
    selectedModel, setSelectedModel,
    prompt: globalPrompt,
    setPrompt: setGlobalPrompt,
    setContentType: setGlobalContentType
  } = useGenerator();

  const [prompt, setPrompt] = useState(globalPrompt || '');
  const [localContentType, setLocalContentType] = useState('Anime');

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'status':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between border-b border-white/5 pb-10 mb-12">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-studio/10 border border-studio/20 rounded-full">
                  <Sparkles className="w-3 h-3 text-studio" />
                  <span className="text-[9px] font-black text-studio uppercase tracking-[0.2em]">Master Engine Configuration</span>
                </div>
                <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
                  PRODUCTION <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-fuchsia-500 to-studio">BLUEPRINT</span>
                </h1>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Clapperboard className="w-4 h-4" />
                      STUDIO SELECTION
                    </label>
                    <Select value={localContentType} onValueChange={(val) => setLocalContentType(val || 'Anime')}>
                      <SelectTrigger className="h-14 bg-zinc-900/50 border-zinc-800 text-cyan-100 rounded-2xl focus:border-studio/50 transition-all">
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
                    <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      NEURAL SYNTH ENGINE
                    </label>
                    <Select value={selectedModel} onValueChange={(val) => setSelectedModel(val || 'Gemini-2.5-Flash')}>
                      <SelectTrigger className="h-14 bg-zinc-900/50 border-zinc-800 text-cyan-100 rounded-2xl focus:border-studio/50 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-zinc-800">
                        <SelectItem value="gemini-3.1-pro" className="text-fuchsia-400 font-bold">G3.1 Pro (Ultra-Gen Intelligence)</SelectItem>
                        <SelectItem value="gemini-3.1-flash" className="text-cyan-400 font-bold">G3.1 Flash (Hyper-Speed Lite)</SelectItem>
                        <SelectItem value="gemini-3-pro" className="text-fuchsia-300">G3.0 Pro (Advanced Reasoning)</SelectItem>
                        <SelectItem value="gemini-3-flash" className="text-cyan-300">G3.0 Flash (Rapid Production)</SelectItem>
                        <SelectItem value="gemini-2.0-pro-exp-02-05" className="text-zinc-300">G2.0 Pro (Elite Intelligence)</SelectItem>
                        <SelectItem value="Gemini-2.5-Flash" className="text-zinc-400">G2.0 Flash (Next-Gen Hub)</SelectItem>
                        <SelectItem value="gemini-1.5-pro" className="text-zinc-500">G1.5 Pro (Legacy Elite)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      NARRATIVE TONE
                    </label>
                    <Select value={tone} onValueChange={(val) => setTone(val || 'Hype/Energetic')}>
                      <SelectTrigger className="h-14 bg-zinc-900/50 border-zinc-800 text-cyan-100 rounded-2xl focus:border-studio/50 transition-all">
                        <SelectValue placeholder="Hype/Energetic" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-zinc-800">
                        <SelectItem value="Hype/Energetic">Hype / Action</SelectItem>
                        <SelectItem value="Dark/Gritty">Dark / Seinen</SelectItem>
                        <SelectItem value="Emotional/Sad">Emotional / Drama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Real-time Pipeline Status */}
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <Activity className="w-4 h-4 text-studio" />
                      Neural Production Pipeline
                    </h4>
                    <span className="text-[8px] font-black text-studio uppercase tracking-widest animate-pulse">Syncing Active State...</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {[
                      { label: 'Engine', status: prompt ? 'active' : 'standby' },
                      { label: 'World', status: useGenerator().worldLore ? 'active' : 'standby' },
                      { label: 'Cast', status: useGenerator().castProfiles ? 'active' : 'standby' },
                      { label: 'Series', status: useGenerator().seriesPlan ? 'active' : 'standby' },
                      { label: 'Script', status: useGenerator().generatedScript ? 'active' : 'standby' },
                      { label: 'Storyboard', status: useGenerator().storyboardPrompts ? 'active' : 'standby' },
                      { label: 'SEO', status: useGenerator().seoMetadata ? 'active' : 'standby' },
                    ].map((stage) => (
                      <div key={stage.label} className={cn(
                        "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-500",
                        stage.status === 'active'
                          ? "bg-studio/10 border-studio/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                          : "bg-black/40 border-white/5 opacity-40 grayscale"
                      )}>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          stage.status === 'active' ? "bg-studio shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "bg-zinc-700"
                        )} />
                        <span className="text-[8px] font-black uppercase tracking-widest text-center">{stage.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    CORE NARRATIVE CONCEPT
                  </label>
                  <div className="bg-[#050505] border border-white/5 rounded-[3rem] overflow-hidden group/textarea transition-all hover:border-white/10 shadow-2xl">
                    <div className="p-10 pb-4">
                      <TextareaAutosize
                        placeholder="Describe your core narrative vision, setting, and structural requirements..."
                        className="w-full min-h-[250px] bg-transparent border-none focus:ring-0 text-cyan-100 text-xl font-medium resize-none transition-all leading-relaxed placeholder:text-zinc-700"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>
                    <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-end gap-4">
                      {prompt && (
                        <button 
                          onClick={() => setPrompt('')} 
                          className="h-16 px-10 flex items-center justify-center bg-zinc-900/50 hover:bg-zinc-800 rounded-full transition-all border border-white/5 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                          Clear
                        </button>
                      )}
                      <Button
                        onClick={() => {
                          setGlobalPrompt(prompt);
                          setGlobalContentType(localContentType);
                          navigate('/anime/world');
                        }}
                        disabled={!prompt}
                        className={cn(
                          "h-16 px-12 bg-[#0070FF] hover:bg-[#0060EE] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-full transition-all shadow-[0_10px_40px_rgba(0,112,255,0.3)] gap-3 border-none",
                          !prompt && "opacity-20 grayscale pointer-events-none"
                        )}
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate Production Blueprint
                      </Button>
                    </div>
                  </div>

                  <div className="pt-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Clapperboard className="w-3.5 h-3.5 text-studio/50" />
                        Production DNA Blueprints
                      </h4>
                      <span className="text-[8px] font-bold text-studio/30 uppercase tracking-widest">Select Narrative Foundation</span>
                    </div>
                    <motion.div className="flex flex-nowrap gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                      {ANIME_TEMPLATES.map((t) => {
                        const isActive = prompt === t.prompt;
                        return (
                          <motion.button 
                            key={t.id} 
                            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} 
                            onClick={() => setPrompt(t.prompt)} 
                            className={cn(
                              "flex-shrink-0 snap-start flex items-center gap-4 px-10 py-6 rounded-full transition-all duration-500 group/dna relative",
                              isActive 
                                ? "bg-blue-500/10 border border-blue-500/30 shadow-[0_0_30px_rgba(0,112,255,0.1)]" 
                                : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                            )}
                          >
                            {isActive && <div className="absolute top-4 right-6 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                            <t.icon className={cn(
                              "w-4 h-4 transition-all duration-500", 
                              isActive ? "text-blue-400" : "text-zinc-600 group-hover/dna:text-zinc-400"
                            )} />
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500", 
                              isActive ? "text-white" : "text-zinc-500 group-hover/dna:text-zinc-400"
                            )}>{t.label}</span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </div>
                </div>
              </div>
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

