import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Brain, 
  X, 
  Target, 
  Users, 
  Settings, 
  Clapperboard, 
  SlidersHorizontal, 
  History, 
  Sword, 
  Globe 
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

const ANIME_TEMPLATES = [
  { id: 'shonen', label: 'Shonen Catalyst', icon: Sword, prompt: 'Synthesize a high-velocity battle narrative focused on elemental energy mastery and hierarchical tournament structures.', color: 'text-orange-500' },
  { id: 'isekai', label: 'Isekai Revision', icon: Globe, prompt: 'Architect a cross-dimensional regression saga featuring a modern-day specialist navigating a low-fantasy political landscape.', color: 'text-purple-500' },
  { id: 'cyberpunk', label: 'Cyber Pulse', icon: Sword, prompt: 'Design a gritty neon-metropolis investigation involving neural-interface conspiracy and megacorporation dominance.', color: 'text-cyan-500' },
  { id: 'slice', label: 'Ghost Resonance', icon: Sword, prompt: 'Generate a supernatural school-life drama centering on localized urban legends and group-based mystery solving.', color: 'text-green-500' },
  { id: 'psych', label: 'Synapse Thriller', icon: Brain, prompt: 'Engineer a psychological thriller exploring reality-bending dream manipulation and forensic memory analysis.', color: 'text-blue-500' },
];

// Sub-components
import { EngineHeader } from '../components/Engine/EngineHeader';

export function EnginePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = React.useState(false);
  
  const {
    prompt, setPrompt,
    tone, setTone,
    audience, setAudience,
    selectedModel, setSelectedModel,
    contentType, setContentType,
    isSaving, setIsSaving,
    generatedScript,
    currentScriptId,
    setCurrentScriptId,
    session,
    episode
  } = useGenerator();

  const [localContentType, setLocalContentType] = React.useState(contentType || 'Anime');

  React.useEffect(() => {
    if (setContentType) setContentType(localContentType);
  }, [localContentType, setContentType]);

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
          vibe: tone
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      <EngineHeader 
        onNext={() => navigate('/anime/world')}
        session={session}
        episode={episode}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
      />

      <Card className="bg-[#030303] border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 hover:border-studio/50">
        <div className="absolute inset-0 border-[1px] border-studio/20 rounded-[2.5rem] pointer-events-none group-hover/card:border-studio/40 transition-colors duration-700" />
        <div className="absolute -top-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-studio/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-[1400px] mx-auto">
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

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Main Config Column */}
                <div className="lg:col-span-3 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* STUDIO TYPE */}
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Clapperboard className="w-4 h-4" />
                        STUDIO SELECTION
                      </label>
                      <Select value={localContentType} onValueChange={setLocalContentType}>
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

                    {/* MODEL */}
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        NEURAL MODEL
                      </label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="h-14 bg-zinc-900/50 border-zinc-800 text-cyan-100 rounded-2xl focus:border-studio/50 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-800">
                          <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Most Stable)</SelectItem>
                          <SelectItem value="gemini-2.0-flash-exp">Gemini 2.0 Flash</SelectItem>
                          <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                          <SelectItem value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro Elite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* CONCEPT AREA */}
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      CORE NARRATIVE CONCEPT
                    </label>
                    <div className="relative group/textarea">
                      <TextareaAutosize
                        placeholder="Describe your core narrative vision, setting, and structural requirements..."
                        className="w-full min-h-[250px] bg-black/40 border border-zinc-800/80 focus:border-studio/50 text-cyan-100 rounded-[2.5rem] p-10 text-lg font-medium resize-none transition-all shadow-inner leading-relaxed"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                      {prompt && (
                        <button 
                          onClick={() => setPrompt('')}
                          className="absolute top-8 right-8 p-3 bg-zinc-900/80 rounded-2xl opacity-0 group-hover/textarea:opacity-100 hover:text-studio transition-all border border-zinc-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                  <div className="p-8 bg-studio/5 border border-studio/10 rounded-[2.5rem] space-y-8">
                    <h4 className="text-[11px] font-black text-studio uppercase tracking-widest flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      TUNING PARAMS
                    </h4>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">NARRATIVE TONE</label>
                        <Select value={tone} onValueChange={setTone}>
                          <SelectTrigger className="h-10 bg-black/40 border-zinc-800/50 text-cyan-200 text-xs rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-950 border-zinc-800">
                            <SelectItem value="Hype/Energetic">Hype / Action</SelectItem>
                            <SelectItem value="Dark/Gritty">Dark / Seinen</SelectItem>
                            <SelectItem value="Emotional/Sad">Emotional / Drama</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">TARGET AUDIENCE</label>
                        <Select value={audience} onValueChange={setAudience}>
                          <SelectTrigger className="h-10 bg-black/40 border-zinc-800/50 text-cyan-200 text-xs rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-950 border-zinc-800">
                            <SelectItem value="General Fans">General Shonen</SelectItem>
                            <SelectItem value="Hardcore Weebs">Elite / Seinen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-studio/10">
                      <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase italic">
                        These parameters calibrate the Neural Engine for specific stylistic variance.
                      </p>
                    </div>
                  </div>

                  {/* QUICK BLUEPRINTS */}
                  <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] space-y-6">
                    <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">BLUEPRINT DNA</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {ANIME_TEMPLATES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setPrompt(t.prompt)}
                          className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-white/5 hover:border-studio/30 hover:bg-studio/5 transition-all text-left group/btn"
                        >
                          <t.icon className={cn("w-4 h-4", t.color)} />
                          <span className="text-[10px] font-black text-zinc-400 uppercase group-hover/btn:text-white transition-colors">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {generatedScript && (
                <div className="mt-12 pt-12 border-t border-white/5 flex justify-center">
                  <Button
                    onClick={handleSaveCurrent}
                    disabled={isSaving}
                    className="h-14 px-12 bg-studio/10 hover:bg-studio text-studio hover:text-black border border-studio/30 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-4 shadow-studio/10"
                  >
                    <History className="w-5 h-5" />
                    {isSaving ? 'SYNCING ARCHIVE...' : (currentScriptId ? 'UPDATE MASTER BLUEPRINT' : 'ARCHIVE ENGINE CONFIG')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
