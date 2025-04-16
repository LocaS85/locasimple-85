
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, Car, User, Bike, Bus, Train, Ship, Users, Plane, MapPin, Search as SearchIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MAPBOX_TOKEN } from '@/config/environment';
import AddressSearch from '@/components/search/AddressSearch';

const Search = () => {
  // Map reference
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [currentRadius, setCurrentRadius] = useState<any>(null);
  const [currentMarker, setCurrentMarker] = useState<any>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [resultsCount, setResultsCount] = useState<number>(5);
  const [radius, setRadius] = useState<number>(5);
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const [transportMode, setTransportMode] = useState<string>('driving');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Subcategories state
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  // Categories state (using the same data as Categories.tsx)
  const [categories, setCategories] = useState<Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>>([
    { id: '1', name: 'Restaurants', icon: '🍽️', color: '#FF5733' },
    { id: '2', name: 'Shopping', icon: '🛍️', color: '#33FF57' },
    { id: '3', name: 'Divertissement', icon: '🎭', color: '#3357FF' },
    { id: '4', name: 'Santé', icon: '💊', color: '#FF33A8' },
    { id: '5', name: 'Services', icon: '🔧', color: '#33FFF3' },
    { id: '6', name: 'Transport', icon: '🚗', color: '#F3FF33' },
  ]);

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Skip if already initialized
    if (map) return;

    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && 'L' in window) {
      const L = (window as any).L;
      
      try {
        const newMap = L.map(mapContainerRef.current, { 
          zoomControl: false 
        }).setView([48.8566, 2.3522], 13);
        
        L.control.zoom({ position: 'bottomright' }).addTo(newMap);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(newMap);
        
        // Add location control
        const locateControl = L.control.locate({
          position: 'bottomright',
          flyTo: true,
          keepCurrentZoomLevel: true,
          strings: {
            title: 'Ma position'
          },
          locateOptions: {
            maxZoom: 16
          }
        }).addTo(newMap);
        
        // Handle location found
        newMap.on('locationfound', (e: any) => {
          const { lat, lng } = e.latlng;
          setUserLocation([lat, lng]);
          
          // Add marker for user location
          if (currentMarker) {
            newMap.removeLayer(currentMarker);
          }
          
          const userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: `<div class="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full border-2 border-white"><span class="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg></span></div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })
          }).addTo(newMap);
          
          setCurrentMarker(userMarker);
          toast.success('Position trouvée !');
        });
        
        // Handle location error
        newMap.on('locationerror', (e: any) => {
          toast.error('Impossible de trouver votre position');
          console.error('Location error:', e);
        });
        
        setMap(newMap);
        
        // Initial radius circle
        updateRadius(radius, newMap);
      } catch (error) {
        console.error('Error initializing map:', error);
        toast.error('Erreur lors de l\'initialisation de la carte');
      }
    } else {
      console.error('Leaflet not loaded');
      toast.error('Bibliothèque cartographique non chargée');
    }
    
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapContainerRef]);

  // Update radius when changed
  useEffect(() => {
    if (map) {
      updateRadius(radius, map);
    }
  }, [radius, map, unit]);
  
  // Function to update radius circle on map
  const updateRadius = (radius: number, mapInstance: any) => {
    if (currentRadius) {
      mapInstance.removeLayer(currentRadius);
    }
    
    // Convert to meters (Leaflet uses meters)
    const radiusInMeters = unit === 'km' ? radius * 1000 : radius * 1609.34;
    
    const newRadius = (window as any).L.circle(mapInstance.getCenter(), {
      radius: radiusInMeters,
      color: '#2A5C82',
      fillColor: '#5BA4E6',
      fillOpacity: 0.1
    }).addTo(mapInstance);
    
    setCurrentRadius(newRadius);
  };
  
  // Handle location click
  const handleLocationClick = () => {
    if (map && 'locate' in map) {
      map.locate({
        setView: true,
        maxZoom: 16
      });
    } else {
      toast.error('Fonctionnalité de localisation non disponible');
    }
  };
  
  // Handle unit change
  const handleUnitChange = (newUnit: 'km' | 'mi') => {
    setUnit(newUnit);
  };
  
  // Handle category change and load subcategories
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Set subcategories based on selected category
    switch(categoryId) {
      case 'Restaurants':
        setSubcategories(['Français', 'Italien', 'Japonais', 'Fast-food']);
        break;
      case 'Shopping':
        setSubcategories(['Vêtements', 'Électronique', 'Livres', 'Sport']);
        break;
      case 'Divertissement':
        setSubcategories(['Cinéma', 'Musée', 'Théâtre', 'Parc']);
        break;
      case 'Santé':
        setSubcategories(['Médecin', 'Pharmacie', 'Hôpital', 'Dentiste']);
        break;
      case 'Services':
        setSubcategories(['Banque', 'Poste', 'Administration', 'Coiffeur']);
        break;
      case 'Transport':
        setSubcategories(['Gare', 'Métro', 'Bus', 'Aéroport']);
        break;
      default:
        setSubcategories([]);
    }
  };
  
  // Handle transport mode selection
  const handleTransportModeSelect = (mode: string) => {
    setTransportMode(mode);
    toast.success(`Mode de transport: ${mode}`);
  };
  
  // Handle address selection
  const handleAddressSelect = (location: {
    name: string;
    longitude: number;
    latitude: number;
  }) => {
    setSearchQuery(location.name);
    
    if (map) {
      map.setView([location.latitude, location.longitude], 15);
      
      // Add marker for selected location
      if (currentMarker) {
        map.removeLayer(currentMarker);
      }
      
      const marker = (window as any).L.marker([location.latitude, location.longitude]).addTo(map);
      setCurrentMarker(marker);
      
      // Update radius to new center
      if (currentRadius) {
        map.removeLayer(currentRadius);
      }
      
      const radiusInMeters = unit === 'km' ? radius * 1000 : radius * 1609.34;
      
      const newRadius = (window as any).L.circle([location.latitude, location.longitude], {
        radius: radiusInMeters,
        color: '#2A5C82',
        fillColor: '#5BA4E6',
        fillOpacity: 0.1
      }).addTo(map);
      
      setCurrentRadius(newRadius);
    }
    
    toast.success(`Recherche: ${location.name}`);
  };
  
  // Handle voice search
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      toast.info('Écoutez...');
      
      // Web Speech API is available
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        toast.success(`Recherche: ${transcript}`);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        toast.error('Erreur de reconnaissance vocale');
      };
      
      recognition.start();
    } else {
      toast.error('La reconnaissance vocale n\'est pas supportée sur ce navigateur');
    }
  };
  
  // Define transport options with colors
  const transportOptions = [
    { mode: 'car', icon: <Car size={18} />, label: 'Voiture', color: '#FF6B6B' },
    { mode: 'walking', icon: <User size={18} />, label: 'À pied', color: '#4ECDC4' },
    { mode: 'bicycle', icon: <Bike size={18} />, label: 'Vélo', color: '#45B7D1' },
    { mode: 'bus', icon: <Bus size={18} />, label: 'Transports', color: '#96CEB4' },
    { mode: 'train', icon: <Train size={18} />, label: 'Train', color: '#FFEEAD' },
    { mode: 'ship', icon: <Ship size={18} />, label: 'Bateau', color: '#D4A5A5' },
    { mode: 'carpooling', icon: <Users size={18} />, label: 'Co-voiturage', color: '#774F38' },
    { mode: 'plane', icon: <Plane size={18} />, label: 'Avion', color: '#8E44AD' }
  ];

  return (
    <div className={`min-h-screen grid ${isMobile ? '' : 'grid-cols-[300px_1fr]'}`}>
      {isMobile && (
        <div className="fixed z-50 bottom-5 left-0 right-0 flex justify-center">
          <Button 
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="rounded-full shadow-lg"
            variant="outline"
          >
            {isPanelOpen ? 'Masquer les filtres' : 'Afficher les filtres'}
          </Button>
        </div>
      )}
      
      <motion.div 
        className={`bg-white shadow-md z-50 overflow-y-auto ${
          isMobile 
            ? 'fixed bottom-0 left-0 right-0 h-[60vh] rounded-t-2xl' 
            : 'h-screen'
        }`}
        animate={{ 
          y: isMobile 
            ? isPanelOpen ? 0 : '100%' 
            : 0 
        }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="p-5">
          <div className="flex gap-2 mb-5">
            <AddressSearch
              onAddressSelect={handleAddressSelect}
              placeholder="Rechercher un lieu..."
              userLocation={userLocation || undefined}
            />
            <Button
              className="rounded-full w-12 h-12 flex-shrink-0"
              variant="default"
              onClick={handleVoiceSearch}
            >
              <Mic size={20} />
            </Button>
          </div>
          
          <div className="mb-4">
            <Button
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
              onClick={handleLocationClick}
            >
              <MapPin size={16} />
              Utiliser ma position
            </Button>
          </div>
          
          <div className="mb-6">
            <Label className="mb-2 block">Catégorie</Label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Choisir</SelectItem>
                {categories.map((category) => (
                  <SelectItem 
                    key={category.id} 
                    value={category.name}
                    className="flex items-center gap-2"
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span style={{ color: category.color }}>{category.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {subcategories.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <Label className="mb-2 block">Sous-catégories</Label>
              <div className="flex gap-2 pb-2 overflow-x-auto">
                {subcategories.map((sub) => (
                  <Button
                    key={sub}
                    variant={selectedSubcategory === sub ? "default" : "outline"}
                    size="sm"
                    className="flex-shrink-0 whitespace-nowrap rounded-full"
                    onClick={() => setSelectedSubcategory(sub)}
                  >
                    {sub}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <Label className="mb-2 block">Nombre de résultats: {resultsCount}</Label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[resultsCount]}
              onValueChange={(values) => setResultsCount(values[0])}
            />
          </div>
          
          <div className="mb-6">
            <Label className="mb-2 block">Rayon de recherche</Label>
            <div className="flex items-center gap-2 mb-2">
              <Button 
                size="sm" 
                variant={unit === 'km' ? "default" : "outline"} 
                onClick={() => handleUnitChange('km')}
              >
                km
              </Button>
              <Button 
                size="sm" 
                variant={unit === 'mi' ? "default" : "outline"} 
                onClick={() => handleUnitChange('mi')}
              >
                mi
              </Button>
              <Input 
                type="number" 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-20" 
                min={1} 
                max={100}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <Label className="mb-2 block">Mode de transport</Label>
            <div className="grid grid-cols-2 gap-2">
              {transportOptions.map((option) => (
                <Button
                  key={option.mode}
                  variant="outline"
                  className="flex items-center gap-2 rounded-full justify-start"
                  style={{ 
                    backgroundColor: transportMode === option.mode ? option.color : undefined,
                    color: transportMode === option.mode ? 'white' : undefined,
                    borderColor: option.color
                  }}
                  onClick={() => handleTransportModeSelect(option.mode)}
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded-full" 
                        style={{ backgroundColor: option.color, color: 'white' }}>
                    {option.icon}
                  </span>
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="h-screen w-full">
        <div ref={mapContainerRef} className="h-full w-full" id="map" />
      </div>
    </div>
  );
};

export default Search;
