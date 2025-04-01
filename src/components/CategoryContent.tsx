
import React, { useState } from 'react';
import { useCategory } from './CategoryContext';
import { CATEGORIES } from '@/types/categories';
import { ScrollArea } from '@/components/ui/scroll-area';
import CategorySelector from './category/CategorySelector';
import CategoryHeader from './category/CategoryHeader';
import AddressSection from './category/AddressSection';
import CustomFieldsSection from './category/CustomFieldsSection';
import FilterSection from './category/FilterSection';
import SubCategoriesSection from './category/SubCategoriesSection';
import PrintableView from './PrintableView';

export const CategoryContent = () => {
  const { selectedCategory } = useCategory();
  
  const [radius, setRadius] = React.useState(5);
  const [transportMode, setTransportMode] = React.useState('driving');
  const [resultsCount, setResultsCount] = React.useState(3);
  const [duration, setDuration] = React.useState(15);
  const [showPrintView, setShowPrintView] = useState(false);

  if (!selectedCategory) {
    return <CategorySelector />;
  }

  const category = CATEGORIES.find(cat => cat.id === selectedCategory);
  if (!category) return null;

  const showAddressForm = ['adresse-principale', 'famille', 'travail', 'ecole', 'divers'].includes(selectedCategory);
  const isDiversCategory = selectedCategory === 'divers';

  const categoriesWithoutFilters = [
    'alimentation',
    'achats',
    'services',
    'sante',
    'divertissement',
    'hebergement'
  ];

  const showFilters = !showAddressForm && !categoriesWithoutFilters.includes(selectedCategory);

  // Mock data for printable view
  const mockResults = [
    { 
      id: '1', 
      name: 'Résultat 1', 
      address: '123 Rue Example', 
      category: 'restaurant',
      distance: 2.5,
      duration: 15,
      latitude: 48.856614,
      longitude: 2.3522219
    },
    { 
      id: '2', 
      name: 'Résultat 2', 
      address: '456 Avenue Sample', 
      category: 'shopping',
      distance: 1.8,
      duration: 10,
      latitude: 48.85,
      longitude: 2.35
    }
  ];

  return (
    <ScrollArea className="flex-1">
      <div className="p-6 space-y-6">
        <CategoryHeader 
          categoryId={selectedCategory}
          showAddressForm={showAddressForm}
          onPrintClick={() => setShowPrintView(true)}
        />

        {showAddressForm && (
          <AddressSection categoryId={selectedCategory} />
        )}

        {isDiversCategory && (
          <CustomFieldsSection categoryId={selectedCategory} />
        )}

        {showFilters && (
          <FilterSection
            selectedCategory={selectedCategory}
            radius={radius}
            setRadius={setRadius}
            transportMode={transportMode}
            setTransportMode={setTransportMode}
            resultsCount={resultsCount}
            setResultsCount={setResultsCount}
            duration={duration}
            setDuration={setDuration}
          />
        )}
        
        <SubCategoriesSection 
          subCategories={category.subCategories}
          categoryId={selectedCategory}
        />
      </div>

      {/* Printable View Modal */}
      {showPrintView && (
        <PrintableView 
          results={mockResults} 
          mapUrl="https://via.placeholder.com/800x400?text=Map+Preview" 
          onClose={() => setShowPrintView(false)} 
        />
      )}
    </ScrollArea>
  );
};
