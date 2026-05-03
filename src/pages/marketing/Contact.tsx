import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Send, 
  Globe, 
  Zap, 
  CheckCircle2, 
  Activity,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const SUPPORT_NODES = [
  { location: 'Tokyo Sector', lat: '35.6895° N', status: 'Optimal' },
  { location: 'L.A. Sector', lat: '34.0522° N', status: 'Optimal' },
  { location: 'London Sector', lat: '51.5074° N', status: 'Maintenance' },
];

const CATEGORIES = ['Technical Support', 'Billing', 'Partnership', 'General Inquiry'];

export function ContactPage() {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Technical Support');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);
    
    // Simulate Neural Link established
    setTimeout(() => {
      setIsTransmitting(false);
      setIsConfirmed(true);
      setTimeout(() => setIsConfirmed(false), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-32 px-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-studio/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-24 relative z-10">
        
        {/* 1. HEADER PROTOCOL */}
        <div className="flex flex-col items-center text-center space-y-6">
           <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-studio/5 border border-studio/20">
              <Activity className="w-3.5 h-3.5 text-studio animate-pulse" />
              <span className="text-[10px] font-black text-studio uppercase tracking-[0.3em]">Support Command Center</span>
           </div>
           <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter">Initialize <span className="text-studio">Contact</span></h1>
           <p className="text-zinc-500 max-w-2xl uppercase text-[11px] font-bold tracking-[0.2em] leading-relaxed">
             Direct uplink to the AnimeScript Pro engineering team. Transmission latency optimized for 24/7 global support.
           </p>
        </div>

        {/* 2. COMMUNICATION NODES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Mail, label: 'Email Protocol', value: 'support@animescript.pro', sub: '2hr Avg Response' },
            { icon: MessageSquare, label: 'Discord Node', value: 'Join Community', sub: 'Instant Support' },
            { icon: Phone, label: 'Enterprise Line', value: '1-800-ANIME-PRO', sub: 'High Priority Only' }
          ].map((node, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-[#0a0a0b] border border-white/5 hover:border-studio/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <node.icon className="w-16 h-16 text-studio" />
              </div>
              <node.icon className="w-10 h-10 text-studio mb-8 group-hover:scale-110 transition-transform" />
              <div className="space-y-1">
                 <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">{node.label}</h3>
                 <p className="text-lg font-black text-white uppercase italic">{node.value}</p>
                 <div className="flex items-center gap-2 pt-2">
                    <Clock className="w-3 h-3 text-zinc-700" />
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{node.sub}</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. TRANSMISSION FORM MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           {/* LEFT: GLOBAL NODES */}
           <div className="lg:col-span-4 space-y-10">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Active Support Hubs</h4>
                 <div className="space-y-3">
                    {SUPPORT_NODES.map((hub, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-zinc-700" />
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black text-white uppercase">{hub.location}</span>
                               <span className="text-[8px] font-bold text-zinc-600 tabular-nums">{hub.lat}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", hub.status === 'Optimal' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500")} />
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{hub.status}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="p-8 rounded-[2rem] bg-studio/[0.02] border border-studio/10">
                 <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-studio fill-studio" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Protocol Sync</span>
                 </div>
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                    All support transmissions are encrypted via neural-link protocols and prioritized by architect tier level.
                 </p>
              </div>
           </div>

           {/* RIGHT: FORM */}
           <div className="lg:col-span-8 bg-[#0a0a0b] border border-white/5 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-studio/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                {/* DIRECTIVE CATEGORY SELECTOR */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Directive Category</h4>
                   <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                            selectedCategory === cat ? "bg-studio text-black border-studio" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                          )}
                        >
                           {cat}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Architect Name</label>
                    <Input required className="bg-black/50 border-zinc-800 rounded-2xl h-14 font-black uppercase tracking-widest text-[11px] focus:border-studio/50" placeholder="ENTER NAME..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Terminal Address</label>
                    <Input required type="email" className="bg-black/50 border-zinc-800 rounded-2xl h-14 font-black uppercase tracking-widest text-[11px] focus:border-studio/50" placeholder="ARCHITECT@STUDIO.IO" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Transmission Directive</label>
                  <textarea 
                    required 
                    rows={6} 
                    className="w-full bg-black/50 border border-zinc-800 rounded-[2rem] px-6 py-5 text-[11px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-studio/50 transition-all resize-none" 
                    placeholder="DESCRIBE YOUR INQUIRY..." 
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isTransmitting}
                  className={cn(
                    "w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs transition-all relative overflow-hidden group",
                    isTransmitting ? "bg-zinc-800 text-zinc-500" : "bg-studio text-black hover:bg-white hover:scale-[1.02] shadow-[0_20px_50px_rgba(6,182,212,0.3)]"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isTransmitting ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin" />
                        Transmitting...
                      </motion.div>
                    ) : isConfirmed ? (
                      <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-500">
                        <CheckCircle2 className="w-5 h-5" /> Transmission Confirmed
                      </motion.div>
                    ) : (
                      <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                        <Send className="w-4 h-4" /> Initialize Transmission
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;





