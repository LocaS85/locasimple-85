
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryGrid from '@/components/category/CategoryGrid';
import SubcategoryGrid from '@/components/category/SubcategoryGrid';
import CategorySearch from '@/components/category/CategorySearch';

const Categories = () => {
  const location = useLocation();
  
  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };
  
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };
  
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-4"
    >
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<CategoryGrid />} />
          <Route path="/search" element={<CategorySearch />} />
          <Route path="/:categoryId" element={<SubcategoryGrid />} />
        </Routes>
      </AnimatePresence>
    </motion.div>
  );
};

export default Categories;
