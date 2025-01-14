import React from 'react';
import { SubCategory } from '@/types/categories';
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
  const renderSubCategories = (categories: SubCategory[]) => {
    return categories.map((category) => (
      <AccordionItem key={category.id} value={category.id}>
        <AccordionTrigger>{category.name}</AccordionTrigger>
        <AccordionContent>
          {category.children ? (
            <div className="ml-4">
              <Accordion type="single" collapsible>
                {renderSubCategories(category.children)}
              </Accordion>
            </div>
          ) : (
            <div className="p-2">
              {/* Espace réservé pour les futures fonctionnalités liées aux sous-catégories */}
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