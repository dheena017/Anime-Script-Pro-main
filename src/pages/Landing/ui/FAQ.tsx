import { ChevronDown } from 'lucide-react';

const FAQ_LIST = [
  { q: 'Do I own the images I generate?', a: 'Yes – you receive full commercial rights for all creations on paid plans. Free-tier images are for personal use.' },
  { q: 'What happens when I run out of credits?', a: 'You can wait for your daily refresh (resets at midnight UTC) or upgrade to a Pro plan for unlimited usage.' },
  { q: 'Are there content restrictions?', a: 'Yes. Our safety filters block NSFW and illegal content to keep the community safe and compliant.' },
  { q: 'Can I use this for manhwa / manga panels?', a: 'Absolutely. Our engine supports consistent character generation across multiple panels, perfect for sequential art.' },
  { q: 'What resolution are the generated images?', a: 'Standard output is 1024×1024. Pro and Master plans include 4K upscaling up to 4096×4096.' },
];

export const FAQ = () => {
  return (
    <section className="max-w-7xl mx-auto py-20">
      <h2 className="text-4xl font-black text-center text-white uppercase tracking-wider mb-12">FAQ</h2>
      <div className="space-y-4 max-w-3xl mx-auto">
        {FAQ_LIST.map((faq, i) => (
          <details
            key={i}
            className="bg-zinc-900/40 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group"
          >
            <summary className="text-white font-bold cursor-pointer flex items-center justify-between">
              {faq.q}
              <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-zinc-400 mt-4 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
};
