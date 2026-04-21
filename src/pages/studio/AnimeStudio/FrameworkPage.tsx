import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LayoutGrid, Sparkles, Wand2, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const frameworkMarkdown = `
# Cinematic Anime Production Framework

Advanced algorithmic methodology for high-speed anime production.

## Step 1: Narrative Engineering
- **Structural Mapping:** Deploy the 3-act cinematic model with distinct emotional peaks.
- **Atmospheric Anchoring:** Define the environmental sub-text (lighting, particle density, color palette).
- **Stakes Calibration:** Ensure every scene contributes to the overall tension or character growth.

## Step 2: Neural Scene Synthesis
1. **Scene Matrix:** Establish spatial coordinates and time markers.
2. **Actor Profiles:** Deployment of current cast DNA with active emotional states.
3. **Dialogue Convergence:** Phase-aware speech patterns and sub-textual exchanges.
4. **Cinematic Cues:** Camera angles, light-tracing, and specialized power effects.

## Step 3: Production Mainland
- **Choreography:** Algorithmic movement descriptions for action reliability.
- **Echoes:** Subtle foreshadowing and lore integration units.
- **The Hook:** High-retention closing frames for episode continuity.
`;

export function FrameworkPage() {
  const [isLiked, setIsLiked] = React.useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" data-testid="marker-production-framework">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-2 text-cyan-50 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <LayoutGrid className="w-6 h-6 text-cyan-400" />
          Production Framework
        </h2>
      </div>

      <Card className="bg-[#050505]/50 border border-cyan-500/10 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[700px]">
        <div className="p-4 border-b border-zinc-800/80 bg-[#0a0a0a]/80 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-cyan-500 shadow-sm shadow-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/30">
              <Wand2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Scene-by-Scene Methodology</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-300 border border-transparent",
                isLiked ? "text-cyan-400 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "text-zinc-600 hover:text-cyan-400 hover:bg-zinc-800/50"
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </Button>
          </div>
          
          <Button 
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest uppercase text-[10px]"
            size="sm"
          >
            <Sparkles className="w-3 h-3 mr-2" />
            Generate
          </Button>
        </div>
        <div className="w-full p-8 bg-[#050505]/50">
          <div className="prose prose-invert prose-cyan max-w-none prose-h1:text-cyan-400 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{frameworkMarkdown}</ReactMarkdown>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
