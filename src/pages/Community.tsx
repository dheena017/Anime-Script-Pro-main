import React from 'react';
import { TrendingUp, Users, Share2, ArrowRight, AlertCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { communityService, CommunityPost } from '@/services/api/community';
import { StudioLoading } from '@/components/studio/StudioLoading';


export function CommunityPage() {
  const [posts, setPosts] = React.useState<CommunityPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getPosts();
      setPosts(data);
    } catch (e: any) {
      console.error("Failed to fetch community posts:", e);
      setError(e.message || "Failed to synchronize with the collective");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: number) => {
    const result = await communityService.likePost(postId);
    if (result) {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: result.likes } : p));
    }
  };


  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-zinc-900 pb-10">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4 text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Users className="w-12 h-12 text-cyan-500" />
            Social Hub
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs pl-1">Sync with the global collective of script architects.</p>
        </div>

        <div className="hidden xl:flex items-center gap-6 px-10 border-l border-zinc-900/50">
           <div className="flex flex-col items-start px-6 border-l border-zinc-900/30 first:border-l-0">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-2">Network Backend</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                 <span className="text-[10px] font-black text-white uppercase tracking-tighter">NODE CONNECTED</span>
              </div>
           </div>
           <div className="flex flex-col items-start px-6 border-l border-zinc-900/30">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-2">Collective DB</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                 <span className="text-[10px] font-black text-white uppercase tracking-tighter">LOCAL SQLITE SYNCED</span>
              </div>
           </div>
           <div className="flex flex-col items-start px-6 border-l border-zinc-900/30">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-2">Protocol API</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black text-white uppercase tracking-tighter">GEMINI ARCHITECT</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-widest text-xs h-12 px-8 rounded-2xl shadow-[0_8px_20px_rgba(6,182,212,0.3)] transition-all active:scale-95">
            <Share2 className="w-4 h-4 mr-3" />
            Broadcast Script
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white">
              <TrendingUp className="w-6 h-6 text-orange-500 animate-pulse" />
              Neural Trending
            </h2>
            <Button variant="ghost" className="text-cyan-500 text-[10px] font-black uppercase tracking-widest hover:text-cyan-400">
              Explore More <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-full">
                <StudioLoading fullPage={false} message="Syncing Collective..." submessage="Establishing secure social node connection..." />
              </div>
            ) : error ? (

              <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-red-900/30 rounded-[3rem] bg-red-900/5">
                 <AlertCircle className="w-12 h-12 text-red-500 mb-6" />
                 <h3 className="text-sm font-black text-red-500 uppercase tracking-[0.3em] mb-2">Network Failure</h3>
                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-xs text-center">{error}</p>
                 <Button onClick={() => window.location.reload()} variant="outline" className="mt-6 border-red-500/30 text-red-400 hover:bg-red-500/10">Reconnect Collective</Button>
              </div>
            ) : posts.length > 0 ? posts.map((post, idx) => (
               <div key={post.id || idx} className="p-6 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/50 hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                      {post.user_id?.slice(0, 2).toUpperCase() || "A"}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">{post.title}</h4>
                      <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Architect: {post.user_id}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="text-[9px] font-black text-zinc-500 flex items-center gap-1.5 uppercase hover:text-red-500 transition-colors group/like"
                      >
                        <Heart className={`w-3 h-3 ${post.likes > 0 ? 'text-red-500 fill-red-500' : 'text-zinc-500'} group-hover/like:scale-110 transition-transform`} /> 
                        {post.likes} Likes
                      </button>
                      <span className="text-[9px] font-black text-zinc-500 flex items-center gap-1.5 uppercase">
                        <Users className="w-3 h-3 text-cyan-500" /> {post.views} Views
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 px-4 text-[9px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-400 p-0">
                      View Work <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
               </div>
            )) : (
              <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-[3rem] bg-[#050505]/20">
                 <TrendingUp className="w-16 h-16 text-zinc-800 mb-6" />
                 <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-2">No Trending Patterns</h3>
                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-xs text-center">
                   Broadcast your latest AI production to start a global trend.
                 </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white">
            <Users className="w-6 h-6 text-fuchsia-500" />
            Top Architects
          </h2>
          <div className="space-y-4">
          <div className="flex flex-col items-center justify-center py-20 border border-zinc-900 rounded-3xl opacity-40">
             <Users className="w-12 h-12 mb-4" />
             <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Connections</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
