import { useEffect, useState, useCallback } from 'react';
import {
  Cpu,
  BrainCircuit,
  Activity,
  DatabaseZap,
  Sparkles,
  Wand2,
  Mic,
  Image as ImageIcon,
  BoxSelect,
  Loader2,
  Key,
  Eye,
  EyeOff,
  Zap,
  Globe,
  ChevronRight,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { cn } from '../../lib/utils';
import { settingsService } from '../../services/api/settings';
import { ExternalModelNetwork } from './ExternalModelNetwork';
import { GeminiStatusCard } from './GeminiStatusCard';
import { getAIClient } from '../../services/generators/core';
import { motion, AnimatePresence } from 'framer-motion';

export function AIModelSettings() {
  const [model, setModel] = useState('gemini-2.5-flash');
  const [temperature, setTemperature] = useState(0.85);
  const [swarmMode, setSwarmMode] = useState(false);
  const [enforcer, setEnforcer] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState("You are the Ultimate Production Architect. Never output generic anime tropes. Always utilize 'Show, Don't Tell' rules. Treat every action line as a highly detailed camera directive.");

  const [geminiKey, setGeminiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testError, setTestError] = useState('');

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Hydrate configurations from PostgreSQL via FastAPI
  useEffect(() => {
    async function hydrate() {
      const dbSettings = await settingsService.getSettings();
      if (dbSettings && dbSettings.ai_models) {
        const ai = dbSettings.ai_models;
        if (ai.primary_engine) setModel(ai.primary_engine);
        if (ai.temperature) setTemperature(ai.temperature);
        if (ai.swarm_mode !== undefined) setSwarmMode(ai.swarm_mode);
        if (ai.cinematic_enforcer !== undefined) setEnforcer(ai.cinematic_enforcer);
        if (ai.system_prompt) setSystemPrompt(ai.system_prompt);
        if (ai.gemini_api_key) setGeminiKey(ai.gemini_api_key);
      }
      setLoading(false);
    }
    hydrate();
  }, []);

  // Atomic Cloud Sync
  const syncToCloud = useCallback(async (payloadOverrides = {}) => {
    setIsSaving(true);
    if (geminiKey) {
      localStorage.setItem('gemini_api_key', geminiKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    await settingsService.updateSettings({
      ai_models: {
        primary_engine: model,
        temperature,
        swarm_mode: swarmMode,
        cinematic_enforcer: enforcer,
        system_prompt: systemPrompt,
        gemini_api_key: geminiKey,
        ...payloadOverrides
      }
    });
    setTimeout(() => setIsSaving(false), 800);
  }, [model, temperature, swarmMode, enforcer, systemPrompt, geminiKey]);

  const clearBrowserKey = async () => {
    localStorage.removeItem('gemini_api_key');
    setGeminiKey('');
    setTestStatus('idle');
    setTestError('');
    await syncToCloud({ gemini_api_key: '' });
  };

  const testConnection = async () => {
    if (!geminiKey) return;
    setIsTesting(true);
    setTestStatus('idle');
    setTestError('');

    try {
      const client = getAIClient(geminiKey);
      if (!client) throw new Error("Failed to initialize client");
      const models = await client.models.list();
      if (models) {
        setTestStatus('success');
      } else {
        throw new Error("No response from Gemini API");
      }
    } catch (e: any) {
      console.error("Gemini API Test Failed:", e);
      setTestStatus('error');
      setTestError(e.message || "Authentication failed. Check your API key and network connection.");
    } finally {
      setIsTesting(false);
    }
  };

  const toggleModel = (newModel: string) => { setModel(newModel); syncToCloud({ primary_engine: newModel }); };
  const toggleSwarm = () => { const n = !swarmMode; setSwarmMode(n); syncToCloud({ swarm_mode: n }); };
  const toggleEnforcer = () => { const n = !enforcer; setEnforcer(n); syncToCloud({ cinematic_enforcer: n }); };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-studio animate-spin" />
          <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em]">Initializing Core Terminal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">

      {/* 1. ATOMIC SYNC OVERLAY */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-8 right-8 z-[100] flex items-center gap-3 px-5 py-2.5 bg-studio/10 border border-studio/20 backdrop-blur-xl rounded-full shadow-[0_20px_50px_rgba(6,182,212,0.2)]"
          >
            <div className="w-2 h-2 rounded-full bg-studio animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-studio">Atomic Cloud Sync Active</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* 2. NEURAL CORE ARCHITECTURE */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="bg-[#0a0a0b] border border-white/5 rounded-[3rem] shadow-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-studio/5 blur-[150px] rounded-full pointer-events-none" />

            <CardHeader className="border-b border-white/5 p-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-studio/10 flex items-center justify-center border border-studio/20 shadow-2xl">
                    <BrainCircuit className="w-7 h-7 text-studio" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase italic">Neural Core Terminal</CardTitle>
                    <CardDescription className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Global Inference Engine & Token Protocol Hub</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-1.5 bg-white/[0.03] rounded-full border border-white/5">
                  <Activity className="w-3.5 h-3.5 text-studio animate-pulse" />
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Engine Status: Optimal</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-12 space-y-12">

              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-black tracking-[0.4em] text-zinc-700 uppercase italic">Primary Inference Engine</h4>
                  <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">Protocol ID: NODE-E1-GLOBAL</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'gemini-3.1-pro', title: 'Gemini 3.1 Pro', icon: BrainCircuit, color: 'studio', tag: 'V3.1 PREVIEW', desc: 'Peak creation reasoning. 2M token context window.' },
                    { id: 'gemini-3.1-flash', title: 'Gemini 3.1 Flash', icon: Zap, color: 'cyan-500', tag: 'HYPER-SPEED', desc: 'Instantaneous synthesis. Zero-latency creative bursts.' },
                    { id: 'gemini-2.5-flash', title: 'Gemini 2.5 Flash', icon: Cpu, color: 'studio', tag: 'STABLE API', desc: 'Stable velocity core. Best for rapid dialogue iteration.' },
                    { id: 'gemini-1.5-pro', title: 'Gemini 1.5 Pro', icon: DatabaseZap, color: 'fuchsia-500', tag: 'HEAVY COMPUTE', desc: 'Multiversal lore synthesis. Specialized massive context.' }
                  ].map((eng) => (
                    <div
                      key={eng.id}
                      onClick={() => toggleModel(eng.id)}
                      className={cn(
                        "relative p-8 rounded-[2rem] border cursor-pointer transition-all duration-500 flex flex-col gap-6 group/eng overflow-hidden",
                        model === eng.id
                          ? `bg-${eng.color}/5 border-${eng.color}/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform scale-[1.02]`
                          : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <eng.icon className={cn("w-8 h-8 transition-colors duration-500", model === eng.id ? `text-${eng.color}` : "text-zinc-800")} />
                        <span className={cn(
                          "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border",
                          model === eng.id ? `bg-${eng.color}/20 text-${eng.color} border-${eng.color}/20` : "bg-zinc-900 text-zinc-700 border-white/5"
                        )}>{eng.tag}</span>
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-lg font-black text-white uppercase italic tracking-tighter group-hover/eng:text-studio transition-colors">{eng.title}</h5>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">{eng.desc}</p>
                      </div>
                      {model === eng.id && (
                        <div className="absolute bottom-4 right-6 text-studio">
                          <CheckCircle2 className="w-5 h-5 fill-studio text-black" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Generators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <ImageIcon className="w-4 h-4 text-studio" />
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Visual Base Engine</span>
                  </div>
                  <div className="relative">
                    <select className="w-full bg-black/60 border border-zinc-900 rounded-2xl px-6 py-4 text-[11px] font-black text-white outline-none focus:border-studio/50 transition-all appearance-none cursor-pointer uppercase tracking-widest">
                      <option>Stable Diffusion XL (God Mode)</option>
                      <option>Midjourney V6 Protocol</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <Mic className="w-4 h-4 text-fuchsia-500" />
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Neural Voice Link</span>
                  </div>
                  <div className="relative">
                    <select className="w-full bg-black/60 border border-zinc-900 rounded-2xl px-6 py-4 text-[11px] font-black text-white outline-none focus:border-studio/50 transition-all appearance-none cursor-pointer uppercase tracking-widest">
                      <option>ElevenLabs V2 (Anime Specialized)</option>
                      <option>Neural Voice v4 Standard</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Advanced Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-white/5">
                <div className="space-y-8">
                  <div className="space-y-4 group">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] group-hover:text-studio transition-colors">Neural Temperature</label>
                      <div className="px-3 py-1 bg-studio/10 rounded-lg text-xs font-black text-studio tabular-nums italic">
                        {temperature.toFixed(2)}
                      </div>
                    </div>
                    <div className="relative py-4">
                      <input
                        type="range" min="0" max="1" step="0.05" value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        onMouseUp={() => syncToCloud()}
                        className="w-full accent-studio cursor-pointer h-2 bg-zinc-900 rounded-full appearance-none relative z-10"
                      />
                      <div className="absolute inset-0 bg-studio/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex justify-between text-[9px] font-black uppercase text-zinc-800 tracking-widest">
                      <span>Analytical (0.0)</span><span>Creative (1.0)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      id: 'enforcer',
                      active: enforcer,
                      toggle: toggleEnforcer,
                      icon: Sparkles,
                      color: 'studio',
                      label: 'Cinematic Enforcer Matrix',
                      desc: 'Override generic output with high-fidelity camera directives.'
                    },
                    {
                      id: 'swarm',
                      active: swarmMode,
                      toggle: toggleSwarm,
                      icon: Wand2,
                      color: 'emerald-500',
                      label: 'Multi-Agent Swarm (Beta)',
                      desc: 'Deploy sub-agent clusters for script validation.'
                    }
                  ].map((feat) => (
                    <div
                      key={feat.id}
                      onClick={feat.toggle}
                      className={cn(
                        "flex items-center justify-between p-6 rounded-[1.5rem] border transition-all cursor-pointer group/feat",
                        feat.active ? `bg-${feat.color}/5 border-${feat.color}/20` : "bg-white/[0.02] border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="flex gap-5 items-center">
                        <div className={cn("p-3 rounded-xl shrink-0 transition-all duration-500", feat.active ? `bg-${feat.color}/20` : "bg-zinc-900")}>
                          <feat.icon className={cn("w-5 h-5", feat.active ? `text-${feat.color} animate-pulse` : "text-zinc-800")} />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-white uppercase tracking-widest italic">{feat.label}</p>
                          <p className="text-[9px] font-bold text-zinc-700 tracking-wider mt-1">{feat.desc}</p>
                        </div>
                      </div>
                      <div className={cn("w-12 h-6 rounded-full relative transition-colors", feat.active ? `bg-${feat.color}` : "bg-zinc-900")}>
                        <div className={cn("absolute top-1 w-4 h-4 rounded-full transition-all duration-500 shadow-2xl", feat.active ? "left-7 bg-white" : "left-1 bg-zinc-700")} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Prompt */}
              <div className="pt-10 border-t border-white/5 space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic flex items-center gap-3">
                    <BoxSelect className="w-4 h-4 text-studio" /> Global System Directive
                  </h4>
                  <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">Sovereign Override Active</span>
                </div>
                <div className="relative group/prompt">
                  <div className="absolute -inset-1 bg-studio/5 rounded-[2.5rem] blur-xl opacity-0 group-focus-within/prompt:opacity-100 transition duration-700" />
                  <textarea
                    className="w-full bg-black/60 border border-zinc-900 rounded-[2.5rem] p-10 text-xs text-studio font-mono focus:border-studio/50 focus:outline-none transition-all resize-none shadow-3xl leading-relaxed"
                    rows={5}
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    onBlur={() => syncToCloud()}
                  />
                </div>
                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest text-center">This directive is permanently prefixed to all outgoing API transmissions.</p>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* 3. VAULT SIDEBAR */}
        <div className="lg:col-span-4 space-y-10">
          <Card className="bg-[#0a0a0b] border border-white/5 rounded-[3rem] shadow-3xl relative overflow-hidden group">
            <CardHeader className="border-b border-white/5 p-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-studio/10 flex items-center justify-center border border-studio/20 shadow-2xl">
                  <Key className="w-5 h-5 text-studio" />
                </div>
                <div>
                  <CardTitle className="text-sm font-black text-white uppercase tracking-widest italic">Secure Vault Hub</CardTitle>
                  <CardDescription className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Encrypted Key Management</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] ml-2">Gemini Protocol Key</label>
                <div className="relative group/key">
                  <input
                    type={showKey ? "text" : "password"}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    onBlur={() => syncToCloud()}
                    placeholder="AIZA..."
                    className="w-full bg-black/60 border border-zinc-900 rounded-2xl px-6 py-5 text-[11px] text-white focus:border-studio/50 focus:outline-none transition-all pr-28 font-mono tracking-widest uppercase"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="p-2 text-zinc-700 hover:text-studio transition-colors"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={clearBrowserKey}
                      className="text-[9px] font-black text-zinc-800 hover:text-red-500 uppercase tracking-widest px-2"
                    >
                      Purge
                    </button>
                  </div>
                </div>
                <p className="text-[8px] font-bold text-zinc-800 uppercase tracking-widest px-2 leading-relaxed">
                  Your transmission key is encrypted and stored in the private cloud vault.
                </p>
              </div>

              <GeminiStatusCard
                apiKey={geminiKey}
                onTest={testConnection}
                isTesting={isTesting}
                status={testStatus}
                lastError={testError}
              />
            </CardContent>
          </Card>

          <div className="p-10 bg-studio/[0.03] border border-studio/20 rounded-[3rem] space-y-6 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-16 h-16 text-studio" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-studio flex items-center justify-center">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <h5 className="text-xs font-black text-white uppercase italic tracking-tighter">Priority Uplink</h5>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest relative z-10">
              Providing your own API key enables <span className="text-studio">Ultra Priority</span> mode, bypassing global queue limits and granting access to experimental models like Gemini 2.0 Pro.
            </p>
            <div className="pt-4 flex items-center gap-2 text-[9px] font-black text-studio uppercase tracking-widest relative z-10 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
              UPGRADE STATUS <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Vault Security active</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-zinc-700" />
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Global cluster sync</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16">
        <ExternalModelNetwork />
      </div>
    </div>
  );
}

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
