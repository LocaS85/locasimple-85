
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORIES } from '@/types/categories';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { getCategoryColorClass } from '@/utils/categoryColors';
import { Users, Briefcase, Heart, ShoppingBag, Utensils, Film, Hotel, Home } from 'lucide-react';

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

  // Icon mapping function to get Lucide icons
  const getCategoryLucideIcon = (categoryId: string) => {
    switch(categoryId) {
      case 'quotidien':
        return <Users className="w-12 h-12 text-white" />;
      case 'alimentation':
        return <Utensils className="w-12 h-12 text-white" />;
      case 'shopping':
        return <ShoppingBag className="w-12 h-12 text-white" />;
      case 'services':
        return <Briefcase className="w-12 h-12 text-white" />;
      case 'sante':
        return <Heart className="w-12 h-12 text-white" />;
      case 'divertissement':
        return <Film className="w-12 h-12 text-white" />;
      case 'hebergement':
        return <Hotel className="w-12 h-12 text-white" />;
      default:
        return <Home className="w-12 h-12 text-white" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-2 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Explorer les catégories
      </motion.h1>
      <motion.p 
        className="text-center text-gray-600 dark:text-gray-300 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Choisissez parmi nos catégories pour trouver exactement ce que vous cherchez
      </motion.p>
      
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
            className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-all duration-300`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className={`mb-4 text-4xl p-4 rounded-full ${getCategoryColorClass(category.id)}`}>
                {getCategoryLucideIcon(category.id)}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {category.subCategories && category.subCategories.length > 0
                  ? `${category.subCategories.length} options`
                  : 'Explorez cette catégorie'}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryGrid;
