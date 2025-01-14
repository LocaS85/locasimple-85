import React from 'react';
import { useCategory } from './CategoryContext';
import { CATEGORIES } from '@/types/categories';
import { AddressForm } from '@/components/AddressForm';
import { SubCategoryList } from '@/components/SubCategoryList';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const showAddressForm = ['famille', 'travail', 'ecole'].includes(selectedCategory);
  const currentAddresses = addresses[selectedCategory] || [];
  const canAddAddress = currentAddresses.length < 10;

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