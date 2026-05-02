import React from 'react';
import { Users2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const CommunityHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 mb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
          <Users2 className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Architect <span className="text-purple-500">Syndicate</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">
            Peer-to-Peer Neural Collaboration & Intelligence Exchange
          </p>
        </div>
      </motion.div>
      
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
              </div>
            ))}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">1.2k Architects Online</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3 h-3 text-purple-500/50" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">84 Active Channels</span>
        </div>
      </div>
    </div>
  );
};



