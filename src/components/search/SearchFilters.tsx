
import React, { useEffect } from 'react';
import CategoryFilter from './filters/CategoryFilter';
import RadiusFilter from './filters/RadiusFilter';
import TransportModeFilter from './filters/TransportModeFilter';
import PrintControl from './filters/PrintControl';
import { Category, DistanceUnit, TransportMode } from '@/types/categoryTypes';
import { CATEGORIES } from '@/types/categories';
import { debounce } from '@/lib/utils';
import { toast } from 'sonner';

interface SearchFiltersProps {
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategorySelect: (subcategoryIds: string[]) => void;
  onRadiusChange: (radius: number) => void;
  onRadiusTypeChange: (type: 'time' | 'distance') => void;
  onTransportModeChange: (mode: string) => void;
  onDistanceUnitChange: (unit: DistanceUnit) => void;
  selectedCategory: string | null;
  selectedRadius: number;
  radiusType: 'time' | 'distance';
  transportMode: string;
  distanceUnit: DistanceUnit;
  onSearch?: () => void;
}

const SearchFilters = ({
  onCategorySelect,
  onSubcategorySelect,
  onRadiusChange,
  onRadiusTypeChange,
  onTransportModeChange,
  onDistanceUnitChange,
  selectedCategory,
  selectedRadius,
  radiusType,
  transportMode,
  distanceUnit,
  onSearch
}: SearchFiltersProps) => {
  // Provide vibration feedback if supported
  const provideTactileFeedback = () => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(20); // Subtle 20ms vibration
      } catch (e) {
        console.log('Vibration not supported');
      }
    }
  };

  // Handle category selection with tactile feedback
  const handleCategorySelect = (categoryId: string) => {
    provideTactileFeedback();
    onCategorySelect(categoryId === selectedCategory ? null : categoryId);
  };

  // Create a debounced search function to avoid too many API calls
  useEffect(() => {
    const fetchResults = debounce(() => {
      if (onSearch) {
        console.log('Recherche automatique avec filtres mis à jour');
        onSearch();
      } else {
        // Pour le débogage uniquement
        toast.info(`Filtres mis à jour`, {
          description: `Catégorie: ${selectedCategory || 'Toutes'}, Rayon: ${selectedRadius}${radiusType === 'distance' ? distanceUnit : ' min'}, Transport: ${transportMode}`,
        });
      }
    }, 1000); // Longer delay for automatic search to avoid too many API calls
    
    fetchResults();
    
    return () => fetchResults.cancel?.();
  }, [selectedCategory, selectedRadius, radiusType, transportMode, distanceUnit, onSearch]);

  return (
    <div className="search-filters space-y-6 p-4">
      <CategoryFilter 
        categories={CATEGORIES}
        onSubcategorySelect={onSubcategorySelect}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      
      <RadiusFilter
        onRadiusChange={onRadiusChange}
        onRadiusTypeChange={onRadiusTypeChange}
        onDistanceUnitChange={onDistanceUnitChange}
        transportMode={transportMode}
        defaultValue={selectedRadius}
        defaultType={radiusType}
        distanceUnit={distanceUnit}
      />
      
      <TransportModeFilter
        selectedMode={transportMode}
        onModeChange={onTransportModeChange}
      />
      
      <PrintControl
        title={`Recherche ${selectedCategory ? `- ${CATEGORIES.find(c => c.id === selectedCategory)?.name}` : ''}`}
      />
    </div>
  );
};

export default SearchFilters;
