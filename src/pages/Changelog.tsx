import React from 'react';
import { 
  History, 
  Sparkles, 
  Zap, 
  Terminal, 
  Shield, 
  Cpu,
  Rocket,
  Wand2,
  Box,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Changelog() {
  const updates = [
    {
      version: 'v2.4.0',
      date: 'April 26, 2026',
      title: 'The Neural Orchestration Update',
      highlight: 'Full FastAPI backend integration and real-time database seeding logic.',
      items: [
        { icon: Cpu, label: 'FastAPI Integration', detail: 'Native Python backend now handles all heavy neural processing and data persistence.' },
        { icon: Zap, label: 'Real-time Seeding', detail: 'Automated database hydration script for instant environment setup.' },
        { icon: Shield, label: 'Encrypted Transmissions', detail: 'New security layer for all production-to-cloud communication nodes.' },
        { icon: Sparkles, label: 'God Mode UI', detail: 'Premium glassmorphic redesign of the entire Core Platform suite.' }
      ]
    },
    {
      version: 'v2.3.5',
      date: 'April 15, 2026',
      title: 'Studio Architect Refinement',
      highlight: 'Enhanced loading protocols and cross-over production stability.',
      items: [
        { icon: Wand2, label: 'Prompt Architecture', detail: 'Improved semantic analysis for complex, multi-layered narrative prompts.' },
        { icon: Box, label: 'Asset Management', detail: 'Centralized media vault for character meshes and environment assets.' },
        { icon: Terminal, label: 'Log Pipeline', detail: 'Integrated system logs for easier debugging of architectural node failures.' }
      ]
    },
    {
      version: 'v2.3.0',
      date: 'April 02, 2026',
      title: 'The Foundation Shift',
      highlight: 'Migration to Gemini 2.0 Pro Experimental for ultra-high fidelity script generations.',
      items: [
        { icon: Rocket, label: 'Engine G2.0', detail: 'Direct integration with Gemini 2.0 for 500% faster script drafting.' },
        { icon: Layers, label: 'Project Scaffolding', detail: 'New hierarchical project structure: Series -> Episodes -> Scenes.' }
      ]
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-black tracking-tighter flex items-center justify-center gap-4 text-white uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <History className="w-12 h-12 text-sky-500" />
          Evolution Logs
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">
          Tracking the constant refinement of the Studio Architect ecosystem.
        </p>
      </div>

      <div className="relative space-y-20 before:absolute before:left-[19px] before:top-4 before:bottom-0 before:w-px before:bg-zinc-800">
        {updates.map((update, i) => (
          <motion.div
            key={update.version}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-12 group"
          >
            {/* Timeline Dot */}
            <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center group-hover:border-sky-500 transition-colors z-10">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-zinc-900 pb-4">
                <div>
                  <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">{update.version}</span>
                  <h2 className="text-3xl font-black text-white tracking-tighter mt-2 group-hover:text-sky-400 transition-colors">{update.title}</h2>
                </div>
                <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-1 italic">{update.date}</p>
              </div>

              <p className="text-zinc-400 font-medium leading-relaxed italic border-l-2 border-zinc-800 pl-4 py-1">
                {update.highlight}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {update.items.map((item, j) => (
                  <Card key={j} className="bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 transition-all">
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-sky-400 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-zinc-200 uppercase tracking-widest">{item.label}</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">{item.detail}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-12 text-center">
        <div className="inline-block p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <p className="text-zinc-500 text-xs font-medium">End of archive. Previous logs (v1.x) are archived in the Data Vault.</p>
        </div>
      </div>
    </div>
  );
}
