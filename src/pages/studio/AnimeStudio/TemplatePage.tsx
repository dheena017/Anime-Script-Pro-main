import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollText, Search, Sword, Globe, Zap, Ghost, Brain, Flame, Heart, Trophy, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useGenerator } from '@/hooks/useGenerator';
import { useNavigate } from 'react-router-dom';

// Sub-components
import { TemplateCard } from '../components/Template/TemplateCard';
import { TemplateDetailModal } from '../components/Template/TemplateDetailModal';

// Icon Mapper
const ICON_MAP: Record<string, any> = {
  Sword, Globe, Zap, Ghost, Brain, Flame, Heart, Trophy, Hash, Search
};

export function TemplatePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateDetails, setShowTemplateDetails] = useState<string | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    setPrompt,
  } = useGenerator();
  const navigate = useNavigate();

  // Fetch templates from the Database
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        if (response.ok) {
          const data = await response.json();
          // Map string icons to Lucide components
          const mappedData = data.map((t: any) => ({
            ...t,
            icon: ICON_MAP[t.icon] || Sword,
            label: t.name // Aligning name with card expectations
          }));
          setTemplates(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch blueprints:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleUsePrompt = (promptText: string) => {
    setPrompt(promptText);
    navigate('..', { relative: 'path' });
  };

  const filteredTemplates = templates.filter(t => {
    return t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedTemplateData = templates.find(t => t.id === showTemplateDetails || t.id.toString() === showTemplateDetails);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8" data-testid="marker-forge-library">
      {/* HEADER SECTION WITH SEARCH */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 glass-panel p-6 rounded-[2rem] border-cyan-500/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="space-y-2 shrink-0">
          <h2 className="text-4xl font-black uppercase tracking-[0.25em] flex items-center gap-3 text-white glow-text">
            <ScrollText className="w-10 h-10 text-cyan-400" /> Forge Library
          </h2>
          <p className="text-cyan-500/60 font-black uppercase tracking-[0.4em] text-[10px] bg-cyan-500/5 px-4 py-1.5 rounded-xl border border-cyan-500/20 inline-block shadow-[0_0_20px_rgba(34,211,238,0.05)]">
            Production-Ready Frameworks & Global Standards
          </p>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* SEARCH ENGINE */}
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/60 group-focus-within:text-cyan-400 transition-colors" />
            <Input
              placeholder="Scan Blueprints..."
              className="pl-12 h-12 bg-black/40 border-cyan-500/10 focus:border-cyan-500/40 text-xs rounded-xl neo-border transition-all w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <div className="text-[10px] font-black text-cyan-500/40 uppercase tracking-[0.4em]">
            {isLoading ? "Synchronizing Matrix..." : `Blueprints Available: ${filteredTemplates.length}`}
          </div>
        </div>

        {/* TEMPLATE GRID */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500/40 animate-pulse">Establishing Neural Link...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, idx) => (
              <TemplateCard
                key={template.id}
                template={template}
                idx={idx}
                handleUsePrompt={handleUsePrompt}
                setShowTemplateDetails={setShowTemplateDetails}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showTemplateDetails && selectedTemplateData && (
          <TemplateDetailModal
            template={selectedTemplateData}
            onClose={() => setShowTemplateDetails(null)}
            handleUsePrompt={handleUsePrompt}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
