import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ArrowLeft, ArrowRight, MapPin, Clock, Ruler, Mic, Car, Bike, User, Bus, Train, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Search = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTransports, setSelectedTransports] = useState<string[]>([]);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [startY, setStartY] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const panelRef = useRef(null);
  const categoriesRef = useRef(null);
  const favoritesRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const categories = [
    "Restaurant", "Hôtel", "Bar", "Café", "Shopping", "Attraction", "Transport", 
    "Parc", "Musée", "Cinéma", "Théâtre", "Bibliothèque", "Plage", "Montagne", "Plus"
  ];

  const favorites = ["Famille", "Amis", "Travail", "Sport", "Plus"];

  const transportModes = [
    { name: "Voiture", icon: <Car className="h-4 w-4 mr-2" />, color: "bg-blue-500" },
    { name: "Vélo", icon: <Bike className="h-4 w-4 mr-2" />, color: "bg-green-500" },
    { name: "À pied", icon: <User className="h-4 w-4 mr-2" />, color: "bg-yellow-500" },
    { name: "Transport en commun", icon: <Bus className="h-4 w-4 mr-2" />, color: "bg-purple-500" },
    { name: "Train", icon: <Train className="h-4 w-4 mr-2" />, color: "bg-red-500" }
  ];

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
    } else {
      console.log("Arrêt de l'enregistrement...");
    }
  };

  const handleMouseDown = (e) => {
    if (!categoriesRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleTouchStart = (e) => {
    if (!categoriesRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !categoriesRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoriesRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !categoriesRef.current) return;
    const x = e.touches[0].pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoriesRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    return () => {
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleTransportClick = (transport: string) => {
    setSelectedTransports(prev => 
      prev.includes(transport) 
        ? prev.filter(t => t !== transport)
        : [...prev, transport]
    );
  };

  const convertDistance = (value) => {
    if (distanceUnit === 'mi') {
      return `${(value * 0.621371).toFixed(1)} mi`;
    }
    return `${value} km`;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours} h`;
  };

  const handlePanelTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handlePanelTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 50) {
      setIsPanelExpanded(false);
    } else if (diff < -50) {
      setIsPanelExpanded(true);
    }
    
    setOffsetY(diff);
  };

  const handlePanelTouchEnd = () => {
    setOffsetY(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <div className="bg-black text-white p-6 flex justify-center items-center">
        <h1 className="text-xl font-bold">Carte Maps</h1>
      </div>

      <motion.div
        ref={panelRef}
        initial={{ y: 0 }}
        animate={{ 
          y: isPanelExpanded ? 0 : "70%",
          transition: { type: "spring", stiffness: 300, damping: 30 }
        }}
        className="absolute top-16 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-10"
        style={{ 
          touchAction: "none",
          height: "calc(100vh - 4rem)"
        }}
      >
        <div 
          className="w-full h-12 flex justify-center items-center cursor-grab"
          onTouchStart={handlePanelTouchStart}
          onTouchMove={handlePanelTouchMove}
          onTouchEnd={handlePanelTouchEnd}
        >
          <div className="w-16 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="overflow-y-auto h-[calc(100%-3rem)]">
          <div className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="relative w-full sm:w-1/2">
              <div className="relative flex items-center w-full">
                <Input 
                  type="text" 
                  placeholder="Recherche" 
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
            <Button className="w-full sm:w-auto rounded-full border-2 border-black bg-white text-black hover:bg-gray-100">
              <MapPin className="mr-2 h-4 w-4" />
              Ma position
            </Button>
          </div>

          <div className="px-4 py-3">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full border-2 border-black px-6 py-1 bg-white">
                Catégorie
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              <ArrowLeft className="h-6 w-6 mr-2 text-gray-400 cursor-pointer hover:text-black" />
              
              <div 
                ref={categoriesRef}
                className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 max-w-full"
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleDragEnd}
              >
                {categories.map((category, index) => (
                  <Button 
                    key={index} 
                    className={`rounded-full border-2 border-black hover:bg-gray-100 whitespace-nowrap px-4 py-1 h-auto flex-shrink-0 transition-colors ${
                      selectedCategories.includes(category) 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-white text-black'
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category === "Plus" ? <Plus className="h-4 w-4" /> : category}
                  </Button>
                ))}
              </div>
              
              <ArrowRight className="h-6 w-6 ml-2 text-gray-400 cursor-pointer hover:text-black" />
            </div>
          </div>

          <div className="px-4 py-3">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full border-2 border-black px-6 py-1 bg-white">
                Favoris
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              <ArrowLeft className="h-6 w-6 mr-2 text-gray-400 cursor-pointer hover:text-black" />
              
              <div 
                ref={favoritesRef}
                className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 max-w-full"
              >
                {favorites.map((favorite, index) => (
                  <Button 
                    key={index} 
                    className={`rounded-full border-2 border-black hover:bg-gray-100 whitespace-nowrap px-4 py-1 h-auto flex-shrink-0 transition-colors ${
                      selectedCategories.includes(favorite) 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-white text-black'
                    }`}
                  >
                    {favorite === "Plus" ? <Plus className="h-4 w-4" /> : favorite}
                  </Button>
                ))}
              </div>
              
              <ArrowRight className="h-6 w-6 ml-2 text-gray-400 cursor-pointer hover:text-black" />
            </div>
          </div>

          <div className="px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {transportModes.map((mode, index) => (
                <Button 
                  key={index}
                  onClick={() => handleTransportClick(mode.name)}
                  className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                    selectedTransports.includes(mode.name)
                      ? `${mode.color} text-white`
                      : 'bg-white text-black border-2 border-black hover:bg-gray-100'
                  }`}
                >
                  {mode.icon}
                  {mode.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="px-4 py-3">
            <div className="flex justify-between gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="w-1/2 rounded-full border-2 border-black bg-white text-black hover:bg-gray-100 justify-between">
                    <span>Nombre autour de moi</span>
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
                        onClick={() => console.log(`Sélectionné: ${i+1}`)}
                      >
                        {i+1}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="w-1/2 rounded-full border-2 border-black bg-white text-black hover:bg-gray-100 justify-between">
                    <span>Durée</span>
                    <Clock className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                  <div className="p-2">
                    <h3 className="font-bold mb-2">Minutes</h3>
                    <div className="grid grid-cols-3 gap-1 mb-4">
                      {generateMinutesDurations().map((min) => (
                        <Button 
                          key={`min-${min}`} 
                          variant={selectedDuration === min ? "default" : "outline"}
                          className="text-sm"
                          onClick={() => setSelectedDuration(min)}
                        >
                          {min} min
                        </Button>
                      ))}
                    </div>
                    <h3 className="font-bold mb-2">Heures</h3>
                    <div className="grid grid-cols-5 gap-1">
                      {generateHoursDurations().map((hour) => (
                        <Button 
                          key={`hour-${hour}`} 
                          variant={selectedDuration === hour * 60 ? "default" : "outline"}
                          className="text-sm"
                          onClick={() => setSelectedDuration(hour * 60)}
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
                    <span>Distance</span>
                    <div className="flex items-center">
                      <Tabs value={distanceUnit} onValueChange={setDistanceUnit} className="ml-1">
                        <TabsList className="h-6 px-1">
                          <TabsTrigger 
                            value="km" 
                            className={`px-1 text-xs h-5 ${
                              distanceUnit === 'km' ? 'bg-blue-500 text-white' : ''
                            }`}
                          >
                            km
                          </TabsTrigger>
                          <TabsTrigger 
                            value="mi" 
                            className={`px-1 text-xs h-5 ${
                              distanceUnit === 'mi' ? 'bg-orange-500 text-white' : ''
                            }`}
                          >
                            mi
                          </TabsTrigger>
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
                          onClick={() => setSelectedDistance(meter / 1000)}
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
                          onClick={() => setSelectedDistance(km)}
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

          <div className="px-4 py-3">
            <div className="bg-gray-100 rounded-lg p-3">
              <h3 className="font-bold mb-2">Résultats :</h3>
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
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 bg-gray-100">
        {/* Ici viendra la carte */}
      </div>

      <div className="bg-black text-white grid grid-cols-3 text-center p-4 z-20">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-gray-800 transition-colors"
        >
          Plan
        </Button>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-gray-800 transition-colors"
        >
          Enregistré
        </Button>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-gray-800 transition-colors"
        >
          Paramètre
        </Button>
      </div>
    </div>
  );
};

export default Search;
