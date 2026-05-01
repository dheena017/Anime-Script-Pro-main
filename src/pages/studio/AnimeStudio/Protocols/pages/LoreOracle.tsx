import { ProtocolDetailView } from '../ProtocolDetailView';
import { Globe } from 'lucide-react';
import { WORLD_GENERATION_PROMPT } from '@/services/prompts';

export default function LoreOracle() {
  const prompts = [
    {
      id: 'world',
      name: 'World Synthesis',
      description: 'Architects the foundational laws, power systems, and physical geography of the anime universe.',
      content: WORLD_GENERATION_PROMPT,
      version: '3.1.0'
    }
  ];

  return (
    <ProtocolDetailView 
      title="Lore Oracle"
      icon={Globe}
      description="Governance of metaphysical laws, historical chronicles, and environmental physics for the simulated world."
      prompts={prompts}
      color="cyan-400"
    />
  );
}


