import React from 'react';
import { Map, Compass, Globe, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const ATLAS_PROSE_CLASSES = `
  prose prose-invert max-w-none 
  prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-white/50 prose-h1:font-black prose-h1:uppercase prose-h1:tracking-[0.3em] prose-h1:text-3xl prose-h1:mb-16
  prose-h2:text-white prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:text-sm 
  prose-h2:bg-gradient-to-r prose-h2:from-white/5 prose-h2:to-transparent prose-h2:p-6 prose-h2:rounded-2xl prose-h2:border prose-h2:border-white/10 
  prose-h2:border-l-4 prose-h2:border-l-blue-500
  prose-h2:mt-32 prose-h2:mb-10 prose-h2:relative prose-h2:shadow-2xl
  prose-p:text-zinc-400 prose-p:leading-loose prose-p:text-[15px] prose-p:mb-8 prose-p:font-medium
  prose-strong:text-blue-400 prose-strong:font-black
`.replace(/\s+/g, ' ').trim();

interface AtlasTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
}

export const AtlasTab: React.FC<AtlasTabProps> = ({
  isEditing,
  content,
  onContentChange
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Map className="w-3 h-3 text-blue-500" />
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Geographic Cartographer</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            REALM <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-400">CARTOGRAPHY</span>
          </h1>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="w-full h-[600px] bg-black/40 border border-white/10 rounded-[2rem] p-8 text-zinc-300 font-mono text-sm leading-loose focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none shadow-inner"
          value={content || ''}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Map out your world geography here..."
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          <div className="xl:col-span-3">
            <div className={ATLAS_PROSE_CLASSES}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>

          <div className="hidden xl:block xl:col-span-1 space-y-8">
            <div className="p-10 bg-[#050505] border border-white/5 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 blur-[100px] group-hover:bg-blue-500/10 transition-all duration-700" />
              <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-pulse">
                  <Globe className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest">World Map Generation</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
                  Creating your world's geography and regional boundaries based on your story.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Primary Continent', val: 'Neo-Pangea', icon: Compass },
                { label: 'Climate Profile', val: 'Bioluminescent Tropical', icon: Navigation },
                { label: 'Resource Density', val: 'High / Etheric', icon: Map },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-zinc-950/50 border border-white/5 rounded-[2rem] flex items-center gap-6 group hover:border-blue-500/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</span>
                    <p className="text-sm font-black text-white uppercase tracking-tighter mt-1">{item.val}</p>
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
