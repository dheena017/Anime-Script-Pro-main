import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck, Activity, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function DNAPage() {

  return (
    <div className="space-y-12 pb-20">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Brain, label: "Cognitive Load", value: "84%", color: "text-studio" },
          { icon: Activity, label: "Emotional Flux", value: "62%", color: "text-fuchsia-400" },
          { icon: ShieldCheck, label: "Narrative Armor", value: "High", color: "text-emerald-400" },
          { icon: BarChart3, label: "Conflict Weight", value: "Critical", color: "text-amber-400" }
        ].map((stat, idx) => (
          <Card key={idx} className="bg-white/5 border-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-studio/30 transition-all">
            <stat.icon className={`w-6 h-6 ${stat.color} opacity-60`} />
            <div className="text-center">
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="bg-[#030303] border-studio/20 p-10 rounded-[3rem] space-y-8">
          <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-studio" />
            Trait Distribution Matrix
          </h3>
          <div className="space-y-6">
            {['Courage', 'Intellect', 'Ambition', 'Empathy', 'Willpower'].map((trait) => (
              <div key={trait} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span>{trait}</span>
                  <span className="text-studio">{Math.floor(Math.random() * 40) + 60}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-studio shadow-[0_0_8px_#06b6d4]" 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#030303] border-studio/20 p-10 rounded-[3rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-studio/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8">Narrative Synapse Scan</h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-500 text-sm font-medium leading-loose italic">
              "Neural analysis indicates a high probability of significant character growth in the third act. The protagonist's 'Core Motivation' DNA is currently clashing with the antagonist's 'Methodology' DNA, creating a stable conflict loop favorable for narrative tension."
            </p>
          </div>
          <div className="mt-12 p-6 bg-studio/5 border border-studio/10 rounded-2xl">
            <p className="text-[10px] font-black text-studio uppercase tracking-widest text-center">Scan Complete: No Abnormalities Detected</p>
          </div>
        </Card>
      </div>
    </div>
  );
}


