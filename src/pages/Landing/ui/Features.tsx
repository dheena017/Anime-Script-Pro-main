import { motion } from 'framer-motion';
import { Zap, Users, Palette, CheckCircle, CreditCard, ExternalLink } from 'lucide-react';

const FEATURE_LIST = [
  { icon: Zap, title: 'Speed & Quality', text: 'Lightning‑fast generation with 4K upscaling capabilities.' },
  { icon: Users, title: 'Storyteller Friendly', text: 'Consistent character panels, dynamic backgrounds, VTuber avatars.' },
  { icon: Palette, title: 'Style Variety', text: 'Cyberpunk, Cel‑Shaded, Watercolor, and many more anime styles.' },
  { icon: CheckCircle, title: 'Commercial Rights', text: 'Full ownership of every image you generate. Use anywhere.' },
  { icon: CreditCard, title: 'Flexible Credits', text: '10 free credits daily. Upgrade anytime for unlimited generation.' },
  { icon: ExternalLink, title: 'Easy Export', text: 'Download in PNG, WebP, or SVG. Share directly to social media.' },
];

export const Features = () => {
  return (
    <section className="max-w-7xl mx-auto py-20">
      <h2 className="text-4xl font-black text-center text-white uppercase tracking-wider mb-12">
        Why Choose AnimeScript Pro?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURE_LIST.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-studio/20 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-studio/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
              <f.icon className="w-6 h-6 text-zinc-400 group-hover:text-studio transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-studio transition-colors">{f.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
