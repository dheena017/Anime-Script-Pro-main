import React from 'react';
import { useGenerator } from '@/hooks/useGenerator';
import { useRealtimeLogs } from '@/hooks/useRealtimeLogs';
import { Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const NeuralStream: React.FC = () => {
  const { masterLogs } = useGenerator();
  const backendLogs = useRealtimeLogs();
  
  // Combine logs, prioritizing masterLogs for active session feedback
  const displayLogs = [...masterLogs, ...backendLogs].sort((a, b) => 
    new Date(b.created_at || b.timestamp).getTime() - new Date(a.created_at || a.timestamp).getTime()
  ).slice(0, 30);

  return (
    <Card className="bg-[#050505]/80 border border-studio/20 rounded-[2rem] overflow-hidden group shadow-2xl backdrop-blur-xl h-full">
      <CardHeader className="p-5 border-b border-studio/10 flex flex-row items-center justify-between bg-studio/5">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-studio">
          <div className="w-2 h-2 rounded-full bg-studio animate-pulse shadow-studio" />
          Neural Thinking Stream
        </CardTitle>
        <span className="text-[8px] font-black text-studio/60 uppercase tracking-widest bg-studio/10 px-3 py-1 rounded-full border border-studio/20">Clinical Report</span>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-56 w-full font-mono">
          {displayLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-800 py-12 opacity-50">
              <Activity className="w-10 h-10 mb-3 animate-[pulse_2s_infinite]" />
              <p className="text-[10px] uppercase tracking-widest font-black">Awaiting Neural Ignition...</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {displayLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-[10px] animate-in fade-in slide-in-from-left-1">
                  <span className="text-zinc-800 font-bold shrink-0 mt-0.5">[{new Date(log.created_at || log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-studio font-black tracking-tighter uppercase shrink-0">{log.module || log.source}:</span>
                      <span className={cn(
                        "font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded text-[7px]",
                        (log.status === 'PROCESSED' || log.status === 'Success' || log.level === 'INFO') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        (log.status === 'Generating' || log.status === 'Synthesizing') ? 'bg-studio/10 text-studio border border-studio/20 animate-pulse' :
                        log.level === 'ERROR' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-zinc-900 text-zinc-600 border border-zinc-800'
                      )}>
                        {log.status || log.level}
                      </span>
                    </div>
                    <span className="text-zinc-400 font-medium break-words leading-relaxed whitespace-pre-wrap">
                      {log.message || log.model_used}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};


