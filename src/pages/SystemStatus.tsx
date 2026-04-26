import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  ShieldCheck,
  RefreshCw,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SystemStatus() {
  const [uptime, setUptime] = useState('99.98%');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const services = [
    { name: 'Neural Engine (G2.0)', status: 'operational', latency: '42ms', load: '12%' },
    { name: 'Vector DB (Supabase)', status: 'operational', latency: '120ms', load: '24%' },
    { name: 'API Mesh (FastAPI)', status: 'operational', latency: '8ms', load: '5%' },
    { name: 'Authentication Node', status: 'operational', latency: '15ms', load: '2%' },
    { name: 'CDN Edge (Vercel)', status: 'operational', latency: '22ms', load: '45%' },
    { name: 'Asset Pipeline', status: 'degraded', latency: '1200ms', load: '92%' },
  ];

  const refreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

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
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Status: Optimal</span>
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
        {[
          { label: 'Uptime (30d)', value: uptime, icon: Clock, color: 'text-emerald-500' },
          { label: 'Neural Credits', value: '1.2M / day', icon: Zap, color: 'text-yellow-500' },
          { label: 'Global Latency', value: '45ms', icon: Globe, color: 'text-sky-500' },
          { label: 'Security Level', value: 'Standard', icon: ShieldCheck, color: 'text-fuchsia-500' }
        ].map((stat, i) => (
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
          <CardTitle className="text-lg font-black text-white uppercase tracking-widest">Incident History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { date: 'Apr 24, 2026', title: 'Asset Pipeline Congestion', type: 'resolved', detail: 'Increased neural buffer size to handle high-resolution character mesh generations.' },
            { date: 'Apr 18, 2026', title: 'Gemini API Latency Spike', type: 'resolved', detail: 'Upstream provider acknowledged node congestion. Auto-failover to backup cluster performed.' },
            { date: 'Apr 12, 2026', title: 'Database Maintenance', type: 'scheduled', detail: 'Routine index optimization for vectorized script archives.' },
          ].map((incident, i) => (
            <div key={i} className="flex gap-6 pb-6 border-b border-zinc-800/50 last:border-0 last:pb-0">
              <div className="w-24 shrink-0">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{incident.date}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-bold text-zinc-200">{incident.title}</h4>
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded ${
                    incident.type === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-sky-500/10 text-sky-500'
                  }`}>
                    {incident.type}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">{incident.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
