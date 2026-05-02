import React from 'react';
import { CastView } from '../CastView';

interface RegistryTabProps {
  isLiked: boolean;
  setIsLiked: (l: boolean) => void;
  onViewCharacter?: (charName: string) => void;
  viewMode?: 'grid' | 'list';
}

export const RegistryTab: React.FC<RegistryTabProps> = ({ isLiked, setIsLiked, onViewCharacter, viewMode }) => {
  return <CastView isLiked={isLiked} setIsLiked={setIsLiked} onViewCharacter={onViewCharacter} viewMode={viewMode} />;
};



