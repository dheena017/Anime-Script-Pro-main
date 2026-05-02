import { ProtocolDetailView } from '../ProtocolDetailView';
import { Layers } from 'lucide-react';
import { SERIES_PLAN_GENERATION_PROMPT } from '@/services/prompts';

export default function Showrunner() {
  const prompts = [
    {
      id: 'series',
      name: 'Master Sequence Planning',
      description: 'Architects the overarching narrative arc, episode hooks, and high-level production parameters for the entire series.',
      content: SERIES_PLAN_GENERATION_PROMPT,
      version: '2.1.0'
    }
  ];

  return (
    <ProtocolDetailView 
      title="Showrunner"
      icon={Layers}
      description="The master executive directives governing pacing, escalation, and architectural consistency across all episodes."
      prompts={prompts}
      color="indigo-500"
    />
  );
}



