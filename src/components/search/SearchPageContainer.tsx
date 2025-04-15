
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import SearchPage from './SearchPage';
import { MAPBOX_TOKEN } from '@/config/environment';
import { initializeMapbox, setMapboxToken } from '@/utils/mapUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// This container handles the initialization and common state
const SearchPageContainer: React.FC = () => {
  const [mapboxTokenSet, setMapboxTokenSet] = useState(!!MAPBOX_TOKEN);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(true);
  const isMobile = useIsMobile();

  // Initialize Mapbox when component mounts
  useEffect(() => {
    const initMap = async () => {
      try {
        const initialized = await initializeMapbox();
        setMapboxTokenSet(initialized);
        
        if (!initialized) {
          toast.error('Erreur d\'initialisation de Mapbox. Veuillez vérifier votre token.');
        }
      } catch (error) {
        console.error('Error initializing Mapbox:', error);
        setMapboxTokenSet(false);
        toast.error('Erreur d\'initialisation de Mapbox. Veuillez vérifier votre token.');
      }
    };
    
    initMap();
  }, []);

  const handleSetMapboxToken = (token: string) => {
    try {
      // Use the utility function from mapUtils
      const success = setMapboxToken(token);
      
      if (success) {
        setMapboxTokenSet(true);
        toast.success('Token Mapbox configuré temporairement');
      } else {
        toast.error('Token Mapbox invalide');
      }
      
      return success;
    } catch (error) {
      console.error('Error setting Mapbox token:', error);
      toast.error('Erreur lors de la configuration du token Mapbox');
      return false;
    }
  };
  
  // Toggle expanded view for mobile
  const toggleExpandedView = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Toggle bottom sheet
  const toggleBottomSheet = () => {
    setShowBottomSheet(!showBottomSheet);
  };

  return (
    <div className="h-full flex flex-col">
      <motion.div 
        className="flex-grow relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <SearchPage 
          mapboxTokenSet={mapboxTokenSet} 
          onSetMapboxToken={handleSetMapboxToken}
          isExpanded={isExpanded}
          toggleExpandedView={toggleExpandedView}
        />
      </motion.div>
      
      {/* Animated Bottom Sheet - similar to Navigation */}
      <AnimatePresence>
        {showBottomSheet && (
          <motion.div 
            className={cn(
              "bg-white p-4 shadow-md border-t z-10",
              isExpanded && !isMobile && "h-1/2",
              isExpanded && isMobile && "h-3/4",
              !isExpanded && "max-h-48"
            )}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
          >
            {/* Pull handle for mobile */}
            {isMobile && (
              <div 
                className="w-full flex justify-center mb-2 cursor-pointer" 
                onClick={toggleBottomSheet}
              >
                <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">
                Résultats de recherche
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full" onClick={toggleExpandedView}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Content changes based on expanded state */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isExpanded ? "expanded" : "collapsed"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isExpanded ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Expanded content with details about search results
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Use the filters above to refine your search
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchPageContainer;
