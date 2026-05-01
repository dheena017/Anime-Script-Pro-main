import { ProtocolDetailView } from '../ProtocolDetailView';
import { ImageIcon } from 'lucide-react';
import { 
  IMAGE_PROMPT_GENERATION_PROMPT, 
  ENHANCE_SCENE_VISUALS_PROMPT 
} from '@/services/prompts';

export default function VisualSynthesizer() {
  const prompts = [
    {
      id: 'img_gen',
      name: 'Image Prompt Engineering',
      description: 'Translates script visual directions into high-fidelity prompts for neural image engines.',
      content: IMAGE_PROMPT_GENERATION_PROMPT,
      version: '1.8.0'
    },
    {
      id: 'vis_enh',
      name: 'Cinematic Enhancement',
      description: 'Refines basic visual descriptions into evocatively lit, stylistically consistent storyboard frames.',
      content: ENHANCE_SCENE_VISUALS_PROMPT,
      version: '1.2.0'
    }
  ];

  return (
    <ProtocolDetailView 
      title="Visual Synthesizer"
      icon={ImageIcon}
      description="Governance of the aesthetic pipeline, lighting temperatures, and artistic consistency of storyboard assets."
      prompts={prompts}
      color="cyan-500"
    />
  );
}


