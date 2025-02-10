
import React from 'react';
import { useCategory } from './CategoryContext';
import { CATEGORIES } from '@/types/categories';
import { AddressForm } from '@/components/AddressForm';
import { SubCategoryList } from '@/components/SubCategoryList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Home } from 'lucide-react';

export const CategoryContent = () => {
  const { selectedCategory, addresses } = useCategory();

  if (!selectedCategory) {
    return (
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Sélectionnez une catégorie</h1>
      </div>
    );
  }

  const category = CATEGORIES.find(cat => cat.id === selectedCategory);
  if (!category) return null;

  const showAddressForm = ['adresse-principale', 'famille', 'travail', 'ecole'].includes(selectedCategory);
  const currentAddresses = addresses[selectedCategory] || [];
  const canAddAddress = currentAddresses.length < 10;
  const isMainAddress = selectedCategory === 'adresse-principale';

  return (
    <ScrollArea className="flex-1">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{category.name}</h1>
          {showAddressForm && (
            <span className="text-sm text-muted-foreground">
              {currentAddresses.length}/10 adresses
            </span>
          )}
        </div>

        {isMainAddress && currentAddresses.length === 0 && (
          <Alert>
            <Home className="h-4 w-4" />
            <AlertTitle>Adresse principale</AlertTitle>
            <AlertDescription>
              Définissez votre adresse principale. Cette adresse sera utilisée comme point de référence pour calculer les distances.
            </AlertDescription>
          </Alert>
        )}
        
        {showAddressForm && canAddAddress && (
          <AddressForm categoryId={selectedCategory} />
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
