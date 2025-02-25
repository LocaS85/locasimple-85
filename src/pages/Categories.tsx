
import React from 'react';
import { CategorySidebar } from '@/components/CategorySidebar';
import { CategoryContent } from '@/components/CategoryContent';
import { CategoryProvider } from '@/components/CategoryContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Button 
        variant="ghost" 
        className="m-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      <SidebarProvider defaultOpen>
        <CategoryProvider>
          <div className="flex flex-1 w-full">
            <CategorySidebar />
            <CategoryContent />
          </div>
        </CategoryProvider>
      </SidebarProvider>
    </div>
  );
};

export default Categories;
