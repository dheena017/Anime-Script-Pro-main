import React from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Utensils, Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CULTURE_PROSE_CLASSES = `
  prose prose-invert max-w-none 
  prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-white/50 prose-h1:font-black prose-h1:uppercase prose-h1:tracking-[0.3em] prose-h1:text-3xl prose-h1:mb-16
  prose-h2:text-white prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:text-sm 
  prose-h2:bg-gradient-to-r prose-h2:from-white/5 prose-h2:to-transparent prose-h2:p-6 prose-h2:rounded-2xl prose-h2:border prose-h2:border-white/10 
  prose-h2:border-l-4 prose-h2:border-l-rose-500
  prose-h2:mt-32 prose-h2:mb-10 prose-h2:relative prose-h2:shadow-2xl
  prose-p:text-zinc-400 prose-p:leading-loose prose-p:text-[15px] prose-p:mb-8 prose-p:font-medium
  prose-strong:text-rose-400 prose-strong:font-black
`.replace(/\s+/g, ' ').trim();

interface CultureTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
}

export const CultureTab: React.FC<CultureTabProps> = ({
  isEditing,
  content,
  onContentChange
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
            <Users className="w-3 h-3 text-rose-500" />
            <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em]">Societal Pulse</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            CULTURAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-500 to-rose-400">ETHOS</span>
          </h1>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="w-full h-[600px] bg-black/40 border border-white/10 rounded-[2rem] p-8 text-zinc-300 font-mono text-sm leading-loose focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all resize-none shadow-inner"
          value={content || ''}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Profile your world culture and societal norms here..."
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          <div className="xl:col-span-3">
            <div className={CULTURE_PROSE_CLASSES}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>

          <div className="hidden xl:block xl:col-span-1 space-y-8">
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Traditions', val: 'Neo-Matsuri', icon: Heart, color: 'text-rose-400' },
                { label: 'Cuisine', val: 'Synthetic Soul', icon: Utensils, color: 'text-orange-400' },
                { label: 'Arts', val: 'Holographic Echo', icon: Music, color: 'text-fuchsia-400' },
                { label: 'Identity', val: 'Neural Nomad', icon: Users, color: 'text-blue-400' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-zinc-950/50 border border-white/5 rounded-3xl flex flex-col items-center text-center space-y-4 hover:bg-white/[0.02] transition-colors border-l-2 border-l-rose-500/20"
                >
                  <div className={`w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{item.label}</span>
                    <p className="text-sm font-black text-white uppercase tracking-tighter">{item.val}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-8 bg-[#050505] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute inset-0 bg-rose-500/5 blur-[60px] pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Societal Core
                </h3>
                <p className="text-zinc-500 text-[10px] font-medium leading-relaxed">
                  The culture is defined by a paradoxical mix of ancient ancestor worship and radical neural integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
