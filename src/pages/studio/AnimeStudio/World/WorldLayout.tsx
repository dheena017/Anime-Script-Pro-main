import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { WorldHeader } from '../../components/World/WorldHeader';
import { WorldToolbar } from '../../components/World/WorldToolbar';
import { generateWorld } from '@/services/geminiService';

export default function WorldLayout() {
  const navigate = useNavigate();
  const {
    isGeneratingWorld, setIsGeneratingWorld,
    prompt, selectedModel, contentType,
    setGeneratedWorld, generatedWorld,
    session, episode, showNotification
  } = useGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Missing Core Parameter: Enter a production prompt to manifest reality.', 'error');
      return;
    }
    setIsGeneratingWorld(true);
    try {
      const world = await generateWorld(prompt, selectedModel, contentType);
      setGeneratedWorld(world);
      showNotification?.('Neural Synthesis Complete: World Bible Archived', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification?.('Synthesis Failure: ' + (e.message || 'Unknown Error'), 'error');
    } finally {
      setIsGeneratingWorld(false);
    }
  };

  return (
    <div className="space-y-6">
      <WorldHeader
        onRegenerate={handleGenerate}
        isGenerating={isGeneratingWorld}
        onNext={() => navigate('/anime/cast')}
        session={session}
        episode={episode}
      />

      <div className="flex items-center justify-between p-4 bg-[#050505]/60 backdrop-blur-xl border border-studio/20 rounded-2xl mb-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="flex items-center gap-12 z-10 w-full">
          <div className="flex items-center gap-3 px-4 py-2 bg-studio/10 border border-studio/20 rounded-xl">
            <Globe className="w-4 h-4 text-studio animate-pulse" />
            <span className="text-[10px] font-black text-studio uppercase tracking-[0.2em]">World_Nexus</span>
          </div>

          <WorldToolbar
            session={session}
            episode={episode}
            status={generatedWorld ? 'active' : 'empty'}
            onRefresh={handleGenerate}
            isGenerating={isGeneratingWorld}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
