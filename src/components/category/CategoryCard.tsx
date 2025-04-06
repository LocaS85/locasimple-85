
import React from 'react';
import { motion } from 'framer-motion';
import { getCategoryIconColorClass } from '@/utils/categoryColorUtils';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: React.ElementType;
    link?: string;
  };
  onClick: (categoryId: string, link?: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  // Animation variants for item
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
    <motion.div
      variants={itemVariants}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
      onClick={() => onClick(category.id, category.link)}
    >
      <div className="p-6 flex flex-col items-center text-center">
        <div className={`mb-4 text-4xl ${getCategoryIconColorClass(category.id)}`}>
          {React.createElement(category.icon, { size: 48 })}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {category.name}
        </h3>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
