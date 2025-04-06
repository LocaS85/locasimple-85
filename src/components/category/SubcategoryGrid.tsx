
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DAILY_SEARCH_CATEGORIES, SearchFilters } from '@/types/dailySearchCategories';
import SubCategoryTile from './SubCategoryTile';
import EnhancedMapComponent from '../map/EnhancedMapComponent';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SubcategoryGrid = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    radius: 5,
    unit: 'km',
    transport: 'driving',
    openNow: false
  });
  
  // Find the current category based on the route parameter
  const currentCategory = DAILY_SEARCH_CATEGORIES.find(cat => cat.id === categoryId);
  
  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  };
  
  const handleSearch = () => {
    if (!selectedSubcategory) {
      toast.error('Veuillez sélectionner une sous-catégorie');
      return;
    }
    
    // Navigate to search page with parameters
    const searchParams = new URLSearchParams({
      category: categoryId || '',
      subcategory: selectedSubcategory,
      radius: String(filters.radius),
      transport: filters.transport,
      unit: filters.unit,
      openNow: String(filters.openNow)
    });
    
    navigate(`/categories/search?${searchParams.toString()}`);
  };
  
  // If category not found, show error and return to categories
  if (!currentCategory) {
    useEffect(() => {
      toast.error('Catégorie non trouvée');
      navigate('/categories');
    }, []);
    
    return null;
  }
  
  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <button 
          onClick={() => navigate('/categories')}
          className="text-blue-500 flex items-center gap-2 mb-4"
        >
          &larr; Retour aux catégories
        </button>
        
        <h1 className="text-2xl font-bold mb-2" style={{ color: currentCategory.color }}>
          {currentCategory.name}
        </h1>
        <p className="text-gray-600">
          Sélectionnez une sous-catégorie pour votre recherche
        </p>
      </header>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {currentCategory.subcategories.map(subcategory => (
          <SubCategoryTile
            key={subcategory.id}
            subcategory={subcategory}
            isSelected={selectedSubcategory === subcategory.id}
            onSelect={handleSubcategorySelect}
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          onClick={handleSearch}
          disabled={!selectedSubcategory}
          className="px-8 py-2"
        >
          Rechercher
        </Button>
      </div>
    </div>
  );
};

export default SubcategoryGrid;
