import React from 'react';
import { Hash, Tag, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SEOTab = 'keywords' | 'description' | 'alt-texts';

interface SEOTabsProps {
  activeTab: SEOTab;
  setActiveTab: (tab: SEOTab) => void;
}

export const SEOTabs: React.FC<SEOTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: SEOTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'keywords', label: 'Keywords', icon: Hash },
    { id: 'description', label: 'Metadata', icon: Tag },
    { id: 'alt-texts', label: 'Alt Texts', icon: Globe },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#080808]/60 border border-white/5 rounded-[1.5rem] backdrop-blur-2xl relative overflow-hidden group">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 group/tab',
              isActive ? 'text-white bg-white/10 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.08)]' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            <Icon className={cn('w-3.5 h-3.5 transition-transform duration-300', isActive ? 'opacity-100' : 'opacity-40 group-hover/tab:opacity-70')} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
