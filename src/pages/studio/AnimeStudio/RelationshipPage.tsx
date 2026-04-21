import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { RelationshipLab } from '../components/Cast/RelationshipLab';

export function RelationshipPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="bg-[#050505]/50 border border-studio shadow-studio overflow-hidden min-h-[700px]">
        <div className="w-full p-0">
          <div className="p-12 max-w-6xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <RelationshipLab />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
