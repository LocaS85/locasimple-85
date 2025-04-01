
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Film, Heart, Briefcase } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface CategoryGridProps {
  onCategorySelect?: (category: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const navigate = useNavigate();
  
  const categories: CategoryItem[] = [
    {
      id: 'alimentation',
      name: 'Alimentation',
      icon: <Utensils size={32} />
    },
    {
      id: 'divertissement',
      name: 'Divertissement',
      icon: <Film size={32} />
    },
    {
      id: 'sante',
      name: 'Santé',
      icon: <Heart size={32} />
    },
    {
      id: 'travail',
      name: 'Travail',
      icon: <Briefcase size={32} />
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else {
      // Default behavior is to navigate
      navigate(`/search?category=${categoryId}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10">
      <h1 className="text-2xl font-bold mb-5 text-center">Choisissez une catégorie</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`
              bg-white p-5 rounded-2xl flex flex-col items-center justify-center
              shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer
              hover:bg-opacity-90 ${getCategoryHoverClass(category.id)}
            `}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="text-3xl mb-3">{category.icon}</div>
            <span className="font-bold text-sm">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getCategoryHoverClass = (categoryId: string): string => {
  switch (categoryId) {
    case 'alimentation':
      return 'hover:bg-orange-200';
    case 'divertissement':
      return 'hover:bg-blue-200';
    case 'sante':
      return 'hover:bg-red-200';
    case 'travail':
      return 'hover:bg-purple-200';
    default:
      return '';
  }
};

export default CategoryGrid;
