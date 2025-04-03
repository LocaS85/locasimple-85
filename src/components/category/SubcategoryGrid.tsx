
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';
import { CATEGORIES } from '@/types/categories';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { getCategoryColorClass } from '@/utils/categoryColors';
import { getCategoryTextColor } from '@/utils/categoryColorUtils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {subCategories.map((subCategory) => {
            // Get the appropriate color for the subcategory
            const iconColor = getCategoryTextColor(subCategory.id);
            const bgColorClass = getCategoryColorClass(subCategory.id);
            
            return (
              <motion.div
                key={subCategory.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                  "bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer",
                  "shadow-lg hover:shadow-xl transition-all duration-300"
                )}
                onClick={() => navigate(`/search?category=${subCategory.id}`)}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 text-5xl">
                    {/* Using getCategoryIcon with improved className and color handling */}
                    {getCategoryIcon(subCategory.id, {
                      className: "w-16 h-16",
                      color: iconColor
                    })}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    {t(subCategory.name) || subCategory.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
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
