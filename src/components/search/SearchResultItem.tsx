
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { SearchResult } from '@/services/searchResultsService';

interface SearchResultItemProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, onClick }) => {
  return (
    <motion.div
      variants={{
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
      }}
      className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 preserve-3d hover:shadow-md transition-all duration-300"
      whileHover={{
        y: -2,
        scale: 1.01,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
      onClick={() => onClick(result)}
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium text-sm">{result.name}</h3>
          <p className="text-xs text-gray-500 flex items-center mt-0.5">
            <MapPin className="h-3 w-3 mr-1" />
            {result.address}
          </p>
        </div>
        <div className="text-right text-xs">
          <p className="font-medium">{result.distance}</p>
          <p className="text-gray-500">{result.time}</p>
        </div>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <span 
          className={`text-xs px-2 py-0.5 rounded-full ${
            result.category === 'restaurants' ? 'bg-app-secondary/10 text-app-secondary' :
            result.category === 'shopping' ? 'bg-app-primary/10 text-app-primary' :
            'bg-purple-100 text-purple-800'
          }`}
        >
          {result.category}
        </span>
        
        {result.rating && (
          <div className="flex items-center">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-0.5" />
            <span className="text-xs font-medium">{result.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchResultItem;
