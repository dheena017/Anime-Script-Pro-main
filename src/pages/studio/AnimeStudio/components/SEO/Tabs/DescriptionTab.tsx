import React from 'react';
import { MonitorPlay } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DescriptionTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const DescriptionTab: React.FC<DescriptionTabProps> = ({ content, isGenerating, onGenerate }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
            Manifest Description
          </h3>
          <p className="text-[10px] text-zinc-500 mt-2">A polished YouTube description with timestamps, CTA, and social hooks.</p>
        </div>

        <Button
          size="sm"
          className="h-11 bg-fuchsia-600 text-white hover:bg-fuchsia-500 font-black tracking-[0.2em] uppercase text-[10px] shadow-[0_0_25px_rgba(192,38,211,0.4)] border border-white/20 px-8 rounded-2xl transition-all duration-300"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
          ) : (
            <MonitorPlay className="w-4 h-4 mr-3" />
          )}
          {isGenerating ? 'Inscribing...' : 'Generate'}
        </Button>
      </div>

      <Card className={cn(
        'bg-[#050505]/50 border transition-all duration-700 backdrop-blur-3xl overflow-hidden relative rounded-[2.5rem] group/card min-h-[500px]',
        content ? 'border-fuchsia-500/30 shadow-[0_0_40px_rgba(192,38,211,0.1)]' : 'border-white/5 hover:border-fuchsia-500/20'
      )}>
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="relative z-10 p-10 h-full">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-fuchsia-700 animate-in fade-in duration-500">
              <div className="w-12 h-12 border-4 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(217,70,239,0.3)]" />
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-400 mb-3">Description Weaver Active</h4>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] leading-relaxed text-center max-w-[320px]">Drafting a high-conversion narrative that converts viewers into subscribers.</p>
            </div>
          ) : content ? (
            <div className="prose prose-invert prose-fuchsia max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000 prose-h1:text-fuchsia-400 prose-strong:text-fuchsia-300 prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-medium">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-zinc-700 group/empty">
              <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center mb-8 group-hover/empty:border-fuchsia-500/30 group-hover/empty:bg-fuchsia-500/5 transition-all duration-700">
                <MonitorPlay className="w-8 h-8 opacity-20 group-hover/empty:opacity-60 transition-opacity" />
              </div>
              <p className="font-black uppercase tracking-[0.3em] text-[10px] max-w-[220px] text-center leading-loose">Generate a conversion-focused description for your anime release.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};


