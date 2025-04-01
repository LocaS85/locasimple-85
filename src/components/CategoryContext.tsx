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
  categoryVisibility: Record<string, boolean>;
  toggleCategoryVisibility: (categoryId: string) => void;
  categoryNames: Record<string, string>;
  updateCategoryName: (categoryId: string, name: string) => void;
  customFields: Record<string, Array<{id: string, name: string, value: string}>>;
  addCustomField: (categoryId: string, field: {id: string, name: string, value: string}) => void;
  updateCustomField: (categoryId: string, fieldId: string, field: {name: string, value: string}) => void;
  removeCustomField: (categoryId: string, fieldId: string) => void;
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
    'divers': '#4ADE80',
  });
  const [categoryVisibility, setCategoryVisibility] = useState<Record<string, boolean>>({
    'adresse-principale': true,
    'famille': true,
    'travail': true,
    'ecole': true,
    'alimentation': true,
    'achats': true,
    'services': true,
    'sante': true,
    'divertissement': true,
    'hebergement': true,
    'divers': true,
  });
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({
    'adresse-principale': 'Adresse Principale',
    'famille': 'Famille',
    'travail': 'Travail',
    'ecole': 'École',
    'alimentation': 'Alimentation',
    'achats': 'Achats',
    'services': 'Services',
    'sante': 'Santé',
    'divertissement': 'Divertissement',
    'hebergement': 'Hébergement',
    'divers': 'Divers',
  });
  const [customFields, setCustomFields] = useState<Record<string, Array<{id: string, name: string, value: string}>>>({
    'divers': []
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

  const toggleCategoryVisibility = (categoryId: string) => {
    setCategoryVisibility(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const updateCategoryName = (categoryId: string, name: string) => {
    setCategoryNames(prev => ({
      ...prev,
      [categoryId]: name
    }));
  };

  const addCustomField = (categoryId: string, field: {id: string, name: string, value: string}) => {
    setCustomFields(prev => {
      const currentFields = prev[categoryId] || [];
      if (currentFields.length >= 10) return prev;

      return {
        ...prev,
        [categoryId]: [...currentFields, field]
      };
    });
  };

  const updateCustomField = (categoryId: string, fieldId: string, field: {name: string, value: string}) => {
    setCustomFields(prev => {
      const currentFields = prev[categoryId] || [];
      return {
        ...prev,
        [categoryId]: currentFields.map(f => 
          f.id === fieldId ? { ...f, ...field } : f
        )
      };
    });
  };

  const removeCustomField = (categoryId: string, fieldId: string) => {
    setCustomFields(prev => {
      const currentFields = prev[categoryId] || [];
      return {
        ...prev,
        [categoryId]: currentFields.filter(f => f.id !== fieldId)
      };
    });
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
      categoryVisibility,
      toggleCategoryVisibility,
      categoryNames,
      updateCategoryName,
      customFields,
      addCustomField,
      updateCustomField,
      removeCustomField,
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
