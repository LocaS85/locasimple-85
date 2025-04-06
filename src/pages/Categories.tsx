
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CategoryGrid from '@/components/category/CategoryGrid';
import SubcategoryGrid from '@/components/category/SubcategoryGrid';

const Categories = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Routes>
        <Route path="/" element={<CategoryGrid />} />
        <Route path="/:categoryId" element={<SubcategoryGrid />} />
      </Routes>
    </motion.div>
  );
};

export default Categories;
