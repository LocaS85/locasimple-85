
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import SearchBar from '@/components/search/SearchBar';
import CategorySection from '@/components/search/CategorySection';
import TransportSection from '@/components/search/TransportSection';
import SearchFilters from '@/components/search/SearchFilters';
import Navigation from '@/components/search/Navigation';
import Map from '@/components/Map';
import ResultsList from '@/components/ResultsList';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, ArrowLeft, X, List, Map as MapIcon } from 'lucide-react';
import type { Result } from '@/components/ResultsList';

const Search = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(5);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(30);
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTransports, setSelectedTransports] = useState<string[]>(['Voiture']);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [startY, setStartY] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([2.3522, 48.8566]); // Paris par défaut
  const [results, setResults] = useState<Result[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
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
        setCurrentLocation([position.coords.longitude, position.coords.latitude]);
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

  // Générer des résultats fictifs en fonction des filtres
  const generateMockResults = () => {
    const mockResults: Result[] = [];
    const categoryColors: Record<string, string> = {
      "Restaurant": "#FF5733", // Rouge
      "Hôtel": "#3366FF", // Bleu
      "Bar": "#9933FF", // Violet
      "Café": "#FFCC33", // Jaune
      "Shopping": "#FF33CC", // Rose
      "Attraction": "#33CC33", // Vert
      "Parc": "#33CCCC", // Turquoise
      "Musée": "#CC9933", // Ambre
      "Cinéma": "#3399FF", // Bleu ciel
      "Théâtre": "#FF3366", // Rose vif
      "Transport": "#6633FF", // Indigo
      "Bibliothèque": "#33FFCC", // Turquoise clair
      "Plage": "#33CCFF", // Cyan
      "Montagne": "#99CC33", // Vert lime
      "Famille": "#FF9933", // Orange
      "Amis": "#3366CC", // Bleu foncé
      "Travail": "#999999", // Gris
      "Sport": "#33CC66", // Vert émeraude
    };

    // Si aucune catégorie n'est sélectionnée, utiliser toutes les catégories
    const categoriesToUse = selectedCategories.length > 0 ? selectedCategories : categories.filter(c => c !== "Plus");

    // Générer entre 2 et 5 résultats pour chaque catégorie sélectionnée
    categoriesToUse.forEach(category => {
      if (category === "Plus") return;

      const resultsCount = Math.floor(Math.random() * 3) + 2; // 2 à 4 résultats par catégorie
      
      for (let i = 0; i < resultsCount; i++) {
        // Calcul d'une position aléatoire dans le rayon choisi
        const radius = selectedDistance || 5; // km
        const angle = Math.random() * Math.PI * 2; // angle aléatoire
        const distance = Math.sqrt(Math.random()) * radius; // distance aléatoire (distribution plus uniforme)
        
        // Convertir km en degrés (approximation grossière)
        const latOffset = distance * 0.009; // ~0.009 degrés = 1km
        const lngOffset = distance * 0.009 / Math.cos(currentLocation[1] * Math.PI / 180);
        
        const lat = currentLocation[1] + latOffset * Math.sin(angle);
        const lng = currentLocation[0] + lngOffset * Math.cos(angle);
        
        // Générer une durée en fonction du mode de transport et de la distance
        let speedFactor = 1;
        if (selectedTransports.includes('Voiture')) speedFactor = 0.8;
        else if (selectedTransports.includes('Vélo')) speedFactor = 2.5;
        else if (selectedTransports.includes('À pied')) speedFactor = 6;
        else if (selectedTransports.includes('Transport en commun')) speedFactor = 1.5;
        else if (selectedTransports.includes('Train')) speedFactor = 0.5;
        
        const duration = Math.round(distance * speedFactor * 5); // temps approximatif en minutes
        
        // Vérifier que la durée ne dépasse pas la durée max sélectionnée
        if (selectedDuration && duration > selectedDuration) continue;
        
        mockResults.push({
          id: `${category}-${i}`,
          name: `${category} ${i + 1}`,
          address: `${Math.floor(Math.random() * 100) + 1} Rue de ${category}`,
          distance: parseFloat(distance.toFixed(1)),
          duration: duration,
          category: category,
          color: categoryColors[category] || "#666666",
          latitude: lat,
          longitude: lng,
          description: `Description pour ${category} ${i + 1}`,
          rating: Math.floor(Math.random() * 5) + 1,
          openingHours: "9h-18h"
        });
      }
    });

    return mockResults.slice(0, 10); // Limiter à 10 résultats maximum
  };

  const handleSearch = () => {
    // Vérifier si les valeurs de recherche sont valides
    if (!selectedDistance && !selectedDuration) {
      toast.error("Veuillez sélectionner une distance ou une durée");
      return;
    }

    if (selectedTransports.length === 0) {
      toast.error("Veuillez sélectionner au moins un mode de transport");
      return;
    }

    toast.success("Recherche lancée !");
    
    // Générer des résultats fictifs basés sur les filtres
    const newResults = generateMockResults();
    
    if (newResults.length === 0) {
      toast.info("Aucun résultat ne correspond à vos critères");
    } else {
      toast.success(`${newResults.length} résultat(s) trouvé(s)`);
      setResults(newResults);
    }
  };

  const handleResultClick = (result: Result) => {
    toast.info(`Vous avez sélectionné: ${result.name}`);
    // Vous pourriez ici naviguer vers une page de détails
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <div className="bg-black text-white p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center text-white">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </Link>
        <h1 className="text-xl font-bold">Carte Maps</h1>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setViewMode('list')}
            className={`p-1 ${viewMode === 'list' ? 'text-blue-400' : 'text-white'}`}
          >
            <List className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setViewMode('map')}
            className={`p-1 ${viewMode === 'map' ? 'text-blue-400' : 'text-white'}`}
          >
            <MapIcon className="h-5 w-5" />
          </Button>
        </div>
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
              value={searchQuery}
              onChange={handleSearchInputChange}
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
            onDistanceChange={(value) => setSelectedDistance(value)}
            onDurationChange={(value) => setSelectedDuration(value)}
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

          {results.length > 0 && viewMode === 'list' && (
            <div className="mt-4 px-4 pb-16">
              <h2 className="text-lg font-bold mb-2">Résultats</h2>
              <ResultsList results={results} onResultClick={handleResultClick} />
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex-1">
        {viewMode === 'map' ? (
          <Map results={results} center={currentLocation} />
        ) : (
          <div className="h-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <MapIcon className="h-12 w-12 mx-auto mb-2" />
              <p>Passez en mode carte pour voir la visualisation</p>
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Search;
