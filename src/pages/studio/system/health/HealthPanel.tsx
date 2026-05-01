import React from 'react';
import { ShieldCheck, Cpu, Zap, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

export const HealthPanel: React.FC = () => {
  const metrics = [
    { label: "Neural Load", value: "24%", icon: Cpu, color: "text-blue-500" },
    { label: "Stability", value: "99.9%", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Latency", value: "18ms", icon: Zap, color: "text-amber-500" },
    { label: "Uptime", value: "720h", icon: Wifi, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-950 border border-white/5 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group hover:border-emerald-500/20 transition-all"
          >
            <m.icon className={`w-8 h-8 ${m.color} mb-4 group-hover:scale-110 transition-transform`} />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{m.label}</p>
            <p className="text-2xl font-black text-white italic">{m.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Network Pulse</h3>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">Operational</span>
        </div>
        <div className="h-40 w-full flex items-end gap-1">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${20 + Math.random() * 80}%` }}
              transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse", delay: i * 0.05 }}
              className="flex-1 bg-emerald-500/20 rounded-t-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
};


