import { ProtocolDetailView } from '../ProtocolDetailView';
import { Zap } from 'lucide-react';
import { VIDEO_PROMPT_GENERATION_PROMPT } from '@/services/prompts';

export default function MotionChoreographer() {
  const prompts = [
    {
      id: 'vid_gen',
      name: 'Video Motion Directives',
      description: 'Generates high-motion prompts for temporal synthesis engines, focusing on camera physics and state changes.',
      content: VIDEO_PROMPT_GENERATION_PROMPT,
      version: '1.0.2'
    }
  ];

  return (
    <ProtocolDetailView 
      title="Motion Choreographer"
      icon={Zap}
      description="Directives for temporal flow, camera kinetics, and atmospheric motion within the production space."
      prompts={prompts}
      color="amber-400"
    />
  );
}



