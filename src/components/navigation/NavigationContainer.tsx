
import React, { useState, useEffect } from 'react';
import NavigationMap from './NavigationMap';
import NavigationControls from './NavigationControls';
import NavigationDirections from './NavigationDirections';
import { useNavigationState } from '@/hooks/useNavigationState';

interface NavigationContainerProps {
  start: [number, number];
  end: [number, number];
  placeName: string;
  transportMode: string;
  onBack: () => void;
}

const NavigationContainer: React.FC<NavigationContainerProps> = ({
  start,
  end,
  placeName,
  transportMode,
  onBack
}) => {
  const {
    directions,
    currentStep,
    distance,
    duration,
    progress,
    isFollowing,
    isLoading,
    toggleFollowMode,
    setCurrentStep,
    loadRoute
  } = useNavigationState();

  // Load route when component mounts
  useEffect(() => {
    loadRoute(start, end, transportMode);
  }, [start, end, transportMode, loadRoute]);

  return (
    <div className="relative h-full w-full">
      {/* Full screen map */}
      <div className="absolute inset-0">
        <NavigationMap
          start={start}
          end={end}
          transportMode={transportMode}
          currentStep={currentStep}
          isFollowing={isFollowing}
        />
      </div>

      {/* Navigation controls overlay */}
      <NavigationControls
        placeName={placeName}
        transportMode={transportMode}
        distance={distance}
        duration={duration}
        progress={progress}
        isFollowing={isFollowing}
        onToggleFollow={toggleFollowMode}
        onBack={onBack}
      />

      {/* Directions panel */}
      <NavigationDirections
        directions={directions}
        currentStep={currentStep}
        onStepSelect={setCurrentStep}
        isLoading={isLoading}
      />
    </div>
  );
};

export default NavigationContainer;
