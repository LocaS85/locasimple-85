
import React from 'react';
import { motion } from 'framer-motion';

interface Result {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distance?: number;
  duration?: number;
}

interface ResultsPopupProps {
  results: Result[];
  selectedPlaceId: string | null;
  handleResultClick: (result: Result) => void;
}

const ResultsPopup: React.FC<ResultsPopupProps> = ({
  results,
  selectedPlaceId,
  handleResultClick
}) => {
  if (results.length === 0) return null;
  
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-10 px-4">
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-sm font-medium px-3 py-1">Résultats</h3>
        <ul className="divide-y divide-gray-100">
          {results.map((result: any, index: number) => (
            <motion.li 
              key={result.id || index}
              variants={itemVariants}
              className={`px-3 py-2 hover:bg-gray-50 cursor-pointer ${
                selectedPlaceId === (result.id || `place-${index}`) ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleResultClick({
                id: result.id || `place-${index}`,
                name: result.name,
                lat: result.lat,
                lon: result.lon
              })}
            >
              <div className="font-medium">{result.name}</div>
              <div className="flex text-sm text-gray-500 justify-between">
                <span>{result.distance} km</span>
                <span>{result.duration} min</span>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default ResultsPopup;
