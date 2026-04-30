import { useState, useEffect } from 'react';
import {
  Book,
  Terminal,
  Cpu,
  Database,
  Layers,
  Zap,
  Code,
  Globe,
  Lock,
  Hash,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from '../components/ui/scroll-area';
import { Button } from '../components/ui/button';
import { supportService, DocSection, DocArticle } from '../services/supportService';

const ICON_MAP: Record<string, any> = {
  Globe,
  Cpu,
  Terminal,
  Database,
  Code,
  Lock
};

export default function DocumentationPage() {
  const [sections, setSections] = useState<DocSection[]>([]);
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [articles, setArticles] = useState<DocArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSections() {
      const data = await supportService.getDocSections();
      setSections(data);
      if (data.length > 0) setActiveSection(data[0].slug);
    }
    loadSections();
  }, []);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      const data = await supportService.getDocArticles(activeSection);
      setArticles(data);
      setLoading(false);
    }
    if (activeSection) loadArticles();
  }, [activeSection]);

  if (sections.length === 0 && loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#030303] overflow-hidden flex flex-col">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Left Sidebar - Table of Contents */}
        <aside className="w-80 border-r border-zinc-900/50 bg-black/40 backdrop-blur-3xl hidden lg:flex flex-col p-8 space-y-12">
          <div className="space-y-4">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-lg">
                   <Book className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Manifesto</h2>
             </div>
             
             <div className="space-y-1">
               {sections.map((section) => {
                 const Icon = ICON_MAP[section.icon] || Globe;
                 const isActive = activeSection === section.slug;
                 return (
                   <button 
                     key={section.id}
                     onClick={() => setActiveSection(section.slug)}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-left ${isActive ? 'bg-red-500/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                   >
                     <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-red-500' : 'group-hover:text-red-500'}`} />
                     <span className="text-[11px] font-bold uppercase tracking-widest">{section.label}</span>
                   </button>
                 );
               })}
             </div>
          </div>

          <div className="mt-auto p-6 bg-red-500/5 border border-red-500/10 rounded-[2rem] space-y-4">
             <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-red-500" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">v4.0.2 SDK</span>
             </div>
             <p className="text-[9px] text-zinc-600 font-bold uppercase leading-relaxed">Download the local CLI tool to sync your productions from the terminal.</p>
             <button className="w-full py-2 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all">Download CLI</button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full p-8 lg:p-20">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto space-y-24 pb-40"
              >
                {loading ? (
                  <div className="flex items-center justify-center py-40">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  </div>
                ) : articles.length > 0 ? articles.map((article, index) => (
                   <section key={article.id} id={article.slug} className="space-y-6">
                      {article.protocol_id && (
                        <div className="flex items-center gap-3 text-red-500">
                           <Hash className="w-5 h-5" />
                           <span className="text-xs font-black uppercase tracking-[0.4em]">{article.protocol_id}</span>
                        </div>
                      )}
                      <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
                         {article.title}
                      </h1>
                      <div className="text-zinc-500 text-lg font-medium leading-relaxed max-w-3xl whitespace-pre-wrap doc-content">
                         {article.content}
                      </div>

                      {index === 0 && activeSection === 'introduction' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                           <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] space-y-4 hover:border-red-500/30 transition-all group">
                              <Layers className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                              <h3 className="text-xl font-black text-white uppercase tracking-widest">Multi-Agent Layers</h3>
                              <p className="text-xs text-zinc-500 leading-relaxed font-medium">Learn how our swarm of sub-agents coordinates cast DNA with world lore to prevent narrative entropy.</p>
                           </div>
                           <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] space-y-4 hover:border-cyan-500/30 transition-all group">
                              <Terminal className="w-8 h-8 text-cyan-500 group-hover:scale-110 transition-transform" />
                              <h3 className="text-xl font-black text-white uppercase tracking-widest">Command Logic</h3>
                              <p className="text-xs text-zinc-500 leading-relaxed font-medium">Advanced prompt engineering guide for generating Hollywood-grade screenplay formatting autonomously.</p>
                           </div>
                        </div>
                      )}
                   </section>
                )) : (
                  <div className="text-center py-40">
                    <p className="text-zinc-600 font-black uppercase tracking-widest text-xs italic">Archive data pending synchronization...</p>
                  </div>
                )}

                 {/* Footer Link */}
                 <div className="flex items-center justify-between p-12 bg-red-500/5 border border-red-500/20 rounded-[3rem]">
                    <div className="space-y-2">
                       <h3 className="text-xl font-black text-white uppercase tracking-widest">Stuck in the Matrix?</h3>
                       <p className="text-xs text-zinc-500 font-bold uppercase tracking-tighter">Our architects are available for direct neural link-up.</p>
                    </div>
                    <Button className="bg-red-500 text-black font-black uppercase tracking-widest px-10 h-14 rounded-2xl hover:bg-red-400 transition-all">
                       Open Ticket
                    </Button>
                 </div>
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
