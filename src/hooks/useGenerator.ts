import { useContext } from 'react';
import { GeneratorContext } from '../contexts/GeneratorContext';

export function useGenerator() {
  const context = useContext(GeneratorContext);
  if (context === undefined) {
    throw new Error('useGenerator must be used within a GeneratorProvider');
  }
  return context;
}
