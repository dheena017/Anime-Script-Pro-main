import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ArrowRight, 
  Activity, 
  LayoutGrid, 
  ScrollText, 
  Zap, 
  ChevronRight, 
  FolderGit2,
  PlusSquare,
  Globe,
  Bell,
  Cpu,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { cn } from '../lib/utils';
import { createClient } from '../supabase/client';
import { TodoWidget } from '../components/TodoWidget';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const supabase = createClient();
  const [stats, setStats] = useState({ total: 0, week: 0, recent: null as any });

  const fetchStats = async () => {
    if (!user) return;
    
    // Total Projects
    const { count: total } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Recent Projects
    const { data: recentItems } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(5);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekCount = recentItems?.filter(i => new Date(i.updated_at) > weekAgo).length || 0;

    setStats({
      total: total || 0,
      week: weekCount,
      recent: recentItems?.[0] || null
    });
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return (
    <div className={cn("min-h-screen bg-[#050505] text-zinc-100 space-y-8 max-w-[1600px] mx-auto pt-4")}>
      {/* 1. TOP HEADER / NEURAL STATUS */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#bd4a4a] animate-pulse shadow-[0_0_8px_rgba(189,74,74,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#bd4a4a]">Node Synchronized</span>
          </div>
        </div>
      </div>

      {/* 2. CORE STATS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-zinc-900/30 border-zinc-800/50 p-8 flex flex-col justify-between group hover:border-[#bd4a4a]/20 transition-all relative overflow-hidden rounded-[2rem]">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#bd4a4a]/[0.02] pointer-events-none" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">PRODUCTION ARCHIVES</p>
            <div className="flex items-baseline gap-2">
               <h3 className="text-5xl font-black text-white">{stats.total}</h3>
               <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mb-1">
                 <Activity className="w-3 h-3" /> ONLINE
               </div>
            </div>
         </Card>

         <Card className="bg-zinc-900/30 border-zinc-800/50 p-8 flex flex-col justify-between group hover:border-[#bd4a4a]/20 transition-all relative overflow-hidden rounded-[2rem]">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">NEURAL ACTIVITY (WEEK)</p>
            <h3 className="text-5xl font-black text-white">{stats.week}</h3>
         </Card>

         <Card className="bg-zinc-900/30 border-zinc-800/50 p-8 flex flex-col justify-center items-start group hover:border-[#bd4a4a]/20 transition-all rounded-[2rem]">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">LATEST BLUEPRINT</p>
            <div className="w-full">
              <p className="text-sm font-bold text-zinc-200 truncate mb-2">
                {stats.recent ? stats.recent.title : 'No active blueprints'}
              </p>
              {stats.recent && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
                    <Calendar className="w-2.5 h-2.5 text-[#bd4a4a]" />
                    {new Date(stats.recent.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
                    <Cpu className="w-2.5 h-2.5 text-blue-500" />
                    {stats.recent.model_used || 'Gemini-2.0-Flash'}
                  </div>
                </div>
              )}
            </div>
         </Card>
      </div>

      {/* 2.1 STUDIO SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
           <LayoutGrid className="w-4 h-4 text-[#bd4a4a]" />
           <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Initialize Environment</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Anime Studio', type: 'Anime', path: '/anime', color: 'border-[#bd4a4a]/20 text-white bg-[#bd4a4a]/5 hover:border-[#bd4a4a]/50', desc: 'Japanese style animation frames & lore.' },
            { name: 'Concept Hub', type: 'Manhwa', path: '/world', color: 'border-zinc-800 text-zinc-400 bg-zinc-900/20 hover:border-zinc-700', desc: 'World building and narrative scaffolding.' },
            { name: 'Archive Room', type: 'Comic', path: '/projects', color: 'border-zinc-800 text-zinc-400 bg-zinc-900/20 hover:border-zinc-700', desc: 'Review and manage existing blueprint archives.' },
          ].map((studio) => (
            <button
              key={studio.type}
              onClick={() => navigate(studio.path)}
              className={cn(
                "p-8 rounded-[2rem] border transition-all text-left group hover:scale-[1.02] active:scale-95 relative overflow-hidden",
                studio.color
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-lg font-black uppercase tracking-tighter">{studio.name}</span>
                <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <p className="text-[10px] opacity-60 font-medium leading-relaxed uppercase tracking-widest relative z-10">{studio.desc.toUpperCase()}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
         <div className="xl:col-span-3 space-y-8">
            <div className="flex items-center gap-3">
               <Zap className="w-5 h-5 text-[#bd4a4a] fill-current" />
               <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white">NEURAL ACTIONS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { title: 'New Blueprint', desc: 'Initialize a fresh project from scratch using AI guidance.', icon: PlusSquare, color: 'text-[#bd4a4a]', path: '/create/new' },
                 { title: 'Resume Script', desc: 'Contine refining your latest narrative transmissions.', icon: ScrollText, color: 'text-blue-500', path: '/anime/script' },
                 { title: 'Project Archive', desc: 'Access and switch between your production history.', icon: FolderGit2, color: 'text-zinc-400', path: '/projects' },
               ].map((item, idx) => (
                 <motion.button 
                   key={idx}
                   whileHover={{ y: -5 }}
                   onClick={() => navigate(item.path)}
                   className="flex flex-col text-left p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] hover:border-[#bd4a4a]/30 transition-all group relative overflow-hidden aspect-[4/3] justify-between shadow-xl"
                 >
                   <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#bd4a4a]/20 to-transparent" />
                   <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#bd4a4a] rounded-full blur-[100px] opacity-0 group-hover:opacity-10 pointer-events-none" />
                   
                   <div className="flex items-center justify-between">
                     <div className={cn("p-3 rounded-2xl bg-zinc-800 border border-zinc-700 transition-all group-hover:scale-110 group-hover:rotate-6", item.color)}>
                        <item.icon className="w-6 h-6" />
                     </div>
                     <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-[#bd4a4a] group-hover:translate-x-1 transition-all" />
                   </div>

                   <div>
                      <h4 className="text-2xl font-black text-white mb-2 tracking-tight">{item.title}</h4>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed uppercase tracking-wide">{item.desc}</p>
                   </div>
                 </motion.button>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <Card className="bg-zinc-900/20 border-zinc-800/50 rounded-[2.5rem] p-10 space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">SYSTEM LOGS</h3>
                  <div className="p-6 bg-black/40 border border-zinc-800/50 rounded-3xl space-y-4">
                     <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#bd4a4a] mt-2 shrink-0 animate-pulse" />
                        <p className="text-[11px] font-bold text-zinc-300 leading-relaxed">
                          All systems optimal. Studio Architect Node is currently running in ARCHITECT mode.
                        </p>
                     </div>
                     <p className="text-[10px] text-zinc-500 font-medium ml-4">
                        Status: Environment synced with Supabase Backend. Project selector active.
                     </p>
                  </div>
               </Card>

               <Card className="bg-zinc-900/20 border-zinc-800/50 rounded-[2.5rem] p-10 space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">FAST LANE</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Narrative Beats', path: '/anime/beats' },
                      { label: 'Character Cast', path: '/anime/cast' },
                      { label: 'Storyboard Gallery', path: '/anime/storyboard' },
                      { label: 'Studio Wiki', path: '/tutorials' },
                    ].map((step, idx) => (
                      <button 
                        key={idx}
                        onClick={() => navigate(step.path)}
                        className="w-full flex items-center justify-between p-4 bg-black/20 border border-zinc-800/50 rounded-2xl hover:bg-zinc-900 hover:border-[#bd4a4a]/20 transition-all group"
                      >
                         <span className="text-[10px] font-black text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">{step.label}</span>
                         <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-[#bd4a4a] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
               </Card>
            </div>
         </div>

         <div className="space-y-8">
            <TodoWidget />
            <Card className="bg-zinc-900/40 border-zinc-800 rounded-[2.5rem] p-8 space-y-8 flex flex-col items-center text-center relative overflow-hidden h-full shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#bd4a4a]/50 to-transparent" />
               <div className="space-y-2">
                 <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">COMMAND CENTER</h3>
                 <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Rapid workspace navigation for advanced architects.</p>
               </div>

               <div className="w-full space-y-3">
                 {[
                   { label: 'Scripting Node', icon: ScrollText, path: '/anime/script' },
                   { label: 'Cast Matrix', icon: Users, path: '/anime/cast' },
                   { label: 'World Lore', icon: Globe, path: '/anime/world' },
                   { label: 'Broadcasts', icon: Bell, path: '/notifications' },
                 ].map((link, idx) => (
                   <Button 
                     key={idx}
                     onClick={() => navigate(link.path)}
                     variant="ghost" 
                     className="w-full justify-between h-14 rounded-2xl bg-black/20 border border-zinc-800 hover:bg-zinc-900 hover:border-[#bd4a4a]/30 text-zinc-400 hover:text-white group px-5"
                   >
                     <div className="flex items-center gap-3">
                        <link.icon className="w-4 h-4 text-zinc-600 group-hover:text-[#bd4a4a]" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{link.label}</span>
                     </div>
                     <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-[#bd4a4a] transition-all opacity-0 group-hover:opacity-100" />
                   </Button>
                 ))}
               </div>

               <div className="mt-auto grid grid-cols-2 gap-4 w-full">
                  <div className="bg-black/40 rounded-2xl p-4 border border-zinc-800">
                     <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total</p>
                     <p className="text-2xl font-black text-white">{stats.total}</p>
                  </div>
                  <div className="bg-black/40 rounded-2xl p-4 border border-zinc-800">
                     <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Week</p>
                     <p className="text-2xl font-black text-[#bd4a4a]">{stats.week}</p>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}

