
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import SearchBar from '@/components/search/SearchBar';
import CategorySection from '@/components/search/CategorySection';
import TransportSection from '@/components/search/TransportSection';
import SearchFilters from '@/components/search/SearchFilters';
import Navigation from '@/components/search/Navigation';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';

const Search = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTransports, setSelectedTransports] = useState<string[]>([]);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [startY, setStartY] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const panelRef = React.useRef(null);

  const categories = [
    "Restaurant", "Hôtel", "Bar", "Café", "Shopping", "Attraction", "Transport", 
    "Parc", "Musée", "Cinéma", "Théâtre", "Bibliothèque", "Plage", "Montagne", "Plus"
  ];

  const favorites = ["Famille", "Amis", "Travail", "Sport", "Plus"];

  const handleMicClick = () => {
    setIsRecording(!isRecording);
  };

  const handleLocationClick = () => {
    toast.info("Localisation en cours...");
    // Implémentation de la localisation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.success("Position obtenue !");
        // Utiliser position.coords.latitude et position.coords.longitude
      },
      (error) => {
        toast.error("Impossible d'obtenir votre position");
      }
    );
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

  const handleSearch = () => {
    toast.success("Recherche lancée !");
    // Implémentation de la recherche
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <div className="bg-black text-white p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center text-white">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </Link>
        <h1 className="text-xl font-bold">Carte Maps</h1>
        <div className="w-20"></div> {/* Spacer pour équilibrer le header */}
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
            <SearchBar 
              isRecording={isRecording}
              onMicClick={handleMicClick}
              onLocationClick={handleLocationClick}
            />
          </div>

          <CategorySection
            title="Catégorie"
            items={categories}
            selectedItems={selectedCategories}
            onItemClick={(category) => setSelectedCategories(prev => 
              prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
            )}
          />

          <CategorySection
            title="Favoris"
            items={favorites}
            selectedItems={selectedCategories}
            onItemClick={(favorite) => setSelectedCategories(prev => 
              prev.includes(favorite) 
                ? prev.filter(f => f !== favorite)
                : [...prev, favorite]
            )}
          />

          <TransportSection
            selectedTransports={selectedTransports}
            onTransportClick={(transport) => setSelectedTransports(prev => 
              prev.includes(transport) 
                ? prev.filter(t => t !== transport)
                : [...prev, transport]
            )}
          />

          <SearchFilters
            distanceUnit={distanceUnit}
            onDistanceUnitChange={setDistanceUnit}
            selectedDistance={selectedDistance}
            selectedDuration={selectedDuration}
          />

          <div className="flex justify-center py-4">
            <Button 
              onClick={handleSearch}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
            >
              <SearchIcon className="h-4 w-4 mr-2" />
              Recherche
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 bg-gray-100">
        {/* Ici viendra la carte */}
      </div>

      <Navigation />
    </div>
  );
};

export default Search;
