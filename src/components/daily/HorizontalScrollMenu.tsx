
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
    <div className="flex items-center mr-1">
      <Button
        variant="ghost"
        size="icon"
        disabled={isFirstItemVisible}
        onClick={() => scrollPrev()}
        className="cursor-pointer h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
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
    <div className="flex items-center ml-1">
      <Button
        variant="ghost"
        size="icon"
        disabled={isLastItemVisible}
        onClick={() => scrollNext()}
        className="cursor-pointer h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Composant pour chaque élément du menu
interface CategoryItemProps {
  itemId: string;
  category: DailyCategory | { id: null; name: string; color: string; };
  isActive: boolean;
  onClick: () => void;
}

function CategoryItem({ itemId, category, isActive, onClick }: CategoryItemProps) {
  return (
    <div className="mx-2" key={itemId}>
      <Button 
        variant={isActive ? "default" : "outline"}
        size="sm"
        onClick={onClick}
        className={`flex-shrink-0 whitespace-nowrap px-4 min-w-20 transition-all ${
          isActive ? 'shadow-md' : 'hover:shadow-sm'
        }`}
        style={category.id ? { borderLeft: `3px solid ${category.color}` } : {}}
      >
        {category.name}
      </Button>
    </div>
  );
}

// Composant pour le bouton "Nouveau groupe"
function AddCategoryItem({ onClick, itemId }: { itemId: string; onClick: () => void }) {
  return (
    <div className="mx-2" key={itemId}>
      <Button 
        variant="outline"
        size="sm"
        onClick={onClick}
        className="flex-shrink-0 whitespace-nowrap min-w-28 bg-white/70 hover:bg-white/90 transition-all"
      >
        <Plus className="h-4 w-4 mr-1" />
        Nouveau groupe
      </Button>
    </div>
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
  const allCategory = { id: null, name: 'Tous', color: '#6b7280' };
  
  return (
    <div className="w-full relative mb-5 py-1">
      <ScrollMenu 
        LeftArrow={LeftArrow} 
        RightArrow={RightArrow}
        options={{ 
          ratio: 0.9, 
          rootMargin: '0px',
          threshold: [0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] 
        }}
      >
        <CategoryItem
          itemId="all"
          category={allCategory}
          isActive={activeCategory === null}
          onClick={() => onCategorySelect(null)}
        />
        
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            itemId={category.id}
            category={category}
            isActive={category.id === activeCategory}
            onClick={() => onCategorySelect(category.id)}
          />
        ))}
        
        <AddCategoryItem 
          itemId="add-new"
          onClick={onAddCategory}
        />
      </ScrollMenu>
    </div>
  );
};

export default HorizontalScrollMenu;
