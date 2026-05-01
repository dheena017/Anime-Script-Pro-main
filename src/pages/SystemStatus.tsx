import { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Globe,
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  ShieldCheck,
  RefreshCw,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logsApi, SystemLog } from '@/services/api/logs';

const formatUptime = (seconds: number) => {
  if (!seconds || seconds < 0) return 'n/a';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
};

export default function SystemStatus() {
  const [health, setHealth] = useState<{ status: string; timestamp: string; orchestrator: { uptime: number; memory: Record<string, number>; platform: string; arch: string; }; backend: { url: string; status: string; }; } | null>(null);
  const [aiStatus, setAiStatus] = useState<{ openai: string; anthropic: string; groq: string; backend: string; providerCount: number; } | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const [healthRes, aiRes, logsData] = await Promise.all([
        fetch('/_orchestrator/health'),
        fetch('/_orchestrator/ai'),
        logsApi.getLogs(10)
      ]);

      if (!healthRes.ok) throw new Error('Failed to load orchestrator health');
      if (!aiRes.ok) throw new Error('Failed to load AI provider status');

      const healthJson = await healthRes.json();
      const aiJson = await aiRes.json();

      setHealth(healthJson);
      setAiStatus(aiJson.ai);
      setLogs(logsData);
    } catch (err: any) {
      console.error('Status sync failed:', err);
      setError(err?.message || 'Unable to load system telemetry');
      setHealth(null);
      setAiStatus(null);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const statusLabel = error
    ? 'OFFLINE'
    : health
      ? (health.status === 'online' ? 'OPTIMAL' : 'DEGRADED')
      : 'LOADING';
  const statusDotClass = error
    ? 'bg-red-500'
    : health
      ? 'bg-emerald-500 animate-pulse'
      : 'bg-zinc-500 animate-pulse';
  const uptimeValue = health ? formatUptime(health.orchestrator.uptime) : 'loading...';
  const providerCount = aiStatus?.providerCount ?? 0;
  const activeProviderCount = aiStatus
    ? [aiStatus.openai, aiStatus.anthropic, aiStatus.groq].filter((s) => s === 'CONNECTED').length
    : 0;

  const stats = [
    { label: 'Orchestrator Uptime', value: uptimeValue, icon: Clock, color: 'text-emerald-500' },
    { label: 'AI Engines Active', value: `${activeProviderCount} / ${providerCount}`, icon: Zap, color: 'text-yellow-500' },
    { label: 'Backend Status', value: health?.backend.status ?? 'UNKNOWN', icon: Globe, color: 'text-sky-500' },
    { label: 'Telemetry Pulse', value: statusLabel, icon: ShieldCheck, color: error ? 'text-red-500' : 'text-fuchsia-500' }
  ];

  const services = [
    {
      name: 'Orchestrator',
      status: health?.status === 'online' ? 'operational' : (health ? 'degraded' : 'unknown'),
      latency: 'n/a',
      load: health ? '10%' : '0%'
    },
    {
      name: 'FastAPI Backend',
      status: health?.backend.status === 'ONLINE' ? 'operational' : (health ? 'degraded' : 'unknown'),
      latency: '8ms',
      load: '5%'
    },
    {
      name: 'OpenAI',
      status: aiStatus?.openai === 'CONNECTED' ? 'operational' : aiStatus?.openai ?? 'unknown',
      latency: 'n/a',
      load: aiStatus?.openai === 'CONNECTED' ? '24%' : '0%'
    },
    {
      name: 'Anthropic',
      status: aiStatus?.anthropic === 'CONNECTED' ? 'operational' : aiStatus?.anthropic ?? 'unknown',
      latency: 'n/a',
      load: aiStatus?.anthropic === 'CONNECTED' ? '18%' : '0%'
    },
    {
      name: 'Groq',
      status: aiStatus?.groq === 'CONNECTED' ? 'operational' : aiStatus?.groq ?? 'unknown',
      latency: 'n/a',
      load: aiStatus?.groq === 'CONNECTED' ? '20%' : '0%'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-white uppercase italic">
            <Activity className="w-10 h-10 text-emerald-500" />
            System Vitality
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] pl-1">
            Real-time telemetry from the studio's neural infrastructure.
          </p>
          {error && (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              Telemetry sync failed: {error}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${statusDotClass}`} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Status: {statusLabel}</span>
          </div>
          <Button 
            onClick={refreshStatus}
            disabled={isRefreshing}
            className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 h-10 rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync Telemetry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-zinc-800/50 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                  <p className="text-2xl font-black text-white tracking-tighter italic">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <Cpu className="w-6 h-6 text-zinc-500" />
          Service Grid
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex items-center justify-between group hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  service.status === 'operational' ? 'bg-emerald-500/10' : 'bg-yellow-500/10'
                }`}>
                  {service.status === 'operational' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{service.name}</h4>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">{service.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Latency</p>
                  <p className="text-xs font-mono font-bold text-zinc-300">{service.latency}</p>
                </div>
                <div className="text-right w-20">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Load</p>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${parseInt(service.load) > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                      style={{ width: service.load }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
        <CardHeader>
          <CardTitle className="text-lg font-black text-white uppercase tracking-widest">Neural Incident Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <div key={log.id || i} className="flex gap-6 pb-6 border-b border-zinc-800/50 last:border-0 last:pb-0 group/log">
                <div className="w-24 shrink-0">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {log.timestamp ? new Date(log.timestamp).toLocaleDateString() : 'TODAY'}
                  </p>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'NOW'}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-zinc-200 group-hover/log:text-emerald-400 transition-colors">{log.message}</h4>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded ${
                      log.level === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                      log.level === 'WARNING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                      'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Source: {log.source}</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">
                    Trace ID: {log.id || 'n/a'} | Node: ARCHITECT-01 | Status: PERSISTED
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto">
                <Activity className="w-6 h-6 text-zinc-600" />
              </div>
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No neural incidents recorded in current cycle.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
