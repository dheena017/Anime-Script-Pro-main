import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { AssetsHeader } from '../../components/Assets/AssetsHeader';
import { generateMetadata, generateYouTubeDescription, generateImagePrompts } from '@/services/geminiService';

export default function AssetsLayout() {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = React.useState(false);
  
  const {
    setGeneratedMetadata,
    setGeneratedDescription,
    setGeneratedImagePrompts,
    isGeneratingMetadata, setIsGeneratingMetadata,
    isGeneratingDescription, setIsGeneratingDescription,
    isGeneratingImagePrompts, setIsGeneratingImagePrompts,
    generatedScript, selectedModel, session, episode,
    showNotification
  } = useGenerator();

  const handleGenerateAll = async () => {
    if (!generatedScript) {
      showNotification?.('Prerequisite Failure: Synthesis a script manifest before generating all assets.', 'error');
      return;
    }
    
    setIsGeneratingMetadata(true);
    setIsGeneratingDescription(true);
    setIsGeneratingImagePrompts(true);

    try {
      const [meta, desc, prompts] = await Promise.all([
        generateMetadata(generatedScript, selectedModel),
        generateYouTubeDescription(generatedScript, selectedModel),
        generateImagePrompts(generatedScript, selectedModel)
      ]);
      
      setGeneratedMetadata(meta);
      setGeneratedDescription(desc);
      setGeneratedImagePrompts(prompts);
      showNotification?.('Neural Synthesis Complete: All Assets Generated', 'success');
    } catch (e: any) {
      showNotification?.('Synthesis Failure: ' + (e.message || 'Error'), 'error');
    } finally {
      setIsGeneratingMetadata(false);
      setIsGeneratingDescription(false);
      setIsGeneratingImagePrompts(false);
    }
  };


  return (
    <div className="space-y-6">
      <AssetsHeader 
        onRegenerate={handleGenerateAll}
        isGenerating={isGeneratingMetadata || isGeneratingDescription || isGeneratingImagePrompts}
        onNext={() => navigate('/anime/screening')}
        onPrev={() => navigate('/anime/storyboard')}
        session={session}
        episode={episode}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
      />

      <div className="flex items-center justify-between p-4 bg-[#050505]/60 backdrop-blur-xl border border-studio/20 rounded-2xl mb-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="flex items-center gap-12 z-10 w-full">
          <div className="flex items-center gap-3 px-4 py-2 bg-studio/10 border border-studio/20 rounded-xl">
            <Search className="w-4 h-4 text-studio" />
            <span className="text-[10px] font-black text-studio uppercase tracking-[0.2em]">Assets_Nexus</span>
          </div>
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
