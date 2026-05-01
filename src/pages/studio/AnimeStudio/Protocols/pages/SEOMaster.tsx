import { ProtocolDetailView } from '../ProtocolDetailView';
import { Search } from 'lucide-react';
import { 
  METADATA_GENERATION_PROMPT, 
  YOUTUBE_DESCRIPTION_GENERATION_PROMPT, 
  ALT_TEXT_GENERATION_PROMPT 
} from '@/services/prompts';

export default function SEOMaster() {
  const prompts = [
    {
      id: 'meta',
      name: 'YouTube SEO Strategy',
      description: 'Generates high-CTR titles, tags, and thumbnail concepts optimized for the YouTube algorithm.',
      content: METADATA_GENERATION_PROMPT,
      version: '1.4.0'
    },
    {
      id: 'desc',
      name: 'Engagement Optimization',
      description: 'Crafts structured descriptions with timestamps and CTAs to maximize viewer retention.',
      content: YOUTUBE_DESCRIPTION_GENERATION_PROMPT,
      version: '1.2.0'
    },
    {
      id: 'alt',
      name: 'Accessibility Compliance',
      description: 'Synthesizes concise, descriptive alt texts for accessibility and indexing.',
      content: ALT_TEXT_GENERATION_PROMPT,
      version: '1.0.0'
    }
  ];

  return (
    <ProtocolDetailView 
      title="SEO Master"
      icon={Search}
      description="Governance of the content distribution layer, visibility parameters, and accessibility standards."
      prompts={prompts}
      color="emerald-500"
    />
  );
}


