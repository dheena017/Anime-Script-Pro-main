import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Repeat2, MoreHorizontal, ShieldCheck } from 'lucide-react';

const feedItems = [
  {
    id: 1,
    user: "Astra_Architect",
    role: "Lead Developer",
    verified: true,
    content: "Just finalized the new neural-diffusion protocols for real-time script rendering. The latency drop is incredible! 🚀 #NeuralStudio #DevLog",
    time: "12m ago",
    likes: 42,
    comments: 12,
    shares: 5
  },
  {
    id: 2,
    user: "Ghost_Writer",
    role: "Script Architect",
    verified: false,
    content: "Seeking collaborators for a high-concept cyberpunk series. Need visual synthesizers and world-lore experts. Direct link in bio.",
    time: "45m ago",
    likes: 28,
    comments: 24,
    shares: 12
  },
  {
    id: 3,
    user: "Studio_Prime",
    role: "System Admin",
    verified: true,
    content: "SYSTEM UPDATE: Version 1.24.8 is now live across all Tokyo-Prime relays. Check the changelog for new DNA sequencing features.",
    time: "2h ago",
    likes: 156,
    comments: 8,
    shares: 45
  }
];

export const CommunityPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      {feedItems.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 hover:border-purple-500/20 transition-all"
        >
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user}`} alt="avatar" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{item.user}</h3>
                    {item.verified && <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />}
                  </div>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{item.role} • {item.time}</p>
                </div>
                <button className="text-zinc-600 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-zinc-300 font-medium leading-relaxed mb-6">
                {item.content}
              </p>

              <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                <button className="flex items-center gap-2 text-zinc-500 hover:text-purple-400 transition-colors group">
                  <Heart className="w-4 h-4 group-hover:fill-purple-400" />
                  <span className="text-[10px] font-black">{item.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-zinc-500 hover:text-blue-400 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[10px] font-black">{item.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors">
                  <Repeat2 className="w-4 h-4" />
                  <span className="text-[10px] font-black">{item.shares}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Loading indicator placeholder */}
      <div className="py-10 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-900/50 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Awaiting Neural Pulses...</span>
        </div>
      </div>
    </div>
  );
};


