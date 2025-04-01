
import React, { useState } from 'react';
import { SubCategory } from '@/types/categories';
import FilterPanel from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SubCategoryListProps {
  subCategories: SubCategory[];
  categoryId: string;
}

export const SubCategoryList = ({ subCategories, categoryId }: SubCategoryListProps) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    radius: 5,
    transportMode: 'driving',
    resultsCount: 3,
    duration: 15
  });

  const handleSearch = (subCategoryId: string) => {
    const searchParams = new URLSearchParams({
      category: categoryId,
      subCategory: subCategoryId,
      radius: filters.radius.toString(),
      transport: filters.transportMode,
      duration: filters.duration.toString(),
      results: filters.resultsCount.toString()
    });

    navigate(`/search?${searchParams.toString()}`);
    toast.success('Recherche lancée');
  };

  const renderSubCategories = (categories: SubCategory[]) => {
    return categories.map((category) => (
      <AccordionItem key={category.id} value={category.id}>
        <AccordionTrigger>
          {category.name}
        </AccordionTrigger>
        <AccordionContent>
          {category.children ? (
            <div className="ml-4">
              <Accordion type="single" collapsible>
                {renderSubCategories(category.children)}
              </Accordion>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              <FilterPanel
                radius={filters.radius}
                onRadiusChange={(value) => setFilters({ ...filters, radius: value })}
                transportMode={filters.transportMode}
                onTransportModeChange={(value) => setFilters({ ...filters, transportMode: value })}
                resultsCount={filters.resultsCount}
                onResultsCountChange={(value) => setFilters({ ...filters, resultsCount: value })}
                duration={filters.duration}
                onDurationChange={(value) => setFilters({ ...filters, duration: value })}
              />
              <Button 
                onClick={() => handleSearch(category.id)}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    ));
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Sous-catégories</h2>
      <Accordion type="single" collapsible>
        {renderSubCategories(subCategories)}
      </Accordion>
    </div>
  );
};
