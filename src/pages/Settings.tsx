import { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Database, 
  Cpu,
  CreditCard,
  LogOut
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { ScrollArea } from '../components/ui/scroll-area';

// Import sub-pages
import { ProfileSettings } from './settings/Profile';
import { SecuritySettings } from './settings/Security';
import { NotificationSettings } from './settings/Notifications';
import { AIModelSettings } from './settings/AIModels';
import { DataStorageSettings } from './settings/DataStorage';
import { BillingSettings } from './settings/Billing';

const SETTINGS_TABS = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'ai-models', icon: Cpu, label: 'AI Models' },
  { id: 'data', icon: Database, label: 'Data & Storage' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
];

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Optionally, show a spinner or message
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />;
      case 'security': return <SecuritySettings />;
      case 'notifications': return <NotificationSettings />;
      case 'ai-models': return <AIModelSettings />;
      case 'data': return <DataStorageSettings />;
      case 'billing': return <BillingSettings />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="space-y-2 mb-8 flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          Settings
        </h1>
        <p className="text-zinc-500">Manage your workspace preferences and neural engine configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1 overflow-y-auto pr-2 no-scrollbar">
          {SETTINGS_TABS.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full justify-start transition-all duration-200 h-11",
                activeTab === item.id 
                  ? "bg-red-500/10 text-red-500 hover:text-red-400 hover:bg-red-500/20" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              <item.icon className={cn("w-4 h-4 mr-3", activeTab === item.id ? "text-red-500" : "text-zinc-500")} />
              {item.label}
            </Button>
          ))}
          <div className="pt-6 mt-6 border-t border-zinc-800/50">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 h-11"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 pr-4">
          <div className="max-w-3xl pb-20">
            {renderContent()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
