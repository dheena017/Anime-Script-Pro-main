import React from 'react';
import '@/styles/creative-engine.css';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Sparkles,
  Target,
  X,
  Brain,
  ScrollText,
  Users,
  Settings,
  Clapperboard,
  Disc,
  SlidersHorizontal,
  History,
  Sword,
  Globe,
  Zap,
  Ghost,
  Layers,
  PanelRightClose,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NARRATIVE_TEMPLATES } from '@/constants';
import { callAI } from '@/services/generators/core';
import TextareaAutosize from 'react-textarea-autosize';

const ANIME_TEMPLATES = [
  { id: 'shonen', label: 'Shonen Catalyst', icon: Sword, prompt: 'Synthesize a high-velocity battle narrative focused on elemental energy mastery and hierarchical tournament structures.', color: 'text-orange-500' },
  { id: 'isekai', label: 'Isekai Revision', icon: Globe, prompt: 'Architect a cross-dimensional regression saga featuring a modern-day specialist navigating a low-fantasy political landscape.', color: 'text-purple-500' },
  { id: 'cyberpunk', label: 'Cyber Pulse', icon: Zap, prompt: 'Design a gritty neon-metropolis investigation involving neural-interface conspiracy and megacorporation dominance.', color: 'text-cyan-500' },
  { id: 'slice', label: 'Ghost Resonance', icon: Ghost, prompt: 'Generate a supernatural school-life drama centering on localized urban legends and group-based mystery solving.', color: 'text-green-500' },
  { id: 'psych', label: 'Synapse Thriller', icon: Brain, prompt: 'Engineer a psychological thriller exploring reality-bending dream manipulation and forensic memory analysis.', color: 'text-blue-500' },
];

interface ProductionCoreProps {
  isOpen: boolean;
  onToggle: () => void;
  prompt: string;
  setPrompt: (p: string) => void;
  tone: string;
  setTone: (t: string) => void;
  audience: string;
  setAudience: (a: string) => void;
  session: string;
  setSession: (s: string) => void;
  episode: string;
  setEpisode: (e: string) => void;
  numScenes: string;
  setNumScenes: (n: string) => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  recapperPersona: string;
  setRecapperPersona: (p: string) => void;
  narrativeBeats: string;
  setNarrativeBeats: (b: string) => void;
  characterRelationships: string;
  setCharacterRelationships: (r: string) => void;
  worldBuilding: string;
  setWorldBuilding?: (w: string) => void;
  castProfiles: string;
  setCastProfiles?: (c: string) => void;
  handleGenerate: () => void;
  handleMasterGenerate: () => void;
  handleSaveCurrent: () => void;
  isLoading: boolean;
  isSaving: boolean;
  generatedScript: string | null;
  currentScriptId: string | null;
  user: any;
  basePath: string;
  navigate: (path: string) => void;
  contentType: string;
  setContentType?: (type: string) => void;
  showNotification?: (msg: string, type: any) => void;
  theme: string;
  setTheme: (t: string) => void;
}

export const ProductionCore: React.FC<ProductionCoreProps> = ({
  isOpen,
  onToggle,
  prompt, setPrompt,
  tone, setTone,
  audience, setAudience,
  session, setSession,
  episode, setEpisode,
  numScenes, setNumScenes,
  selectedModel, setSelectedModel,
  recapperPersona, setRecapperPersona,
  narrativeBeats, setNarrativeBeats,
  characterRelationships, setCharacterRelationships,
  worldBuilding, setWorldBuilding,
  castProfiles, setCastProfiles,
  handleGenerate,
  handleMasterGenerate,
  handleSaveCurrent,
  isLoading,
  isSaving,
  generatedScript,
  currentScriptId,
  user,
  basePath,
  navigate,
  contentType,
  setContentType,
  showNotification,
  theme,
  setTheme
}) => {
  const [localContentType, setLocalContentType] = React.useState(contentType || 'Anime');
  const [aiLoading, setAiLoading] = React.useState(false);

  React.useEffect(() => {
    if (setContentType) setContentType(localContentType);
  }, [localContentType, setContentType]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sidebarContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Right Sidebar Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[390]"
          />

          <motion.aside
            initial={{ x: 450, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 450, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-[420px] lg:w-[480px] glass-panel border-l border-cyan-500/20 flex flex-col z-[400] shadow-[-20px_0_100px_rgba(0,0,0,1)] overflow-hidden"
          >
            {/* HEADER SECTION */}
            <div className="p-8 border-b border-cyan-500/10 flex items-center justify-between bg-gradient-to-b from-cyan-500/[0.03] to-transparent shrink-0">
              <div className="space-y-1">
                <h1 className="text-xl font-black text-cyan-400 uppercase tracking-[0.25em] drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                  Creative Engine
                </h1>
                <p className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-widest">
                  Creative Engine / Series Config
                </p>
              </div>
              <button
                onClick={onToggle}
                className="p-2 text-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
              >
                <PanelRightClose className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-4 pb-40">

              {/* STUDIO TYPE SELECT */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 glow-text">
                  <Clapperboard className="w-3.5 h-3.5" />
                  SELECT STUDIO TYPE
                </label>
                <Select value={localContentType} onValueChange={(val) => { if (val) setLocalContentType(val); }}>
                  <SelectTrigger className="h-10 bg-black/40 border-cyan-500/20 text-cyan-200 hover:border-cyan-500/50 transition-all font-bold tracking-widest text-xs uppercase rounded-xl neo-border">
                    <SelectValue placeholder="Anime" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-cyan-500/20 text-cyan-300">
                    <SelectItem value="Anime">Anime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* QUICK TEMPLATES */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 glow-text">
                    <Sparkles className="w-3.5 h-3.5" />
                    QUICK TEMPLATES
                  </label>
                  <button
                    onClick={() => navigate(`${basePath}/template`)}
                    className="text-[9px] font-black text-cyan-500/60 hover:text-cyan-400 uppercase tracking-widest underline decoration-cyan-500/30"
                  >
                    BROWSE LIBRARY
                  </button>
                </div>
                <Select 
                  key={prompt}
                  onValueChange={(value) => {
                    if (!value) return;
                    const selected = ANIME_TEMPLATES.find(t => t.id === value);
                    if (selected) {
                      setPrompt(selected.prompt);
                    }
                  }}
                >
                  <SelectTrigger className="h-10 bg-black/40 border-cyan-500/20 text-cyan-200 hover:border-cyan-500/50 transition-all font-bold tracking-widest text-xs uppercase rounded-xl neo-border">
                    <SelectValue placeholder="Select Blueprint..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-cyan-500/20 text-cyan-300">
                    {ANIME_TEMPLATES.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        <div className="flex items-center gap-2">
                          <t.icon className={cn("w-3 h-3", t.color)} />
                          <span>{t.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* CONCEPT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 transition-colors glow-text"
                  >
                    <Target className="w-3.5 h-3.5" />
                    CONCEPT
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        setAiLoading(true);
                        try {
                          const sys = `You are a High-Dimensional Creative Architect for a professional ${localContentType} studio.
                    Synthesize a complete, high-end production framework. 
                    Return ONLY a JSON object with these EXACT keys: 
                    'concept' (narrative hook), 
                    'theme' (aesthetic/visual style), 
                    'beats' (episodic scaffolding), 
                    'world' (lore/history), 
                    'cast' (character visual DNA), 
                    'relationships' (ideological frictions), 
                    'persona' (narrator voice).`;
                          
                          const res = await callAI(selectedModel, `Execute full Omni-Surge for: ${prompt || 'a new project'}`, sys);
                          const data = JSON.parse(res.match(/\{[\s\S]*\}/)?.[0] || res);
                          
                          if (data.concept) setPrompt(data.concept);
                          if (data.theme) setTheme(data.theme);
                          if (data.beats) setNarrativeBeats(data.beats);
                          if (data.world) setWorldBuilding?.(data.world);
                          if (data.cast) setCastProfiles?.(data.cast);
                          if (data.relationships) setCharacterRelationships(data.relationships);
                          if (data.persona) setRecapperPersona(data.persona);
                          
                          showNotification?.("Full Production Bible Synthesized.", "success");
                        } catch (e) { 
                          console.error(e);
                          showNotification?.("Synthesis Failure: Check logs.", "error");
                        }
                        setAiLoading(false);
                      }}
                      disabled={aiLoading}
                      className="text-[8px] font-black text-fuchsia-400 bg-fuchsia-500/5 border border-fuchsia-500/20 px-2 py-1 rounded hover:bg-fuchsia-500/10 transition-all tracking-tighter disabled:opacity-20"
                    >
                      {aiLoading ? "SYNT..." : "Omni-Surge (Synthesize All)"}
                    </button>
                    <button
                      onClick={handleMasterGenerate}
                      disabled={isLoading}
                      className="text-[8px] font-black text-cyan-400 bg-cyan-500/5 border border-cyan-500/20 px-2 py-1 rounded hover:bg-cyan-500/10 transition-all tracking-tighter disabled:opacity-20"
                    >
                      Initiate Master Production Loop
                    </button>
                  </div>
                </div>
                <div className="relative group">
                  <TextareaAutosize
                    placeholder="Describe your core narrative concept and structural requirements..."
                    className="w-full min-h-[100px] max-h-[300px] overflow-y-auto hide-scrollbar bg-black border border-cyan-500/20 focus:border-cyan-500/50 text-cyan-100 placeholder:text-zinc-800 rounded-2xl p-4 text-xs font-medium resize-none transition-all shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <button onClick={() => setPrompt('')} className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-cyan-500 transition-all">
                    <span className="text-[10px] font-black uppercase mr-2">Clear</span>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* THEME */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 transition-colors glow-text">
                  <Sparkles className="w-3.5 h-3.5" />
                  THEME / AESTHETIC
                </label>
                <div className="relative group">
                  <TextareaAutosize
                    placeholder="Define visual style, atmospheric direction, and stylistic cues..."
                    className="w-full min-h-[80px] max-h-[250px] overflow-y-auto hide-scrollbar bg-black border border-cyan-500/20 focus:border-cyan-500/50 text-cyan-100 placeholder:text-zinc-800 rounded-2xl p-4 text-xs font-medium resize-none transition-all shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  />
                  <button onClick={() => setTheme('')} className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-cyan-500 transition-all">
                    <span className="text-[10px] font-black uppercase mr-2">Clear</span>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* NARRATIVE BEATS CARD */}
              <div className="p-5 rounded-3xl bg-cyan-500/[0.02] border border-cyan-500/20 space-y-3 shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all hover:bg-cyan-500/[0.04]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ScrollText className="w-3.5 h-3.5" />
                    NARRATIVE BEATS
                  </label>
                  <button
                    onClick={() => navigate(`${basePath}/beats`)}
                    className="text-[8px] font-black text-cyan-500/40 hover:text-cyan-400 uppercase transition-colors"
                  >
                    Browse Beats
                  </button>
                </div>

                <div className="flex overflow-x-auto hide-scrollbar gap-1.5 pb-1">
                  {Object.entries(NARRATIVE_TEMPLATES).map(([name, val]) => (
                    <button
                      key={name}
                      onClick={() => setNarrativeBeats(val)}
                      className="px-2.5 py-1 rounded-full bg-black border border-cyan-500/10 text-[8px] font-black text-cyan-500/60 uppercase tracking-widest hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
                    >
                      {name}
                    </button>
                  ))}
                </div>

                <TextareaAutosize
                  placeholder="Define the logical flow of narrative beats (e.g. Phase 1 -> Phase 2 -> Peak -> Resolution)..."
                  className="w-full min-h-[140px] max-h-[400px] overflow-y-auto hide-scrollbar bg-black/60 border border-cyan-500/10 focus:border-cyan-500/40 text-cyan-200/80 text-[10px] rounded-xl p-3 resize-none font-medium transition-all"
                  value={narrativeBeats}
                  onChange={(e) => setNarrativeBeats(e.target.value)}
                />
              </div>

              {/* WORLD BUILDING */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    WORLD BUILDING
                  </label>
                  <button
                    onClick={() => navigate(`${basePath}/world`)}
                    className="h-7 px-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
                  >
                    Lore Matrix
                  </button>
                </div>
                <TextareaAutosize
                  placeholder="Establish world-logic, history, and environmental constraints..."
                  className="w-full min-h-[100px] max-h-[400px] overflow-y-auto hide-scrollbar bg-black border border-cyan-500/20 focus:border-cyan-500/50 text-cyan-100 rounded-2xl p-4 text-xs font-medium resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                  value={worldBuilding || ''}
                  onChange={(e) => setWorldBuilding?.(e.target.value)}
                />
              </div>

              {/* CAST PROFILES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    CAST PROFILES
                  </label>
                  <button onClick={() => navigate(`${basePath}/cast`)} className="text-[8px] font-black text-cyan-500/40 hover:text-cyan-400 uppercase">Lab</button>
                </div>
                <TextareaAutosize
                  placeholder="Define character identities, archetypes, and visual DNA..."
                  className="w-full min-h-[100px] max-h-[400px] overflow-y-auto hide-scrollbar bg-black border border-cyan-500/20 focus:border-cyan-500/50 text-cyan-100 rounded-2xl p-4 text-xs font-medium resize-none"
                  value={castProfiles || ''}
                  onChange={(e) => setCastProfiles?.(e.target.value)}
                />
              </div>

              {/* RELATIONSHIPS */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 glow-text">
                  <Layers className="w-3.5 h-3.5" />
                  RELATIONSHIPS
                </label>
                <TextareaAutosize
                  placeholder="Define interpersonal dynamics and ideological frictions between identities..."
                  className="w-full min-h-[80px] max-h-[300px] overflow-y-auto engine-scrollbar bg-black/40 border border-cyan-500/10 focus:border-cyan-500/40 text-cyan-100 rounded-2xl p-4 text-xs font-medium resize-none neo-border"
                  value={characterRelationships || ''}
                  onChange={(e) => setCharacterRelationships(e.target.value)}
                />
              </div>

              {/* PERSONA */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 glow-text">
                  <Brain className="w-3.5 h-3.5" />
                  NARRATOR PERSONA
                </label>
                <TextareaAutosize
                  placeholder="Establish the voice and narrative style of the engine (e.g. Cinematic, Noir, High-Octane)..."
                  className="w-full min-h-[80px] max-h-[300px] overflow-y-auto engine-scrollbar bg-black/40 border border-cyan-500/10 focus:border-cyan-500/40 text-cyan-100 rounded-2xl p-4 text-xs font-medium resize-none uppercase tracking-tighter neo-border"
                  value={recapperPersona}
                  onChange={(e) => setRecapperPersona(e.target.value)}
                />
              </div>

              {/* ADVANCE CONFIGS */}
              <div className="pt-8 border-t border-cyan-500/10 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-cyan-500/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Settings className="w-3 h-3" /> MODEL
                  </label>
                  <Select value={selectedModel} onValueChange={(val) => { if (val) setSelectedModel(val); }}>
                    <SelectTrigger className="h-9 bg-black border-cyan-500/10 text-cyan-200 text-[10px] font-bold uppercase rounded-xl">
                      <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-cyan-500/20 text-cyan-400">
                      <SelectItem value="gemini-2.0-pro-exp-02-05">G2.0 Pro (Elite Intelligence)</SelectItem>
                      <SelectItem value="gemini-2.0-flash-exp">G2.0 Flash (Next-Gen Hub)</SelectItem>
                      <SelectItem value="gemini-1.5-pro">G1.5 Pro (Legacy Elite)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-cyan-500/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <SlidersHorizontal className="w-3 h-3" /> TONE
                  </label>
                  <Select value={tone} onValueChange={(val) => { if (val) setTone(val); }}>
                    <SelectTrigger className="h-9 bg-black border-cyan-500/10 text-cyan-200 text-[10px] font-bold uppercase rounded-xl">
                      <SelectValue placeholder="Tone" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-cyan-500/20 text-cyan-400">
                      <SelectItem value="Hype/Energetic">Hype</SelectItem>
                      <SelectItem value="Dark/Gritty">Dark</SelectItem>
                      <SelectItem value="Emotional/Sad">Emotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-cyan-500/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Users className="w-3 h-3" /> AUDIENCE
                  </label>
                  <Select value={audience} onValueChange={(val) => { if (val) setAudience(val); }}>
                    <SelectTrigger className="h-9 bg-black border-cyan-500/10 text-cyan-200 text-[10px] font-bold uppercase rounded-xl">
                      <SelectValue placeholder="Audience" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-cyan-500/20 text-cyan-400">
                      <SelectItem value="General Fans">General</SelectItem>
                      <SelectItem value="Hardcore Weebs">Hardcore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-cyan-500/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Disc className="w-3 h-3" /> PROD
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <Select value={session} onValueChange={(val) => { if (val) setSession(val); }}>
                      <SelectTrigger className="h-9 bg-black border-cyan-500/10 text-cyan-200 text-[10px] font-bold rounded-xl pr-1">
                        <SelectValue placeholder="SESS" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border border-cyan-500/20 text-cyan-400">
                        {['1', '2', '3', '4'].map(s => <SelectItem key={s} value={s}>S{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={episode} onValueChange={(val) => { if (val) setEpisode(val); }}>
                      <SelectTrigger className="h-9 bg-black border-cyan-500/10 text-cyan-200 text-[10px] font-bold rounded-xl pr-1">
                        <SelectValue placeholder="EP" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border border-cyan-500/20 text-cyan-400">
                        {['1', '2', '3', '4'].map(e => <SelectItem key={e} value={e}>E{e}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[9px] font-black text-cyan-500/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Zap className="w-3 h-3" /> SCENES
                  </label>
                  <Select value={numScenes} onValueChange={(val) => { if (val) setNumScenes(val); }}>
                    <SelectTrigger className="h-9 bg-black border-cyan-500/10 text-cyan-200 text-[10px] font-bold rounded-xl">
                      <SelectValue placeholder="Number of Scenes" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border border-cyan-500/20 text-cyan-400">
                      {['4', '6', '8', '12', '16'].map(s => <SelectItem key={s} value={s}>{s} Scenes</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="pt-8 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="flex-1 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center gap-3 group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black text-white uppercase tracking-wider text-sm">Initiate Full Self-Construction</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        showNotification?.("Sending Pulse...", "info");
                        const res = await callAI(selectedModel, "Respond with: SYSTEM_ONLINE", "You are a diagnostic tool.");
                        if (res.includes("SYSTEM_ONLINE")) {
                          showNotification?.("AI Pulse Successful: System Online", "success");
                        } else {
                          showNotification?.("AI Pulse Received: " + res.slice(0, 30) + "...", "success");
                        }
                      } catch (e: any) {
                        showNotification?.("Pulse Failed: " + (e.message || "Unknown Error"), "error");
                      }
                    }}
                    className="w-14 h-14 bg-zinc-900 border border-cyan-500/20 rounded-2xl flex items-center justify-center hover:bg-zinc-800 transition-colors"
                    title="Test AI Connection"
                  >
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </button>
                </div>

                {generatedScript && (
                  <Button
                    onClick={handleSaveCurrent}
                    disabled={isSaving || !user}
                    className="w-full h-10 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-widest border border-zinc-800 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <History className="w-3.5 h-3.5" />
                    {isSaving ? 'Saving...' : (currentScriptId ? 'Update Script' : 'Push to Library')}
                  </Button>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(sidebarContent, document.body);
};
