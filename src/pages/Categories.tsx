
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import CategoryGrid from '@/components/category/CategoryGrid';
import SubcategoryGrid from '@/components/category/SubcategoryGrid';
import CategorySearch from '@/components/category/CategorySearch';

const Categories = () => {
  const location = useLocation();
  
  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };
  
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3
  };
  
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <Routes>
        <Route path="/" element={<CategoryGrid />} />
        <Route path="/search" element={<CategorySearch />} />
        <Route path="/:categoryId" element={<SubcategoryGrid />} />
      </Routes>
    </motion.div>
  );
};

export default Categories;
