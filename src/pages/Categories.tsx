
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Search, ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Main category types
const categoryTypes = ['restaurants', 'shopping', 'entertainment'];

// Category data matching the UI in the image
const categories = [
  { id: 'restaurants-1', type: 'restaurants', image: null, color: 'from-app-gray to-app-primary' },
  { id: 'restaurants-2', type: 'restaurants', image: '/lovable-uploads/ee881492-135d-48dc-bbda-6ada8828a366.png', color: 'from-app-gray to-app-primary' },
  { id: 'shopping-1', type: 'shopping', image: null, color: 'from-app-gray to-app-primary' },
  { id: 'shopping-2', type: 'shopping', image: null, color: 'from-amber-200 to-amber-400' },
  { id: 'shopping-3', type: 'shopping', image: null, color: 'from-app-secondary to-red-500' },
  { id: 'shopping-4', type: 'shopping', image: null, color: 'from-stone-300 to-stone-500' },
  { id: 'entertainment-1', type: 'entertainment', image: '/lovable-uploads/ee881492-135d-48dc-bbda-6ada8828a366.png', color: 'from-app-gray to-app-primary' },
  { id: 'entertainment-2', type: 'entertainment', image: null, color: 'from-app-gray to-app-primary' },
  { id: 'entertainment-3', type: 'entertainment', image: null, color: 'from-amber-100 to-amber-300' },
  { id: 'entertainment-4', type: 'entertainment', image: null, color: 'from-zinc-200 to-zinc-400' },
];

// Filters matching the UI in the image
const filterButtons = [
  { id: 'shopping', label: 'Shopping' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'restaurants', label: 'Restaurants' }
];

const Categories = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter categories based on active filter
  const filteredCategories = activeFilter 
    ? categories.filter(cat => cat.type === activeFilter)
    : categories;

  const handleCategoryClick = (categoryId: string, categoryType: string) => {
    setSelectedCategory(categoryId);
    // Navigate to search page with category filter
    setTimeout(() => {
      navigate(`/search?category=${categoryType}`);
    }, 300);
  };

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
  };

  return (
    <div className="min-h-screen bg-app-dark text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-heading font-semibold ml-2">Category</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/search')}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Category Pills/Buttons at top */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {categoryTypes.map((type, index) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={() => handleFilterClick(type)}
              variant={activeFilter === type ? "default" : "outline"}
              className={`rounded-full text-xs py-1 px-3 h-auto ${activeFilter === type ? "bg-app-secondary" : "bg-app-gray"}`}
            >
              {t(type) || type}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="mb-5 space-y-2">
        {filterButtons.map((filter, index) => (
          <motion.div
            key={filter.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={() => handleFilterClick(filter.id)}
              variant="outline"
              className={`w-full justify-start rounded-xl bg-app-gray border-none h-9 text-xs ${
                activeFilter === filter.id ? "ring-1 ring-white" : ""
              }`}
            >
              {filter.label}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.03, translateY: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(category.id, category.type)}
            className="category-card relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} z-0`}></div>
            
            {category.image && (
              <div className="absolute inset-0 opacity-60">
                <img 
                  src={category.image} 
                  alt={category.type}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
              <h3 className="text-sm font-medium text-white">{category.type.charAt(0).toUpperCase() + category.type.slice(1)}</h3>
            </div>
            
            {/* Small dots in corners to mimic the UI in the image */}
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
          </motion.div>
        ))}
      </div>

      {/* Bottom circle buttons */}
      <div className="fixed bottom-4 left-0 right-0">
        <div className="flex justify-center space-x-3">
          {["gray", "light", "red", "beige"].map((color, index) => (
            <motion.button
              key={color}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`w-8 h-8 rounded-full ${
                color === "gray" ? "bg-app-gray" :
                color === "light" ? "bg-gray-300" :
                color === "red" ? "bg-app-secondary" : "bg-amber-200"
              } shadow-md`}
            ></motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
