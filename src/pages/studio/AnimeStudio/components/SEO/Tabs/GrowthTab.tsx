import React from 'react';
import { TrendingUp, Sparkles, Loader2, Play, Users, MessageSquare, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

interface GrowthTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const GrowthTab: React.FC<GrowthTabProps> = ({
  content,
  isGenerating,
  onGenerate
}) => {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Growth Blueprint</h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
              Advanced YouTube Strategy & Audience Retention Matrix
            </p>
          </div>
        </div>
        
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="h-14 px-8 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] gap-3 shadow-orange-500/20 hover:shadow-orange-500/40 transition-all"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isGenerating ? 'Strategizing...' : 'Synthesize Strategy'}
        </Button>
      </div>

      {!content ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Educational Series', icon: Play, desc: 'Topics, release schedules, and script structures.' },
            { label: 'Influencer Collab', icon: Users, desc: 'Personalized pitches and niche identification.' },
            { label: 'Engagement Hub', icon: MessageSquare, desc: 'Community response guidelines and tactics.' },
            { label: 'Repurpose Matrix', icon: Repeat, desc: 'Shorts, Reels, and TikTok adaptation strategy.' }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-[#050505]/40 border border-white/5 flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <item.icon className="w-6 h-6 text-zinc-600" />
              </div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</h4>
              <p className="text-[9px] text-zinc-500 leading-relaxed uppercase tracking-wide">{item.desc}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="prose prose-invert max-w-none">
          <div className="p-10 rounded-[2.5rem] bg-[#050505]/60 border border-white/5 backdrop-blur-xl">
             <ReactMarkdown
               components={{
                 h1: ({node, ...props}) => <h1 className="text-xl font-black text-white uppercase tracking-tighter mb-6 mt-10 first:mt-0" {...props} />,
                 h2: ({node, ...props}) => <h2 className="text-lg font-black text-orange-500 uppercase tracking-widest mb-4 mt-8" {...props} />,
                 h3: ({node, ...props}) => <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 mt-6" {...props} />,
                 p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                 ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                 li: ({node, ...props}) => <li className="text-zinc-400" {...props} />,
                 strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
               }}
             >
               {content || ''}
             </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
