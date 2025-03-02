
import React from 'react';
import Map from '@/components/Map';
import InteractiveMenu from '@/components/InteractiveMenu';
import type { Result } from '@/components/ResultsList';

interface MapSectionProps {
  results: Result[];
  userLocation: [number, number];
  radius: number;
  radiusUnit: 'km' | 'miles';
  radiusType: 'distance' | 'duration';
  duration: number;
  timeUnit: 'minutes' | 'hours';
  transportMode: string;
  onFilterChange: (filters: {
    radius: number;
    unit: 'km' | 'miles';
    duration: number;
    timeUnit: 'minutes' | 'hours';
    resultsCount: number;
    transportMode: string;
    radiusType: 'distance' | 'duration';
  }) => void;
}

const MapSection: React.FC<MapSectionProps> = ({
  results,
  userLocation,
  radius,
  radiusUnit,
  radiusType,
  duration,
  timeUnit,
  transportMode,
  onFilterChange
}) => {
  return (
    <div className="mb-6">
      <div className="h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-200 mb-6">
        <Map 
          results={results} 
          center={userLocation} 
          radius={radius}
          radiusUnit={radiusUnit}
          radiusType={radiusType}
          duration={duration}
          timeUnit={timeUnit}
          transportMode={transportMode}
        />
      </div>
      
      <InteractiveMenu onFilterChange={onFilterChange} />
    </div>
  );
};

export default MapSection;
