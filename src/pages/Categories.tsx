
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
    <>
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
          <div className="flex min-h-screen w-full">
            <CategorySidebar />
            <CategoryContent />
          </div>
        </CategoryProvider>
      </SidebarProvider>
    </>
  );
};

export default Categories;
