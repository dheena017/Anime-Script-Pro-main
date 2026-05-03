import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SYSTEMS_PROSE_CLASSES = `
  prose prose-invert max-w-none 
  prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-white/50 prose-h1:font-black prose-h1:uppercase prose-h1:tracking-[0.3em] prose-h1:text-3xl prose-h1:mb-16
  prose-h2:text-white prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:text-sm 
  prose-h2:bg-gradient-to-r prose-h2:from-white/5 prose-h2:to-transparent prose-h2:p-6 prose-h2:rounded-2xl prose-h2:border prose-h2:border-white/10 
  prose-h2:border-l-4 prose-h2:border-l-cyan-500
  prose-h2:mt-32 prose-h2:mb-10 prose-h2:relative prose-h2:shadow-2xl
  prose-p:text-zinc-400 prose-p:leading-loose prose-p:text-[15px] prose-p:mb-8 prose-p:font-medium
  prose-strong:text-cyan-400 prose-strong:font-black
`.replace(/\s+/g, ' ').trim();

interface SystemsTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
}

export const SystemsTab: React.FC<SystemsTabProps> = ({
  isEditing,
  content,
  onContentChange
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <Cpu className="w-3 h-3 text-cyan-500" />
            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em]">Mechanical Logic</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            WORLD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-500 to-cyan-400">DYNAMICS</span>
          </h1>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="w-full h-[600px] bg-black/40 border border-white/10 rounded-[2rem] p-8 text-zinc-300 font-mono text-sm leading-loose focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none shadow-inner"
          value={content || ''}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Define your world systems and mechanics here..."
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          <div className="xl:col-span-3">
            <div className={SYSTEMS_PROSE_CLASSES}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>

          <div className="hidden xl:block xl:col-span-1 space-y-8">
            <div className="space-y-6">
              {[
                { title: 'Power System', desc: 'Neural-Arcana manipulation through cognitive overloading.', icon: Zap, color: 'text-amber-400' },
                { title: 'Economy', desc: 'Credits & Karma: A dual-currency social contribution system.', icon: Activity, color: 'text-blue-400' },
                { title: 'Governance', desc: 'Algorithm Sovereignty by planetary AI core.', icon: ShieldCheck, color: 'text-emerald-400' },
                { title: 'Social Strata', desc: 'The Indexed vs The Ghost: Neural net accessibility.', icon: Cpu, color: 'text-cyan-400' },
              ].map((sys, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative group overflow-hidden hover:border-cyan-500/30 transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-[40px] pointer-events-none" />
                  <div className={`w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center ${sys.color}`}>
                    <sys.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{sys.title}</h3>
                    <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">{sys.desc}</p>
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
