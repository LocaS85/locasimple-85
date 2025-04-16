
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon, MapPin, Car, User as Walking, Bike, Bus, Filter } from 'lucide-react';
import { DistanceUnit } from '@/types/categoryTypes';
import { CATEGORIES } from '@/types/categories';

interface FilterSidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  selectedDistance: number;
  distanceUnit: DistanceUnit;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  resultsCount: number;
  onResultsCountChange: (count: number) => void;
  filterMode: 'distance' | 'duration';
  onFilterModeChange: (mode: 'distance' | 'duration') => void;
  onSearch?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  onCategorySelect,
  selectedDistance,
  distanceUnit,
  transportMode,
  onTransportModeChange,
  resultsCount,
  onResultsCountChange,
  filterMode,
  onFilterModeChange,
  onSearch
}) => {
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <div className="w-80 bg-white h-full p-4 shadow-lg overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Filtres de recherche</h3>
          <Button 
            className="w-full mb-4 gap-2" 
            onClick={handleSearchClick}
          >
            <SearchIcon size={16} />
            Rechercher maintenant
          </Button>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Catégories</h4>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="justify-start gap-2 h-auto py-2"
                onClick={() => onCategorySelect(category.id)}
              >
                {category.icon && (
                  <span className="flex-shrink-0">{category.icon}</span>
                )}
                <span className="truncate">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Rayon de recherche</h4>
          <Tabs value={filterMode} onValueChange={(value) => onFilterModeChange(value as 'distance' | 'duration')}>
            <TabsList className="w-full mb-3">
              <TabsTrigger value="distance">Distance</TabsTrigger>
              <TabsTrigger value="duration">Durée</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {filterMode === 'distance' ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{selectedDistance} {distanceUnit}</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={distanceUnit === 'km' ? 'bg-blue-100' : undefined}
                    onClick={() => {
                      if (distanceUnit !== 'km') {
                        // Convert miles to km (approximate)
                        const kmValue = Math.round(selectedDistance * 1.60934);
                        onResultsCountChange(kmValue);
                      }
                    }}
                  >
                    km
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={distanceUnit === 'mi' ? 'bg-blue-100' : undefined}
                    onClick={() => {
                      if (distanceUnit !== 'mi') {
                        // Convert km to miles (approximate)
                        const miValue = Math.round(selectedDistance * 0.621371);
                        onResultsCountChange(miValue);
                      }
                    }}
                  >
                    mi
                  </Button>
                </div>
              </div>
              <Slider
                value={[selectedDistance]}
                min={1}
                max={50}
                step={1}
                onValueChange={(values) => onResultsCountChange(values[0])}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <Label>{selectedDistance} minutes</Label>
              <Slider
                value={[selectedDistance]}
                min={5}
                max={120}
                step={5}
                onValueChange={(values) => onResultsCountChange(values[0])}
              />
            </div>
          )}
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Mode de transport</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={transportMode === 'driving' ? "default" : "outline"}
              className="justify-start gap-2"
              onClick={() => onTransportModeChange('driving')}
            >
              <Car size={16} />
              <span>Voiture</span>
            </Button>
            <Button
              variant={transportMode === 'walking' ? "default" : "outline"}
              className="justify-start gap-2"
              onClick={() => onTransportModeChange('walking')}
            >
              <Walking size={16} />
              <span>À pied</span>
            </Button>
            <Button
              variant={transportMode === 'cycling' ? "default" : "outline"}
              className="justify-start gap-2"
              onClick={() => onTransportModeChange('cycling')}
            >
              <Bike size={16} />
              <span>Vélo</span>
            </Button>
            <Button
              variant={transportMode === 'transit' ? "default" : "outline"}
              className="justify-start gap-2"
              onClick={() => onTransportModeChange('transit')}
            >
              <Bus size={16} />
              <span>Transport</span>
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Nombre de résultats</h4>
          <div className="space-y-3">
            <Label>{resultsCount} résultats</Label>
            <Slider 
              value={[resultsCount]}
              min={1}
              max={20}
              step={1}
              onValueChange={(values) => onResultsCountChange(values[0])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
