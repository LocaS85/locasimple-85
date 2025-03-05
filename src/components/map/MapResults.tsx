
import React from 'react';
import type { Result } from '../ResultsList';

interface MapResultsProps {
  results: Result[];
}

const MapResults: React.FC<MapResultsProps> = ({ results }) => {
  if (results.length === 0) return null;
  
  return (
    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-sm font-medium">
      {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
    </div>
  );
};

export default MapResults;
