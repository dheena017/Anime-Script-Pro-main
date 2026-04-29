import { useEffect, useState, useCallback } from 'react';
import { Cpu, BrainCircuit, Activity, DatabaseZap, Sparkles, Wand2, Mic, Image as ImageIcon, BoxSelect, Loader2, Save, Key, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { cn } from '../../lib/utils';
import { settingsService } from '../../services/settingsService';
import { ExternalModelNetwork } from '../../components/settings/ExternalModelNetwork';
import { GeminiStatusCard } from '../../components/settings/GeminiStatusCard';
import { getAIClient } from '../../services/generators/core';

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
    setIsSaving(false);
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
      
      // Attempt to list models as a connection test
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
     return <div className="w-full h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-fuchsia-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      {isSaving && (
         <div className="absolute top-4 right-8 z-50 flex items-center gap-2 px-3 py-1.5 bg-fuchsia-500/20 border border-fuchsia-500/50 rounded-full animate-pulse transition-all">
            <Save className="w-3 h-3 text-fuchsia-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white">Syncing to Cluster...</span>
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-[#0a0a0a]/80 backdrop-blur-3xl border-zinc-800/50 shadow-2xl relative overflow-hidden group rounded-3xl">
            <div className="absolute top-0 right-0 p-40 bg-fuchsia-600/10 blur-[150px] rounded-full pointer-events-none" />
            
            <CardHeader className="relative z-10 border-b border-zinc-900 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20 shadow-[0_0_15px_rgba(192,38,211,0.15)]">
                  <BrainCircuit className="w-5 h-5 text-fuchsia-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-white tracking-widest uppercase">Neural Core Architecture</CardTitle>
                  <CardDescription className="text-zinc-500 font-medium">Configure LLMs, token budgets, secondary agent pipelines, and prompt parameters.</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-8 pt-8">
              
              <div className="space-y-4">
                <h4 className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
                  <Activity className="w-3 h-3 text-fuchsia-500" /> Primary Inference Engine
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div 
                     onClick={() => toggleModel('gemini-3.1-pro')}
                     className={cn(
                       "relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-4 overflow-hidden",
                       model === 'gemini-3.1-pro' ? "bg-fuchsia-500/10 border-fuchsia-500/50 shadow-[0_0_30_px_rgba(192,38,211,0.15)] transform scale-[1.02] ring-1 ring-fuchsia-500" : "bg-black/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                     )}
                   >
                      {model === 'gemini-3.1-pro' && <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50" />}
                      <div className="flex justify-between items-start">
                         <BrainCircuit className={cn("w-6 h-6", model === 'gemini-3.1-pro' ? "text-fuchsia-400" : "text-zinc-500")} />
                         <span className="px-2 py-0.5 bg-fuchsia-900/30 text-[9px] font-black uppercase tracking-widest text-fuchsia-500 border border-fuchsia-500/20 rounded">v3.1 Preview</span>
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-white uppercase tracking-widest">Gemini 3.1 Pro</h5>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1">Universal Production Intelligence. The absolute peak of creative reasoning and script architecting.</p>
                      </div>
                   </div>

                   <div 
                     onClick={() => toggleModel('gemini-3.1-flash')}
                     className={cn(
                       "relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-4 overflow-hidden",
                       model === 'gemini-3.1-flash' ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_30_px_rgba(6,182,212,0.15)] transform scale-[1.02] ring-1 ring-cyan-500" : "bg-black/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                     )}
                   >
                      {model === 'gemini-3.1-flash' && <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />}
                      <div className="flex justify-between items-start">
                         <Activity className={cn("w-6 h-6", model === 'gemini-3.1-flash' ? "text-cyan-400" : "text-zinc-500")} />
                         <span className="px-2 py-0.5 bg-cyan-900/30 text-[9px] font-black uppercase tracking-widest text-cyan-500 border border-cyan-500/20 rounded">v3.1 Flash</span>
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-white uppercase tracking-widest">Gemini 3.1 Flash</h5>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1">Instantaneous Synthesis. Hyper-optimized for rapid script beats and real-time world building.</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div 
                     onClick={() => toggleModel('gemini-2.5-flash')}
                     className={cn(
                       "relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-4 overflow-hidden",
                       model === 'gemini-2.5-flash' ? "bg-fuchsia-500/10 border-fuchsia-500/50 shadow-[0_0_30_px_rgba(192,38,211,0.15)] transform scale-[1.02] ring-1 ring-fuchsia-500" : "bg-black/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                     )}
                   >
                      {model === 'gemini-2.5-flash' && <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50" />}
                      <div className="flex justify-between items-start">
                         <Cpu className={cn("w-6 h-6", model === 'gemini-2.5-flash' ? "text-fuchsia-400" : "text-zinc-500")} />
                         <span className="px-2 py-0.5 bg-zinc-800 text-[9px] font-black uppercase tracking-widest text-white rounded">Stable API</span>
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-white uppercase tracking-widest">Gemini 2.5 Flash</h5>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1">Extreme output velocity. Best for rapid iteration, dialogue, and UI population.</p>
                      </div>
                   </div>

                   <div 
                     onClick={() => toggleModel('gemini-1.5-pro')}
                     className={cn(
                       "relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-4 overflow-hidden",
                       model === 'gemini-1.5-pro' ? "bg-red-500/10 border-red-500/50 shadow-[0_0_30_px_rgba(239,68,68,0.15)] transform scale-[1.02] ring-1 ring-red-500" : "bg-black/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                     )}
                   >
                      {model === 'gemini-1.5-pro' && <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />}
                      <div className="flex justify-between items-start">
                         <DatabaseZap className={cn("w-6 h-6", model === 'gemini-1.5-pro' ? "text-red-500" : "text-zinc-500")} />
                         <span className="px-2 py-0.5 bg-red-900/30 text-[9px] font-black uppercase tracking-widest text-red-500 border border-red-500/20 rounded shadow-inner">Max Compute Mode</span>
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-white uppercase tracking-widest">Gemini 1.5 Pro</h5>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1">High-compute heavy lifter. Massive Context limits for deep multiversal lore synthesis.</p>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-5 border border-zinc-900 bg-black/40 rounded-xl space-y-3">
                    <h4 className="text-[10px] font-black tracking-widest text-zinc-400 flex items-center gap-2"><ImageIcon className="w-3 h-3 text-sky-400" /> Visual Base Engine</h4>
                    <select className="bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-xl w-full">
                       <option>Stable Diffusion XL (God Mode Built-in)</option>
                       <option>Midjourney V6 API (External Auth)</option>
                    </select>
                 </div>
                 <div className="p-5 border border-zinc-900 bg-black/40 rounded-xl space-y-3">
                    <h4 className="text-[10px] font-black tracking-widest text-zinc-400 flex items-center gap-2"><Mic className="w-3 h-3 text-indigo-400" /> Neural Voice Synthesis</h4>
                    <select className="bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-xl w-full">
                       <option>ElevenLabs V2 (Multilingual Anime)</option>
                       <option>OpenAI TTS-1-HD (Standard)</option>
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-900">
                 <div className="space-y-8">
                    <div className="space-y-2 group">
                       <div className="flex justify-between">
                          <label className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-fuchsia-400 transition-colors">Model Temperature (Chaos vs Logic)</label>
                          <span className="text-[11px] text-fuchsia-500 font-black">{temperature.toFixed(2)}</span>
                       </div>
                       <input 
                          type="range" min="0" max="1" step="0.05" value={temperature} 
                          onChange={(e) => setTemperature(parseFloat(e.target.value))}
                          onMouseUp={() => syncToCloud()} 
                          className="w-full accent-fuchsia-500 cursor-pointer h-1.5 bg-zinc-900 rounded-full appearance-none"
                       />
                       <div className="flex justify-between text-[9px] font-bold uppercase text-zinc-600">
                          <span>Analytical (0.0)</span><span>Divergent/Creative (1.0)</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div onClick={toggleEnforcer} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-fuchsia-500/20 rounded-xl transition-colors cursor-pointer group hover:bg-zinc-900">
                      <div className="flex gap-4 items-center">
                         <div className="bg-fuchsia-500/10 p-2 rounded shrink-0"><Sparkles className="w-4 h-4 text-fuchsia-400 group-hover:animate-spin" /></div>
                         <div>
                           <p className="text-[11px] font-black text-white uppercase tracking-widest">Cinematic Enforcer Matrix</p>
                           <p className="text-[9px] font-bold text-zinc-500 tracking-wider mt-1 pr-4">Force Hollywood-grade terminology into all scene rendering (e.g., 'Volumetric Fog', 'Sakuga Intensity') autonomously.</p>
                         </div>
                      </div>
                      <div className={cn("w-10 h-5 rounded-full relative shadow-inner shrink-0 transition-colors", enforcer ? "bg-fuchsia-600" : "bg-zinc-800")}>
                        <div className={cn("absolute top-1 w-3 h-3 rounded-full transition-transform", enforcer ? "left-[calc(100%-16px)] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "left-1 bg-zinc-500")} />
                      </div>
                    </div>

                    <div onClick={toggleSwarm} className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-colors cursor-pointer group hover:bg-zinc-900">
                      <div className="flex gap-4 items-center">
                         <div className="bg-emerald-500/10 p-2 rounded shrink-0"><Wand2 className="w-4 h-4 text-emerald-500 group-hover:animate-pulse" /></div>
                         <div>
                           <p className="text-[11px] font-black text-white uppercase tracking-widest">Multi-Agent Swarm (Beta)</p>
                           <p className="text-[9px] font-bold text-zinc-500 tracking-wider mt-1 pr-4">Deploy tiny sub-agents to debate and pre-read scripts before returning the final output to you.</p>
                         </div>
                      </div>
                      <div className={cn("w-10 h-5 rounded-full relative shadow-inner shrink-0 transition-colors", swarmMode ? "bg-emerald-500" : "bg-zinc-800")}>
                        <div className={cn("absolute top-1 w-3 h-3 rounded-full transition-transform", swarmMode ? "left-[calc(100%-16px)] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "left-1 bg-zinc-500")} />
                      </div>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-zinc-900 group">
                 <label className="text-[11px] font-black text-white shadow-sm uppercase tracking-widest mb-3 flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/20 p-2 rounded-lg w-max"><BoxSelect className="w-3 h-3"/> Global System Prompt Injector</label>
                 <textarea 
                   className="w-full bg-black border border-zinc-800 rounded-xl p-5 text-sm text-fuchsia-500 font-mono focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 transition-all resize-y shadow-inner" 
                   rows={4}
                   value={systemPrompt}
                   onChange={(e) => setSystemPrompt(e.target.value)}
                   onBlur={() => syncToCloud()}
                 />
                 <p className="text-[10px] font-bold text-zinc-600 uppercase mt-2">This string is permanently and invisibly prefixed to EVERY API request you execute within God Mode.</p>
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-[#0a0a0a]/80 backdrop-blur-3xl border-zinc-800/50 shadow-2xl relative overflow-hidden group rounded-3xl">
            <CardHeader className="border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-studio/10 rounded-xl border border-studio/20">
                  <Key className="w-4 h-4 text-studio" />
                </div>
                <CardTitle className="text-sm font-black text-white uppercase tracking-widest">API Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gemini API Key</label>
                <div className="relative">
                  <input 
                    type={showKey ? "text" : "password"}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    onBlur={() => syncToCloud()}
                    placeholder="AIza..."
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:border-studio/50 focus:outline-none transition-all pr-28 font-mono"
                  />
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-studio transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={clearBrowserKey}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 hover:text-rose-400 transition-colors"
                  >
                    clear
                  </button>
                </div>
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">Your key is encrypted and stored in your private cloud vault.</p>
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

          <div className="p-6 bg-studio/5 border border-studio/20 rounded-3xl space-y-4">
             <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-studio" />
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Pro Tip: Dual-Linkage</h5>
             </div>
             <p className="text-[9px] text-zinc-400 font-bold leading-relaxed uppercase tracking-tighter">
                Providing your own API key enables "Ultra Priority" mode, bypassing global queue limits and granting access to experimental models like Gemini 2.0 Pro.
             </p>
          </div>
        </div>
      </div>

      <div className="pt-12">
        <ExternalModelNetwork />
      </div>
    </div>
  );
}
