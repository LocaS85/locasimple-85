import React from 'react';
import { useParams } from 'react-router-dom';

const PlaceDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Détails du lieu</h1>
      {/* TODO: Implement place details */}
    </div>
  );
};

export default PlaceDetails;