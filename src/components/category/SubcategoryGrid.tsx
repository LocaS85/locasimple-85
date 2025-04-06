
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';
import { CATEGORIES } from '@/types/categories';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { getCategoryColorClass } from '@/utils/categoryColors';
import { getCategoryIconColorClass, getCategoryTextColor } from '@/utils/categoryColorUtils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import clsx from 'clsx';
import { getEntertainmentIcon } from '@/utils/icons/entertainmentIcons';
import { getHealthIcon } from '@/utils/icons/healthIcons';
import { getFoodCategoryIcon } from '@/utils/icons/foodIcons';
import { SubCategory } from '@/types/categories';

const SubcategoryGrid = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  const mainCategory = categories.find(cat => cat.id === categoryId);
  
  if (!category && !mainCategory) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Button variant="outline" onClick={() => navigate('/categories')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux catégories
        </Button>
        <h1 className="text-3xl font-bold mb-4">Catégorie non trouvée</h1>
        <p>La catégorie que vous recherchez n'existe pas.</p>
      </div>
    );
  }
  
  const subCategories = category?.subCategories || [];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  // Function to get the appropriate icon for a subcategory
  const getSubcategoryIcon = (subCategoryId: string) => {
    // For entertainment subcategories, use specific entertainment icons
    if (categoryId === 'divertissement') {
      return getEntertainmentIcon(subCategoryId, "w-16 h-16");
    }
    
    // For health subcategories, use specific health icons
    if (categoryId === 'sante') {
      return getHealthIcon(subCategoryId, "w-16 h-16");
    }
    
    // For food subcategories, use specific food icons
    if (categoryId === 'alimentation') {
      return getFoodCategoryIcon(subCategoryId, "w-16 h-16");
    }
    
    // For other categories, use the regular category icon
    return getCategoryIcon(subCategoryId, {
      className: "w-16 h-16",
      color: getCategoryTextColor(subCategoryId)
    });
  };
  
  // Helper function to render subcategories with their children
  const renderSubCategoryCard = (subCategory: SubCategory) => {
    const hasChildren = subCategory.children && subCategory.children.length > 0;
    const iconColor = getCategoryTextColor(subCategory.id);
    const bgColorClass = getCategoryColorClass(subCategory.id);
    
    return (
      <motion.div
        key={subCategory.id}
        variants={itemVariants}
        whileHover={{ 
          scale: 1.02,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        whileTap={{ scale: 0.98 }}
        className="w-full"
      >
        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
          <div 
            className={`p-6 flex flex-col h-full ${
              hasChildren ? 'cursor-default' : 'cursor-pointer'
            }`}
            onClick={!hasChildren ? () => navigate(`/search?category=${subCategory.id}`) : undefined}
          >
            <div className="flex items-center mb-4">
              <div className={`mr-3 text-4xl ${getCategoryIconColorClass(subCategory.id)}`}>
                {getSubcategoryIcon(subCategory.id)}
              </div>
              <h3 className="text-lg font-semibold">{t(subCategory.name) || subCategory.name}</h3>
            </div>
            
            {hasChildren && (
              <>
                <Separator className="my-3" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {subCategory.children.map(child => (
                    <Button
                      key={child.id}
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-full hover:bg-primary hover:text-white transition-colors"
                      onClick={() => navigate(`/search?category=${child.id}`)}
                    >
                      {t(child.name) || child.name}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/categories')} 
        className="mb-4 hover:scale-105 transform transition-all"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux catégories
      </Button>
      
      <h1 className="text-3xl font-bold mb-8 text-center">
        {mainCategory ? (t(mainCategory.name) || mainCategory.name) : (t(category?.name || '') || category?.name || '')}
      </h1>
      
      {subCategories.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {subCategories.map(renderSubCategoryCard)}
        </motion.div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400">Aucune sous-catégorie disponible.</p>
          <Button 
            className="mt-4 hover:scale-105 transform transition-all" 
            onClick={() => navigate(`/search?category=${categoryId}`)}
          >
            Rechercher dans cette catégorie
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubcategoryGrid;
