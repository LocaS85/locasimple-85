
import { useState } from 'react';
import type { Result } from '@/components/ResultsList';

export const useResultSelection = () => {
  const [selectedResultId, setSelectedResultId] = useState<string | undefined>();
  
  const handleResultClick = (result: Result) => {
    setSelectedResultId(prev => prev === result.id ? undefined : result.id);
  };

  return {
    selectedResultId,
    setSelectedResultId,
    handleResultClick
  };
};

export default useResultSelection;
