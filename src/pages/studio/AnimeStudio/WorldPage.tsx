import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';
import { useOutletContext } from 'react-router-dom';
import { WorldTab } from '../components/World/Tabs/WorldTabs';

// Modularized Tab Components
import { WorldArchitecture } from './World/tabs/WorldArchitecture';
import { WorldAtlas } from './World/tabs/WorldAtlas';
import { WorldHistory } from './World/tabs/WorldHistory';
import { WorldSystems } from './World/tabs/WorldSystems';
import { WorldCulture } from './World/tabs/WorldCulture';
import { WorldEmptyState } from '../components/World/WorldEmptyState';

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
        return <WorldArchitecture />;
      case 'atlas':
        return <WorldAtlas />;
      case 'history':
        return <WorldHistory />;
      case 'systems':
        return <WorldSystems />;
      case 'culture':
        return <WorldCulture />;
      default:
        return <WorldArchitecture />;
    }
  };

  return (
    <div data-testid="marker-world-architecture">
      <Card className={cn(
        "bg-[#030303] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700",
        activeTab === 'architecture' 
          ? "border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] hover:border-studio/50" 
          : "border-zinc-800/30 hover:border-zinc-700"
      )}>
        <div className={cn(
          "absolute inset-0 border-[1px] rounded-[2.5rem] pointer-events-none transition-colors duration-700",
          activeTab === 'architecture' ? "border-studio/20 group-hover/card:border-studio/40" : "border-white/5"
        )} />
        
        <div className="w-full p-0">
          <div className="p-12 max-w-[1400px] mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


