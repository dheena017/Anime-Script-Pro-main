import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Play, 
  Sparkles, 
  Cpu, 
  History, 
  Search, 
  ImageIcon, 
  Layout,
  ChevronRight,
  ScrollText,
  Clock,
  MonitorPlay,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { tutorialService, Tutorial } from '../services/tutorialService';

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Cpu,
  Search,
  Layout,
  History,
  ImageIcon,
  BookOpen,
  Play,
  ScrollText,
  Clock,
  MonitorPlay
};

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTutorials = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await tutorialService.getTutorials();
      
      // If no tutorials found, attempt to seed then fetch again
      if (data.length === 0) {
        await tutorialService.seedTutorials();
        data = await tutorialService.getTutorials();
      }
      
      setTutorials(data);
    } catch (e: any) {
      setError(e.message || "Failed to load learning center content. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutorials();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-[#bd4a4a]" />
          LEARNING CENTER
        </h1>
        <p className="text-zinc-500 text-lg max-w-2xl">
          Master the art of anime content creation with our comprehensive guides and tutorials.
        </p>

        <div className="flex items-center gap-6 pt-4">
           <div className="flex flex-col items-start px-4 border-l border-zinc-900">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1.5">Tutorial Backend</span>
              <div className="flex items-center gap-1.5">
                 <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                 <span className="text-[9px] font-bold text-white uppercase tracking-tighter">SERVICE_READY</span>
              </div>
           </div>
           <div className="flex flex-col items-start px-4 border-l border-zinc-900">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1.5">Knowledge DB</span>
              <div className="flex items-center gap-1.5">
                 <div className="w-1 h-1 rounded-full bg-cyan-500" />
                 <span className="text-[9px] font-bold text-white uppercase tracking-tighter">REPLICATED</span>
              </div>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bd4a4a]"></div>
        </div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 space-y-4 text-center"
        >
          <div className="p-4 bg-red-900/20 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Oops! Something went wrong</h2>
            <p className="text-zinc-500 max-w-md">{error}</p>
          </div>
          <Button 
            onClick={loadTutorials}
            variant="outline"
            className="border-zinc-800 hover:bg-zinc-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial, idx) => {
            const IconComponent = ICON_MAP[tutorial.icon_name] || BookOpen;
            return (
              <motion.div
                key={tutorial.id || tutorial.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 hover:border-red-500/30 transition-all group cursor-pointer h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
                        <IconComponent className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-2 py-1 bg-zinc-800/50 rounded">
                        {tutorial.category}
                      </span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-red-500 transition-colors">{tutorial.title}</CardTitle>
                    <CardDescription className="text-sm text-zinc-500 leading-relaxed">
                      {tutorial.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-800/50">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {tutorial.duration}
                      </span>
                      <span>•</span>
                      <span>{tutorial.level}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-transparent p-0">
                      Start <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
        <Card className="bg-gradient-to-br from-red-900/20 to-zinc-900 border-red-900/30 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <MonitorPlay className="w-32 h-32" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-bold">Watch Video Guides</CardTitle>
            <CardDescription className="text-zinc-300">
              Prefer visual learning? Check out our YouTube channel for step-by-step walkthroughs.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button className="bg-red-600 hover:bg-red-700">
              <Play className="w-4 h-4 mr-2 fill-white" />
              Visit YouTube Channel
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <ScrollText className="w-32 h-32" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-bold">Documentation</CardTitle>
            <CardDescription className="text-zinc-300">
              Deep dive into the technical details and advanced prompt engineering techniques.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button variant="outline" className="border-zinc-700 bg-zinc-800/50">
              Read Docs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
