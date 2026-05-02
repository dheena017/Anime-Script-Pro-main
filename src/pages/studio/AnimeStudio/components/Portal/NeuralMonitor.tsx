import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LogEntry } from '@/contexts/LogContext';

interface NeuralMonitorProps {
  masterLogs: LogEntry[];
}

export const NeuralMonitor = React.memo(({ masterLogs }: NeuralMonitorProps) => {
  return (
    <div className="space-y-6 lg:row-span-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-3">
          <Brain className="w-4 h-4 text-studio" /> Neural Monitor
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Link</span>
        </div>
      </div>
      
      <Card className="bg-black/80 border-zinc-900 rounded-[2.5rem] overflow-hidden flex flex-col h-[600px] shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-12 bg-zinc-950/50 border-b border-zinc-900 flex items-center px-6 justify-between z-10 backdrop-blur-md">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          </div>
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Neural_Terminal_v4.0</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 pt-16 space-y-4 font-mono no-scrollbar">
          {masterLogs.length > 0 ? masterLogs.map((log) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <div className="flex items-start gap-3">
                <span className="text-[10px] text-zinc-700 whitespace-nowrap mt-0.5">
                  {new Date(log.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "text-[9px] font-black px-1.5 py-0.5 rounded-md border",
                      log.module === 'NEURAL_ENGINE' ? "bg-purple-500/10 border-purple-500/30 text-purple-400" :
                      log.module === 'ORCHESTRATOR' ? "bg-blue-500/10 border-blue-500/30 text-blue-400" :
                      "bg-zinc-800 border-zinc-700 text-zinc-500"
                    )}>
                      [{log.module}]
                    </span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      log.status === 'ERROR' || log.status === 'FAILED' ? "text-red-500" :
                      log.status === 'COMPLETED' || log.status === 'SUCCESS' ? "text-emerald-500" :
                      "text-amber-500"
                    )}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    <span className="text-zinc-600 mr-2">»</span>
                    {log.message}
                  </p>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <Brain className="w-12 h-12 text-zinc-800" />
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Awaiting Neural Commands...</p>
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-studio/5 to-transparent pointer-events-none" />
      </Card>
    </div>
  );
});

NeuralMonitor.displayName = 'NeuralMonitor';

