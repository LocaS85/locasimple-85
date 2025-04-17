
import { createContext, useState, ReactNode } from 'react';
import { Category, Subcategory } from '@/types/categoryTypes';

// Définition du type pour le contexte
interface CategoryContextType {
  categories: Category[];
  selectedCategory: Category | null;
  selectedSubcategory: Subcategory | null;
  setCategories: (categories: Category[]) => void;
  setSelectedCategory: (category: Category | null) => void;
  setSelectedSubcategory: (subcategory: Subcategory | null) => void;
}

// Création du contexte avec une valeur par défaut
export const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  selectedCategory: null,
  selectedSubcategory: null,
  setCategories: () => {},
  setSelectedCategory: () => {},
  setSelectedSubcategory: () => {},
});

// Props du provider
interface CategoryProviderProps {
  children: ReactNode;
}

// Provider qui encapsule l'application
export const CategoryProvider = ({ children }: CategoryProviderProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        selectedCategory,
        selectedSubcategory,
        setCategories,
        setSelectedCategory,
        setSelectedSubcategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
