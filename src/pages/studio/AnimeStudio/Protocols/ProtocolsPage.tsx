import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Search,
  Filter,
  Copy,
  Check
} from 'lucide-react';
import * as Prompts from '@/services/prompts';

export default function ProtocolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const allPrompts = Object.entries(Prompts).map(([key, value]) => ({
    id: key,
    label: key.replace(/_/g, ' ').replace('PROMPT', '').trim(),
    content: typeof value === 'function' ? 'Dynamic Template (Function)' : String(value),
    fullContent: typeof value === 'function' ? String(value) : String(value),
    type: typeof value === 'function' ? 'Dynamic' : 'Static'
  })).filter(p => p.id !== 'UI_PROMPT_SUGGESTIONS');

  const filteredPrompts = allPrompts.filter(p => 
    p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-studio/10 via-transparent to-studio/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-studio/20 flex items-center justify-center border border-studio/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Terminal className="w-5 h-5 text-studio" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">
                Nexus <span className="text-studio not-italic">Protocols</span>
              </h1>
            </div>
            <p className="text-zinc-500 max-w-xl text-sm font-medium leading-relaxed">
              The core architectural directives powering the Neural Link. These system instructions define the behavioral logic and output constraints for all synthesis engines.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Search Protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-zinc-950 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-studio/50 focus:ring-4 focus:ring-studio/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* GRID OF PROTOCOLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt, idx) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="group relative bg-[#050505] border-white/5 hover:border-studio/30 rounded-3xl overflow-hidden transition-all duration-500 h-full flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-0 bg-gradient-to-br from-studio/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        prompt.type === 'Dynamic' ? "bg-amber-500" : "bg-emerald-500"
                      )} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                        {prompt.type} Logic
                      </span>
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-studio transition-colors">
                      {prompt.label}
                    </h3>
                  </div>
                  
                  <button 
                    onClick={() => handleCopy(prompt.id, prompt.fullContent)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-studio/20 hover:border-studio/30 transition-all text-zinc-500 hover:text-studio"
                  >
                    {copiedKey === prompt.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative flex-1 bg-black/40 border border-white/5 rounded-2xl p-4 overflow-hidden group/code">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)] opacity-0 group-hover/code:opacity-100 transition-opacity duration-700" />
                  <pre className="text-[11px] font-mono text-zinc-400 whitespace-pre-wrap line-clamp-6 leading-relaxed">
                    {prompt.content}
                  </pre>
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent" />
                </div>
              </div>

              <div className="p-4 bg-zinc-950/50 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                    v1.0.0
                  </div>
                  <div className="px-2 py-1 rounded-md bg-studio/10 border border-studio/20 text-[9px] font-bold text-studio uppercase tracking-tighter">
                    Optimized
                  </div>
                </div>
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  ID: {prompt.id.slice(0, 8)}...
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <Filter className="w-8 h-8 text-zinc-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase text-white">No Directives Found</h3>
            <p className="text-zinc-500 text-sm">Adjustment of filter parameters required for sector scan.</p>
          </div>
        </div>
      )}
    </div>
  );
}



