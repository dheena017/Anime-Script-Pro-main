import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GalleryItem } from '../constants';

interface GalleryProps {
  images: GalleryItem[];
  activePrompt: string;
  setActivePrompt: (prompt: string) => void;
  onTryPrompt: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  images,
  activePrompt,
  setActivePrompt,
  onTryPrompt,
}) => {
  return (
    <section className="max-w-7xl mx-auto py-20">
      <h2 className="text-4xl font-black text-center text-white uppercase tracking-wider mb-4">
        Inspiration Gallery
      </h2>
      <p className="text-zinc-500 text-center mb-12 text-sm font-medium">
        <Search className="w-4 h-4 inline-block mr-1" />
        Hover over any image to see the exact prompt used
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="relative group cursor-pointer rounded-2xl overflow-hidden hover:shadow-[0_10px_30px_rgba(6,182,212,0.2)] hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-studio/30"
            onClick={() => setActivePrompt(item.prompt)}
          >
            <img
              src={item.src}
              alt="Generated anime art"
              className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 p-6">
              <span className="text-white text-sm font-medium text-center leading-relaxed translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                "{item.prompt}"
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <AnimatePresence>
        {activePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 p-6 rounded-2xl bg-zinc-900/60 border border-studio/20 text-center"
          >
            <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">Selected Prompt</p>
            <p className="text-white font-medium">"{activePrompt}"</p>
            <Button
              onClick={onTryPrompt}
              className="mt-4 bg-studio text-black font-bold rounded-xl px-6 hover:bg-studio/90"
            >
              Try This Prompt <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
