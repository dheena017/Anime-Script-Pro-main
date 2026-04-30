import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Terminal,
  ShieldAlert,
  Binary
} from 'lucide-react';

interface PromptItem {
  id: string;
  name: string;
  content: string | Function;
  description: string;
  version: string;
}

interface ProtocolDetailViewProps {
  title: string;
  icon: React.ElementType;
  description: string;
  prompts: PromptItem[];
  color: string;
}

export const ProtocolDetailView: React.FC<ProtocolDetailViewProps> = ({
  title,
  icon: Icon,
  description,
  prompts,
  color
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, content: string | Function) => {
    const text = typeof content === 'function' ? content.toString() : content;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <div className="relative group p-8 rounded-[2.5rem] bg-zinc-950/50 border border-white/5 overflow-hidden">
        <div className={cn(
          "absolute -inset-24 opacity-10 blur-3xl pointer-events-none group-hover:opacity-20 transition-opacity duration-1000",
          `bg-${color}/20`
        )} />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className={cn(
            "w-20 h-20 rounded-3xl flex items-center justify-center border shadow-2xl transition-all duration-500 group-hover:scale-110",
            `bg-${color}/10 border-${color}/30 text-${color}`
          )}>
            <Icon className="w-10 h-10" />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">
              {title} <span className={cn("not-italic", `text-${color}`)}>Protocols</span>
            </h1>
            <p className="text-zinc-500 max-w-2xl text-sm font-medium leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <Binary className="w-3 h-3" />
              L1 Neural Link
            </div>
            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
              Status: <span className="text-emerald-500">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* PROMPT LIST */}
      <div className="grid grid-cols-1 gap-6">
        {prompts.map((prompt, idx) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="group bg-[#030303] border-white/5 hover:border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500">
              <div className="flex flex-col lg:flex-row">
                {/* INFO SIDEBAR */}
                <div className="lg:w-80 p-8 border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950/30">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Directive Name</div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">{prompt.name}</h3>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Objective</div>
                      <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                        {prompt.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="text-[10px] font-black text-zinc-700 uppercase">Ver: {prompt.version}</div>
                      <div className={cn(
                        "px-2 py-1 rounded text-[9px] font-bold uppercase",
                        typeof prompt.content === 'function' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      )}>
                        {typeof prompt.content === 'function' ? 'Dynamic' : 'Static'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 p-8 relative">
                  <div className="absolute top-8 right-8 z-10">
                    <button 
                      onClick={() => handleCopy(prompt.id, prompt.content)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-studio/20 hover:border-studio/30 transition-all text-zinc-500 hover:text-studio text-[10px] font-black uppercase tracking-widest"
                    >
                      {copiedKey === prompt.id ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy Protocol
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-black/60 rounded-2xl p-6 border border-white/5 h-full min-h-[200px] font-mono text-sm group-hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                      <Terminal className="w-4 h-4 text-zinc-600" />
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">System Instruction Output</span>
                    </div>
                    <pre className="text-zinc-400 whitespace-pre-wrap leading-relaxed text-[13px]">
                      {typeof prompt.content === 'function' ? prompt.content.toString() : String(prompt.content)}
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* FOOTER WARNING */}
      <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-500" />
        <div className="flex-1">
          <h4 className="text-[11px] font-black uppercase text-amber-500 tracking-widest">Architectural Warning</h4>
          <p className="text-[10px] font-medium text-amber-500/60 leading-tight italic">
            Modification of core directives may cause neural desynchronization or unintended narrative collapse. Proceed with caution.
          </p>
        </div>
      </div>
    </div>
  );
};
