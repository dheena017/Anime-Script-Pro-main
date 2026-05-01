import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Gauge, TrendingUp, Zap, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { engineApi } from '@/services/api/engine';

export const EngineOptimization: React.FC = () => {
  const [telemetry, setTelemetry] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const data = await engineApi.getRecentTelemetry(100);
        setTelemetry(data || []);
      } catch (err) {
        console.error("Failed to fetch telemetry:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTelemetry();
  }, []);

  const avgLatency = telemetry.length > 0 
    ? Math.round(telemetry.reduce((acc, curr) => acc + curr.latency_ms, 0) / telemetry.length) 
    : 0;
  
  const successRate = telemetry.length > 0
    ? Math.round((telemetry.filter(t => t.status === 'SUCCESS').length / telemetry.length) * 100)
    : 100;

  const stats = [
    { label: 'Neural Latency', value: `${avgLatency}ms`, trend: '-12%', icon: Zap, color: 'text-amber-400' },
    { label: 'Success Rate', value: `${successRate}%`, trend: '+2.4%', icon: Activity, color: 'text-emerald-400' },
    { label: 'Cycle Count', value: telemetry.length.toString(), trend: '+5', icon: Cpu, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Activity className="w-3 h-3 text-blue-500" />
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Optimization Suite</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            PERFORMANCE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-400">METRICS</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-zinc-950/50 border border-white/5 rounded-[2rem] relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[40px] pointer-events-none" />
            <div className={cn("w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
            <div className="flex items-end gap-3 mt-2">
              <span className="text-3xl font-black text-white uppercase tracking-tighter">{isLoading ? '---' : stat.value}</span>
              <span className={cn("text-[10px] font-bold mb-1.5", stat.trend.includes('+') ? 'text-emerald-400' : 'text-zinc-500')}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="p-10 bg-[#050505] border border-white/5 rounded-[2.5rem] space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Gauge className="w-4 h-4 text-blue-500" />
              Real-time Workload
            </h4>
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Neural Cluster #04</span>
          </div>

          <div className="space-y-6">
            {[
              { name: 'Core Synthesis', val: 65 },
              { name: 'Context Parsing', val: 42 },
              { name: 'Asset Indexing', val: 88 },
            ].map((bar) => (
              <div key={bar.name} className="space-y-3">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                  <span className="text-zinc-400">{bar.name}</span>
                  <span className="text-white">{bar.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.val}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10 bg-zinc-950/30 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 400 400">
              {[...Array(6)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={200 + Math.cos(i * 60 * Math.PI / 180) * 120}
                  cy={200 + Math.sin(i * 60 * Math.PI / 180) * 120}
                  r="4"
                  fill="#3b82f6"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
              <motion.circle 
                cx="200" cy="200" r="10" fill="#3b82f6"
                animate={{ r: [10, 12, 10], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {[...Array(6)].map((_, i) => (
                <motion.line
                  key={`line-${i}`}
                  x1="200" y1="200"
                  x2={200 + Math.cos(i * 60 * Math.PI / 180) * 120}
                  y2={200 + Math.sin(i * 60 * Math.PI / 180) * 120}
                  stroke="#3b82f6"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              ))}
            </svg>
          </div>
          
          <div className="relative z-10 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Neural Linkage Active</h4>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed max-w-[240px]">
              Synchronizing production nodes across distributed AI clusters for maximum coherence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


