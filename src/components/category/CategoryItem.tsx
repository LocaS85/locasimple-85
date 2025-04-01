
import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '@/services/categoryService';

interface CategoryItemProps {
  category: Category;
  onClick: (category: Category) => void;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onClick,
  isHovered,
  onHoverStart,
  onHoverEnd
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        rotateY: 5,
        rotateX: 5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(category)}
      className="category-card relative overflow-hidden aspect-square"
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} z-0 transition-all duration-300`}></div>
      
      {category.image && (
        <motion.div 
          className="absolute inset-0 opacity-60"
          animate={{ 
            scale: isHovered ? 1.05 : 1 
          }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={category.image} 
            alt={category.type}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-3 z-10"
        initial={{ y: 10, opacity: 0.8 }}
        animate={{ 
          y: isHovered ? 0 : 5,
          opacity: isHovered ? 1 : 0.9
        }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-sm font-medium text-white">
          {category.name || category.type.charAt(0).toUpperCase() + category.type.slice(1)}
        </h3>
      </motion.div>
      
      {/* 3D effects - corner dots with parallax effect */}
      <motion.div 
        className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-70"
        animate={{ 
          x: isHovered ? 1 : 0,
          y: isHovered ? -1 : 0
        }}
      ></motion.div>
      <motion.div 
        className="absolute top-2 left-2 w-1.5 h-1.5 bg-white rounded-full opacity-70"
        animate={{ 
          x: isHovered ? -1 : 0,
          y: isHovered ? -1 : 0
        }}
      ></motion.div>
      
      {/* Additional 3D elements */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent"
        animate={{ 
          opacity: isHovered ? 0.4 : 0.2
        }}
      ></motion.div>
    </motion.div>
  );
};

export default CategoryItem;
