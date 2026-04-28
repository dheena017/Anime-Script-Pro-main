import React from 'react';
import { motion } from 'motion/react';
import { Milestone, Activity, Volume2, Camera, Video, LayoutGrid,  PlayCircle, MapPin, Clock, Users, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface SeriesAssetMatrix {
  sound: string;
  image: string;
  video: string;
  scene_count: number | string;
}

export interface SeriesEpisode {
  episode: string;
  title: string;
  hook: string;
  setting?: string;
  runtime?: string;
  focus_characters?: string[];
  emotional_arc?: string;
  asset_matrix?: SeriesAssetMatrix;
}

interface SeriesCardProps {
  ep: SeriesEpisode;
  idx: number;
  isEditing: boolean;
  onUpdateEpisode: (index: number, updates: Partial<SeriesEpisode>) => void;
  onUpdateAssetMatrix: (index: number, updates: Partial<SeriesAssetMatrix>) => void;
  onFocusEpisode: (episodeNum: string) => void;
}

export function SeriesCard({
  ep,
  idx,
  isEditing,
  onUpdateEpisode,
  onUpdateAssetMatrix,
  onFocusEpisode
}: SeriesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10"
    >
      <Card className="bg-[#050505]/80 backdrop-blur-2xl border-studio/10 p-8 hover:border-studio/40 transition-all duration-500 group relative overflow-hidden rounded-[2rem] shadow-[0_0_0_rgba(6,182,212,0)] hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.15)]">
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-studio/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-studio/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:translate-x-10 group-hover:translate-y-10" />

        {/* Floating Watermark Icon */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none transform group-hover:scale-110 group-hover:rotate-6">
          <Milestone className="w-32 h-32 text-studio" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          
          {/* Episode Number Badge (Left Sidebar) */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-black border-2 border-studio/20 group-hover:border-studio/50 flex flex-col items-center justify-center text-studio shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-500 transform group-hover:-translate-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-[-4px]">EP</span>
              <span className="font-black text-2xl leading-none">{ep.episode}</span>
            </div>
            
            {/* Visual connector dot */}
            <div className="hidden md:flex flex-1 w-px bg-gradient-to-b from-studio/30 to-transparent relative items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-studio/50 absolute top-4 group-hover:bg-studio transition-colors" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            
            {/* Header / Title */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] group-hover:text-studio/70 transition-colors">
                <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-studio" /> Narrative Milestone</span>
                {ep.runtime && <span className="flex items-center gap-1.5 opacity-60"><Clock className="w-3 h-3" /> {ep.runtime}</span>}
              </div>
              
              {isEditing ? (
                <input 
                  className="w-full bg-black/60 border border-studio/30 rounded-xl px-4 py-3 text-2xl font-black text-white uppercase focus:border-studio focus:ring-1 focus:ring-studio/50 focus:outline-none transition-all shadow-inner"
                  value={ep.title}
                  onChange={(e) => onUpdateEpisode(idx, { title: e.target.value })}
                  placeholder="Episode Title"
                />
              ) : (
                <h3 className="text-3xl font-black text-white uppercase tracking-wider group-hover:text-studio transition-colors duration-500">
                  {ep.title}
                </h3>
              )}
            </div>

            {/* Hook / Synopsis */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-studio/40 to-transparent rounded-full" />
              <div className="pl-6">
                {isEditing ? (
                  <textarea 
                    className="w-full bg-black/60 border border-studio/20 rounded-xl p-5 text-sm text-zinc-300 leading-relaxed font-medium focus:border-studio/50 focus:outline-none transition-all min-h-[120px] resize-none"
                    value={ep.hook}
                    onChange={(e) => onUpdateEpisode(idx, { hook: e.target.value })}
                    placeholder="Describe the main hook or synopsis..."
                  />
                ) : (
                  <p className="text-zinc-400 text-[15px] leading-relaxed font-medium italic group-hover:text-zinc-300 transition-colors">
                    "{ep.hook}"
                  </p>
                )}
              </div>
            </div>

            {/* Additional Production Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
               {ep.setting && (
                 <div className="flex items-start gap-2 bg-black/20 p-3 rounded-xl border border-white/5 group-hover:border-studio/10">
                   <MapPin className="w-4 h-4 text-studio/70 shrink-0 mt-0.5" />
                   <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Primary Setting</p>
                     {isEditing ? (
                       <input className="w-full bg-transparent border-b border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-studio" value={ep.setting} onChange={(e) => onUpdateEpisode(idx, { setting: e.target.value })} />
                     ) : <p className="text-xs text-zinc-300 font-medium">{ep.setting}</p>}
                   </div>
                 </div>
               )}
               
               {ep.focus_characters && ep.focus_characters.length > 0 && (
                 <div className="flex items-start gap-2 bg-black/20 p-3 rounded-xl border border-white/5 group-hover:border-studio/10">
                   <Users className="w-4 h-4 text-purple-400/70 shrink-0 mt-0.5" />
                   <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Focus Cast</p>
                     {isEditing ? (
                       <input className="w-full bg-transparent border-b border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-studio" value={ep.focus_characters.join(', ')} onChange={(e) => onUpdateEpisode(idx, { focus_characters: e.target.value.split(',').map(s => s.trim()) })} />
                     ) : <p className="text-xs text-zinc-300 font-medium truncate">{ep.focus_characters.join(', ')}</p>}
                   </div>
                 </div>
               )}

               {ep.emotional_arc && (
                 <div className="flex items-start gap-2 bg-black/20 p-3 rounded-xl border border-white/5 group-hover:border-studio/10">
                   <Heart className="w-4 h-4 text-pink-400/70 shrink-0 mt-0.5" />
                   <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Emotional Arc</p>
                     {isEditing ? (
                       <input className="w-full bg-transparent border-b border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-studio" value={ep.emotional_arc} onChange={(e) => onUpdateEpisode(idx, { emotional_arc: e.target.value })} />
                     ) : <p className="text-xs text-zinc-300 font-medium truncate">{ep.emotional_arc}</p>}
                   </div>
                 </div>
               )}
            </div>
              
            {/* Asset Matrix Data */}
            {ep.asset_matrix && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-black/40 rounded-2xl border border-white/5 group-hover:border-studio/10 transition-colors">
                
                {/* Sound */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
                    <Volume2 className="w-3 h-3" /> Audio Profile
                  </p>
                  {isEditing ? (
                    <input 
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:border-studio/50 focus:outline-none transition-all"
                      value={ep.asset_matrix.sound}
                      onChange={(e) => onUpdateAssetMatrix(idx, { sound: e.target.value })}
                    />
                  ) : (
                    <p className="text-xs text-zinc-300 font-medium truncate" title={ep.asset_matrix.sound}>{ep.asset_matrix.sound}</p>
                  )}
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2 group-hover:text-purple-400 transition-colors">
                    <Camera className="w-3 h-3" /> Visual Style
                  </p>
                  {isEditing ? (
                    <input 
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:border-studio/50 focus:outline-none transition-all"
                      value={ep.asset_matrix.image}
                      onChange={(e) => onUpdateAssetMatrix(idx, { image: e.target.value })}
                    />
                  ) : (
                    <p className="text-xs text-zinc-300 font-medium truncate" title={ep.asset_matrix.image}>{ep.asset_matrix.image}</p>
                  )}
                </div>

                {/* Video */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                    <Video className="w-3 h-3" /> Motion
                  </p>
                  {isEditing ? (
                    <input 
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:border-studio/50 focus:outline-none transition-all"
                      value={ep.asset_matrix.video}
                      onChange={(e) => onUpdateAssetMatrix(idx, { video: e.target.value })}
                    />
                  ) : (
                    <p className="text-xs text-zinc-300 font-medium truncate" title={ep.asset_matrix.video}>{ep.asset_matrix.video}</p>
                  )}
                </div>

                {/* Scenes */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                    <LayoutGrid className="w-3 h-3" /> Structure
                  </p>
                  {isEditing ? (
                    <input 
                      type="number"
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:border-studio/50 focus:outline-none transition-all"
                      value={ep.asset_matrix.scene_count}
                      onChange={(e) => onUpdateAssetMatrix(idx, { scene_count: parseInt(e.target.value) || 0 })}
                    />
                  ) : (
                    <p className="text-xs text-emerald-400 font-bold">{ep.asset_matrix.scene_count} Units Planned</p>
                  )}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-end pt-4 border-t border-white/5">
              <Button 
                variant="outline" 
                onClick={() => onFocusEpisode(parseInt(ep.episode).toString())}
                className="h-10 px-6 rounded-xl bg-transparent border-studio/20 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-black hover:bg-studio hover:border-studio hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 group/btn"
              >
                Focus Episode <PlayCircle className="w-4 h-4 ml-2 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
