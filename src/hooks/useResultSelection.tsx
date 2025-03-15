
import { useState } from 'react';

export const useResultSelection = () => {
  const [selectedResultId, setSelectedResultId] = useState<string | undefined>(undefined);

  return {
    selectedResultId,
    setSelectedResultId
  };
};

export default useResultSelection;
