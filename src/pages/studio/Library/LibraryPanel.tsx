import React from 'react';
import { motion } from 'framer-motion';
import { Folder, FileText, Film, Users, MoreVertical } from 'lucide-react';

const libraryItems = [
  { id: 1, title: "Neon Genesis Script", type: "Script", date: "2h ago", items: 12, color: "text-blue-500" },
  { id: 2, title: "Character DNA: Protagonist", type: "Assets", date: "5h ago", items: 45, color: "text-purple-500" },
  { id: 3, title: "World Lore: Neo Tokyo", type: "Lore", date: "1d ago", items: 8, color: "text-amber-500" },
  { id: 4, title: "Season 1 Storyboard", type: "Visuals", date: "3d ago", items: 156, color: "text-emerald-500" },
  { id: 5, title: "Production Templates", type: "System", date: "1w ago", items: 5, color: "text-zinc-500" },
];

export const LibraryPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {libraryItems.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="group relative bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 hover:border-[#bd4a4a]/40 hover:bg-zinc-900/50 transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between mb-6">
            <div className={`p-4 bg-zinc-900 rounded-2xl border border-white/5 group-hover:border-[#bd4a4a]/20 transition-all ${item.color}`}>
              {item.type === "Script" && <FileText className="w-6 h-6" />}
              {item.type === "Assets" && <Users className="w-6 h-6" />}
              {item.type === "Lore" && <Folder className="w-6 h-6" />}
              {item.type === "Visuals" && <Film className="w-6 h-6" />}
              {item.type === "System" && <Folder className="w-6 h-6" />}
            </div>
            <button className="p-2 text-zinc-600 hover:text-white transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">{item.title}</h3>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded-md">
                {item.type}
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                {item.items} Objects
              </span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em]">Last Sync: {item.date}</span>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id * i}`} alt="user" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Empty Slot / New */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border-2 border-dashed border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:border-[#bd4a4a]/20 transition-all group cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Folder className="w-5 h-5 text-zinc-700 group-hover:text-[#bd4a4a]" />
        </div>
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-zinc-500">Create Directory</p>
      </motion.div>
    </div>
  );
};


