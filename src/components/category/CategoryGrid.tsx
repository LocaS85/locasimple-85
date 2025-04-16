
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORIES } from '@/types/categories';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { getCategoryColorClass } from '@/utils/categoryColors';

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Animation variants for grid items
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

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'quotidien') {
      navigate('/quotidien');
    } else {
      navigate(`/categories/${categoryId}`);
    }
  };

  // Filter main categories for the grid
  const mainCategories = [
    'quotidien',
    'alimentation',
    'shopping',
    'services',
    'sante',
    'divertissement',
    'hebergement'
  ];
  
  const displayCategories = CATEGORIES.filter(cat => 
    mainCategories.includes(cat.id)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Explorer les catégories
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        Choisissez parmi nos catégories pour trouver exactement ce que vous cherchez
      </p>
      
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {displayCategories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 ${getCategoryColorClass(category.id)}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="mb-4 text-4xl">
                {getCategoryIcon(category.id, "w-16 h-16")}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryGrid;
