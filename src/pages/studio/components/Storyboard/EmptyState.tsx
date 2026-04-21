import React from 'react';
import { Layout, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  handleAddScene: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ handleAddScene }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-zinc-600 bg-zinc-950/20 border-2 border-dashed border-zinc-900 rounded-[3rem]">
      <Layout className="w-16 h-16 mb-6 opacity-10" />
      <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-2 text-shadow-studio">No Scenes Detected</h3>
      <p className="mb-8 text-xs font-medium uppercase tracking-wider max-w-xs text-center leading-relaxed">
        Initiate the <span className="text-studio">Master Production Loop</span> or add a manual unit to begin visualization.
      </p>
      <div className="flex gap-3">
        <Button 
          className="bg-studio text-black hover:bg-studio/90 font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-studio"
          onClick={handleAddScene}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Manual Unit
        </Button>
      </div>
    </div>
  );
};
