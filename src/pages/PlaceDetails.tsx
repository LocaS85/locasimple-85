
import React from 'react';
import { useParams } from 'react-router-dom';
import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, Phone, Globe, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration
const mockPlace = {
  id: '1',
  name: 'Restaurant Example',
  address: '123 Rue Example, 75000 Paris',
  description: 'Un excellent restaurant au cœur de Paris',
  category: 'Restaurant',
  rating: 4.5,
  openingHours: '10:00 - 22:00',
  phone: '+33 1 23 45 67 89',
  website: 'https://example.com',
  latitude: 48.8566,
  longitude: 2.3522,
  color: 'blue-500'
};

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{mockPlace.name}</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{mockPlace.address}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>{mockPlace.rating} / 5</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>{mockPlace.openingHours}</span>
            </div>

            {mockPlace.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <a href={`tel:${mockPlace.phone}`} className="hover:text-primary">
                  {mockPlace.phone}
                </a>
              </div>
            )}

            {mockPlace.website && (
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <a 
                  href={mockPlace.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Site web
                </a>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{mockPlace.description}</p>
          </div>

          <Button className="w-full">
            <Navigation className="mr-2 h-4 w-4" />
            Obtenir l'itinéraire
          </Button>
        </div>

        <div className="h-[400px] rounded-lg overflow-hidden">
          <Map 
            results={[mockPlace]} 
            center={[mockPlace.longitude, mockPlace.latitude]} 
          />
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
