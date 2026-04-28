import { SeriesCard, SeriesEpisode, SeriesAssetMatrix } from './SeriesCard';

interface SeriesViewProps {
  plan: SeriesEpisode[];
  isEditing: boolean;
  onUpdateEpisode: (index: number, updates: Partial<SeriesEpisode>) => void;
  onUpdateAssetMatrix: (index: number, updates: Partial<SeriesAssetMatrix>) => void;
  onFocusEpisode: (episodeNum: string) => void;
}

export function SeriesView({
  plan,
  isEditing,
  onUpdateEpisode,
  onUpdateAssetMatrix,
  onFocusEpisode
}: SeriesViewProps) {
  return (
    <div className="relative py-8">
      {/* Master Timeline Connector */}
      <div className="absolute left-[38px] md:left-[5.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-studio/20 to-transparent pointer-events-none hidden sm:block" />
      
      <div className="flex flex-col gap-12 relative z-10">
        {plan.map((ep, idx) => (
          <SeriesCard
            key={idx}
            ep={ep}
            idx={idx}
            isEditing={isEditing}
            onUpdateEpisode={onUpdateEpisode}
            onUpdateAssetMatrix={onUpdateAssetMatrix}
            onFocusEpisode={onFocusEpisode}
          />
        ))}
      </div>
    </div>
  );
}
