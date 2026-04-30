import { useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { generateMetadata, generateYouTubeDescription, generateAltTexts } from '@/services/geminiService';
import { useNavigate } from 'react-router-dom';
// Sub-components
import { SEOHeader } from '../components/SEO/SEOHeader';
import { SEOToolbar } from '../components/SEO/SEOToolbar';
import { ViewerToolbar } from '../components/Layout/ViewerToolbar';
import { KeywordsTab } from '../components/SEO/Tabs/KeywordsTab';
import { DescriptionTab } from '../components/SEO/Tabs/DescriptionTab';
import { AltTextTab } from '../components/SEO/Tabs/AltTextTab';
import type { SEOTab } from '../components/SEO/Tabs/SEOTabs';

export function SEOPage() {
  const navigate = useNavigate();
  const {
    generatedMetadata,
    setGeneratedMetadata,
    isGeneratingMetadata,
    setIsGeneratingMetadata,
    generatedDescription,
    setGeneratedDescription,
    isGeneratingDescription,
    setIsGeneratingDescription,
    generatedScript,
    selectedModel,
    session,
    episode
  } = useGenerator();
  const [generatedAltText, setGeneratedAltText] = useState<string | null>(null);
  const [isGeneratingAltText, setIsGeneratingAltText] = useState(false);
  const [activeTab, setActiveTab] = useState<SEOTab>('keywords');

  const handleGenerateMetadata = async () => {
    if (!generatedScript) return;
    setIsGeneratingMetadata(true);
    const metadata = await generateMetadata(generatedScript, selectedModel);
    setGeneratedMetadata(metadata);
    setIsGeneratingMetadata(false);
  };

  const handleGenerateDescription = async () => {
    if (!generatedScript) return;
    setIsGeneratingDescription(true);
    const description = await generateYouTubeDescription(generatedScript, selectedModel);
    setGeneratedDescription(description);
    setIsGeneratingDescription(false);
  };

  const handleGenerateAltText = async () => {
    if (!generatedScript) return;
    setIsGeneratingAltText(true);
    const altText = await generateAltTexts(generatedScript, selectedModel);
    setGeneratedAltText(altText);
    setIsGeneratingAltText(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10" data-testid="marker-marketing-specs">
      <SEOHeader
        onRegenerate={handleGenerateMetadata}
        isGenerating={isGeneratingMetadata}
        onNext={() => navigate('/anime/prompts')}
        session={session}
        episode={episode}
      />

      <ViewerToolbar
        content={activeTab === 'keywords' ? generatedMetadata : activeTab === 'description' ? generatedDescription : generatedAltText}
        nexusLabel="SEO_Nexus"
        session={session}
        episode={episode}
        icon={Search}
      >
        <SEOToolbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          session={session}
          episode={episode}
          status={generatedMetadata || generatedDescription || generatedAltText ? 'active' : 'empty'}
        />
      </ViewerToolbar>

      <Card className="bg-[#030303] border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 hover:border-studio/50">
        <div className="absolute inset-0 border-[1px] border-studio/20 rounded-[2.5rem] pointer-events-none group-hover/card:border-studio/40 transition-colors duration-700" />
        <div className="absolute -top-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-studio/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

        <div className="w-full p-0">
          <div className="p-12 max-w-6xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {activeTab === 'keywords' && (
                <KeywordsTab
                  content={generatedMetadata}
                  isGenerating={isGeneratingMetadata}
                  onGenerate={handleGenerateMetadata}
                />
              )}
              {activeTab === 'description' && (
                <DescriptionTab
                  content={generatedDescription}
                  isGenerating={isGeneratingDescription}
                  onGenerate={handleGenerateDescription}
                />
              )}
              {activeTab === 'alt-texts' && (
                <AltTextTab
                  content={generatedAltText}
                  isGenerating={isGeneratingAltText}
                  onGenerate={handleGenerateAltText}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
