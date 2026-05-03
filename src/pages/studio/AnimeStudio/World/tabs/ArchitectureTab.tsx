import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Zap, Building2, Castle, Ruler, Layers } from 'lucide-react';

const WORLD_VIEWER_PROSE_CLASSES = `
  prose prose-invert max-w-none 
  prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-white/50 prose-h1:font-black prose-h1:uppercase prose-h1:tracking-[0.3em] prose-h1:text-3xl prose-h1:mb-16
  prose-h2:text-white prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:text-sm 
  prose-h2:bg-gradient-to-r prose-h2:from-white/5 prose-h2:to-transparent prose-h2:p-6 prose-h2:rounded-2xl prose-h2:border prose-h2:border-white/10 
  prose-h2:border-l-4 prose-h2:border-l-studio
  prose-h2:mt-32 prose-h2:mb-10 prose-h2:relative prose-h2:shadow-2xl
  prose-h2:before:content-[''] prose-h2:before:absolute prose-h2:before:-top-16 prose-h2:before:left-[5%] prose-h2:before:w-[90%] prose-h2:before:h-[1px] prose-h2:before:bg-gradient-to-r prose-h2:before:from-transparent prose-h2:before:via-white/10 prose-h2:before:to-transparent
  prose-h3:text-zinc-300 prose-h3:font-bold prose-h3:uppercase prose-h3:tracking-[0.15em] prose-h3:text-xs prose-h3:mt-12 prose-h3:mb-6 prose-h3:border-b prose-h3:border-white/5 prose-h3:pb-4
  prose-p:text-zinc-400 prose-p:leading-loose prose-p:text-[15px] prose-p:mb-8 prose-p:font-medium
  prose-strong:text-studio prose-strong:font-black prose-strong:drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]
  prose-ul:border-l-2 prose-ul:border-white/5 prose-ul:pl-8 prose-ul:space-y-4 prose-ul:mb-12
  prose-li:text-[14px] prose-li:text-zinc-400 prose-li:leading-relaxed prose-li:marker:text-studio
  prose-blockquote:border-l-4 prose-blockquote:border-studio prose-blockquote:bg-studio/5 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-zinc-300 prose-blockquote:font-mono prose-blockquote:text-[13px] prose-blockquote:italic prose-blockquote:shadow-inner prose-blockquote:my-12
  prose-code:bg-studio/10 prose-code:text-studio prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:font-mono prose-code:text-[12px] prose-code:before:content-none prose-code:after:content-none
  prose-hr:border-white/10 prose-hr:my-24
`.replace(/\s+/g, ' ').trim();

interface ArchitectureTabProps {
  isEditing: boolean;
  content: string;
  prompt: string;
  onContentChange: (content: string) => void;
}

export const ArchitectureTab: React.FC<ArchitectureTabProps> = ({
  isEditing,
  content,
  prompt,
  onContentChange
}) => {
  const headings = React.useMemo(() => {
    return content.split('\n')
      .filter((line) => line.startsWith('## '))
      .map((line) => {
        const text = line.replace(/#/g, '').replace(/\*/g, '').replace(/_/g, '').trim();
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return { text, id };
      });
  }, [content]);

  const customComponents = React.useMemo(() => ({
    h2: ({ node, ...props }: any) => {
      const text = React.Children.toArray(props.children)
        .map((child) => (typeof child === 'string' ? child : '')).join('');
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return <motion.h2 id={id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, ease: 'easeOut' }} {...props} />;
    },
    p: ({ node, ...props }: any) => (
      <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} {...props} />
    )
  }), []);

  const handleScroll = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Premium Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <Building2 className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">Structural Architect</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            URBAN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400">STRUCTURES</span>
          </h1>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Settlement Style', icon: Castle, val: 'Gothic-Futurism' },
          { label: 'Building Material', icon: Layers, val: 'Obsidian / Neon' },
          { label: 'Scale Factor', icon: Ruler, val: 'Mega-Metropolis' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-zinc-950/50 border border-white/5 rounded-[2rem] relative group overflow-hidden hover:border-amber-500/30 transition-all"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[40px] pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform">
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
            <div className="mt-2">
              <span className="text-2xl font-black text-white uppercase tracking-tighter">{stat.val}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content (Editor or Markdown) */}
      {isEditing ? (
        <textarea
          className="w-full h-[800px] bg-black/40 border border-studio/20 rounded-[2.5rem] p-10 text-zinc-300 font-mono text-sm leading-loose focus:outline-none focus:ring-2 focus:ring-studio/30 transition-all resize-none shadow-inner custom-scrollbar"
          value={content || ''}
          onChange={(event) => onContentChange(event.target.value)}
          placeholder="Manually architect your world lore here..."
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 relative group">
          <div className="xl:col-span-3 relative">
            <div className={WORLD_VIEWER_PROSE_CLASSES}>
              <ReactMarkdown components={customComponents}>{content}</ReactMarkdown>
            </div>
          </div>

          <div className="hidden xl:block xl:col-span-1 space-y-8">
            <div className="p-6 bg-studio/5 border border-studio/10 rounded-[2rem] space-y-6">
              <h4 className="text-[10px] font-black text-studio uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" /> Lore Manifest
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Geography', val: 'Rendered' },
                  { label: 'Metaphysics', val: 'Active' },
                  { label: 'Timeline', val: 'Synced' },
                  { label: 'Sociology', val: 'Archived' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.label}</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">{item.val}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-studio/10">
                <p className="text-[9px] text-zinc-600 font-medium leading-relaxed uppercase">
                  World data is now locked as the "Source of Truth" for all subsequent Script and Beat generation.
                </p>
              </div>
            </div>

            {prompt && (
              <div className="p-6 bg-black/40 border border-white/5 rounded-[2rem] space-y-4">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Seed</h4>
                <div className="p-3 bg-zinc-950 rounded-xl border border-white/5">
                  <p className="text-[9px] font-mono text-studio/70 break-all leading-relaxed">
                    {prompt.substring(0, 150)}...
                  </p>
                </div>
              </div>
            )}

            {headings.length > 0 && (
              <div className="sticky top-10 p-6 bg-black/40 border border-white/5 rounded-[2rem] space-y-6 shadow-2xl backdrop-blur-md">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
                  <Zap className="w-4 h-4 text-studio" /> Quick Navigation
                </h4>
                <ul className="space-y-1 relative before:absolute before:inset-y-0 before:left-[5px] before:w-[1px] before:bg-white/5">
                  {headings.map((heading, index) => (
                    <li key={index} className="relative group">
                      <div className="absolute left-[3px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-white/10 group-hover:bg-studio group-hover:shadow-[0_0_8px_var(--studio-glow)] transition-all duration-300 z-10" />
                      <a
                        href={`#${heading.id}`}
                        onClick={(event) => handleScroll(event, heading.id)}
                        className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-studio transition-all duration-300 block py-2 pl-6 group-hover:translate-x-1 group-hover:bg-studio/5 rounded-r-lg"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
