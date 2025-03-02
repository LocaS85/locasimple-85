
import React from 'react';
import type { Result } from './ResultsList';
import MapContainer from './map/MapContainer';

interface MapProps {
  results: Result[];
  center: [number, number];
  radius?: number;
  radiusUnit?: 'km' | 'miles';
  radiusType?: 'distance' | 'duration';
  duration?: number;
  timeUnit?: 'minutes' | 'hours';
  transportMode?: string;
}

const Map = ({ 
  results, 
  center, 
  radius = 5, 
  radiusUnit = 'km', 
  radiusType = 'distance',
  duration = 15,
  timeUnit = 'minutes',
  transportMode = 'driving'
}: MapProps) => {
  return (
    <MapContainer
      results={results}
      center={center}
      radius={radius}
      radiusUnit={radiusUnit}
      radiusType={radiusType}
      duration={duration}
      timeUnit={timeUnit}
      transportMode={transportMode}
    />
  );
};

export default Map;
