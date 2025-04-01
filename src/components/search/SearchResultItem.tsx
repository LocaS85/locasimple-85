
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { SearchResult } from '@/services/searchResultsService';
import { getCategoryColor } from '@/utils/categoryColors';

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
      className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-md transition-all duration-300 transform-gpu preserve-3d cursor-pointer"
      whileHover={{
        y: -3,
        scale: 1.01,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
      onClick={() => onClick(result)}
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium text-sm">{result.name}</h3>
          <p className="text-xs text-gray-500 flex items-center mt-0.5">
            <MapPin className="h-3 w-3 mr-1 text-app-primary/70" />
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
            <span className="text-xs font-medium">{(typeof result.rating === 'number') ? result.rating.toFixed(1) : result.rating}</span>
          </div>
        )}
      </div>
      
      {/* 3D effect elements */}
      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-gray-100 rounded-full opacity-70"></div>
      <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-gray-100 rounded-full opacity-70"></div>
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>
      <div className="absolute -bottom-px left-0 right-0 h-1 bg-gradient-to-t from-app-primary/10 to-transparent rounded-b-lg"></div>
    </motion.div>
  );
};

export default SearchResultItem;
