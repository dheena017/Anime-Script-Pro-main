import React from 'react';
import { CastView } from '../CastView';

interface RegistryTabProps {
  isLiked: boolean;
  setIsLiked: (l: boolean) => void;
}

export const RegistryTab: React.FC<RegistryTabProps> = ({ isLiked, setIsLiked }) => {
  return <CastView isLiked={isLiked} setIsLiked={setIsLiked} />;
};
