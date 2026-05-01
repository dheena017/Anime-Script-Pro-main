import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share2, Play, Download } from 'lucide-react';

const discoverItems = [
  {
    id: 1,
    title: "Cyberpunk District 7",
    author: "NeonGhost",
    type: "Environment DNA",
    likes: "2.4k",
    comments: 128,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800",
    tags: ["CYBERPUNK", "NIGHT", "NEON"]
  },
  {
    id: 2,
    title: "Vocaloid Synthesis V4",
    author: "MikuMaster",
    type: "Audio Script",
    likes: "1.8k",
    comments: 84,
    image: "https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=800",
    tags: ["AUDIO", "VOCAL", "AI"]
  },
  {
    id: 3,
    title: "Samurai Motion Suite",
    author: "KatanaDev",
    type: "Motion Pack",
    likes: "3.1k",
    comments: 245,
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800",
    tags: ["ACTION", "SAMURAI", "ANIMATION"]
  },
  {
    id: 4,
    title: "Gothic Cathedral Interior",
    author: "ArchViz",
    type: "3D Asset",
    likes: "952",
    comments: 42,
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800",
    tags: ["GOTHIC", "INTERIOR", "FANTASY"]
  }
];

export const DiscoverPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {discoverItems.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="group relative bg-zinc-950 border border-white/5 rounded-[3rem] overflow-hidden hover:border-blue-500/30 transition-all cursor-pointer"
        >
          {/* IMAGE PREVIEW */}
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60" />
            
            <div className="absolute top-6 left-6 flex gap-2">
              {item.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[7px] font-black tracking-widest text-white border border-white/10">
                  {tag}
                </span>
              ))}
            </div>

            <button className="absolute inset-0 m-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">{item.type}</p>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">{item.title}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author}`} alt="author" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-[10px] font-black">{item.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[10px] font-black">{item.comments}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-white/5 text-[9px] font-black uppercase tracking-widest text-white transition-all">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};


