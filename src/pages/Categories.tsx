
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CategorySidebar } from '@/components/CategorySidebar';
import { CategoryContent } from '@/components/CategoryContent';
import { CategoryProvider } from '@/components/CategoryContext';
import { SidebarProvider } from '@/components/ui/sidebar';

const Categories = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <CategoryProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <Link to="/" className="text-gray-600 hover:text-gray-900 mr-4">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">{t('categories') || 'Catégories'}</h1>
          </div>
        </header>

        {/* Main content with sidebar */}
        <div className="container mx-auto px-4 py-6">
          <SidebarProvider>
            <div className="flex min-h-[calc(100vh-5rem)] w-full rounded-lg overflow-hidden border">
              <CategorySidebar />
              <CategoryContent />
            </div>
          </SidebarProvider>
        </div>
      </div>
    </CategoryProvider>
  );
};

export default Categories;
