
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getCategoryIconColorClass } from '@/utils/categoryColorUtils';
import { SubCategory } from '@/types/categories';
import { NavigateFunction } from 'react-router-dom';

interface SubcategoryCardProps {
  subCategory: SubCategory;
  categoryId: string;
  onNavigate: NavigateFunction;
  t: (key: string) => string;
}

const SubcategoryCard: React.FC<SubcategoryCardProps> = ({ 
  subCategory, 
  categoryId,
  onNavigate,
  t
}) => {
  const hasChildren = subCategory.children && subCategory.children.length > 0;
  
  // Animation variants
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
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
        <div 
          className={`p-4 sm:p-6 flex flex-col h-full ${
            hasChildren ? 'cursor-default' : 'cursor-pointer'
          }`}
          onClick={!hasChildren ? () => onNavigate(`/search?category=${subCategory.id}`) : undefined}
        >
          <div className="flex items-center mb-3 sm:mb-4">
            <div className={`mr-3 text-3xl sm:text-4xl ${getCategoryIconColorClass(subCategory.id)}`}>
              {/* Icon will be determined by category utility functions */}
              {subCategory.id.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-base sm:text-lg font-semibold">{t(subCategory.name) || subCategory.name}</h3>
          </div>
          
          {hasChildren && (
            <>
              <Separator className="my-2 sm:my-3" />
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                {subCategory.children.map(child => (
                  <Button
                    key={child.id}
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-full hover:bg-primary hover:text-white transition-colors mb-1"
                    onClick={() => onNavigate(`/search?category=${child.id}`)}
                  >
                    {t(child.name) || child.name}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default SubcategoryCard;
