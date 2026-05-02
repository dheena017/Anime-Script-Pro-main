import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Trash2,
  Dna,
  ShieldAlert
} from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function CastEditPage() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const { castData, castList, setCastList, contentType } = useGenerator();

  const characters = [...(castData?.characters || castList || [])];
  const charIndex = characters.findIndex((c: any) => 
    c.name.toLowerCase().replace(/\s+/g, '-') === characterId || c.name === characterId
  );
  
  const [formData, setFormData] = React.useState<any>(characters[charIndex] || null);

  React.useEffect(() => {
    if (charIndex !== -1 && !formData) {
      setFormData(characters[charIndex]);
    }
  }, [charIndex, characters, formData]);

  if (charIndex === -1 || !formData) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em]">Character Not Found</p>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    );
  }

  const handleSave = () => {
    const newList = [...characters];
    newList[charIndex] = formData;
    setCastList(newList);
    navigate(`/${contentType.toLowerCase()}/cast/registry/${characterId}`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Discard Changes
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4 mr-2" /> Delete Character
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-studio text-black font-black uppercase hover:bg-studio/80 shadow-studio"
          >
            <Save className="w-4 h-4 mr-2" /> Synchronize DNA
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                Re-Sequence <span className="text-studio">{formData.name}</span>
              </h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Character Soul Architect</p>
            </div>

            <Card className="p-8 md:p-10 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                    Character Name <span className="text-studio/50">*</span>
                  </Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-black/60 border-zinc-800 h-12 text-lg font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                    Narrative Role <span className="text-studio/50">*</span>
                  </Label>
                  <Input 
                    value={formData.role || ''} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="bg-black/60 border-zinc-800 h-12 text-lg font-bold text-studio"
                    placeholder="Protagonist, Antagonist, etc."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Personality / Description</Label>
                <Textarea 
                  value={formData.personality || formData.description || ''} 
                  onChange={(e) => setFormData({...formData, personality: e.target.value})}
                  className="bg-black/60 border-zinc-800 min-h-[120px] resize-none leading-relaxed"
                  placeholder="Describe the essence of this character..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Core Objective</Label>
                  <Input 
                    value={characterId === 'goal' ? formData.goal : (formData.goal || formData.objective || '')} 
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    className="bg-black/60 border-zinc-800"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Genetic Flaw</Label>
                  <Input 
                    value={formData.weakness || formData.flaw || ''} 
                    onChange={(e) => setFormData({...formData, weakness: e.target.value})}
                    className="bg-black/60 border-zinc-800"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-8 bg-[#050505]/60 border-studio/10 rounded-[3rem] space-y-6">
             <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <Dna className="w-5 h-5 text-studio" />
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">DNA Specification</h3>
             </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Visual DNA Profile</Label>
                <Textarea 
                  value={formData.visual_dna || ''} 
                  onChange={(e) => setFormData({...formData, visual_dna: e.target.value})}
                  className="bg-black/40 border-zinc-800 text-xs min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Communication Style</Label>
                <Input 
                  value={formData.communication_style || ''} 
                  onChange={(e) => setFormData({...formData, communication_style: e.target.value})}
                  className="bg-black/40 border-zinc-800 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Narrative Conflict</Label>
                <Input 
                  value={formData.conflict || ''} 
                  onChange={(e) => setFormData({...formData, conflict: e.target.value})}
                  className="bg-black/40 border-zinc-800 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">Changes to character DNA will propagate through the neural story network immediately.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

