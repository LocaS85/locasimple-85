
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

interface CategoriesScrollerProps {
  categories: Category[];
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

const CategoriesScroller: React.FC<CategoriesScrollerProps> = ({
  categories,
  onCategorySelect,
  selectedCategory
}) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      // Check initial scroll state
      checkScroll();
      
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Handle subcategory display based on selected category
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [currentSubcategories, setCurrentSubcategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const subcategories: Record<string, string[]> = {
    'restaurants': ['Français', 'Italien', 'Asiatique', 'Vegan', 'Fast Food'],
    'bars': ['Cocktail', 'Rooftop', 'Bière artisanale', 'Karaoké'],
    'culture': ['Cinéma', 'Théâtre', 'Musée', 'Galerie', 'Concert'],
    'nature': ['Parc', 'Plage', 'Lac', 'Montagne'],
    'hebergement': ['Hôtel', 'Auberge', 'Appartement', 'Camping']
  };

  useEffect(() => {
    if (selectedCategory && subcategories[selectedCategory]) {
      setCurrentSubcategories(subcategories[selectedCategory]);
      setShowSubcategories(true);
    } else {
      setShowSubcategories(false);
      setSelectedSubcategory(null);
    }
  }, [selectedCategory]);

  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory === selectedSubcategory ? null : subcategory);
    console.log("Recherche en cours pour :", subcategory);
  };

  return (
    <div className="relative mb-4">
      {/* Main categories */}
      <div className="relative">
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md"
            onClick={scrollLeft}
          >
            <ChevronLeft size={20} />
          </Button>
        )}
        
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto py-2 px-2 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex-shrink-0 mx-1 px-4 py-2 rounded-full cursor-pointer transition-all duration-200
                ${selectedCategory === category.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white hover:bg-gray-100 border border-gray-300'}`}
              onClick={() => onCategorySelect(selectedCategory === category.id ? null : category.id)}
            >
              <div className="flex items-center space-x-2">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md"
            onClick={scrollRight}
          >
            <ChevronRight size={20} />
          </Button>
        )}
      </div>

      {/* Subcategories */}
      {showSubcategories && (
        <div className="mt-2 overflow-x-auto flex hide-scrollbar p-2" id="subcategories">
          {currentSubcategories.map((subcategory, index) => (
            <div
              key={index}
              className={`subcategory-item mr-2 ${selectedSubcategory === subcategory ? 'active' : ''}`}
              onClick={() => handleSubcategoryClick(subcategory)}
            >
              {subcategory}
            </div>
          ))}
        </div>
      )}

      {/* Add CSS for subcategories */}
      <style jsx>{`
        .subcategory-item {
          flex: 0 0 auto;
          padding: 8px 15px;
          border-radius: 20px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease-in-out;
          border: 1px solid transparent;
        }

        .subcategory-item:hover {
          background: var(--secondary-color, #6b7280);
          color: white;
        }

        .subcategory-item.active {
          background: var(--primary-color, #3b82f6);
          color: white;
          border-color: var(--secondary-color, #6b7280);
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoriesScroller;
