import React from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Trash2,
  FileText,
  Clock,
  Calendar,
  GitCommit,
  TrendingUp,
  Hash,
  FolderOpen,
  MoreHorizontal,
  Share2,
  Bookmark,
  LayoutGrid,
  List
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { StudioLoading } from '@/components/studio/StudioLoading';


interface Script {
  id: string;
  prompt?: string;
  script?: string;
  tone?: string;
  session?: string;
  episode?: string;
  uid?: string;
  createdAt?: { seconds: number };
  updatedAt?: { seconds: number };
}

interface ScriptVersion {
  id: string;
  scriptId: string;
  script: string;
  uid: string;
  createdAt?: { seconds: number };
}

export function LibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const [scripts, setScripts] = React.useState<Script[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Versions state
  const [selectedScriptForVersions, setSelectedScriptForVersions] = React.useState<Script | null>(null);
  const [scriptVersions, setScriptVersions] = React.useState<ScriptVersion[]>([]);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = React.useState(false);
  const [isLoadingVersions, setIsLoadingVersions] = React.useState(false);

  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [pinnedScripts, setPinnedScripts] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  
  const navigate = useNavigate();

  const categories = ['All', ...Array.from(new Set(scripts.map(s => s.tone || 'Action')))];

  const stats = [
    { label: 'Total Scripts', value: scripts.length, icon: FileText, color: 'text-cyan-400' },
    { label: 'Words Written', value: scripts.reduce((acc, s) => acc + (s.script?.split(' ').length || 0), 0).toLocaleString(), icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Collections', value: categories.length - 1, icon: FolderOpen, color: 'text-orange-400' },
    { label: 'Pinned', value: pinnedScripts.length, icon: Bookmark, color: 'text-yellow-400' },
  ];

  React.useEffect(() => {
    // Failsafe: force yield to UI after 8 seconds
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Library failsafe triggered: forcing isLoading to false");
        setIsLoading(false);
      }
    }, 8000);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  React.useEffect(() => {
    if (!user) {
      if (!authLoading) setIsLoading(false);
      return;
    }

    const fetchLibrary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8001/api/projects`);
        if (!res.ok) throw new Error("Failed to connect to production archive");
        const data = await res.json();
        
        const mappedData = data.map((p: any) => ({
          id: p.id.toString(),
          prompt: p.prompt || p.title,
          script: p.prod_metadata?.script || "Archived Production...",
          tone: p.art_style || p.vibe || "Action",
          session: p.prod_metadata?.session,
          episode: p.prod_metadata?.episode,
          createdAt: { seconds: Math.floor(new Date(p.created_at).getTime() / 1000) }
        }));
        
        setScripts(mappedData);
      } catch (err: any) {
        console.error("Library sync failed:", err);
        setError(err.message || "Network synchronization failed");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, [user]);

  const fetchVersions = async (scriptId: string) => {
    setIsLoadingVersions(true);
    try {
      const res = await fetch(`http://localhost:8001/api/scripts/${scriptId}/versions`);
      if (!res.ok) throw new Error("Failed to fetch versions");
      const versions = await res.json();
      
      const mappedVersions = versions.map((v: any) => ({
        id: v.id.toString(),
        scriptId: v.script_id.toString(),
        script: v.content,
        createdAt: { seconds: Math.floor(new Date(v.created_at).getTime() / 1000) }
      }));
      
      setScriptVersions(mappedVersions);
    } catch (error) {
      console.error("Fetch versions error:", error);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleOpenVersions = (script: Script) => {
    setSelectedScriptForVersions(script);
    setIsVersionsModalOpen(true);
    fetchVersions(script.id);
  };

  const handleRevertVersion = async (version: ScriptVersion) => {
    if (!selectedScriptForVersions) return;
    if (window.confirm('Are you sure you want to revert to this version?')) {
      try {
        // Update the project/script content on the backend
        const res = await fetch(`http://localhost:8001/api/projects/${selectedScriptForVersions.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prod_metadata: { ...selectedScriptForVersions, script: version.script }
          })
        });

        if (res.ok) {
          setIsVersionsModalOpen(false);
          // Refresh the library
          window.location.reload();
        }
      } catch (error) {
        console.error("Revert error:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this script?')) {
      try {
        const res = await fetch(`http://localhost:8001/api/projects/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setScripts(prev => prev.filter(s => s.id !== id));
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const [sortBy, setSortBy] = React.useState<'newest' | 'oldest' | 'title'>('newest');

  const filteredScripts = scripts
    .filter(s => {
      const matchesSearch = s.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.script?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || (s.tone || 'Action') === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      if (sortBy === 'oldest') return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
      if (sortBy === 'title') return (a.prompt || '').localeCompare(b.prompt || '');
      return 0;
    });

  const togglePin = (id: string) => {
    setPinnedScripts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 uppercase text-cyan-50 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">My Library</h1>
            <p className="text-cyan-500/60 font-bold uppercase tracking-widest text-xs">Manage and organize your generated anime scripts.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
              <Input 
                placeholder="Search scripts..." 
                className="pl-10 bg-[#0a0a0a] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-700 focus-visible:ring-cyan-500/50 rounded-full h-10 shadow-[inner_0_2px_10px_rgba(0,0,0,0.8)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-cyan-500/30 bg-[#0a0a0a] text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300 rounded-full h-10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[140px] border-cyan-500/30 bg-[#0a0a0a] text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300 rounded-full h-10">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-cyan-500/30 text-cyan-100">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">By Title</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border border-zinc-800 rounded-full p-1 bg-black/40">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8 rounded-full", viewMode === 'grid' ? "bg-cyan-500/10 text-cyan-400" : "text-zinc-500")}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8 rounded-full", viewMode === 'list' ? "bg-cyan-500/10 text-cyan-400" : "text-zinc-500")}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              onClick={() => navigate('/create-project')}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase tracking-widest text-[10px] rounded-full h-10 px-6 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95 hidden md:flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Production
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0a] border border-zinc-800/50 p-4 rounded-2xl flex items-center justify-between group hover:border-cyan-500/30 transition-all"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
                <p className="text-xl font-black text-white">{stat.value}</p>
              </div>
              <div className={cn("p-3 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:scale-110 transition-transform", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                selectedCategory === cat
                  ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {authLoading || (user && isLoading) ? (
          <StudioLoading fullPage={false} message="Synchronizing Archive..." submessage="Accessing production vaults and script versions..." />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6 bg-red-500/5 rounded-[3rem] border border-red-500/20">
            <div className="p-5 bg-red-500/10 rounded-full">
                <History className="w-10 h-10 text-red-500" />
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-red-500">Connection Failed</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{error}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline" 
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              Reconnect to Neural Net
            </Button>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "flex flex-col gap-3"
          )}>
            {viewMode === 'grid' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer group"
                onClick={() => navigate('/create-project')}
              >
                <div className="h-full min-h-[300px] bg-gradient-to-br from-[#111318]/50 to-[#0a0b0e]/50 border-2 border-dashed border-zinc-800 group-hover:border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]" />
                  <div className="w-16 h-16 rounded-full bg-cyan-500/5 flex items-center justify-center border border-cyan-500/20 group-hover:bg-cyan-500/10 group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                      <Plus className="w-8 h-8 text-cyan-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-50 mb-1">New Production</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Start from scratch</p>
                  </div>
                </div>
              </motion.div>
            )}

            {filteredScripts.map((script, idx) => (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {viewMode === 'grid' ? (
                <Card className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all group overflow-hidden h-full flex flex-col rounded-2xl relative">
                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0" />
                  
                  <div className="aspect-video bg-[#0a0a0a] relative overflow-hidden z-10 border-b border-zinc-800/50">
                    <img 
                      src={`https://picsum.photos/seed/${script.id}/600/400`} 
                      alt="Preview" 
                      className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/40 to-transparent" />
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          "h-8 w-8 rounded-full backdrop-blur-md border transition-all",
                          pinnedScripts.includes(script.id) 
                            ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]" 
                            : "bg-black/40 border-white/5 text-white/40 hover:text-white hover:bg-black/60"
                        )}
                        onClick={(e) => { e.stopPropagation(); togglePin(script.id); }}
                      >
                        <Bookmark className={cn("w-4 h-4", pinnedScripts.includes(script.id) && "fill-yellow-500")} />
                      </Button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-black uppercase tracking-widest text-[10px]">
                          {script.tone || 'Action'}
                        </Badge>
                        {(script.session || script.episode) && (
                          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-black uppercase tracking-widest text-[10px]">
                            {script.session && <span>S{script.session}</span>} 
                            {script.episode && <span>E{script.episode}</span>}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono tracking-widest bg-black/50 px-2 py-1 rounded-full backdrop-blur-md border border-zinc-800">
                        <Clock className="w-3 h-3 text-cyan-500" />
                        {Math.ceil((script.script?.split(' ').length || 0) / 130)} min
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="p-5 pb-2 z-10 relative">
                    <div className="flex items-center justify-between mb-1">
                      <CardTitle className="text-lg line-clamp-1 group-hover:text-cyan-400 transition-colors font-bold text-zinc-100 drop-shadow-md">
                        {script.prompt?.slice(0, 40) || 'Untitled Script'}
                      </CardTitle>
                      <Badge variant="ghost" className="text-[9px] text-zinc-600 font-mono p-0">
                        <Hash className="w-2.5 h-2.5 mr-0.5" /> {script.id.slice(0, 4)}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                      <Calendar className="w-3 h-3 text-zinc-600" />
                      {script.createdAt?.seconds ? new Date(script.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between z-10 relative">
                    <p className="text-[11px] text-zinc-400 line-clamp-3 mb-6 leading-relaxed font-medium">
                      {script.script?.replace(/[#|*-]/g, '').slice(0, 150)}...
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors"
                          onClick={() => navigate('/', { state: { scriptId: script.id, script: script.script } })}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10 rounded-full transition-colors"
                          title="Version History"
                          onClick={() => handleOpenVersions(script)}
                        >
                          <GitCommit className="w-4 h-4" />
                        </Button>
                      </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                            onClick={() => handleDelete(script.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                    </div>
                  </CardContent>
                  </Card>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-[#0a0a0a] border border-zinc-800 rounded-2xl hover:border-cyan-500/30 transition-all group relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.01] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                    <div className="w-32 h-20 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                      <img 
                        src={`https://picsum.photos/seed/${script.id}/300/200`} 
                        alt="Preview" 
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-all mix-blend-luminosity"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-black text-zinc-100 truncate group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                          {script.prompt?.slice(0, 60) || 'Untitled Script'}
                        </h3>
                        <Badge variant="outline" className="bg-zinc-900 text-zinc-500 border-zinc-800 text-[8px] font-bold uppercase tracking-widest px-1.5 h-4">
                          <Hash className="w-2 h-2 mr-1" />
                          {script.id.slice(0, 4)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[9px] font-black uppercase tracking-widest">
                            {script.tone || 'Action'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-mono">
                          <Calendar className="w-3 h-3" />
                          {script.createdAt?.seconds ? new Date(script.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-full text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10"
                        onClick={() => navigate('/', { state: { scriptId: script.id, script: script.script } })}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn("h-9 w-9 rounded-full transition-all", pinnedScripts.includes(script.id) ? "text-yellow-500 bg-yellow-500/10" : "text-zinc-500 hover:text-yellow-500")}
                        onClick={() => togglePin(script.id)}
                      >
                        <Bookmark className={cn("w-4 h-4", pinnedScripts.includes(script.id) && "fill-yellow-500")} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-full text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10"
                        onClick={() => handleOpenVersions(script)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-full text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(script.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {filteredScripts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <FileText className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500">No scripts found matching your search.</p>
              </div>
            )}
          </div>
        )}

        <Dialog open={isVersionsModalOpen} onOpenChange={setIsVersionsModalOpen}>
          <DialogContent className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border border-cyan-500/20 text-zinc-200 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
            
            <DialogHeader className="relative z-10 border-b border-zinc-800/50 pb-4">
              <DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-cyan-100">
                <History className="w-6 h-6 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                Version History
              </DialogTitle>
              <DialogDescription className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">
                {selectedScriptForVersions?.prompt?.slice(0, 50)}...
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="flex-1 relative z-10 pr-4 mt-4">
              {isLoadingVersions ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                </div>
              ) : scriptVersions.length === 0 ? (
                <div className="text-center py-12 text-zinc-600 font-bold uppercase tracking-widest text-xs">
                  No previous versions found.
                </div>
              ) : (
                <div className="flex flex-col gap-4 pb-4">
                  {scriptVersions.map((version, idx) => (
                    <Card key={version.id} className="bg-[#0a0a0a]/50 border-zinc-800/60 relative overflow-hidden group hover:border-orange-500/30 transition-all rounded-xl backdrop-blur-md">
                      <CardContent className="p-5 flex gap-5">
                        <div className="flex flex-col items-center justify-start pt-1">
                          <div className={cn("w-3 h-3 rounded-full transition-all drop-shadow-md border", idx === 0 ? "bg-orange-500 border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.6)]" : "bg-zinc-800 border-zinc-700 group-hover:bg-zinc-600")} />
                          {idx !== scriptVersions.length - 1 && (
                            <div className="w-[1px] h-full bg-gradient-to-b from-orange-500/20 via-zinc-800 to-zinc-800 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black tracking-widest uppercase text-zinc-300">
                              {version.createdAt?.seconds ? new Date(version.createdAt.seconds * 1000).toLocaleString() : 'Unknown Time'}
                            </p>
                            {idx === 0 && (
                              <span className="text-[9px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-[0.2em] border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]">Latest Origin</span>
                            )}
                          </div>
                          <div className="bg-[#050505] rounded-lg p-3 border border-zinc-800/50 shadow-inner">
                            <p className="text-xs text-zinc-400 line-clamp-3 font-medium leading-relaxed italic">
                              {version.script?.replace(/[#|*-]/g, '').slice(0, 200)}...
                            </p>
                          </div>
                          {idx !== 0 && (
                            <div className="pt-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300 hover:border-orange-400 transition-all shadow-[0_0_10px_rgba(249,115,22,0.05)]"
                                onClick={() => handleRevertVersion(version)}
                              >
                                <History className="w-3 h-3 mr-2" /> Revert Configuration
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
