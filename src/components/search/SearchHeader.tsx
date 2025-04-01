
import React from 'react';
import { ChevronDown, Filter, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface SearchHeaderProps {
  resultsCount: number;
  setResultsCount: (count: number) => void;
  openFilters?: () => void;
  title?: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ 
  resultsCount,
  setResultsCount,
  openFilters,
  title = "Recherche de lieux",
  showSettings = false,
  onSettingsClick
}) => {
  const { t } = useLanguage();
  
  const countOptions = [3, 5, 10, 15, 20];
  
  return (
    <motion.div 
      className="bg-white shadow-sm border-b border-gray-100 p-2 sticky top-16 z-30 backdrop-blur-sm bg-white/95"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-app-primary">
            <MapPin className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {openFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={openFilters}
              className="text-xs px-2 py-1 h-auto text-gray-600 hover:text-app-primary hover:bg-app-primary/5"
            >
              <Filter className="h-3 w-3 mr-1" />
              Filtres
            </Button>
          )}
          
          <div className="flex items-center text-xs text-gray-600">
            <span className="mr-1">Résultats:</span>
            <select
              value={resultsCount}
              onChange={(e) => setResultsCount(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 rounded-md text-xs px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-app-primary"
            >
              {countOptions.map(count => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
          </div>
          
          {showSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              className="text-xs px-2 py-1 h-auto text-gray-600 hover:text-app-primary hover:bg-app-primary/5"
            >
              <Settings className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchHeader;
