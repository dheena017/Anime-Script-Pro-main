import { useGenerator } from '@/hooks/useGenerator';
import { useWorldState } from '@/contexts/generator';
import { cn } from '@/lib/utils';
import { useOutletContext } from 'react-router-dom';
import { WorldTab } from './tabs/WorldTabs';

// Modularized Tab Components
import { ArchitectureTab } from './tabs/ArchitectureTab';
import { AtlasTab } from './tabs/AtlasTab';
import { HistoryTab } from './tabs/HistoryTab';
import { SystemsTab } from './tabs/SystemsTab';
import { CultureTab } from './tabs/CultureTab';
import { WorldEmptyState } from './components/WorldEmptyState';

export function WorldPage() {
  const { activeTab } = useOutletContext<{ activeTab: WorldTab, setActiveTab: (tab: WorldTab) => void }>();
  const {
    isEditing,
    prompt,
    setGeneratedWorld: updateGlobalWorld
  } = useGenerator();

  const { generatedWorld, isGeneratingWorld } = useWorldState();

  const renderTabContent = () => {
    if (isGeneratingWorld) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] space-y-8">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-studio/20 border-t-studio rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
            <div className="absolute inset-0 m-auto w-2 h-2 bg-studio rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-black tracking-[0.3em] text-[10px] uppercase text-studio animate-pulse">Building your world's foundation...</p>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Creating history, geography, and lore</p>
          </div>
        </div>
      );
    }

    if (!generatedWorld) {
      return (
        <WorldEmptyState
          onLaunch={() => {
            window.dispatchEvent(new CustomEvent('studio-generate-all'));
          }}
          isGenerating={isGeneratingWorld}
        />
      );
    }

    const tabProps = {
      isEditing,
      content: generatedWorld,
      onContentChange: (val: string) => {
        updateGlobalWorld(val);
      }
    };

    switch (activeTab) {
      case 'architecture':
        return <ArchitectureTab {...tabProps} prompt={prompt || ''} />;
      case 'atlas':
        return <AtlasTab {...tabProps} />;
      case 'history':
        return <HistoryTab {...tabProps} />;
      case 'systems':
        return <SystemsTab {...tabProps} />;
      case 'culture':
        return <CultureTab {...tabProps} />;
      default:
        return <ArchitectureTab {...tabProps} prompt={prompt || ''} />;
    }
  };

  return (
    <div data-testid="marker-world-architecture" className="space-y-8 pb-20">
      <div className={cn(
        "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700 border border-white/5",
        activeTab === 'architecture' && "border-studio/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
      )}>
        <div className="w-full p-8 lg:p-10 max-w-[1400px] mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
