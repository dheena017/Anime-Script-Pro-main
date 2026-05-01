import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Terminal, ChevronRight, FileText } from 'lucide-react';

const docSections = [
  { 
    title: "Getting Started", 
    icon: Book, 
    items: ["System Requirements", "Installation Guide", "Quick Start"],
    desc: "Initial setup and architectural deployment."
  },
  { 
    title: "Neural Logic", 
    icon: Terminal, 
    items: ["Prompt Engineering", "DNA Sequencing", "Logic Gates"],
    desc: "Understanding the core AI reasoning engine."
  },
  { 
    title: "API Reference", 
    icon: Code, 
    items: ["Authentication", "Endpoint Mapping", "Webhooks"],
    desc: "Developer integrations and neural hooks."
  },
];

export const DocsPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {docSections.map((section, idx) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-zinc-950 border border-white/5 rounded-[3rem] p-8 hover:border-zinc-500/30 transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between mb-8">
            <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 group-hover:border-zinc-500/20 transition-all">
              <section.icon className="w-6 h-6 text-zinc-500" />
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-zinc-700" />
            </div>
          </div>

          <h3 className="text-lg font-black text-white uppercase tracking-tighter italic mb-2">{section.title}</h3>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-loose mb-8">{section.desc}</p>

          <div className="space-y-3">
            {section.items.map(item => (
              <div key={item} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-2xl border border-white/5 hover:border-zinc-500/10 transition-all group/item">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover/item:text-zinc-300">{item}</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-800 group-hover/item:text-zinc-500 transition-colors" />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};


