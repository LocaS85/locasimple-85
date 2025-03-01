
import React, { useState } from 'react';
import { useCategory } from './CategoryContext';
import { CATEGORIES } from '@/types/categories';
import { AddressForm } from '@/components/AddressForm';
import { SubCategoryList } from '@/components/SubCategoryList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Home, Search } from 'lucide-react';
import FilterPanel from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const CategoryContent = () => {
  const { selectedCategory, addresses } = useCategory();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // États pour les filtres
  const [radius, setRadius] = useState(5);
  const [transportMode, setTransportMode] = useState('driving');
  const [resultsCount, setResultsCount] = useState(3);
  const [duration, setDuration] = useState(15);

  if (!selectedCategory) {
    return (
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">{t('selectCategory')}</h1>
      </div>
    );
  }

  const category = CATEGORIES.find(cat => cat.id === selectedCategory);
  if (!category) return null;

  const showAddressForm = ['adresse-principale', 'famille', 'travail', 'ecole'].includes(selectedCategory);
  const currentAddresses = addresses[selectedCategory] || [];
  const canAddAddress = currentAddresses.length < 10;
  const isMainAddress = selectedCategory === 'adresse-principale';

  // Liste des catégories qui ne doivent pas avoir de filtres
  const categoriesWithoutFilters = [
    'alimentation',
    'achats',
    'services',
    'sante',
    'divertissement',
    'hebergement'
  ];

  const showFilters = !showAddressForm && !categoriesWithoutFilters.includes(selectedCategory);

  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      category: selectedCategory,
      radius: radius.toString(),
      transport: transportMode,
      duration: duration.toString(),
      results: resultsCount.toString()
    });

    navigate(`/search?${searchParams.toString()}`);
    toast.success(t('searchStarted'));
  };

  return (
    <ScrollArea className="flex-1">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{category.name}</h1>
          {showAddressForm && (
            <span className="text-sm text-muted-foreground">
              {currentAddresses.length}/10 {t('addresses')}
            </span>
          )}
        </div>

        {isMainAddress && currentAddresses.length === 0 && (
          <Alert>
            <Home className="h-4 w-4" />
            <AlertTitle>{t('mainAddress')}</AlertTitle>
            <AlertDescription>
              {t('mainAddressDescription')}
            </AlertDescription>
          </Alert>
        )}
        
        {showAddressForm && canAddAddress && (
          <AddressForm categoryId={selectedCategory} />
        )}

        {showFilters && (
          <div className="space-y-6">
            <FilterPanel
              radius={radius}
              onRadiusChange={setRadius}
              transportMode={transportMode}
              onTransportModeChange={setTransportMode}
              resultsCount={resultsCount}
              onResultsCountChange={setResultsCount}
              duration={duration}
              onDurationChange={setDuration}
            />

            <Button 
              onClick={handleSearch}
              className="w-full"
              size="lg"
            >
              <Search className="w-4 h-4 mr-2" />
              {t('search')}
            </Button>
          </div>
        )}
        
        {category.subCategories && (
          <SubCategoryList 
            subCategories={category.subCategories}
            categoryId={selectedCategory}
          />
        )}
      </div>
    </ScrollArea>
  );
};
