import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ImageIcon, 
  Sparkles, 
  GripVertical, 
  Wand2, 
  Edit2, 
  X, 
  Save, 
  Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
  duration: string;
  linkedPrompt?: string;
}

interface SceneCardProps {
  scene: Scene;
  index: number;
  visualData: Record<number, string>;
  promptList: string[]; // Add this
  editingSceneId: string | null;
  editForm: Partial<Scene>;
  isEnhancingNarration: boolean;
  isEnhancing: boolean;
  isRewritingTension: boolean;
  isSuggestingDuration: boolean;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<Scene>>>;
  handleGenerateVisual: (idx: number, visuals: string) => void;
  startEditing: (scene: Scene) => void;
  cancelEditing: () => void;
  saveSceneEdits: () => void;
  handleEnhanceNarration: () => void;
  handleEnhanceVisuals: () => void;
  handleRewriteTension: () => void;
  handleSuggestDuration: () => void;
  dragHandleProps?: any;
  draggableProps?: any;
  innerRef?: (element: HTMLElement | null) => void;
  isDragging?: boolean;
  isBulkEnhancing?: boolean;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  index,
  visualData,
  promptList,
  editingSceneId,
  editForm,
  isEnhancingNarration,
  isEnhancing,
  isRewritingTension,
  isSuggestingDuration,
  setEditForm,
  handleGenerateVisual,
  startEditing,
  cancelEditing,
  saveSceneEdits,
  handleEnhanceNarration,
  handleEnhanceVisuals,
  handleRewriteTension,
  handleSuggestDuration,
  dragHandleProps,
  draggableProps,
  innerRef,
  isDragging,
  isBulkEnhancing
}) => {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      style={{
        ...draggableProps?.style,
        opacity: isDragging ? 0.8 : 1,
      }}
      className="relative"
    >
      <Card className={cn(
        "bg-gradient-to-br from-[#111318] to-[#0a0b0e] border transition-all duration-500 overflow-hidden group hover:scale-[1.02]",
        isDragging 
          ? "border-studio shadow-studio scale-[1.02] z-50 relative" 
          : "border-zinc-800 hover:border-studio/50 hover:shadow-studio/20",
        isBulkEnhancing && "border-studio/50 shadow-studio/10"
      )}>
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
        
        {isBulkEnhancing && (
          <div className="absolute inset-0 bg-studio/5 backdrop-blur-[2px] z-[60] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
             <div className="w-12 h-12 border-4 border-studio/20 border-t-studio rounded-full animate-spin mb-4" />
             <h4 className="text-xs font-black uppercase tracking-[0.2em] text-studio drop-shadow-studio mb-2">Architect Refining</h4>
             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">Synthesizing advanced visual parameters...</p>
          </div>
        )}
        
        {/* Scene Image Area */}
        <div className="aspect-video bg-zinc-950/50 flex items-center justify-center border-b border-white/5 relative overflow-hidden z-10">
          {visualData[scene.originalIndex] === 'loading' ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-studio/30 border-t-studio rounded-full animate-spin" />
              <p className="text-[9px] text-studio uppercase tracking-widest font-black">Generating Frame...</p>
            </div>
          ) : visualData[scene.originalIndex] ? (
            <img 
              src={visualData[scene.originalIndex]} 
              alt={`Scene ${index + 1}`} 
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="p-6 text-center">
              <ImageIcon className="w-10 h-10 mx-auto mb-3 text-zinc-800" />
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium">Awaiting Visual Generation</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 h-8 text-[10px] text-studio hover:text-studio/80 hover:bg-studio/10 uppercase tracking-widest font-black transition-all"
                onClick={() => handleGenerateVisual(scene.originalIndex, scene.linkedPrompt || scene.visuals)}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Generate Visual
              </Button>
            </div>
          )}

          {/* Scene Label & Drag Handle */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-studio/30 text-zinc-100 text-[9px] font-black px-2.5 py-1.5 rounded shadow-studio flex items-center gap-1.5 uppercase tracking-widest">
            <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing mr-1">
              <GripVertical className="w-3.5 h-3.5 opacity-70 hover:opacity-100 transition-opacity text-studio" />
            </div>
            Scene {String(index + 1).padStart(2, '0')}
          </div>

          {visualData[scene.originalIndex] && visualData[scene.originalIndex] !== 'loading' && (
            <button 
              onClick={() => handleGenerateVisual(scene.originalIndex, scene.linkedPrompt || scene.visuals)}
              className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md border border-studio/30 hover:bg-studio hover:border-studio text-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-studio"
              title="Regenerate Visual"
            >
              <Wand2 className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <p className="text-[10px] text-zinc-200 font-semibold uppercase tracking-widest line-clamp-1">{scene.section}</p>
          </div>
        </div>

        {/* Scene Content Area */}
        <div className="p-5 space-y-4 relative z-10">
          {editingSceneId === scene.id ? (
            <div className="space-y-3">

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Section</label>
                <Input 
                  value={editForm.section || ''} 
                  onChange={(e) => setEditForm({...editForm, section: e.target.value})}
                  className="h-8 text-xs bg-transparent border-transparent hover:border-zinc-800 focus:border-studio/50 focus:bg-black/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Narration</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2.5 text-[9px] text-studio hover:text-studio/80 hover:bg-studio/10 uppercase tracking-widest font-black"
                    onClick={handleEnhanceNarration}
                    disabled={isEnhancingNarration}
                  >
                    {isEnhancingNarration ? (
                      <div className="w-3 h-3 border-2 border-studio/30 border-t-studio rounded-full animate-spin mr-1.5" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1.5" />
                    )}
                    {isEnhancingNarration ? 'Enhancing...' : 'Enhance'}
                  </Button>
                </div>
                <Textarea 
                  value={editForm.narration || ''} 
                  onChange={(e) => setEditForm({...editForm, narration: e.target.value})}
                  className="min-h-[60px] text-sm font-serif bg-transparent border-transparent hover:border-zinc-800 focus:border-studio/50 focus:bg-black/50 resize-none transition-all leading-relaxed"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Visual/Scene Description</label>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-1.5 text-[9px] text-studio hover:text-studio/80 hover:bg-studio/10 uppercase tracking-wider font-bold"
                      onClick={() => handleGenerateVisual(scene.originalIndex, editForm.linkedPrompt || editForm.visuals || scene.visuals)}
                      disabled={visualData[scene.originalIndex] === 'loading'}
                      title="Generate Visual from prompt"
                    >
                      {visualData[scene.originalIndex] === 'loading' ? (
                        <div className="w-3 h-3 border-2 border-studio/30 border-t-studio rounded-full animate-spin" />
                      ) : (
                        <ImageIcon className="w-3 h-3" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-1.5 text-[9px] text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 uppercase tracking-wider font-bold"
                      onClick={handleEnhanceVisuals}
                      disabled={isEnhancing}
                    >
                      {isEnhancing ? (
                        <div className="w-3 h-3 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-1.5 text-[9px] text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 uppercase tracking-wider font-bold"
                      onClick={handleRewriteTension}
                      disabled={isRewritingTension}
                    >
                      {isRewritingTension ? (
                        <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                      ) : (
                        <Zap className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <Textarea 
                  value={editForm.visuals || ''} 
                  onChange={(e) => setEditForm({...editForm, visuals: e.target.value})}
                  className="min-h-[60px] text-xs font-mono bg-transparent border-transparent hover:border-zinc-800 focus:border-purple-500/50 focus:bg-black/50 resize-none transition-all leading-relaxed"
                  placeholder="Specify camera angles, lighting, and cinematic composition..."
                />
              </div>

              <div className="space-y-1.5 p-3 rounded-lg bg-studio/5 border border-studio/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[9px] font-black text-studio uppercase tracking-[0.2em]">Master Image Prompt</label>
                  {promptList.length > 0 && (
                    <Select onValueChange={(val: string | null) => setEditForm({ ...editForm, linkedPrompt: val || undefined })}>
                      <SelectTrigger className="h-6 w-auto bg-studio/20 border-studio/30 text-[8px] text-white uppercase font-black px-2 hover:bg-studio/30 transition-colors">
                        <SelectValue placeholder="SELECT FROM LIST" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0b0e] border-studio/20 max-h-[300px]">
                        {promptList.map((p, i) => (
                          <SelectItem key={i} value={p} className="text-[10px] text-zinc-400 focus:text-white uppercase font-bold py-2 border-b border-white/5 last:border-0">
                            Prompt {i + 1}: {p.substring(0, 40)}...
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <Textarea 
                  value={editForm.linkedPrompt || ''} 
                  onChange={(e) => setEditForm({...editForm, linkedPrompt: e.target.value})}
                  className="min-h-[80px] text-[11px] font-mono bg-black/40 border-studio/20 hover:border-studio/40 focus:border-studio focus:bg-black/60 resize-none transition-all leading-relaxed text-zinc-300"
                  placeholder="Select a prompt from the list above or paste your own master artistic prompt here..."
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[8px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold"
                    onClick={() => setEditForm({...editForm, linkedPrompt: ''})}
                  >
                    Clear Prompt
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Sound & BGM Cues</label>
                <Textarea 
                  value={editForm.sound || ''} 
                  onChange={(e) => setEditForm({...editForm, sound: e.target.value})}
                  className="min-h-[60px] text-xs font-mono bg-transparent border-transparent hover:border-zinc-800 focus:border-blue-500/50 focus:bg-black/50 resize-none transition-all leading-relaxed"
                  placeholder="Insert sound effect cues [SFX] or background music markers <BGM>..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Duration</label>
                <div className="flex gap-2">
                  <Input 
                    value={editForm.duration || ''} 
                    onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                    className="h-8 text-xs font-mono bg-black/50 border-white/10 focus-visible:ring-emerald-500/50 flex-1"
                    placeholder="e.g. 5s"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-3 text-[9px] text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 uppercase tracking-wider font-bold border border-emerald-500/20"
                    onClick={handleSuggestDuration}
                    disabled={isSuggestingDuration}
                  >
                    {isSuggestingDuration ? (
                      <div className="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1.5" /> Suggest
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-white/5 mt-4">
                <Button variant="ghost" size="sm" onClick={cancelEditing} className="h-8 text-[10px] uppercase tracking-wider font-bold hover:bg-white/5">
                  <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                </Button>
                <Button variant="default" size="sm" onClick={saveSceneEdits} className="h-8 text-[10px] uppercase tracking-widest font-black bg-studio hover:bg-studio/80 text-black shadow-studio">
                  <Save className="w-3.5 h-3.5 mr-1.5" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1 flex-1 pr-4">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Narration</h4>
                  <p className="text-sm text-zinc-200 font-serif leading-relaxed italic line-clamp-2">"{scene.narration}"</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => startEditing(scene)}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="space-y-1.5 bg-black/20 p-3 rounded-lg border border-white/5 relative group/visual">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[9px] font-bold text-purple-400/80 uppercase tracking-widest flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3" /> Visual/Scene Description
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-[9px] text-studio hover:text-studio/80 hover:bg-studio/10 uppercase tracking-widest font-black opacity-0 group-hover/visual:opacity-100 transition-opacity"
                    onClick={() => handleGenerateVisual(scene.originalIndex, scene.linkedPrompt || scene.visuals)}
                    disabled={visualData[scene.originalIndex] === 'loading'}
                  >
                    {visualData[scene.originalIndex] === 'loading' ? 'Generating...' : 'Generate Visual'}
                  </Button>
                </div>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-2">{scene.visuals}</p>
                {scene.linkedPrompt && (
                  <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                    <span className="text-[8px] font-black text-studio/60 uppercase tracking-widest block">Linked Master Prompt</span>
                    <p className="text-[9px] text-zinc-500 font-mono italic line-clamp-1 truncate hover:line-clamp-none transition-all cursor-default">
                      {scene.linkedPrompt}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 bg-black/20 p-3 rounded-lg border border-white/5">
                <h4 className="text-[9px] font-bold text-blue-400/80 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Sound & BGM
                </h4>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-2 italic">{scene.sound}</p>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 mt-2">
                <span className="opacity-70">Duration:</span>
                <span className="text-studio">{scene.duration}</span>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
