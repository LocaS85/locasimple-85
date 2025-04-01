
import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Star, Navigation, Clock, Phone, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@/services/searchResultsService';

interface SearchDetailProps {
  result: SearchResult | null;
  onClose: () => void;
  onGetDirections: (result: SearchResult) => void;
}

const SearchDetail: React.FC<SearchDetailProps> = ({ result, onClose, onGetDirections }) => {
  if (!result) return null;
  
  return (
    <motion.div 
      className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl shadow-lg z-50 overflow-hidden"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{result.name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Image if available */}
        {result.image && (
          <div className="w-full h-40 bg-gray-200">
            <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
          </div>
        )}
        
        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Rating and Category */}
          <div className="flex justify-between">
            <span 
              className={`text-xs px-2 py-1 rounded-full ${
                result.category === 'restaurants' ? 'bg-app-secondary/10 text-app-secondary' :
                result.category === 'shopping' ? 'bg-app-primary/10 text-app-primary' :
                'bg-purple-100 text-purple-800'
              }`}
            >
              {result.category}
            </span>
            
            {result.rating && (
              <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-xs font-medium">{result.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          {/* Address */}
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
            <p className="text-sm text-gray-600">{result.address}</p>
          </div>
          
          {/* Distance and Time */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{result.distance}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{result.time}</span>
            </div>
          </div>
          
          {/* Contact Info (mock) */}
          <div className="pt-2 flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <a href="tel:+123456789" className="text-sm text-blue-600">+1 (234) 567-890</a>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <a href="#" className="text-sm text-blue-600">www.example.com</a>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="p-4 border-t flex space-x-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-app-primary to-blue-600"
            onClick={() => onGetDirections(result)}
          >
            <Navigation className="mr-2 h-4 w-4" /> Directions
          </Button>
          <Button variant="outline" className="w-12 justify-center">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchDetail;
