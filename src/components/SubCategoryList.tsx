
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
import { DistanceUnit } from '@/types/categoryTypes';
import { getHealthIcon } from '@/utils/icons/healthIcons';
import { getFoodCategoryIcon } from '@/utils/icons/foodIcons';
import { getServicesIcon } from '@/utils/icons/servicesIcons';
import { getEntertainmentIcon } from '@/utils/icons/entertainmentIcons';
import { getAccommodationIcon } from '@/utils/icons/accommodationIcons';

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
    duration: 15,
    distanceUnit: 'km' as DistanceUnit
  });

  const handleSearch = (subCategoryId: string) => {
    const searchParams = new URLSearchParams({
      category: categoryId,
      subCategory: subCategoryId,
      radius: filters.radius.toString(),
      transport: filters.transportMode,
      duration: filters.duration.toString(),
      results: filters.resultsCount.toString(),
      unit: filters.distanceUnit
    });

    navigate(`/categories/search?${searchParams.toString()}`);
    toast.success('Recherche lancée');
  };

  // Get the appropriate icon based on category ID
  const getIconForCategory = (id: string, parentId: string) => {
    // Check category specific icons from utility functions
    if (parentId === 'sante') {
      return getHealthIcon(id, "h-4 w-4 mr-2");
    }
    if (parentId === 'alimentation') {
      return getFoodCategoryIcon(id, "h-4 w-4 mr-2");
    }
    if (parentId === 'services') {
      return getServicesIcon(id, "h-4 w-4 mr-2");
    }
    if (parentId === 'divertissement') {
      return getEntertainmentIcon(id, "h-4 w-4 mr-2");
    }
    if (parentId === 'hebergement') {
      return getAccommodationIcon(id, "h-4 w-4 mr-2");
    }
    
    // Fallback to search icon
    return <Search className="h-4 w-4 mr-2" />;
  };

  const renderSubCategories = (categories: SubCategory[]) => {
    return categories.map((category) => (
      <AccordionItem key={category.id} value={category.id} className="border rounded-md mb-2">
        <AccordionTrigger className="px-4 py-2 hover:bg-accent/50">
          <div className="flex items-center">
            {getIconForCategory(category.id, categoryId)}
            {category.name}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {category.children ? (
            <div className="ml-4">
              <Accordion type="single" collapsible className="w-full">
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
                distanceUnit={filters.distanceUnit}
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
    <div className="mt-4 p-2">
      <h2 className="text-xl font-semibold mb-4">Sous-catégories</h2>
      <Accordion type="single" collapsible className="w-full">
        {renderSubCategories(subCategories)}
      </Accordion>
    </div>
  );
};

export default SubCategoryList;
