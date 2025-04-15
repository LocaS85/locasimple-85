
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Map, List, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchPageContainer from '../components/search/SearchPageContainer';

const Search = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Toggle expanded view for mobile
  const toggleExpandedView = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top navigation bar */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 text-app-dark" />
        </Button>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-grow">
        <SearchPageContainer />
      </div>
      
      {/* Floating expand/collapse button for mobile */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-32 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md"
            onClick={toggleExpandedView}
          >
            {isExpanded ? <Compass className="h-5 w-5" /> : <Map className="h-5 w-5" />}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Search;
