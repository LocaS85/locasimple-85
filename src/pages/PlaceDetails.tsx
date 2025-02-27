
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, Phone, Globe, Star, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';

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
  color: 'blue-500',
  // Adding required properties from Result type
  distance: 0.5,
  duration: 10
};

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleFavorite = () => {
    toast.success("Ajouté aux favoris !");
  };

  const handleShare = () => {
    toast.success("Lien copié dans le presse-papier !");
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center hover:bg-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full hover:bg-gray-100"
            onClick={handleFavorite}
          >
            <Heart className="h-4 w-4 text-red-500" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full hover:bg-gray-100"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

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

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4" />
              <span>{mockPlace.distance}km</span>
              <span>•</span>
              <span>{mockPlace.duration} min</span>
            </div>
          </div>

          <Button className="w-full">
            <Navigation className="mr-2 h-4 w-4" />
            Obtenir l'itinéraire
          </Button>
          
          <div className="pt-4">
            <Link to="/search" className="text-sm text-blue-600 hover:underline">
              Retour à la recherche
            </Link>
          </div>
        </div>

        <div className="h-[400px] rounded-lg overflow-hidden">
          <Map 
            results={[mockPlace]} 
            center={[mockPlace.longitude, mockPlace.latitude]} 
          />
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lieux similaires à proximité</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Link to={`/place/${i + 1}`} key={i} className="block">
              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-medium">{`Restaurant ${i + 1}`}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{`${0.2 * i + 0.3}km`}</span>
                    <span className="mx-1">•</span>
                    <span>{`${5 * i + 5} min`}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
