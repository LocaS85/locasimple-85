
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import CategoryGrid from '@/components/category/CategoryGrid';
import SubcategoryGrid from '@/components/category/SubcategoryGrid';
import CategorySearch from '@/components/category/CategorySearch';

const Categories = () => {
  const location = useLocation();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
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
