import { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Database, 
  Cpu,
  CreditCard,
  Settings,
  ChevronRight,
  Zap,
  Activity,
  Globe,
  Wifi,
  WifiOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ScrollArea } from '../components/ui/scroll-area';
import { settingsService, UserBalance } from '../services/settingsService';

// Import sub-pages
import { ProfileSettings } from './settings/Profile';
import { SecuritySettings } from './settings/Security';
import { NotificationSettings } from './settings/Notifications';
import { AIModelSettings } from './settings/AIModels';
import { DataStorageSettings } from './settings/DataStorage';
import { BillingSettings } from './settings/Billing';

const SETTINGS_TABS = [
  { id: 'profile', icon: User, label: 'Profile Identity', sub: 'Personal metadata & role' },
  { id: 'security', icon: Shield, label: 'Neural Security', sub: 'Encryption & access' },
  { id: 'notifications', icon: Bell, label: 'Comms Control', sub: 'Sync pings & alerts' },
  { id: 'ai-models', icon: Cpu, label: 'Model Engine', sub: 'LLM & prompt parameters' },
  { id: 'data', icon: Database, label: 'Cloud Vault', sub: 'Storage & snapshots' },
  { id: 'billing', icon: CreditCard, label: 'Studio Credits', sub: 'Subscription & tier' },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [backendStatus, setBackendStatus] = useState('UNKNOWN');
  const [aiProviders, setAiProviders] = useState<{ active: number; configured: number; openai: string; anthropic: string; groq: string; } | null>(null);

  useEffect(() => {
    const hydrateTelemetry = async () => {
      try {
        const [balanceData, healthRes, aiRes] = await Promise.all([
          settingsService.getBalance(),
          fetch('/_orchestrator/health').catch(() => ({ ok: false } as Response)),
          fetch('/_orchestrator/ai').catch(() => ({ ok: false } as Response))
        ]);

        setBalance(balanceData);
        setIsOnline(healthRes.ok || false);

        if (healthRes.ok) {
          const healthJson = await healthRes.json().catch(() => null);
          setBackendStatus(healthJson?.backend?.status ?? 'UNKNOWN');
        } else {
          setBackendStatus('OFFLINE');
        }

        if (aiRes.ok) {
          const aiJson = await aiRes.json().catch(() => null);
          const openaiStatus = aiJson?.ai?.openai ?? 'UNKNOWN';
          const anthropicStatus = aiJson?.ai?.anthropic ?? 'UNKNOWN';
          const groqStatus = aiJson?.ai?.groq ?? 'UNKNOWN';
          const configured = [openaiStatus, anthropicStatus, groqStatus].filter((s: string) => s !== 'UNKNOWN').length;
          const active = [openaiStatus, anthropicStatus, groqStatus].filter((s: string) => s === 'CONNECTED').length;

          setAiProviders({
            openai: openaiStatus,
            anthropic: anthropicStatus,
            groq: groqStatus,
            active,
            configured
          });
        } else {
          setAiProviders(null);
        }
      } catch (e) {
        console.error("Telemetry sync failed:", e);
        setIsOnline(false);
        setBackendStatus('OFFLINE');
        setAiProviders(null);
      }
    };

    hydrateTelemetry();
    const interval = setInterval(hydrateTelemetry, 30000); // Sync every 30s
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'security' && <SecuritySettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
        {activeTab === 'ai-models' && <AIModelSettings />}
        {activeTab === 'data' && <DataStorageSettings />}
        {activeTab === 'billing' && <BillingSettings />}
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#030303] overflow-hidden flex flex-col p-6 lg:p-12">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4" />
      
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col h-full flex-1">
        
        {/* Premium Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                <Settings className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/80">System Core</span>
            </div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Orchestrator <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">Config</span>
            </h1>
            <p className="text-zinc-500 font-medium max-w-xl text-sm leading-relaxed">
              Fine-tune your creative environment, neural engine parameters, and cloud synchronization protocols.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-8 px-10 border-l border-zinc-900/50 h-fit">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-2">Sync Status</span>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-cyan-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">CLOUD ENCRYPTED</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-red-500" />
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">OFFLINE MODE</span>
                  </>
                )}
              </div>
              <p className="text-[8px] text-zinc-500 uppercase tracking-[0.2em] mt-1">FastAPI: {backendStatus}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-2">AI Providers</span>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                  {aiProviders ? `${aiProviders.active}/${aiProviders.configured} ACTIVE` : 'LOADING...'}
                </span>
              </div>
              {aiProviders && (
                <p className="text-[8px] text-zinc-500 uppercase tracking-[0.2em] mt-1">
                  OpenAI: {aiProviders.openai}, Anthropic: {aiProviders.anthropic}, Groq: {aiProviders.groq}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-2">Neural Credits</span>
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-fuchsia-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{balance?.credits ?? '--'} UNITS</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-col lg:flex-row gap-12 flex-1 overflow-hidden">
          {/* Nav Sidebar - Glassmorphic */}
          <nav className="w-full lg:w-80 flex-shrink-0 space-y-2 animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="bg-zinc-900/20 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-4 space-y-1">
              {SETTINGS_TABS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                    activeTab === item.id 
                      ? "bg-red-500/10 border border-red-500/20" 
                      : "hover:bg-white/5 border border-transparent"
                  )}
                >
                  {activeTab === item.id && (
                    <motion.div 
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none"
                    />
                  )}
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                      activeTab === item.id 
                        ? "bg-red-500 text-black shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
                        : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                    )}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className={cn(
                        "text-[11px] font-black uppercase tracking-widest transition-colors",
                        activeTab === item.id ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                      )}>{item.label}</p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-0.5">{item.sub}</p>
                    </div>
                  </div>

                  <ChevronRight className={cn(
                    "w-4 h-4 transition-all duration-500",
                    activeTab === item.id ? "text-red-500 translate-x-0" : "text-zinc-800 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </button>
              ))}
            </div>

            <div className="p-8 bg-zinc-900/10 border border-zinc-900/50 rounded-[2rem] mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-zinc-600" />
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Matrix Health</span>
              </div>
              <div className="space-y-2">
                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className={cn(
                    "h-full transition-all duration-1000",
                    isOnline ? "bg-cyan-500/40 w-full animate-pulse" : "bg-red-500/40 w-1/4"
                  )} />
                </div>
                <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">
                  {isOnline ? "Protocol Version 4.0.2 Stable" : "Emergency Offline Protocol Active"}
                </p>
              </div>
            </div>

            <div className="p-6 bg-zinc-900/10 border border-zinc-900/50 rounded-[2rem] space-y-4">
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-zinc-600" />
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Orchestrator Status</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-zinc-950/80 border border-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">FastAPI Backend</span>
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-black uppercase rounded-full",
                      backendStatus === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/10' : 'bg-red-500/10 text-red-300 border border-red-500/10'
                    )}>{backendStatus}</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-zinc-950/80 border border-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">AI Providers</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                      {aiProviders ? `${aiProviders.active}/${aiProviders.configured} active` : 'Syncing...'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {['OpenAI', 'Anthropic', 'Groq'].map((provider) => {
                      const status = aiProviders ? (aiProviders[provider.toLowerCase() as 'openai' | 'anthropic' | 'groq'] ?? 'UNKNOWN') : 'SYNCING';
                      return (
                        <div key={provider} className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                          <span>{provider}</span>
                          <span className={cn(
                            "px-2 py-1 rounded-full font-black text-[10px]",
                            status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-300' : status === 'AUTH OK' ? 'bg-yellow-500/10 text-yellow-300' : 'bg-red-500/10 text-red-300'
                          )}>{status}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <ScrollArea className="h-full lg:h-[calc(100vh-280px)] pr-6 -mr-6">
              <div className="animate-in fade-in slide-in-from-right-4 duration-1000">
                <AnimatePresence mode="wait">
                  {renderContent()}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
}


