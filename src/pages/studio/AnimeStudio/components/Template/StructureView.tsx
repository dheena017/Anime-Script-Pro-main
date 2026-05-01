import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StructureViewProps {
  templateMarkdown: string;
  isLiked: boolean;
  setIsLiked: (l: boolean) => void;
}

export const StructureView: React.FC<StructureViewProps> = ({
  templateMarkdown,
  isLiked,
  setIsLiked
}) => {
  return (
    <Card className="glass-panel border-cyan-500/10 shadow-[-20px_0_100px_rgba(0,0,0,0.5)] overflow-hidden min-h-[700px] relative">
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#22d3ee20_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee20_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />
      
      <div className="p-8 border-b border-cyan-500/10 bg-black/40 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Monitor className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em] glow-text">Standard Matrix</h3>
          </div>
          <p className="text-[10px] text-cyan-500/60 font-black uppercase tracking-[0.4em] ml-1">
            Global Production Standards v5.2 // System Core
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Badge className="bg-zinc-900 border-cyan-500/20 text-cyan-500/60 uppercase px-3 py-1 text-[9px] font-black tracking-widest">Protocol v5.2</Badge>
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 uppercase px-3 py-1 text-[9px] font-black tracking-widest glow-text">Verified</Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-2xl transition-all duration-300 border border-transparent",
              isLiked ? "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.3)]" : "text-zinc-600 hover:text-cyan-400 hover:bg-cyan-500/10"
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
          </Button>
        </div>
      </div>

      <div className="w-full p-0 relative z-10">
        <div className="p-8 lg:p-16 max-w-5xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="prose prose-invert max-w-none 
              prose-h1:font-black prose-h1:text-5xl prose-h1:uppercase prose-h1:tracking-tighter prose-h1:text-cyan-400 prose-h1:mb-12 prose-h1:glow-text
              prose-h2:font-black prose-h2:text-2xl prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:text-white prose-h2:mt-16 prose-h2:border-l-4 prose-h2:border-cyan-500 prose-h2:pl-6
              prose-strong:text-cyan-300 prose-strong:font-black
              prose-li:text-zinc-400 prose-li:font-medium prose-li:text-lg
              prose-table:border-cyan-500/10 prose-th:bg-cyan-950/20 prose-th:text-cyan-400 prose-th:font-black prose-th:uppercase prose-th:tracking-widest prose-th:text-[11px] prose-th:p-4
              prose-td:p-4 prose-td:border-cyan-500/5
            ">
              <div className="mb-16 flex justify-start">
                 <div className="inline-block px-6 py-2 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                   Technical Specification // Unit: Standard
                 </div>
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{templateMarkdown}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};


