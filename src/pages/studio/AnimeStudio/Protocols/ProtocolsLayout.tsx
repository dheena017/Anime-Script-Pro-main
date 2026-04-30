import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ProtocolsToolbar } from './ProtocolsToolbar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProtocolsLayout() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-2xl p-2 pr-4">
        <div className="flex items-center gap-2 px-4 border-r border-white/10 mr-2 py-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/anime/prompts')}
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-studio"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">Nexus</span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocols</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ProtocolsToolbar />
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-white/10 ml-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/anime/screening')}
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-studio"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}

