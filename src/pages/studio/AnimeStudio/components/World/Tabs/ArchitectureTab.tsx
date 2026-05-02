import React from 'react';
import { WorldOutputViewer } from '../WorldOutputViewer';

interface ArchitectureTabProps {
  isEditing: boolean;
  content: string;
  prompt: string;
  onContentChange: (content: string) => void;
}

export const ArchitectureTab: React.FC<ArchitectureTabProps> = ({
  isEditing,
  content,
  prompt,
  onContentChange
}) => {
  return (
    <WorldOutputViewer 
      isEditing={isEditing} 
      content={content} 
      prompt={prompt}
      onContentChange={onContentChange} 
    />
  );
};



