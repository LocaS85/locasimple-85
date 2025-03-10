
import React from 'react';
import MapComponent from '@/components/map/MapComponent';

const NavigationPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <MapComponent />
      </div>
    </div>
  );
};

export default NavigationPage;
