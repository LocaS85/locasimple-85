
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, MapPin, Clock, Mic } from 'lucide-react';
import { transportModes } from '@/data/transportModes';
import { mockCategories } from '@/data/mockCategories';
import { TransportModeSelector } from '@/components/menu/TransportModeSelector';
import { RadiusSelector } from '@/components/menu/RadiusSelector';

const Search = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');
  const [transportMode, setTransportMode] = useState('driving');
  const [radiusType, setRadiusType] = useState<'distance' | 'duration'>('distance');
  const [resultsCount, setResultsCount] = useState(5);
  const [radius, setRadius] = useState(5);
  const [duration, setDuration] = useState(15);
  
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  
  const meterDistances = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  
  const generateKilometerDistances = () => {
    return Array.from({ length: 100 }, (_, i) => i + 1);
  };

  const generateMinutesDurations = () => {
    return Array.from({ length: 11 }, (_, i) => i * 5 + 5);
  };
  
  const generateHoursDurations = () => {
    return Array.from({ length: 10 }, (_, i) => i + 1);
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log("Démarrage de l'enregistrement...");
      // Code pour démarrer l'enregistrement
    } else {
      console.log("Arrêt de l'enregistrement...");
      // Code pour arrêter l'enregistrement
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!categoriesRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!categoriesRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !categoriesRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiplicateur de vitesse de défilement
    categoriesRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !categoriesRef.current) return;
    const x = e.touches[0].pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoriesRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleSearch = (query: string) => {
    setLoading(true);
    console.log(`Searching for: ${query}`);
    // Simulate search
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilters: {
    radius: number;
    unit: 'km' | 'miles';
    duration: number;
    timeUnit: 'minutes' | 'hours';
    resultsCount: number;
    transportMode: string;
    radiusType: 'distance' | 'duration';
  }) => {
    setRadius(newFilters.radius);
    setDistanceUnit(newFilters.unit);
    setDuration(newFilters.duration);
    setTimeUnit(newFilters.timeUnit);
    setResultsCount(newFilters.resultsCount);
    setTransportMode(newFilters.transportMode);
    setRadiusType(newFilters.radiusType);
    
    // Relaunch search with new parameters
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    return () => {
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const convertDistance = (value: number) => {
    if (distanceUnit === 'miles') {
      return `${(value * 0.621371).toFixed(1)} mi`;
    }
    return `${value} km`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours} h`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with title */}
      <div className="bg-black text-white p-4 flex justify-center items-center">
        <h1 className="text-xl font-bold">{t('search_title')}</h1>
      </div>
      
      {/* Search and location section */}
      <div className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="relative w-full sm:w-1/2">
          <div className="relative flex items-center w-full">
            <Input 
              type="text" 
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-2 border-black pr-10" 
            />
            <Button 
              onClick={handleMicClick}
              className={`absolute right-2 ${isRecording ? 'text-red-500' : 'text-gray-500'} bg-transparent hover:bg-transparent p-1`}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button 
          className="w-full sm:w-auto rounded-full border-2 border-black bg-white text-black hover:bg-gray-100"
          onClick={() => {
            // Get user's location
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setUserLocation([position.coords.longitude, position.coords.latitude]);
                  console.log("Location updated:", position.coords);
                },
                (error) => {
                  console.error('Error getting location:', error);
                }
              );
            }
          }}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Ma position
        </Button>
      </div>
      
      {/* Categories section */}
      <div className="px-4 py-3">
        <div className="mb-2 flex justify-center">
          <div className="rounded-full border-2 border-black px-6 py-1 bg-white">
            Catégorie
          </div>
        </div>
        
        <div className="flex justify-center items-center">
          <ArrowLeft className="h-6 w-6 mr-2 text-gray-400" />
          
          <div 
            ref={categoriesRef}
            className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 max-w-full"
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleDragEnd}
          >
            {mockCategories.map((category) => (
              <Button 
                key={category.id} 
                className="rounded-full border-2 border-black bg-white text-black hover:bg-gray-100 whitespace-nowrap px-4 py-1 h-auto flex-shrink-0"
              >
                {category.icon}
                <span className="ml-1">{category.name}</span>
              </Button>
            ))}
          </div>
          
          <ArrowRight className="h-6 w-6 ml-2 text-gray-400" />
        </div>
      </div>
      
      {/* Additional filters */}
      <div className="px-4 py-3 flex flex-col gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full rounded-full border-2 border-black bg-white text-black hover:bg-gray-100 justify-between">
              <span>{t('results_count')}</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="grid grid-cols-5 gap-1 p-2">
              {Array.from({ length: 10 }, (_, i) => (
                <Button 
                  key={`nbr-${i+1}`} 
                  variant="outline"
                  className="h-10 w-10"
                  onClick={() => setResultsCount(i+1)}
                >
                  {i+1}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="w-full border-2 border-black rounded-full bg-white text-black">
          <TransportModeSelector 
            transportMode={transportMode} 
            onTransportModeChange={setTransportMode} 
          />
        </div>
        
        <div className="flex justify-between gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-1/2 rounded-full border-2 border-black bg-white text-black hover:bg-gray-100 justify-between">
                <span>{t('duration')}</span>
                <Clock className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <div className="p-2">
                <h3 className="font-bold mb-2">{t('minutes')}</h3>
                <div className="grid grid-cols-3 gap-1 mb-4">
                  {generateMinutesDurations().map((min) => (
                    <Button 
                      key={`min-${min}`} 
                      variant={selectedDuration === min ? "default" : "outline"}
                      className="text-sm"
                      onClick={() => {
                        setSelectedDuration(min);
                        setDuration(min);
                        setTimeUnit('minutes');
                      }}
                    >
                      {min} min
                    </Button>
                  ))}
                </div>
                <h3 className="font-bold mb-2">{t('hours')}</h3>
                <div className="grid grid-cols-5 gap-1">
                  {generateHoursDurations().map((hour) => (
                    <Button 
                      key={`hour-${hour}`} 
                      variant={selectedDuration === hour * 60 ? "default" : "outline"}
                      className="text-sm"
                      onClick={() => {
                        setSelectedDuration(hour * 60);
                        setDuration(hour);
                        setTimeUnit('hours');
                      }}
                    >
                      {hour} h
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-1/2 rounded-full border-2 border-black bg-white text-black hover:bg-gray-100 justify-between">
                <span>{t('distance')}</span>
                <div className="flex items-center">
                  <Tabs 
                    value={distanceUnit} 
                    onValueChange={(value) => setDistanceUnit(value as 'km' | 'miles')} 
                    className="ml-1"
                  >
                    <TabsList className="h-6 px-1">
                      <TabsTrigger value="km" className="px-1 text-xs h-5">km</TabsTrigger>
                      <TabsTrigger value="miles" className="px-1 text-xs h-5">mi</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <div className="p-2">
                <h3 className="font-bold mb-2">Mètres</h3>
                <div className="grid grid-cols-3 gap-1 mb-4">
                  {meterDistances.map((meter) => (
                    <Button 
                      key={`meter-${meter}`} 
                      variant={selectedDistance === meter / 1000 ? "default" : "outline"}
                      className="text-sm"
                      onClick={() => {
                        setSelectedDistance(meter / 1000);
                        setRadius(meter / 1000);
                      }}
                    >
                      {meter} m
                    </Button>
                  ))}
                </div>
                <h3 className="font-bold mb-2">{distanceUnit === 'km' ? 'Kilomètres' : 'Miles'}</h3>
                <div className="grid grid-cols-4 gap-1 h-40 overflow-y-auto">
                  {generateKilometerDistances().map((km) => (
                    <Button 
                      key={`km-${km}`} 
                      variant={selectedDistance === km ? "default" : "outline"}
                      className="text-sm"
                      onClick={() => {
                        setSelectedDistance(km);
                        setRadius(km);
                      }}
                    >
                      {distanceUnit === 'km' ? `${km} km` : `${(km * 0.621371).toFixed(1)} mi`}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Display selected filters */}
      <div className="px-4 py-3">
        <div className="bg-gray-100 rounded-lg p-3">
          <h3 className="font-bold mb-2">Vos critères de recherche :</h3>
          <div className="flex flex-wrap gap-2">
            {selectedDuration && (
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {formatDuration(selectedDuration)}
              </div>
            )}
            {selectedDistance && (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {distanceUnit === 'km' ? 
                  (selectedDistance < 1 ? `${selectedDistance * 1000} m` : `${selectedDistance} km`) : 
                  `${(selectedDistance * 0.621371).toFixed(1)} mi`}
              </div>
            )}
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
              {transportModes.find(mode => mode.id === transportMode)?.name || 'Voiture'}
            </div>
            <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
              Résultats: {resultsCount}
            </div>
          </div>
        </div>
      </div>
      
      {/* Map placeholder */}
      <div className="px-4 py-3">
        <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
          <p className="text-gray-600">Carte en chargement...</p>
        </div>
      </div>
      
      {/* Footer navigation */}
      <div className="mt-auto">
        <div className="bg-black text-white grid grid-cols-3 text-center p-4">
          <Button variant="ghost" className="text-white hover:text-gray-300">Plan</Button>
          <Button variant="ghost" className="text-white hover:text-gray-300">Enregistré</Button>
          <Button variant="ghost" className="text-white hover:text-gray-300">Paramètre</Button>
        </div>
      </div>
    </div>
  );
};

export default Search;
