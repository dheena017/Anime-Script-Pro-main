export interface GalleryItem {
  src: string;
  prompt: string;
}

export const GALLERY_DATA: GalleryItem[] = [
  { src: '/cyberpunk_thumbnail_1776537282821.png', prompt: 'A neon-lit cyberpunk city at night with rain reflections' },
  { src: '/dark_isekai_thumbnail_1776537262155.png', prompt: 'A cel-shaded fantasy warrior wielding a glowing katana' },
  { src: '/magical_girl_thumbnail_1776537629295.png', prompt: 'Watercolor-style sakura blossoms falling over a quiet temple' },
  { src: '/mecha_rebellion_thumbnail_1776537334398.png', prompt: 'A massive mecha battle in a ruined metropolis, 90s anime style' },
  { src: '/sports_anime_thumbnail_1776537646600.png', prompt: 'An anime girl watching the ocean sunset from a cliff, Studio Ghibli style' },
  { src: '/steampunk_chronicle_thumbnail_1776586554491.png', prompt: 'Interior of a futuristic space station with holographic displays' },
];

export const STYLE_OPTIONS = [
  { label: 'Cyberpunk', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20' },
  { label: '90s Cel-Shaded', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' },
  { label: 'Watercolor', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20' },
  { label: 'Studio Ghibli', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' },
  { label: 'Dark Fantasy', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20' },
  { label: 'Noir', color: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20 hover:bg-zinc-500/20' },
  { label: 'Chibi', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' },
  { label: 'Retro Manga', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20' },
  { label: 'Synthwave', color: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 hover:bg-fuchsia-500/20' },
  { label: 'Ukiyo-e', color: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' },
  { label: 'Steampunk', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20' },
  { label: 'Vaporwave', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20' },
];

export const PLACEHOLDER_PROMPTS = [
  'A samurai standing in a bamboo forest at sunset...',
  'A futuristic Tokyo skyline with flying cars...',
  'An underwater kingdom with bioluminescent creatures...',
  'A dragon rider soaring above snow-covered mountains...',
  'A magical girl transformation scene with sparkles...',
];
