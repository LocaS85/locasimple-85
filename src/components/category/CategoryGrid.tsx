
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-3d">{t('chooseCategory') || 'Choisissez une catégorie'}</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ 
              scale: 1.05,
              rotateX: '2deg',
              rotateY: '2deg',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            }}
            whileTap={{ scale: 0.98 }}
            className={`category-card preserve-3d perspective-1000 overflow-hidden cursor-pointer transition-all duration-300 ${getCategoryColorClass(category.id)}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="p-8 flex flex-col items-center text-center relative h-full">
              <div className="mb-6 text-white transform translate-z-10 text-4xl">
                {getCategoryIcon(category.id)}
              </div>
              <h3 className="text-xl font-semibold text-white transform translate-z-10">{t(category.name) || category.name}</h3>
              <div className="gradient-overlay"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
