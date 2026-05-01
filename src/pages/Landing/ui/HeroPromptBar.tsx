import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STYLE_OPTIONS, PLACEHOLDER_PROMPTS } from '../constants';

interface HeroPromptBarProps {
  promptText: string;
  setPromptText: (text: string) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  placeholderIndex: number;
  handleGenerate: () => void;
}

export const HeroPromptBar: React.FC<HeroPromptBarProps> = ({
  promptText,
  setPromptText,
  selectedStyle,
  setSelectedStyle,
  placeholderIndex,
  handleGenerate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-5xl mx-auto w-full"
    >
      <div className="relative group">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-studio/50 via-purple-500/50 to-studio/50 rounded-[1.75rem] blur-sm opacity-40 group-hover:opacity-70 transition-opacity" />
        <div className="relative bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[1.75rem] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-start gap-3">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder={PLACEHOLDER_PROMPTS[placeholderIndex]}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white text-base md:text-lg font-medium placeholder:text-zinc-600 py-3 px-2 resize-none max-h-[9rem] overflow-y-auto hide-scrollbar leading-relaxed"
            />
          </div>
          <div className="flex items-center justify-end pt-2 px-1">
            <Button
              onClick={handleGenerate}
              className="h-12 px-8 rounded-xl bg-studio text-black hover:bg-studio/90 font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95 shrink-0 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg] z-0" />
              <span className="relative z-10 flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Generate
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest shrink-0 mr-1">Style:</span>
        {STYLE_OPTIONS.map((style) => (
          <button
            key={style.label}
            onClick={() => setSelectedStyle(style.label)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${selectedStyle === style.label
                ? style.color + ' ring-1 ring-white/20 scale-105'
                : 'bg-zinc-800/50 text-zinc-500 border-zinc-800 hover:text-zinc-300'
              }`}
          >
            {style.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
