import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Edit3,
  Share2,
  User,
  Zap,
  Shield,
  Target,
  Skull,
  MessageSquare,
  Eye,
  Info,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CastViewPage() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const { castData, castList, contentType, setIsLoading, addLog } = useGenerator();
  const [isManifesting, setIsManifesting] = useState(false);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);

  const characters = castData?.characters || castList || [];
  // Finding by name or slugified name
  const character = characters.find((c: any) => 
    c.name.toLowerCase().replace(/\s+/g, '-') === characterId || c.name === characterId
  );

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em]">Character Not Found</p>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    );
  const handleManifest = async () => {
    setIsManifesting(true);
    addLog("NEURAL_ENGINE", "MANIFESTING", `Synthesizing Visual DNA for ${character.name}...`);
    
    // Simulate generation for now
    setTimeout(() => {
      setPortraitUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${character.name}&backgroundColor=0a0a0a`);
      setIsManifesting(false);
      addLog("NEURAL_ENGINE", "SUCCESS", `Visual DNA Manifested for ${character.name}.`);
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-white p-0 h-auto"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Registry
        </Button>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
          <Button variant="outline" className="border-zinc-800 text-zinc-400 flex-1 md:flex-none">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => navigate(`/${contentType.toLowerCase()}/cast/registry/${characterId}/edit`)}
            className="bg-zinc-800 text-white hover:bg-zinc-700 flex-1 md:flex-none"
          >
            <Edit3 className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button 
            disabled={isManifesting}
            onClick={handleManifest}
            className="bg-studio text-black font-black uppercase hover:bg-studio/80 shadow-studio flex-1 md:flex-none group relative overflow-hidden"
          >
            {isManifesting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            )}
            {isManifesting ? "Manifesting..." : "Neural Manifest"}
            {isManifesting && <div className="absolute inset-0 bg-studio/20 animate-pulse" />}
          </Button>
        </div>
      </div>

      {/* Main Profile Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-studio/20 to-purple-500/20 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <Card className="relative p-8 md:p-12 bg-black/40 border-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-32 h-32 rounded-3xl bg-zinc-900 border-2 border-studio/20 flex items-center justify-center text-studio shrink-0 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden group/portrait">
                    {portraitUrl ? (
                      <img src={portraitUrl} alt={character.name} className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000" />
                    ) : (
                      <User className="w-16 h-16" />
                    )}
                    {isManifesting && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-studio border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-studio/10 opacity-0 group-hover/portrait:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Badge className="bg-studio/10 text-studio border-studio/20 uppercase tracking-widest text-[9px] font-black">
                        {character.role || "Character Soul"}
                      </Badge>
                      <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight break-words">
                        {character.name}
                      </h1>
                    </div>
                    <p className="text-base md:text-xl text-zinc-400 font-medium italic leading-relaxed max-w-2xl">
                      "{character.personality || character.description || 'Soul manifest pending...'}"
                    </p>
                  </div>
               </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="p-8 bg-zinc-900/40 border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-studio">
                  <Target className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Core Objective</span>
                </div>
                <p className="text-zinc-300 leading-relaxed font-medium">
                  {character.goal || character.objective || "To navigate the narrative currents and find purpose."}
                </p>
             </Card>
             <Card className="p-8 bg-zinc-900/40 border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-red-400">
                  <Skull className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Genetic Flaw</span>
                </div>
                <p className="text-zinc-300 leading-relaxed font-medium">
                  {character.weakness || character.flaw || "A hidden vulnerability within the character's DNA."}
                </p>
             </Card>
          </div>

          <Card className="p-4 sm:p-8 md:p-12 bg-zinc-900/20 border-white/5 space-y-8">
            <div className="space-y-2">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <Eye className="w-4 h-4 text-studio" /> Visual DNA Profile
              </h3>
              <p className="text-zinc-400 leading-relaxed italic">
                {character.visual_dna || "Detailed visual specification for neural manifestation."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Communication Style</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                    {character.communication_style || "Nuanced linguistic patterns and vocal texture."}
                  </p>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Narrative Conflict</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                    {character.conflict || "The friction between internal desire and external reality."}
                  </p>
               </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 bg-[#050505]/60 border-studio/10 rounded-[2.5rem] sm:rounded-[3rem] space-y-8">
            <div className="space-y-6">
               <div className="text-center pb-6 border-b border-white/5">
                  <div className="w-20 h-20 rounded-full bg-studio/5 border border-studio/20 mx-auto flex items-center justify-center mb-4">
                    <Shield className="w-10 h-10 text-studio animate-pulse" />
                  </div>
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Manifestation Status</h4>
                  <p className="text-studio font-black text-xs uppercase tracking-widest mt-1">Ready for Production</p>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-zinc-600">Soul Sync</span>
                    <span className="text-studio">100%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-studio shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                  </div>
               </div>

               <div className="space-y-2">
                 <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Metadata Tags</p>
                 <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-[8px] border-zinc-800 text-zinc-500">CORE_NPC</Badge>
                    <Badge variant="outline" className="text-[8px] border-zinc-800 text-zinc-500">NEURAL_STABLE</Badge>
                    <Badge variant="outline" className="text-[8px] border-zinc-800 text-zinc-500">HIGH_RES</Badge>
                 </div>
               </div>
            </div>

            <Button className="w-full h-14 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all">
              Download Soul Archive
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
