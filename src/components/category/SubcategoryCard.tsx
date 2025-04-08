
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getCategoryIconColorClass } from '@/utils/categoryColorUtils';
import { SubCategory } from '@/types/categories';
import { NavigateFunction } from 'react-router-dom';
import { 
  Utensils, 
  ShoppingBag, 
  Briefcase, 
  Heart, 
  Film, 
  Hotel,
  Home
} from 'lucide-react';

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

  // Get the appropriate icon based on category ID
  const getIconForCategory = (id: string) => {
    switch(id.toLowerCase()) {
      case 'alimentation':
      case 'restaurants':
      case 'cafes':
      case 'bars':
        return <Utensils className={`h-5 w-5 ${getCategoryIconColorClass(id)}`} />;
      case 'shopping':
      case 'vetements':
      case 'electronique':
        return <ShoppingBag className={`h-5 w-5 ${getCategoryIconColorClass(id)}`} />;
      case 'services':
        return <Briefcase className={`h-5 w-5 ${getCategoryIconColorClass(id)}`} />;
      case 'sante':
        return <Heart className={`h-5 w-5 ${getCategoryIconColorClass(id)}`} />;
      case 'divertissement':
        return <Film className={`h-5 w-5 ${getCategoryIconColorClass(id)}`} />;
      case 'hebergement':
      case 'hotels':
        return <Hotel className={`h-5 w-5 ${getCategoryIconColorClass(id)}`} />;
      default:
        return <Home className={`h-5 w-5 ${getCategoryIconColorClass(id)}`} />;
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
            <div className="mr-3 flex-shrink-0">
              {getIconForCategory(subCategory.id)}
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold">{t(subCategory.name) || subCategory.name}</h3>
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
                    className="text-xs rounded-full hover:bg-primary hover:text-white transition-colors mb-1 px-2 py-1 h-auto"
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
