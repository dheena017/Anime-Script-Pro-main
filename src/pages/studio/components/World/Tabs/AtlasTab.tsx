import React from 'react';
import { Globe } from 'lucide-react';

export const AtlasTab: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
        <Globe className="w-10 h-10 text-amber-400" />
      </div>
      <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Cartographic Atlas</h3>
      <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em] max-w-xs">
        Tectonic layouts and geographic manifests are being calculated for this neural reality.
      </p>
    </div>
  );
};
