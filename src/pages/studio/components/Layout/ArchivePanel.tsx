import React from 'react';
import { History, ScrollText, ChevronRight, Box, Calendar, Cpu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArchivePanelProps {
  history: any[];
  onRestore: (item: any) => void;
}

export const ArchivePanel: React.FC<ArchivePanelProps> = ({ history, onRestore }) => {
  return (
    <Card className="bg-[#050505]/80 border border-zinc-900 rounded-[2rem] overflow-hidden group shadow-2xl backdrop-blur-xl h-full">
      <CardHeader className="p-5 border-b border-zinc-900 flex flex-row items-center justify-between">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-zinc-500">
          <History className="w-4 h-4 text-zinc-700" />
          Production Archive
        </CardTitle>
        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full">{history.length} Units</span>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-48 w-full">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-950 py-12">
              <Box className="w-10 h-10 mb-3 opacity-10" />
              <p className="text-[10px] uppercase tracking-widest font-black text-zinc-900">No Historical Records Found</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {history.map((record, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-zinc-950/30 border border-zinc-900/50 rounded-2xl hover:border-studio/30 hover:bg-studio/5 transition-all cursor-pointer group/item"
                  onClick={() => onRestore(record)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover/item:border-studio/30 transition-colors">
                      <ScrollText className="w-4 h-4 text-zinc-600 group-hover/item:text-studio transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest group-hover/item:text-white transition-colors">{record.title || "Untitled Unit"}</h4>
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-tighter flex items-center gap-1.5">
                          <Box className="w-2.5 h-2.5" />
                          VOL {record.session || 1} • UNIT {record.episode || 1}
                        </p>
                        <div className="flex items-center gap-3">
                          <p className="text-[8px] text-zinc-800 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Calendar className="w-2 h-2 text-studio/40" />
                            {record.date}
                          </p>
                          <p className="text-[8px] text-zinc-800 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Cpu className="w-2 h-2 text-blue-900/40" />
                            {record.modelUsed || 'AI-Architect'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-800 group-hover/item:text-studio group-hover/item:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
