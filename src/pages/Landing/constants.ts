export interface GalleryItem {
  src: string;
  prompt: string;
  architect?: string;
  node?: string;
}

export const GALLERY_DATA: GalleryItem[] = [
  { src: '/cyberpunk_thumbnail_1776537282821.png', prompt: 'A neon-lit cyberpunk city at night with rain reflections', architect: 'K. AKIRA', node: 'TOKYO-01' },
  { src: '/dark_isekai_thumbnail_1776537262155.png', prompt: 'A cel-shaded fantasy warrior wielding a glowing katana', architect: 'S. CHEN', node: 'SEOUL-04' },
  { src: '/magical_girl_thumbnail_1776537629295.png', prompt: 'Watercolor-style sakura blossoms falling over a quiet temple', architect: 'Y. TANAKA', node: 'KYOTO-02' },
  { src: '/mecha_rebellion_thumbnail_1776537334398.png', prompt: 'A massive mecha battle in a ruined metropolis, 90s anime style', architect: 'M. ROSSI', node: 'ROME-09' },
  { src: '/sports_anime_thumbnail_1776537646600.png', prompt: 'An anime girl watching the ocean sunset from a cliff, Studio Ghibli style', architect: 'E. DUPONT', node: 'PARIS-03' },
  { src: '/steampunk_chronicle_thumbnail_1776586554491.png', prompt: 'Interior of a futuristic space station with holographic displays', architect: 'J. DOE', node: 'SF-12' },
];

export const STYLE_OPTIONS = [
  { label: 'Cyberpunk', desc: 'High-contrast neon, gritty textures, and rain-slicked surfaces.', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20', node: 'NEURAL-V3' },
  { label: '90s Cel-Shaded', desc: 'Classic hand-drawn look with thick lines and vibrant palettes.', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20', node: 'RETRO-X' },
  { label: 'Watercolor', desc: 'Soft, bleeding colors and traditional paper textures.', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20', node: 'ARTISAN-I' },
  { label: 'Studio Ghibli', desc: 'Lush environments, whimsical character designs, and painterly backgrounds.', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20', node: 'NATURE-H' },
  { label: 'Dark Fantasy', desc: 'Gritty, high-detail rendering with dramatic lighting and shadows.', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20', node: 'GOTHIC-IV' },
  { label: 'Noir', desc: 'Monochromatic, high-contrast, and moody atmospheric effects.', color: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20 hover:bg-zinc-500/20', node: 'VOID-0' },
  { label: 'Synthwave', desc: '80s aesthetic with retro-futuristic grids and sunset gradients.', color: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 hover:bg-fuchsia-500/20', node: 'WAVE-V2' },
  { label: 'Ukiyo-e', desc: 'Traditional Japanese woodblock print style with flat colors.', color: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20', node: 'HERITAGE-I' },
];

export const CORE_FEATURES = [
  {
    category: 'Neural Layer',
    title: 'Atomic Prompting',
    desc: 'Our engine parses natural language into production-ready visual directives with 99% accuracy.',
    icon: 'Cpu'
  },
  {
    category: 'Production Layer',
    title: 'DNA Consistency',
    desc: 'Lock character features and environmental seeds across multiple generations for serial production.',
    icon: 'Shield'
  },
  {
    category: 'Architecture Layer',
    title: 'Global Sync',
    desc: 'Collaborate with your studio team in real-time. Share assets and directives instantly.',
    icon: 'Globe'
  }
];

export const TESTIMONIALS = [
  {
    author: 'Hiroshi Nakamura',
    role: 'Lead Architect, Neo-Kyoto Studio',
    quote: 'AnimeScript Pro has reduced our concept art turnaround from weeks to seconds. It is the backbone of our visual development.',
    avatar: '/avatars/architect_01.png'
  },
  {
    author: 'Elena Vance',
    role: 'Indie Creator',
    quote: 'The level of consistency I can achieve with the DNA locking feature is unheard of in other AI tools. Simply revolutionary.',
    avatar: '/avatars/architect_02.png'
  }
];

export const FAQ_DATA = [
  {
    q: 'Can I use the generated assets commercially?',
    a: 'Yes. All assets generated on the Pro and Enterprise plans include full commercial rights and royalty-free licensing.'
  },
  {
    q: 'What is a "Neural Seed"?',
    a: 'A Neural Seed is a unique identifier that allows you to recreate exact compositions and character traits across different prompts.'
  },
  {
    q: 'Does it support team collaboration?',
    a: 'Absolutely. Our Enterprise protocol allows for shared asset libraries, unified prompt histories, and team-wide consistency layers.'
  }
];

export const PRODUCTION_STATS = {
  transmissions: 1240582,
  nodes: 842,
  uptime: 99.98,
  latency: '14ms'
};

export const PLACEHOLDER_PROMPTS = [
  'A samurai standing in a bamboo forest at sunset...',
  'A futuristic Tokyo skyline with flying cars...',
  'An underwater kingdom with bioluminescent creatures...',
  'A dragon rider soaring above snow-covered mountains...',
  'A magical girl transformation scene with sparkles...',
];


