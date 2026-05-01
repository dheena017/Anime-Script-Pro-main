import { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageSquare, 
  Zap, 
  LifeBuoy, 
  ChevronRight,
  ExternalLink,
  Cpu,
  ShieldCheck,
  FileText,
  Mail,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supportService, HelpCategory, FAQ } from '@/services/api/support';

const ICON_MAP: Record<string, any> = {
  Zap,
  FileText,
  Cpu,
  ShieldCheck,
  BookOpen,
  HelpCircle
};

export default function HelpPage() {
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ faqs: FAQ[] } | null>(null);

  useEffect(() => {
    async function hydrate() {
      const [cats, frequentFaqs] = await Promise.all([
        supportService.getHelpCategories(),
        supportService.getFAQs(true)
      ]);
      setCategories(cats);
      setFaqs(frequentFaqs);
      setLoading(false);
    }
    hydrate();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    const results = await supportService.searchHelp(searchQuery);
    setSearchResults(results);
    setLoading(false);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
      </div>
    );
  }

  const displayFaqs = searchResults ? searchResults.faqs : faqs;

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#030303] overflow-hidden flex flex-col p-6 lg:p-12">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/4" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-500/5 blur-[120px] rounded-full pointer-events-none translate-y-1/3 translate-x-1/4" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col items-center text-center space-y-8 mb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <HelpCircle className="w-6 h-6 text-cyan-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/80">Support Archive</span>
            </div>
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">Assist?</span>
            </h1>
            <p className="text-zinc-500 font-medium max-w-2xl mx-auto text-base">
              Explore the documentation, search the neural archive, or initiate a direct link with the architectural support team.
            </p>
          </div>

          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-zinc-900/50 backdrop-blur-3xl border border-white/5 rounded-3xl p-2 pl-6 focus-within:border-cyan-500/50 transition-all duration-500">
              <Search className="w-5 h-5 text-zinc-500" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-zinc-600 text-lg py-8" 
                placeholder="Search protocols, models, or billing logic..." 
              />
              <Button onClick={handleSearch} className="bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl px-8 h-12 hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                Initialize
              </Button>
            </div>
          </div>
        </header>

        {/* Quick Help Cards */}
        {!searchResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {categories.map((cat, idx) => {
              const Icon = ICON_MAP[cat.icon] || HelpCircle;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-zinc-900/20 backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-all group cursor-pointer relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                      <Icon className={cn("w-24 h-24", cat.color)} />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className={cn("w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center transition-all duration-500 group-hover:scale-110", cat.color)}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-widest">{cat.label}</h3>
                        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tighter mt-1">{cat.sub}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-cyan-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                        Open Protocol <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4 border-b border-zinc-900 pb-6">
               <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <Zap className="w-5 h-5 text-yellow-500" />
               </div>
               <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                 {searchResults ? `Search Results (${displayFaqs.length})` : 'Frequent Inquiries'}
               </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {displayFaqs.length > 0 ? displayFaqs.map((faq, idx) => (
                <div key={idx} className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl hover:bg-zinc-900/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-black text-white uppercase tracking-wide group-hover:text-cyan-400 transition-colors">{faq.question}</p>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed">{faq.answer}</p>
                    </div>
                    <div className="bg-zinc-800 p-1.5 rounded-lg text-zinc-600 group-hover:text-white transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-zinc-900/10 rounded-[3rem] border border-dashed border-zinc-800">
                   <p className="text-zinc-600 font-black uppercase tracking-widest text-xs">No records found in the archive.</p>
                </div>
              )}
            </div>
          </div>

          {/* Support Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 border-b border-zinc-900 pb-6">
               <div className="p-2 bg-fuchsia-500/10 rounded-lg border border-fuchsia-500/20">
                  <LifeBuoy className="w-5 h-5 text-fuchsia-500" />
               </div>
               <h2 className="text-2xl font-black text-white uppercase tracking-widest">Support Core</h2>
            </div>

            <div className="space-y-4">
               <Card className="bg-gradient-to-br from-zinc-900/80 to-black border border-white/5 p-8 rounded-[2rem] space-y-6">
                  <div className="space-y-2 text-center">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                      <Mail className="w-8 h-8 text-cyan-500" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">Architect Direct</h3>
                    <p className="text-xs text-zinc-500 font-medium">Standard Response Time: &lt; 2 Neural Cycles</p>
                  </div>
                  <Button className="w-full h-14 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-zinc-200 shadow-xl">
                    Initiate Contact Link
                  </Button>
               </Card>

               <div className="flex flex-col gap-2">
                  <a href="/documentation" className="flex items-center justify-between p-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl hover:bg-zinc-900/40 transition-all group no-underline">
                     <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-zinc-500 group-hover:text-cyan-500" />
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-white">API Documentation</span>
                     </div>
                     <ExternalLink className="w-3 h-3 text-zinc-800 group-hover:text-cyan-500" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl hover:bg-zinc-900/40 transition-all group no-underline">
                     <div className="flex items-center gap-3">
                        <MessageSquare className="w-4 h-4 text-zinc-500 group-hover:text-cyan-500" />
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-white">Discord Collective</span>
                     </div>
                     <ExternalLink className="w-3 h-3 text-zinc-800 group-hover:text-cyan-500" />
                  </a>
               </div>
            </div>
          </div>
        </div>

        {/* System Status Footer */}
        <footer className="mt-20 pt-12 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
           <div className="flex items-center gap-4">
              <span>Studio Uptime: 99.98%</span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
           </div>
           <div className="flex items-center gap-8">
              <a href="#" className="hover:text-white transition-colors no-underline">Privacy Protocol</a>
              <a href="#" className="hover:text-white transition-colors no-underline">Neural Terms</a>
              <a href="#" className="hover:text-white transition-colors no-underline">Cookie Data</a>
           </div>
        </footer>
      </div>
    </div>
  );
}




