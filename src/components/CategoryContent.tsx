import React from 'react';
import { useCategory } from './CategoryContext';
import { CATEGORIES } from '@/types/categories';
import { AddressForm } from '@/components/AddressForm';
import { SubCategoryList } from '@/components/SubCategoryList';

export const CategoryContent = () => {
  const { selectedCategory } = useCategory();

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

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">{category.name}</h1>
      
      {showAddressForm && <AddressForm categoryId={selectedCategory} />}
      
      {category.subCategories && (
        <SubCategoryList 
          subCategories={category.subCategories}
          categoryId={selectedCategory}
        />
      )}
    </div>
  );
};