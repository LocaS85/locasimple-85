
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';

interface CategoryGridProps {
  onCategorySelect?: (category: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else {
      // Default behavior is to navigate
      navigate(`/search?category=${categoryId}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10">
      <h1 className="text-2xl font-bold mb-5 text-center">{t('selectCategory') || 'Choisissez une catégorie'}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`
              bg-white p-5 rounded-2xl flex flex-col items-center justify-center
              shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer
              hover:bg-opacity-90 ${getCategoryColorClass(category.id)}
            `}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="text-3xl mb-3">
              <category.icon size={32} className={getCategoryIconColorClass(category.id)} />
            </div>
            <span className="font-bold text-sm">{t(category.name) || category.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const getCategoryColorClass = (categoryId: string): string => {
  switch (categoryId) {
    case 'alimentation':
      return 'hover:bg-orange-200';
    case 'divertissement':
      return 'hover:bg-blue-200';
    case 'sante':
      return 'hover:bg-red-200';
    case 'travail':
      return 'hover:bg-purple-200';
    case 'education':
      return 'hover:bg-yellow-200';
    case 'shopping':
      return 'hover:bg-green-200';
    case 'hotel':
      return 'hover:bg-cyan-200';
    default:
      return 'hover:bg-gray-200';
  }
};

const getCategoryIconColorClass = (categoryId: string): string => {
  switch (categoryId) {
    case 'alimentation':
      return 'text-orange-600';
    case 'divertissement':
      return 'text-blue-600';
    case 'sante':
      return 'text-red-600';
    case 'travail':
      return 'text-purple-600';
    case 'education':
      return 'text-yellow-600';
    case 'shopping':
      return 'text-green-600';
    case 'hotel':
      return 'text-cyan-600';
    default:
      return 'text-gray-600';
  }
};

export default CategoryGrid;
