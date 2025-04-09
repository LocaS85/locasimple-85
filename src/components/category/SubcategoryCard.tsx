
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { SubCategory } from '@/types/categories';
import { NavigateFunction } from 'react-router-dom';
import { getHealthIcon } from '@/utils/icons/healthIcons';
import { getFoodCategoryIcon } from '@/utils/icons/foodIcons';
import { getServicesIcon } from '@/utils/icons/servicesIcons';
import { getEntertainmentIcon } from '@/utils/icons/entertainmentIcons';
import { getAccommodationIcon } from '@/utils/icons/accommodationIcons';
import { 
  Home,
  Coffee,
  ShoppingCart,
  Shirt,
  Smartphone,
  Package,
  Gift,
  Palette,
  BookOpen,
  Gem,
  Glasses,
  Dumbbell,
  Flower,
  Scissors,
  Sparkles,
  Car,
  Search
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

  const getIconForCategory = (id: string) => {
    // Vérifier d'abord les icônes spécifiques par catégorie parente
    if (categoryId === 'sante') {
      return getHealthIcon(id, "h-5 w-5");
    }
    
    if (categoryId === 'alimentation') {
      return getFoodCategoryIcon(id, "h-5 w-5");
    }
    
    if (categoryId === 'services') {
      return getServicesIcon(id, "h-5 w-5");
    }
    
    if (categoryId === 'divertissement') {
      return getEntertainmentIcon(id, "h-5 w-5");
    }
    
    if (categoryId === 'hebergement') {
      return getAccommodationIcon(id, "h-5 w-5");
    }

    // Fallback pour les autres catégories
    switch(id.toLowerCase()) {
      case 'cafes':
        return <Coffee className="h-5 w-5 text-amber-700" />;
      case 'shopping':
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case 'vetements':
        return <Shirt className="h-5 w-5 text-purple-600" />;
      case 'electronique':
        return <Smartphone className="h-5 w-5 text-gray-700" />;
      case 'chaussures':
        return <Package className="h-5 w-5 text-amber-600" />;
      case 'cadeaux':
        return <Gift className="h-5 w-5 text-red-500" />;
      case 'art':
        return <Palette className="h-5 w-5 text-teal-500" />;
      case 'librairies':
        return <BookOpen className="h-5 w-5 text-amber-800" />;
      case 'bijouteries':
        return <Gem className="h-5 w-5 text-yellow-500" />;
      case 'opticiens-achats':
        return <Glasses className="h-5 w-5 text-blue-700" />;
      case 'sport':
        return <Dumbbell className="h-5 w-5 text-emerald-600" />;
      case 'fleuristes':
        return <Flower className="h-5 w-5 text-pink-400" />;
      case 'parfumeries':
        return <Sparkles className="h-5 w-5 text-violet-400" />;
      case 'coiffeurs':
        return <Scissors className="h-5 w-5 text-cyan-600" />;
      case 'automobile':
        return <Car className="h-5 w-5 text-slate-600" />;
      default:
        return <Search className="h-5 w-5 text-slate-500" />;
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
