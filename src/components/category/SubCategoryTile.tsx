
import React from 'react';
import { motion } from 'framer-motion';
import { SubCategoryType } from '@/types/dailySearchCategories';

interface SubCategoryTileProps {
  subcategory: SubCategoryType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const SubCategoryTile: React.FC<SubCategoryTileProps> = ({ 
  subcategory, 
  isSelected, 
  onSelect 
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`p-4 rounded-lg cursor-pointer transition-colors ${
      isSelected ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white hover:bg-gray-50'
    }`}
    onClick={() => onSelect(subcategory.id)}
  >
    <div className="flex flex-col items-center">
      <div className="p-2 mb-2 text-blue-500">{subcategory.icon}</div>
      <span className="text-sm font-medium text-center">{subcategory.name}</span>
    </div>
  </motion.div>
);

export default SubCategoryTile;
