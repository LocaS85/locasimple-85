
import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryGrid from '@/components/category/CategoryGrid';
import SubcategoryGrid from '@/components/category/SubcategoryGrid';
import CategorySearch from '@/components/category/CategorySearch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES } from '@/types/categories';
import { getCategoryIcon } from '@/utils/categoryIcons';

const Categories = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };
  
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  // Handle category navigation
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/categories/${categoryId}`);
  };
  
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-4"
    >
      <div className="container mx-auto px-4 pb-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Catégories</h1>
          
          <div className="flex justify-between items-center">
            <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
              <TabsList>
                <TabsTrigger value="grid">Grille</TabsTrigger>
                <TabsTrigger value="list">Liste</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <button 
              onClick={() => navigate('/categories/search')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Rechercher
            </button>
          </div>
        </header>
        
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<CategoryGrid />} />
            <Route path="/search" element={<CategorySearch />} />
            <Route path="/:categoryId" element={<SubcategoryGrid />} />
          </Routes>
        </AnimatePresence>
        
        {location.pathname === '/' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <h2 className="text-lg font-semibold mb-4">Toutes les catégories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {CATEGORIES.map((category) => {
                const IconComponent = typeof category.icon === 'function' 
                  ? category.icon 
                  : getCategoryIcon(category.id);
                
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCategoryClick(category.id)}
                    className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      {React.isValidElement(IconComponent) ? (
                        IconComponent
                      ) : typeof IconComponent === 'function' ? (
                        <IconComponent size={24} className="text-primary" />
                      ) : (
                        getCategoryIcon(category.id, "w-6 h-6 text-primary")
                      )}
                    </div>
                    <span className="font-medium text-center">{category.name}</span>
                    {category.subCategories && (
                      <span className="text-xs text-gray-500 mt-1">
                        {category.subCategories.length} sous-catégories
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Categories;
