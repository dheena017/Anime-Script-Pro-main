import { ProtocolDetailView } from '../ProtocolDetailView';
import { SlidersHorizontal } from 'lucide-react';
import { 
  ENHANCE_NARRATION_PROMPT, 
  SUGGEST_DURATION_PROMPT,
  SCENE_GENERATION_PROMPT 
} from '@/services/prompts';

export default function ProductionAide() {
  const prompts = [
    {
      id: 'narr',
      name: 'Voice Direction Enhancement',
      description: 'Adds evocative delivery instructions and emotional markers to dialogue lines.',
      content: ENHANCE_NARRATION_PROMPT,
      version: '1.1.0'
    },
    {
      id: 'dur',
      name: 'Temporal Estimation',
      description: 'Calculates precise narration durations based on linguistic complexity and delivery style.',
      content: SUGGEST_DURATION_PROMPT,
      version: '1.0.0'
    },
    {
      id: 'scene',
      name: 'Beat Direction',
      description: 'The atomic directive for synthesizing individual scene beats with narration, visual, and sound components.',
      content: SCENE_GENERATION_PROMPT,
      version: '2.0.1'
    }
  ];

  return (
    <ProtocolDetailView 
      title="Production Aide"
      icon={SlidersHorizontal}
      description="Supporting directives for fine-tuning the technical and temporal aspects of the production manifest."
      prompts={prompts}
      color="zinc-400"
    />
  );
}


