import React from 'react';
import { motion } from 'framer-motion';
import { History, Hourglass, Landmark, ScrollText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const HISTORY_PROSE_CLASSES = `
  prose prose-invert max-w-none 
  prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-white/50 prose-h1:font-black prose-h1:uppercase prose-h1:tracking-[0.3em] prose-h1:text-3xl prose-h1:mb-16
  prose-h2:text-white prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:text-sm 
  prose-h2:bg-gradient-to-r prose-h2:from-white/5 prose-h2:to-transparent prose-h2:p-6 prose-h2:rounded-2xl prose-h2:border prose-h2:border-white/10 
  prose-h2:border-l-4 prose-h2:border-l-fuchsia-500
  prose-h2:mt-32 prose-h2:mb-10 prose-h2:relative prose-h2:shadow-2xl
  prose-h3:text-zinc-300 prose-h3:font-bold prose-h3:uppercase prose-h3:tracking-[0.15em] prose-h3:text-xs prose-h3:mt-12 prose-h3:mb-6 prose-h3:border-b prose-h3:border-white/5 prose-h3:pb-4
  prose-p:text-zinc-400 prose-p:leading-loose prose-p:text-[15px] prose-p:mb-8 prose-p:font-medium
  prose-strong:text-fuchsia-400 prose-strong:font-black
  prose-blockquote:border-l-4 prose-blockquote:border-fuchsia-500 prose-blockquote:bg-fuchsia-500/5 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl
`.replace(/\s+/g, ' ').trim();

interface HistoryTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  isEditing,
  content,
  onContentChange
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full">
            <History className="w-3 h-3 text-fuchsia-500" />
            <span className="text-[9px] font-black text-fuchsia-500 uppercase tracking-[0.2em]">Temporal Archivist</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            CHRONICLED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-500 to-fuchsia-400">ERAS</span>
          </h1>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="w-full h-[600px] bg-black/40 border border-white/10 rounded-[2rem] p-8 text-zinc-300 font-mono text-sm leading-loose focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 transition-all resize-none shadow-inner"
          value={content || ''}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Archive your world history here..."
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          <div className="xl:col-span-3">
            <div className={HISTORY_PROSE_CLASSES}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>

          <div className="hidden xl:block xl:col-span-1 space-y-8">
            <div className="relative border-l border-white/5 ml-4 pl-12 space-y-16">
              {[
                { era: 'The First Spark', date: '3000 B.E.', desc: 'The discovery of the Etheric core and the dawn of civilizations.', icon: Landmark },
                { era: 'The Great Regression', date: '500 B.E.', desc: 'A global conflict that shattered the old kingdoms.', icon: ScrollText },
                { era: 'Current Epoch', date: 'Year 0', desc: 'The stabilization of the mega-metropolises.', icon: Hourglass },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="relative"
                >
                  <div className="absolute -left-[61px] top-0 w-6 h-6 rounded-full bg-zinc-950 border-2 border-fuchsia-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-fuchsia-500 uppercase tracking-widest">{item.date}</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tighter">{item.era}</h3>
                    <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
