import React from 'react';
import { User, Shield, Zap, Bell, Database, Sliders } from 'lucide-react';
import { cn } from "@/lib/utils";

const tabs = [
  { id: 'general', label: "General", icon: Sliders },
  { id: 'profile', label: "Profile", icon: User },
  { id: 'security', label: "Security", icon: Shield },
  { id: 'ai', label: "AI Models", icon: Zap },
  { id: 'notifications', label: "Alerts", icon: Bell },
  { id: 'data', label: "Data", icon: Database },
];

interface SettingsToolbarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const SettingsToolbar: React.FC<SettingsToolbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-zinc-950 border border-white/5 rounded-[2rem] mb-8 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-xl border transition-all whitespace-nowrap",
            activeTab === tab.id 
              ? "bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
              : "bg-transparent border-transparent text-zinc-500 hover:text-white"
          )}
        >
          <tab.icon className="w-3.5 h-3.5" />
          <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};


