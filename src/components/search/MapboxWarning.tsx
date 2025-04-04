
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface MapboxWarningProps {
  show: boolean;
  onClose: () => void;
}

const MapboxWarning: React.FC<MapboxWarningProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md p-4 max-w-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Token Mapbox manquant</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Vous devez définir un token Mapbox pour utiliser la carte. 
                  Ajoutez <strong>VITE_MAPBOX_TOKEN</strong> dans votre fichier .env
                </p>
              </div>
              <div className="mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-yellow-800 bg-yellow-100 hover:bg-yellow-200 border-yellow-300"
                  onClick={onClose}
                >
                  Compris
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MapboxWarning;
