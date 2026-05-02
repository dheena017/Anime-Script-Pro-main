import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PricingCard = ({ title, price, features, highlighted = false, icon: Icon, onSelect }: { title: string; price: string; features: string[]; highlighted?: boolean; icon: React.ComponentType<{ className?: string }>; onSelect: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`p-8 rounded-[2.5rem] border ${highlighted ? 'border-studio bg-studio/5 shadow-[0_0_50px_rgba(6,182,212,0.1)]' : 'border-white/5 bg-zinc-900/40'} relative overflow-hidden flex flex-col`}
  >
    {highlighted && (
      <div className="absolute top-6 right-8">
        <div className="px-4 py-1.5 rounded-full bg-studio text-black text-[10px] font-black uppercase tracking-widest shadow-xl">
          Most Popular
        </div>
      </div>
    )}
    
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 ${highlighted ? 'bg-studio text-black' : 'bg-white/5 text-zinc-400'}`}>
      <Icon className="w-6 h-6" />
    </div>

    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{title}</h3>
    <div className="flex items-baseline gap-1 mb-8">
      <span className="text-4xl md:text-5xl font-black text-white">{price}</span>
      <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{price !== 'Free' ? '/month' : ''}</span>
    </div>

    <div className="space-y-4 mb-10 flex-grow">
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${highlighted ? 'bg-studio/20 text-studio' : 'bg-white/5 text-zinc-500'}`}>
            <Check className="w-3 h-3" />
          </div>
          <span className="text-sm text-zinc-400 font-medium">{feature}</span>
        </div>
      ))}
    </div>

    <Button 
      onClick={onSelect}
      className={`h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${highlighted ? 'bg-studio text-black hover:bg-studio/90 hover:scale-105 shadow-lg' : 'bg-white/5 text-white hover:bg-white/10'}`}
    >
      Initialize {title} <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  </motion.div>
);

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio/10 border border-studio/20 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-studio" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-studio">Pricing Architecture</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase">
            Choose your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-fuchsia-500 to-studio">Production Power.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-500 font-bold uppercase tracking-widest text-xs">
            Scalable resources for solo architects and full-scale studios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard 
            title="Aspirant"
            price="Free"
            icon={Zap}
            onSelect={() => navigate('/login')}
            features={[
              "1 Active Project",
              "Basic AI Generation",
              "Standard Community Access",
              "720p Script Exports"
            ]}
          />
          <PricingCard 
            title="Architect"
            price="$29"
            highlighted={true}
            icon={Sparkles}
            onSelect={() => navigate('/login')}
            features={[
              "Unlimited Projects",
              "Priority Agent Swarm Access",
              "Advanced Character DNA",
              "4K Production Exports",
              "Custom Templates"
            ]}
          />
          <PricingCard 
            title="Master"
            price="$99"
            icon={Crown}
            onSelect={() => navigate('/login')}
            features={[
              "Everything in Architect",
              "White-label Exports",
              "API Access",
              "Dedicated Sub-agent Cluster",
              "24/7 Priority Neural Support"
            ]}
          />
        </div>
        
        <div className="mt-20 p-12 rounded-[3rem] bg-zinc-900/20 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left space-y-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Need a custom cluster?</h3>
            <p className="text-zinc-500 text-sm font-medium">Enterprise solutions for large-scale anime production studios.</p>
          </div>
          <Button onClick={() => navigate('/community')} variant="outline" className="h-14 px-10 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs transition-all">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}




