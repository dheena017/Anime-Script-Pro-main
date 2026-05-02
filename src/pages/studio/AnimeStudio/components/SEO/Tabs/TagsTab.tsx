import React from 'react';
import { Tag, Sparkles, Copy, RefreshCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TagsTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const TagsTab: React.FC<TagsTabProps> = ({ content, isGenerating, onGenerate }) => {
  // Parsing a markdown content to extract potential tags if needed, 
  // but for now we'll just show the raw content or a structured view.
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
            Meta Tags & Categories
          </h3>
          <p className="text-[10px] text-zinc-500 mt-2">Technical metadata, category mappings, and algorithmic tag clusters.</p>
        </div>

        <Button
          size="sm"
          className="h-11 bg-fuchsia-500 text-white hover:bg-fuchsia-600 font-black tracking-[0.2em] uppercase text-[10px] shadow-[0_0_25px_rgba(217,70,239,0.4)] border border-white/20 px-8 rounded-2xl transition-all duration-300"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <RefreshCcw className="w-4 h-4 mr-3 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-3" />
          )}
          {isGenerating ? 'Compiling Tags...' : 'Generate Tags'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-[#050505]/50 border border-white/5 rounded-[2.5rem] p-8 min-h-[400px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {content ? (
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">Tag Manifest</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Mockup of tag display */}
                {['Anime', 'Storytelling', 'AI Production', 'Animation', 'Tutorial', 'Nexus', 'Visual DNA'].map((tag, i) => (
                  <div key={i} className="px-4 py-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-[10px] font-bold text-fuchsia-300 flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 italic mt-8 leading-relaxed">
                These tags are optimized for YouTube, TikTok, and Instagram discovery algorithms based on your script content.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-700">
              <Tag className="w-12 h-12 mb-6 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center max-w-[200px]">No tag clusters generated yet.</p>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="bg-[#050505]/50 border border-white/5 rounded-[2rem] p-6 space-y-4">
            <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Platform Specifics</h4>
            <div className="space-y-2">
              {['YouTube (500 chars)', 'TikTok (4000 chars)', 'Instagram (30 tags)'].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-[9px] font-bold text-zinc-500">{p}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};



