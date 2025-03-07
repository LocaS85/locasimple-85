
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronUp, ChevronDown, CornerDownRight, Clock } from 'lucide-react';

export interface Direction {
  instruction: string;
  distance: number;
  duration: number;
  maneuver?: string;
}

interface NavigationDirectionsProps {
  directions: Direction[];
  currentStep: number;
  onStepSelect: (step: number) => void;
  isLoading: boolean;
}

const NavigationDirections: React.FC<NavigationDirectionsProps> = ({
  directions,
  currentStep,
  onStepSelect,
  isLoading
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the panel
  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`absolute bottom-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm rounded-t-2xl transition-transform duration-300 ${
        isExpanded ? 'h-2/3' : 'h-auto'
      }`}
    >
      {/* Panel header with toggle */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer" 
        onClick={togglePanel}
      >
        <div className="flex items-center gap-2">
          <div className="h-1 w-10 bg-white/30 rounded-full mx-auto mb-2" />
          <h2 className="text-white font-semibold">Instructions</h2>
        </div>
        
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-white" />
        ) : (
          <ChevronUp className="h-5 w-5 text-white" />
        )}
      </div>
      
      {/* Directions content */}
      {isExpanded && (
        <ScrollArea className="h-[calc(100%-60px)] px-4 pb-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-20 text-white">
              <Clock className="h-5 w-5 animate-spin mr-2" />
              Chargement des instructions...
            </div>
          ) : directions.length === 0 ? (
            <div className="text-white/70 text-center py-4">
              Aucune instruction disponible
            </div>
          ) : (
            <ul className="space-y-3">
              {directions.map((direction, index) => (
                <li 
                  key={index}
                  className={`p-3 rounded-lg flex items-start gap-3 cursor-pointer transition-colors ${
                    currentStep === index 
                      ? 'bg-white/20 text-white' 
                      : 'hover:bg-white/10 text-white/80'
                  }`}
                  onClick={() => onStepSelect(index)}
                >
                  <div className="mt-1">
                    <CornerDownRight className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium">{direction.instruction}</p>
                    
                    <div className="flex items-center mt-1 text-xs text-white/60">
                      <span>{direction.distance < 1 
                        ? `${Math.round(direction.distance * 1000)} m` 
                        : `${direction.distance.toFixed(1)} km`}
                      </span>
                      {direction.duration > 0 && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{direction.duration < 1 
                            ? `${Math.round(direction.duration * 60)} sec` 
                            : `${Math.round(direction.duration)} min`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      )}
      
      {/* Current direction when collapsed */}
      {!isExpanded && directions.length > 0 && (
        <div className="px-4 pb-6 pt-2">
          <div className="bg-white/10 p-4 rounded-lg flex items-start gap-3">
            <div className="mt-1">
              <CornerDownRight className="h-5 w-5 text-white" />
            </div>
            
            <div className="flex-1">
              <p className="text-white font-medium">
                {directions[currentStep]?.instruction || "Démarrer la navigation"}
              </p>
              
              {directions[currentStep] && (
                <div className="flex items-center mt-1 text-sm text-white/70">
                  <span>
                    {directions[currentStep].distance < 1 
                      ? `${Math.round(directions[currentStep].distance * 1000)} m` 
                      : `${directions[currentStep].distance.toFixed(1)} km`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationDirections;
