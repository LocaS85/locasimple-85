
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, MapPin, Navigation, Eye } from 'lucide-react';
import { transportModes } from '@/data/transportModes';

interface NavigationControlsProps {
  placeName: string;
  transportMode: string;
  distance: number;
  duration: number;
  progress: number;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onBack: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  placeName,
  transportMode,
  distance,
  duration,
  progress,
  isFollowing,
  onToggleFollow,
  onBack
}) => {
  // Find the selected transport mode for icon and color
  const selectedMode = transportModes.find(mode => mode.id === transportMode) || transportModes[0];

  return (
    <div className="absolute top-0 left-0 right-0 z-10">
      {/* Header with back button and destination info */}
      <div className="bg-black/80 backdrop-blur-sm p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {selectedMode.icon}
            <h1 className="text-lg font-bold text-white">{placeName}</h1>
          </div>
          <div className="flex items-center text-xs text-gray-300 mt-1">
            <span className="font-medium">{distance.toFixed(1)} km</span>
            <span className="mx-2">•</span>
            <span className="font-medium">{duration} min</span>
          </div>
        </div>
        
        {/* Toggle follow mode button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFollow}
          className={`${isFollowing ? 'text-white bg-' + selectedMode.color : 'text-white hover:bg-white/20'} transition-colors`}
          style={{ backgroundColor: isFollowing ? selectedMode.color : 'transparent' }}
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Progress bar */}
      <Progress 
        value={progress} 
        className="h-1 rounded-none" 
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', '--progress-foreground': selectedMode.color } as React.CSSProperties}
      />
    </div>
  );
};

export default NavigationControls;
