import { Sword, Globe, Zap, Ghost, Brain, Flame, Heart, Trophy, Search, Hash } from 'lucide-react';

export const CATEGORIES = ['All', 'Action', 'Psychological', 'Isekai', 'Sci-Fi', 'Horror', 'Slice of Life', 'Mystery', 'Sports', 'Magical', 'Gourmet', 'Dark Fantasy', 'Music', 'Adventure'];

export const QUICK_TEMPLATES = [
  { 
    id: 'shonen', 
    category: 'Action',
    label: 'Shonen Catalyst', 
    icon: Sword, 
    thumbnail: '/shonen_battle_thumbnail_1776537245370.png',
    prompt: 'Synthesize a high-velocity battle narrative focused on elemental energy mastery and hierarchical tournament structures.',
    color: 'text-orange-500',
    border: 'border-orange-500/50',
    bg: 'bg-orange-500/10',
    shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]',
    description: 'High energy, intense pacing, and structural conflict loops.',
    elements: ['Energy Matrices', 'Power Scalability', 'System Rivalries'],
    vibe: 'Kinetic & High-Retention',
    stats: { deployed: '42.4k', success: '98%', complexity: 'Advanced' }
  },
  { 
    id: 'isekai', 
    category: 'Isekai',
    label: 'Dimensional Revision', 
    icon: Globe, 
    thumbnail: '/dark_isekai_thumbnail_1776537262155.png',
    prompt: 'Architect a cross-dimensional regression saga featuring a modern-day specialist navigating a low-fantasy political landscape.',
    color: 'text-purple-500',
    border: 'border-purple-500/50',
    bg: 'bg-purple-500/10',
    shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    description: 'Dimensional shift logic with a focus on system exploitation.',
    elements: ['World-Logic Variance', 'Strategic Dominance', 'Progression Loops'],
    vibe: 'Calculated & Immersive',
    stats: { deployed: '28.1k', success: '94%', complexity: 'Professional' }
  },
  { 
    id: 'cyberpunk', 
    category: 'Sci-Fi',
    label: 'Neural Cityscape', 
    icon: Zap, 
    thumbnail: '/cyberpunk_thumbnail_1776537282821.png',
    prompt: 'Design a gritty neon-metropolis investigation involving neural-interface conspiracy and megacorporation dominance.',
    color: 'text-cyan-500',
    border: 'border-cyan-500/50',
    bg: 'bg-cyan-500/10',
    shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    description: 'Dystopian high-tech systems and urban decay dynamics.',
    elements: ['Bionic Interfacing', 'Information Warfare', 'Corporate Hegemony'],
    vibe: 'Neon & Synthetic',
    stats: { deployed: '35.2k', success: '99%', complexity: 'Expert' }
  },
  { 
    id: 'slice', 
    category: 'Horror',
    label: 'Supernatural Resonance', 
    icon: Ghost, 
    thumbnail: '/supernatural_school_thumbnail_1776537301525.png',
    prompt: 'Generate a supernatural school-life drama centering on localized urban legends and group-based mystery solving.',
    color: 'text-emerald-500',
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/10',
    shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    description: 'Localized supernatural friction within group environments.',
    elements: ['Eerie Atmosphere', 'Recursive Mystery', 'Social Dynamics'],
    vibe: 'Unsettling & Human',
    stats: { deployed: '15.7k', success: '92%', complexity: 'Standard' }
  },
  { 
    id: 'psych', 
    category: 'Psychological',
    label: 'Cognitive Inquiry', 
    icon: Brain, 
    thumbnail: '/dream_detective_thumbnail_1776537317644.png',
    prompt: 'Engineer a psychological thriller exploring reality-bending dream manipulation and forensic memory analysis.',
    color: 'text-blue-500',
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/10',
    shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    description: 'Internalized conflict and cognitive reality shifts.',
    elements: ['Mental Geometry', 'Perception Logic', 'Heuristic Stakes'],
    vibe: 'Abstract & Tense',
    stats: { deployed: '19.3k', success: '95%', complexity: 'Professional' }
  },
  { 
    id: 'mecha', 
    category: 'Sci-Fi',
    label: 'Mechanical Epoch', 
    icon: Flame, 
    thumbnail: '/mecha_rebellion_thumbnail_1776537334398.png',
    prompt: 'Design a heavy-machinery conflict narrative involving experimental unit piloting and large-scale colony defense.',
    color: 'text-red-500',
    border: 'border-red-500/50',
    bg: 'bg-red-500/10',
    shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    description: 'Industrial-scale combat and tactical hardware logic.',
    elements: ['Rigid Frames', 'Orbital Mechanics', 'Resource Attrition'],
    vibe: 'Heavy & Scale-Driven',
    stats: { deployed: '21.8k', success: '97%', complexity: 'Advanced' }
  },
  { 
    id: 'magical', 
    category: 'Magical',
    label: 'Celestial Paradigm', 
    icon: Heart, 
    thumbnail: '/magical_girl_thumbnail_1776537629295.png',
    prompt: 'Construct a transformation-based narrative involving celestial energy seals and cosmic-shadow containment.',
    color: 'text-fuchsia-500',
    border: 'border-fuchsia-500/50',
    bg: 'bg-fuchsia-500/10',
    shadow: 'shadow-[0_0_15px_rgba(217,70,239,0.2)]',
    description: 'Aesthetic-driven metamorphosis and moral clarity.',
    elements: ['Dynamic Flux', 'Visual Radiance', 'Aligned Unity'],
    vibe: 'Ethereal & Vibrant',
    stats: { deployed: '14.2k', success: '91%', complexity: 'Standard' }
  },
  { 
    id: 'sports', 
    category: 'Sports',
    label: 'Tactical Kinetic', 
    icon: Trophy, 
    thumbnail: '/sports_anime_thumbnail_1776537646600.png',
    prompt: 'Design a high-stakes competitive narrative focused on speed-based strategy and underdog technical synergy.',
    color: 'text-yellow-500',
    border: 'border-yellow-500/50',
    bg: 'bg-yellow-500/10',
    shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]',
    description: 'High-pacing athletic logic and group-synergy loops.',
    elements: ['Strategic Velocity', 'Skill-Tree Scaling', 'Peak Flow State'],
    vibe: 'Relentless & Focused',
    stats: { deployed: '16.9k', success: '96%', complexity: 'Standard' }
  },
  { 
    id: 'mystery', 
    category: 'Mystery',
    label: 'Hardboiled Logic', 
    icon: Search, 
    thumbnail: '/detective_noir_thumbnail_1776537665824.png',
    prompt: 'Synthesize an investigative noir saga centered on anomalous crime solving in a rain-saturated urban landscape.',
    color: 'text-zinc-400',
    border: 'border-zinc-500/50',
    bg: 'bg-zinc-500/10',
    shadow: 'shadow-[0_0_15px_rgba(113,113,122,0.2)]',
    description: 'Analytical deductive logic and atmospheric tension.',
    elements: ['Analytical Friction', 'Systemic Rot', 'Recursive Clues'],
    vibe: 'Gritty & Precise',
    stats: { deployed: '13.5k', success: '89%', complexity: 'Professional' }
  },
  { 
    id: 'survival', 
    category: 'Action',
    label: 'Elimination Protocol', 
    icon: Hash, 
    thumbnail: '/survival_game_thumbnail_1776537679688.png',
    prompt: 'Architect a high-stakes game-theory narrative involving localized trap environments and social-trauma mechanics.',
    color: 'text-rose-600',
    border: 'border-rose-600/50',
    bg: 'bg-rose-600/10',
    shadow: 'shadow-[0_0_15px_rgba(225,29,72,0.2)]',
    description: 'Tense social commentary and high-stakes games.',
    elements: ['Game Theory', 'Social Darwinism', 'Psychological Stress'],
    vibe: 'Brutal & Strategic',
    stats: { deployed: '17.4k', success: '93%', complexity: 'Professional' }
  },
];

export const templateMarkdown = `
# OMNI-RECAP PRODUCTION DIRECTIVE v5.2

## GLOBAL HEURISTICS
- **Neural Pacing:** 120-140 BPM equivalent narrative flow.
- **Visual DNA:** High-contrast 4K grading, anamorphic flares.
- **Audio Scaffolding:** Binaural soundstage, dynamic EQ ducking.

---

## 1. THE KINETIC HOOK [0:00 - 0:20]
- **Directive:** Execute "Momentum-Lock" logic. 
- **Requirement:** Display the highest-complexity animation cell or most critical ideological conflict within the first 3 seconds.
- **Lighting:** Dynamic Rim Lighting, Volumetric God-Rays.
- **Audio:** Bass-boosted impact SFX, immediate vocal entry.

## 2. SYSTEMIC SETUP [0:20 - 1:15]
- **Directive:** Establish "World-Logic Variance."
- **Requirement:** Define the unique power system or social friction through visual shorthand.
- **Camera:** Tracking wide shots, slow Dolly-In on protagonist.
- **Audio:** Ambient atmospheric pads, clear mid-range VO.

## 3. FRICTION DYNAMICS [1:15 - 3:45]
- **Directive:** Sustain "Conflict Cycles."
- **Requirement:** Escalate stakes through three distinct narrative pivots (Discovery -> Friction -> Engagement).
- **VFX:** Particle systems for energy/magic, micro-expression focus.
- **Audio:** Layered percussive BGM, high-frequency "clink" SFX for impact.

## 4. OMNI-PAYOFF [3:45 - 4:45]
- **Directive:** Finalize "Payoff Matrix."
- **Requirement:** Deliver the resolution with peak visual saturation and emotional resonance.
- **Camera:** Dutch Tilts, 360-degree Orbit shots.
- **Audio:** Peak BGM volume, heavy low-end reverb tails.

## 5. RECURSIVE OUTRO [4:45 - 5:00]
- **Directive:** Trigger "Retention Loop."
- **Requirement:** Inject a "Post-Credit" mystery seed to drive next-video engagement.
- **Visual:** Fade to black with neon-glyph overlay.
- **Audio:** Heartbeat rhythm fading into silence.
`;


