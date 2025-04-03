
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { getCategoryColorClass } from '@/utils/categoryColors';

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/categories/${categoryId}`);
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-3d">{t('chooseCategory') || 'Choisissez une catégorie'}</h1>
      
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-900 text-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xl"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="p-8 flex flex-col items-center text-center relative h-full">
              <div className="mb-6 transform translate-z-10 text-5xl">
                {getCategoryIcon(category.id, {
                  className: "w-16 h-16", 
                  color: getCategoryTextColor(category.id)
                })}
              </div>
              <h3 className="text-xl font-semibold transform translate-z-10">
                {t(category.name) || category.name}
              </h3>
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-900/90"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Helper function to get text color for each category
const getCategoryTextColor = (categoryId: string): string => {
  switch(categoryId) {
    case 'alimentation': return '#f97316'; // orange-500
    case 'divertissement': return '#3b82f6'; // blue-500
    case 'sante': return '#ef4444'; // red-500
    case 'travail': return '#8b5cf6'; // violet-500
    case 'shopping': return '#22c55e'; // green-500
    case 'education': return '#eab308'; // yellow-500
    case 'home': return '#ec4899'; // pink-500
    case 'hotel': return '#06b6d4'; // cyan-500
    default: return '#f8fafc'; // slate-50
  }
};

export default CategoryGrid;
