
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';
import { getCategoryIcon } from '@/utils/categoryIcons';

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/categories/${categoryId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('chooseCategory') || 'Choisissez une catégorie'}</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="mb-4 text-primary">
                {getCategoryIcon(category.id)}
              </div>
              <h3 className="text-lg font-semibold">{t(category.name) || category.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
