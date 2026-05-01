// Projects Page - fixed imports and logic
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Search,
  Filter,
  Plus,
  Clock,
  Trash2,
  ArrowRight,
  ChevronRight,
  Cpu,
  Calendar,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { apiRequest } from '../lib/api-utils';
import { StudioLoading } from '../components/studio/StudioLoading';


export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [showCreatedMsg, setShowCreatedMsg] = useState(false);
  const navigate = useNavigate();

  const { setCurrentProject, refreshAppData } = useApp();

  // Show success banner when arriving from project creation
  useEffect(() => {
    if (location.state && (location.state as any).newlyCreated) {
      setShowCreatedMsg(true);
      const timer = setTimeout(() => setShowCreatedMsg(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Fetch projects from FastAPI backend
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<any[]>('/api/projects');
      if (data) setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Delete a project
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to purge this project data?')) return;
    try {
      await apiRequest(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      // Update UI after deletion
      setCurrentProject(null);
      await refreshAppData();
      navigate('/projects');
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  // Open a selected project in the studio
  const selectProject = (project: any) => {
    setCurrentProject(project);
    navigate('/anime');
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {showCreatedMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#bd4a4a] text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
          Project successfully created!
        </div>
      )}
      <div className="min-h-screen pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              <FolderGit2 className="text-[#bd4a4a]" />
              PRODUCTION ARCHIVE
            </h1>
            <p className="text-zinc-500 mt-1 uppercase text-[10px] tracking-widest">
              MANAGE AND SWITCH BETWEEN YOUR ACTIVE STUDIO BLUEPRINTS.
            </p>
          </div>
          <button
            onClick={() => navigate('/projects/new')}
            className="flex items-center gap-2 px-6 py-3 bg-[#bd4a4a] text-white rounded-xl font-bold text-sm hover:bg-[#a33f3f] transition-all shadow-[0_4px_15px_rgba(189,74,74,0.3)] uppercase"
          >
            <Plus className="w-4 h-4" /> NEW PROJECT
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 lg:col-span-3 flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-3 mb-2">
            <Search className="w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search Project Archives..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-zinc-700"
            />
            <Filter className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white transition-colors" />
          </div>

          {loading ? (
            <div className="col-span-full">
               <StudioLoading fullPage={false} message="Scanning Archives..." submessage="Syncing production metadata and neural fragments..." />
            </div>
          ) : filteredProjects.length === 0 ? (

            <div className="md:col-span-3 py-20 text-center">
              <FolderGit2 className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">NO PROJECTS FOUND</h2>
              <p className="text-zinc-500">Your archive is currently empty.</p>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 hover:border-[#bd4a4a]/30 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => selectProject(project)}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#bd4a4a]/20 to-transparent group-hover:via-[#bd4a4a]/50 transition-all" />
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-black border border-zinc-800 rounded-2xl flex items-center justify-center group-hover:border-[#bd4a4a]/30 transition-colors">
                    <FolderGit2 className="w-6 h-6 text-zinc-500 group-hover:text-[#bd4a4a]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded bg-zinc-800 text-zinc-400`}>{project.status}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                      className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}
                      className="p-2 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-2 line-clamp-1 group-hover:text-[#bd4a4a] transition-colors">{project.title}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <Calendar className="w-3 h-3 text-[#bd4a4a]" />
                    Initialized {new Date(project.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <Clock className="w-3 h-3 text-blue-500" />
                    Synced {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-black uppercase tracking-widest bg-white/5 border border-white/5 rounded-full px-2 py-0.5 w-fit">
                    <Cpu className="w-2.5 h-2.5 text-[#bd4a4a]" />
                    {project.model_used || 'Gemini-2.0-Flash'}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                    Open Project <ArrowRight className="w-3 h-3" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-[#bd4a4a] group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
