
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';
import { MapPin } from 'lucide-react';

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

  // Function to get color based on category ID
  const getCategoryColor = (categoryId: string): string => {
    switch(categoryId) {
      case 'alimentation': return 'text-orange-500';
      case 'divertissement': return 'text-blue-500';
      case 'sante': return 'text-red-500';
      case 'travail': return 'text-purple-500';
      case 'shopping': return 'text-green-500';
      case 'education': return 'text-yellow-500';
      case 'home': return 'text-pink-500';
      case 'hotel': return 'text-cyan-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {t('chooseCategory') || 'Choisissez une catégorie'}
      </h1>
      
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer shadow-lg"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="p-8 flex flex-col items-center text-center">
              <div className={`mb-4 ${getCategoryColor(category.id)}`}>
                <MapPin size={48} />
              </div>
              <h3 className="text-xl font-medium text-white">
                {t(category.name) || category.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryGrid;
