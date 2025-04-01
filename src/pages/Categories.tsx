
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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10 
      }
    }
  };

  return (
    <div className="min-h-screen bg-app-dark text-white p-4">
      {/* Header with 3D animation */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="hover:scale-110 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <motion.h1 
            className="text-xl font-heading font-semibold ml-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Category
          </motion.h1>
        </div>
        <div className="flex space-x-2">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="inline-block"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/search')}
              className="hover:scale-110 transition-transform"
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div 
            whileHover={{ rotate: -10 }}
            className="inline-block"
          >
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:scale-110 transition-transform"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Category Pills/Buttons at top with 3D effect */}
      <motion.div 
        className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categoryTypes.map((type, index) => (
          <motion.div
            key={type}
            variants={itemVariants}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => handleFilterClick(type)}
              variant={activeFilter === type ? "default" : "outline"}
              className={`rounded-full text-xs py-1 px-3 h-auto ${activeFilter === type ? "bg-app-secondary shadow-lg shadow-app-secondary/20" : "bg-app-gray"}`}
            >
              {t(type) || type}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter Buttons with 3D hover effect */}
      <motion.div 
        className="mb-5 space-y-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filterButtons.map((filter, index) => (
          <motion.div
            key={filter.id}
            variants={filterVariants}
            whileHover={{ 
              scale: 1.02, 
              x: 5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
            whileTap={{ scale: 0.98 }}
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
      </motion.div>

      {/* Category Grid with 3D cards and effects */}
      <motion.div 
        className="grid grid-cols-2 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              rotateY: 5,
              rotateX: 5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(category.id, category.type)}
            className="category-card relative overflow-hidden"
            onHoverStart={() => setHoveredCard(category.id)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} z-0 transition-all duration-300`}></div>
            
            {category.image && (
              <motion.div 
                className="absolute inset-0 opacity-60"
                animate={{ 
                  scale: hoveredCard === category.id ? 1.05 : 1 
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
                y: hoveredCard === category.id ? 0 : 5,
                opacity: hoveredCard === category.id ? 1 : 0.9
              }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-sm font-medium text-white">{category.type.charAt(0).toUpperCase() + category.type.slice(1)}</h3>
            </motion.div>
            
            {/* 3D effects - corner dots with parallax effect */}
            <motion.div 
              className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-70"
              animate={{ 
                x: hoveredCard === category.id ? 1 : 0,
                y: hoveredCard === category.id ? -1 : 0
              }}
            ></motion.div>
            <motion.div 
              className="absolute top-2 left-2 w-1.5 h-1.5 bg-white rounded-full opacity-70"
              animate={{ 
                x: hoveredCard === category.id ? -1 : 0,
                y: hoveredCard === category.id ? -1 : 0
              }}
            ></motion.div>
            
            {/* Additional 3D elements */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent"
              animate={{ 
                opacity: hoveredCard === category.id ? 0.4 : 0.2
              }}
            ></motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom circle buttons with 3D pop effect */}
      <div className="fixed bottom-4 left-0 right-0">
        <motion.div 
          className="flex justify-center space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {["gray", "light", "red", "beige"].map((color, index) => (
            <motion.button
              key={color}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ 
                scale: 1.2, 
                y: -5,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.9 }}
              className={`w-8 h-8 rounded-full ${
                color === "gray" ? "bg-app-gray" :
                color === "light" ? "bg-gray-300" :
                color === "red" ? "bg-app-secondary" : "bg-amber-200"
              } shadow-md`}
            ></motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;
