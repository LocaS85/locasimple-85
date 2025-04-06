import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';
import { getCategoryIconColorClass } from '@/utils/categoryColorUtils';
import CategoryCard from '@/components/category/CategoryCard';

const CategoryGrid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  const handleCategoryClick = (categoryId: string, link?: string) => {
    // If it's the 'quotidien' category, navigate to the dedicated page
    if (categoryId === 'quotidien') {
      navigate('/quotidien');
    } else if (link && link.includes('/search')) {
      // If the link contains '/search', navigate directly to the search page
      navigate(link);
    } else {
      // Otherwise, navigate to the subcategories page
      navigate(`/categories/${categoryId}`);
    }
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
      <h1 className="text-3xl font-bold mb-6 text-center font-heading">
        Explorer les catégories
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8 font-worksans">
        Choisissez parmi nos catégories pour trouver exactement ce que vous cherchez
      </p>
      
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category) => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            onClick={handleCategoryClick}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryGrid;
