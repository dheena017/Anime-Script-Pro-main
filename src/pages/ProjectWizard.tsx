import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PlusSquare, 
  ScrollText, 
  Users, 
  Layout, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const WIZARD_OPTIONS = [
  {
    id: 'script',
    title: 'New Script',
    description: 'Craft a new narrative beat or episode script using AI resonance.',
    icon: ScrollText,
    color: 'text-blue-500',
    path: '/anime/script'
  },
  {
    id: 'character',
    title: 'New Character',
    description: 'Design a character DNA with unique visual and personality traits.',
    icon: Users,
    color: 'text-emerald-500',
    path: '/anime/cast'
  },
  {
    id: 'scene',
    title: 'New Storyboard',
    description: 'Scaffold a new scene with visual prompts and camera directions.',
    icon: Layout,
    color: 'text-purple-500',
    path: '/anime/storyboard'
  }
];

import { projectService } from '../services/api/projects';

export default function ProjectWizard() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentProject, refreshAppData } = useApp();

  const handleCreate = async (opt: any) => {
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const project = await projectService.createProject({
        title,
        content_type: opt.title,
        model_used: 'gemini-2.0-flash',
        status: 'draft'
      });

      if (!project) throw new Error('Failed to create project');

      setCurrentProject(project);
      await refreshAppData();
      navigate(opt.path);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-[#bd4a4a]/10 border border-[#bd4a4a]/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <PlusSquare className="w-8 h-8 text-[#bd4a4a]" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-2">Initialize Blueprint</h1>
          <p className="text-zinc-500">Every masterpiece begins with a single design parameter.</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 mb-12">
          <div className="max-w-md mx-auto mb-10">
            <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3 ml-1">Project Name</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cyberpunk Revolution v1"
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-4 text-white placeholder:text-zinc-700 focus:border-[#bd4a4a] focus:ring-1 focus:ring-[#bd4a4a] transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WIZARD_OPTIONS.map((opt, idx) => (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (idx * 0.1) }}
                disabled={!title || loading}
                onClick={() => handleCreate(opt)}
                className="group relative flex flex-col p-6 bg-black border border-zinc-800 rounded-2xl hover:border-[#bd4a4a]/50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(189,74,74,0.1)]"
              >
                <div className={`w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:bg-[#bd4a4a]/10 group-hover:border-[#bd4a4a]/20 transition-colors`}>
                  <opt.icon className={`w-5 h-5 ${opt.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#bd4a4a] transition-colors">{opt.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">{opt.description}</p>
                <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-white transition-colors">
                  Get Started <ChevronRight className="w-3 h-3" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-zinc-600 text-xs font-medium">
          <Sparkles className="w-3 h-3 text-[#bd4a4a]" />
          Powered by Studio Architect Engine Node
        </div>
      </div>
    </div>
  );
}
