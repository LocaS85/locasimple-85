
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MAPBOX_TOKEN } from '@/config/environment';
import { MapPin, Home, User } from 'lucide-react';
import { SearchFilters } from '@/types/dailySearchCategories';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
  isFavorite?: boolean;
}

interface EnhancedMapComponentProps {
  selectedLocations?: MapLocation[];
  userLocation?: [number, number];
  transportMode?: string;
  searchRadius?: number;
  center?: [number, number];
  filters?: SearchFilters;
  selectedCategory?: string | null;
}

// Helper component to adjust the map view
const MapViewUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const EnhancedMapComponent: React.FC<EnhancedMapComponentProps> = ({
  selectedLocations = [],
  userLocation = [2.3522, 48.8566], // Default to Paris
  transportMode = 'driving',
  searchRadius = 5,
  center,
  filters,
  selectedCategory
}) => {
  // Default to user location if no center is provided
  const mapCenter = center || userLocation;
  
  // If filters are provided, use them
  const radius = filters?.radius || searchRadius;
  const transport = filters?.transport || transportMode;
  
  // Mapbox tile layer URL with token
  const mapboxTileUrl = MAPBOX_TOKEN 
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"; // Fallback to OSM if no token
  
  const attribution = MAPBOX_TOKEN
    ? '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
    : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution={attribution}
        url={mapboxTileUrl}
      />
      
      {/* Update view when center changes */}
      <MapViewUpdater center={mapCenter} />
      
      {/* User marker */}
      <Marker position={userLocation}>
        <Popup>
          <div>
            <strong>Votre position</strong>
          </div>
        </Popup>
      </Marker>
      
      {/* Search radius circle */}
      <Circle
        center={userLocation}
        radius={radius * 1000} // Convert km to meters
        pathOptions={{
          fillColor: '#1e90ff',
          fillOpacity: 0.1,
          color: '#1e90ff',
          weight: 1,
        }}
      />
      
      {/* Location markers */}
      {selectedLocations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            <div>
              <strong>{location.name}</strong>
              <p>{location.address}</p>
              <p>Catégorie: {location.category}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EnhancedMapComponent;
