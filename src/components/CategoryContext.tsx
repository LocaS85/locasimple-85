
import React, { createContext, useContext, useState } from 'react';
import { Category, SubCategory, Address, TransportMode } from '@/types/categories';

interface CategoryContextType {
  selectedCategory: string | null;
  setSelectedCategory: (category: string) => void;
  addresses: Record<string, Address[]>;
  addAddress: (categoryId: string, address: Address) => void;
  removeAddress: (categoryId: string, addressId: string) => void;
  updateAddress: (categoryId: string, addressId: string, newAddress: Address) => void;
  categoryColors: Record<string, string>;
  updateCategoryColor: (categoryId: string, color: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Record<string, Address[]>>({});
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({
    'adresse-principale': '#8B5CF6',
    'famille': '#D946EF',
    'travail': '#F97316',
    'ecole': '#0EA5E9',
    'alimentation': '#1EAEDB',
    'achats': '#9b87f5',
    'services': '#7E69AB',
    'sante': '#6E59A5',
    'divertissement': '#F2FCE2',
    'hebergement': '#FEC6A1',
  });

  const addAddress = (categoryId: string, address: Address) => {
    setAddresses(prev => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), address].slice(0, 10)
    }));
  };

  const removeAddress = (categoryId: string, addressId: string) => {
    setAddresses(prev => ({
      ...prev,
      [categoryId]: prev[categoryId]?.filter(addr => addr.id !== addressId) || []
    }));
  };

  const updateAddress = (categoryId: string, addressId: string, newAddress: Address) => {
    setAddresses(prev => ({
      ...prev,
      [categoryId]: prev[categoryId]?.map(addr => 
        addr.id === addressId ? { ...addr, ...newAddress } : addr
      ) || []
    }));
  };

  const updateCategoryColor = (categoryId: string, color: string) => {
    setCategoryColors(prev => ({
      ...prev,
      [categoryId]: color
    }));
  };

  return (
    <CategoryContext.Provider value={{
      selectedCategory,
      setSelectedCategory,
      addresses,
      addAddress,
      removeAddress,
      updateAddress,
      categoryColors,
      updateCategoryColor,
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};
