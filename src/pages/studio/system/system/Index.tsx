import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Server, 
  Database, 
  Network,
  Clock,
  RefreshCw
} from 'lucide-react';

const StatusCard = ({ 
  icon: Icon, 
  title, 
  value, 
  status, 
  color 
}: { 
  icon: any, 
  title: string, 
  value: string, 
  status: string, 
  color: string 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-all group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg bg-black/40 border border-${color}-500/20 group-hover:border-${color}-500/50 transition-colors`}>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
      <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-${color}-500/10 text-${color}-500 border border-${color}-500/20 animate-pulse`}>
        {status}
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  </motion.div>
);

export const SystemStatus: React.FC = () => {
  const [lastUpdate, setLastUpdate] = React.useState(new Date());

  const systems = [
    {
      icon: Cpu,
      title: "Neural Core",
      value: "V3.24-Stable",
      status: "Operational",
      color: "emerald"
    },
    {
      icon: Zap,
      title: "System Load",
      value: "14%",
      status: "Optimal",
      color: "cyan"
    },
    {
      icon: Globe,
      title: "Global Edge",
      value: "128ms",
      status: "Active",
      color: "blue"
    },
    {
      icon: ShieldCheck,
      title: "Security Uplink",
      value: "Level 9",
      status: "Encrypted",
      color: "indigo"
    },
    {
      icon: Server,
      title: "Orchestrator",
      value: "Node-Beta",
      status: "Online",
      color: "purple"
    },
    {
      icon: Database,
      title: "Storage Grid",
      value: "99.99%",
      status: "Ready",
      color: "amber"
    }
  ];

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
            System <span className="text-emerald-500">Diagnostics</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-xl">
            Real-time telemetry and health monitoring for the Studio Architect Neural Infrastructure. 
            All systems synchronized across global edge nodes.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Last Sync</div>
            <div className="text-xs text-emerald-500 font-mono flex items-center gap-1.5 justify-end">
              <Clock className="w-3 h-3" />
              {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
          <button 
            onClick={() => setLastUpdate(new Date())}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((system, idx) => (
          <StatusCard key={idx} {...system} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-500" />
              Real-time Throughput
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] text-emerald-500 font-bold uppercase">Live Telemetry</span>
            </div>
          </div>
          <div className="h-48 flex items-end gap-1">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${20 + Math.random() * 80}%` }}
                transition={{ repeat: Infinity, duration: 1 + Math.random(), repeatType: 'reverse' }}
                className="flex-1 bg-gradient-to-t from-emerald-500/10 to-emerald-500/40 rounded-t-sm"
              />
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Network className="w-5 h-5 text-blue-500" />
              Node Infrastructure
            </h3>
            <span className="text-[10px] text-blue-500 font-bold uppercase">Active Nodes: 12</span>
          </div>
          <div className="space-y-4">
            {['Tokyo-Prime-01', 'London-Alpha-04', 'US-East-Gamma-09'].map((node, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-bold text-zinc-300">{node}</span>
                </div>
                <div className="text-xs font-mono text-zinc-500">99.99% Uptime</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
