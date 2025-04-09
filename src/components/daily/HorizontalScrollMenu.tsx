
import React, { useContext } from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { DailyCategoryType, DailyCategory } from '@/types/dailyCategories';

// Définition des props pour le composant
interface HorizontalScrollMenuProps {
  categories: DailyCategory[];
  activeCategory: DailyCategoryType | null;
  onCategorySelect: (categoryId: DailyCategoryType | null) => void;
  onAddCategory: () => void;
  onEditCategory?: (categoryId: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

// Composant pour les flèches de navigation à gauche
function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        disabled={isFirstItemVisible}
        onClick={() => scrollPrev()}
        className="cursor-pointer h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Composant pour les flèches de navigation à droite
function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        disabled={isLastItemVisible}
        onClick={() => scrollNext()}
        className="cursor-pointer h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Composant pour chaque élément du menu
interface CategoryItemProps {
  category: DailyCategory | { id: null; name: string; color: string; };
  isActive: boolean;
  onClick: () => void;
}

function CategoryItem({ category, isActive, onClick }: CategoryItemProps) {
  return (
    <Button 
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="flex-shrink-0 mx-1 whitespace-nowrap"
      style={category.id ? { borderLeft: `3px solid ${category.color}` } : {}}
    >
      {category.name}
    </Button>
  );
}

// Composant principal de menu horizontal défilant
const HorizontalScrollMenu: React.FC<HorizontalScrollMenuProps> = ({
  categories,
  activeCategory,
  onCategorySelect,
  onAddCategory
}) => {
  
  // Préparation des éléments du menu avec "Tous" en premier
  const allMenuItems = [
    { id: null, name: 'Tous', color: '#6b7280' },
    ...categories
  ];
  
  return (
    <div className="w-full relative mb-4">
      <ScrollMenu 
        LeftArrow={LeftArrow} 
        RightArrow={RightArrow}
        options={{ 
          ratio: 0.9, 
          rootMargin: '0px',
          threshold: [0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] 
        }}
      >
        {allMenuItems.map((category) => (
          <CategoryItem
            key={category.id || 'all'}
            itemId={category.id || 'all'}
            category={category}
            isActive={category.id === activeCategory || (category.id === null && activeCategory === null)}
            onClick={() => onCategorySelect(category.id)}
          />
        ))}
        
        {/* Bouton pour ajouter une nouvelle catégorie */}
        <Button 
          variant="ghost"
          size="sm"
          onClick={onAddCategory}
          className="flex-shrink-0 mx-1 whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nouveau groupe
        </Button>
      </ScrollMenu>
    </div>
  );
};

export default HorizontalScrollMenu;
