import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bug, 
  Lightbulb, 
  Heart,
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState('feature');

  const categories = [
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-yellow-500' },
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
    { id: 'design', label: 'UI/UX Feedback', icon: Sparkles, color: 'text-sky-500' },
    { id: 'other', label: 'General Message', icon: MessageSquare, color: 'text-emerald-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 min-h-screen">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-black tracking-tighter flex items-center justify-center gap-4 text-white uppercase italic">
          <BrainCircuit className="w-12 h-12 text-fuchsia-500" />
          Neural Feedback
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">
          Help us refine the Studio Architect by sharing your neural patterns.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Send className="w-64 h-64 -rotate-12" />
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">Transmit Feedback</CardTitle>
                <CardDescription className="text-zinc-500 font-medium">
                  Select a frequency and broadcast your thoughts to the lead architects.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 group ${
                        category === cat.id 
                          ? 'bg-white/5 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                          : 'bg-transparent border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className={`p-2 rounded-xl bg-zinc-800/50 ${category === cat.id ? cat.color : 'text-zinc-600'}`}>
                        <cat.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest text-center ${
                        category === cat.id ? 'text-white' : 'text-zinc-600'
                      }`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Transmission Subject</label>
                      <Input 
                        placeholder="E.g., Neural generation latency in Act III" 
                        className="bg-zinc-900 border-zinc-800 h-12 rounded-xl focus-visible:ring-fuchsia-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Detailed Log / Message</label>
                      <Textarea 
                        placeholder="Provide as much architectural detail as possible..." 
                        className="bg-zinc-900 border-zinc-800 min-h-[150px] rounded-xl focus-visible:ring-fuchsia-500 resize-none"
                        required
                      />
                    </div>
                  </div>

                  <Button className="w-full h-14 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_10px_30px_rgba(192,38,211,0.2)] transition-all active:scale-95">
                    Broadcast Transmission
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center space-y-8 py-20 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-fuchsia-500/20 blur-3xl rounded-full" />
              <div className="w-24 h-24 bg-zinc-900 border-2 border-fuchsia-500 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(192,38,211,0.3)]">
                <CheckCircle2 className="w-12 h-12 text-fuchsia-500" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Transmission Received</h2>
              <p className="text-zinc-500 max-w-md mx-auto font-medium">
                Your architectural patterns have been logged and added to the refining queue. Thank you for evolving the ecosystem.
              </p>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setSubmitted(false)}
              className="border-zinc-800 hover:bg-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl"
            >
              Send Another Transmission
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
         {[
           { label: 'Community Hub', detail: 'Discuss with fellow architects', icon: MessageSquare },
           { label: 'Technical Docs', detail: 'Review system protocols', icon: BrainCircuit },
           { label: 'Love the Platform?', detail: 'Show your appreciation', icon: Heart }
         ].map((item, i) => (
           <div key={i} className="p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl flex flex-col items-center text-center gap-3 group cursor-pointer hover:bg-zinc-900/50 transition-all">
              <item.icon className="w-6 h-6 text-zinc-600 group-hover:text-fuchsia-500 transition-colors" />
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</h4>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">{item.detail}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
