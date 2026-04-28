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
  Brain,
  X,
  Target,
  Users,
  Settings,
  Clapperboard,
  SlidersHorizontal,
  History,
  Sword,
  Globe,
  PanelRightClose
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';

const ANIME_TEMPLATES = [
  { id: 'shonen', label: 'Shonen Catalyst', icon: Sword, prompt: 'Synthesize a high-velocity battle narrative focused on elemental energy mastery and hierarchical tournament structures.', color: 'text-orange-500' },
  { id: 'isekai', label: 'Isekai Revision', icon: Globe, prompt: 'Architect a cross-dimensional regression saga featuring a modern-day specialist navigating a low-fantasy political landscape.', color: 'text-purple-500' },
  { id: 'cyberpunk', label: 'Cyber Pulse', icon: Sword, prompt: 'Design a gritty neon-metropolis investigation involving neural-interface conspiracy and megacorporation dominance.', color: 'text-cyan-500' },
  { id: 'slice', label: 'Ghost Resonance', icon: Sword, prompt: 'Generate a supernatural school-life drama centering on localized urban legends and group-based mystery solving.', color: 'text-green-500' },
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
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  handleSaveCurrent: () => void;
  isLoading: boolean;
  isSaving: boolean;
  generatedScript: string | null;
  currentScriptId: string | null;
  user: any;
  contentType: string;
  setContentType?: (type: string) => void;
  showNotification?: (msg: string, type: any) => void;
}

export const ProductionCore: React.FC<ProductionCoreProps> = ({
  isOpen,
  onToggle,
  prompt, setPrompt,
  tone, setTone,
  audience, setAudience,
  selectedModel, setSelectedModel,
  handleSaveCurrent,
  isSaving,
  generatedScript,
  currentScriptId,
  user,
  contentType,
  setContentType,
}) => {
  const [localContentType, setLocalContentType] = React.useState(contentType || 'Anime');

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

              {/* SELECT STUDIO TYPE */}
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
                <label className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 glow-text">
                  <Sparkles className="w-3.5 h-3.5" />
                  QUICK TEMPLATES
                </label>
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
                <label
                  className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 transition-colors glow-text"
                >
                  <Target className="w-3.5 h-3.5" />
                  CONCEPT
                </label>
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
                      <SelectItem value="Gemini-2.5-Flash">G2.0 Flash (Next-Gen Hub)</SelectItem>
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
                <div className="space-y-1 col-span-2">
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
              </div>

              {/* ACTIONS */}
              <div className="pt-8 space-y-3">
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
