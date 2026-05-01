import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';
import { useOutletContext } from 'react-router-dom';
import { WorldTab } from './components/World/Tabs/WorldTabs';

// Modularized Tab Components
import { ArchitectureTab } from './components/World/Tabs/ArchitectureTab';
import { AtlasTab } from './components/World/Tabs/AtlasTab';
import { HistoryTab } from './components/World/Tabs/HistoryTab';
import { SystemsTab } from './components/World/Tabs/SystemsTab';
import { CultureTab } from './components/World/Tabs/CultureTab';
import { WorldEmptyState } from './components/World/WorldEmptyState';

export function WorldPage() {
  const { activeTab } = useOutletContext<{ activeTab: WorldTab }>();
  const {
    generatedWorld,
    setGeneratedWorld,
    isGeneratingWorld,
    isEditing,
    prompt,
  } = useGenerator();

  const renderTabContent = () => {
    if (isGeneratingWorld) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] space-y-8">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-studio/20 border-t-studio rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
            <div className="absolute inset-0 m-auto w-2 h-2 bg-studio rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-black tracking-[0.3em] text-[10px] uppercase text-studio animate-pulse">Sequencing World DNA...</p>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Architecting neural foundations</p>
          </div>
        </div>
      );
    }

    if (!generatedWorld) {
      return (
        <WorldEmptyState 
          onLaunch={() => {}} // Handled by Layout Header
          isGenerating={isGeneratingWorld}
        />
      );
    }

    switch (activeTab) {
      case 'architecture':
        return (
          <ArchitectureTab 
            isEditing={isEditing}
            content={generatedWorld}
            prompt={prompt || ''}
            onContentChange={setGeneratedWorld}
          />
        );
      case 'atlas':
        return <AtlasTab />;
      case 'history':
        return <HistoryTab />;
      case 'systems':
        return <SystemsTab />;
      case 'culture':
        return <CultureTab />;
      default:
        return (
          <ArchitectureTab 
            isEditing={isEditing}
            content={generatedWorld}
            prompt={prompt || ''}
            onContentChange={setGeneratedWorld}
          />
        );
    }
  };

  return (
    <div data-testid="marker-world-architecture" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className={cn(
        "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700",
        activeTab === 'architecture' 
          ? "border-studio/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:border-studio/50" 
          : "border-zinc-800/30 hover:border-zinc-700"
      )}>
        <div className={cn(
          "absolute inset-0 border-[1px] rounded-3xl pointer-events-none transition-colors duration-700",
          activeTab === 'architecture' ? "border-studio/20 group-hover/card:border-studio/40" : "border-white/5"
        )} />
        
        <div className="w-full p-8 lg:p-10 max-w-[1400px] mx-auto">
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
}




