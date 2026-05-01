import { GitBranch, ArrowRightLeft, Users, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function DynamicsPage() {

  return (
    <div className="space-y-12 pb-20">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="bg-[#030303] border-fuchsia-500/20 p-10 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <GitBranch className="w-24 h-24 text-fuchsia-500" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3">
            <Zap className="w-5 h-5 text-fuchsia-500 fill-fuchsia-500" />
            Growth Arc Simulation
          </h3>
          <div className="space-y-12">
            {[1, 2, 3].map((step) => (
              <div key={step} className="relative pl-12 border-l border-zinc-800 pb-8 last:pb-0">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-zinc-800 border-2 border-[#030303] group-hover:bg-fuchsia-500 transition-colors" />
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest">Stage 0{step}</p>
                  <p className="text-white font-black uppercase text-sm tracking-wide">
                    {step === 1 ? "Initial Rivalry" : step === 2 ? "Mutual Respect" : "Blood Brothers"}
                  </p>
                  <p className="text-xs text-zinc-500 font-medium">Predicted narrative convergence at episode {step * 4}.</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#030303] border-fuchsia-500/20 p-10 rounded-[3rem] flex flex-col justify-between">
          <div className="space-y-8">
            <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
              <ArrowRightLeft className="w-5 h-5 text-fuchsia-500" />
              Dynamic Conflict Map
            </h3>
            <div className="flex flex-col items-center justify-center h-64 border border-zinc-800/50 rounded-[2rem] bg-zinc-900/20 relative group">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                 <Users className="w-32 h-32 text-fuchsia-500 animate-pulse" />
              </div>
              <p className="relative z-10 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">Rendering Relational Topology...</p>
            </div>
          </div>
          
          <div className="mt-10 p-6 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-2xl">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Simulation Accuracy</span>
                <span className="text-fuchsia-500 font-black">92.4%</span>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


