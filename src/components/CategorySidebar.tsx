
import React, { useState } from 'react';
import { useCategory } from './CategoryContext';
import { CATEGORIES } from '@/types/categories';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ColorPicker } from './ColorPicker';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { SubCategoryList } from '@/components/SubCategoryList';

export const CategorySidebar = () => {
  const { selectedCategory, setSelectedCategory, categoryColors, updateCategoryColor } = useCategory();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // This sets the default category when the component is first rendered
  React.useEffect(() => {
    if (!selectedCategory) {
      // Set the first category as the default selected category
      setSelectedCategory(CATEGORIES[0].id);
    }
  }, [selectedCategory, setSelectedCategory]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel>Catégories</SidebarGroupLabel>
            <SidebarTrigger />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {CATEGORIES.map((category) => {
                const hasSubCategories = category.subCategories && category.subCategories.length > 0;
                
                return (
                  <SidebarMenuItem key={category.id}>
                    <div className="group relative w-full">
                      {hasSubCategories ? (
                        <HoverCard openDelay={100} closeDelay={200}>
                          <HoverCardTrigger asChild>
                            <SidebarMenuButton
                              onClick={() => setSelectedCategory(category.id)}
                              onMouseEnter={() => setHoveredCategory(category.id)}
                              onMouseLeave={() => setHoveredCategory(null)}
                              className={cn(
                                'flex items-center justify-between gap-2 w-full p-2 rounded-md transition-colors',
                                selectedCategory === category.id 
                                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                  : 'hover:bg-gray-100'
                              )}
                              style={{
                                backgroundColor: selectedCategory === category.id ? categoryColors[category.id] : undefined,
                                color: selectedCategory === category.id ? '#ffffff' : undefined,
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                              </div>
                              {selectedCategory === category.id && (
                                <Settings className="h-4 w-4" />
                              )}
                            </SidebarMenuButton>
                          </HoverCardTrigger>
                          <HoverCardContent side="right" align="start" className="p-2 w-64 bg-white rounded-md shadow-md">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-sm">{category.name}</h3>
                              {category.subCategories && (
                                <SubCategoryList 
                                  subCategories={category.subCategories} 
                                  categoryId={category.id}
                                />
                              )}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ) : (
                        <SidebarMenuButton
                          onClick={() => setSelectedCategory(category.id)}
                          className={cn(
                            'flex items-center justify-between gap-2 w-full p-2 rounded-md transition-colors',
                            selectedCategory === category.id 
                              ? 'bg-blue-500 text-white hover:bg-blue-600' 
                              : 'hover:bg-gray-100'
                          )}
                          style={{
                            backgroundColor: selectedCategory === category.id ? categoryColors[category.id] : undefined,
                            color: selectedCategory === category.id ? '#ffffff' : undefined,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                          {selectedCategory === category.id && (
                            <Settings className="h-4 w-4" />
                          )}
                        </SidebarMenuButton>
                      )}
                      
                      {selectedCategory === category.id && (
                        <ColorPicker
                          currentColor={categoryColors[category.id]}
                          onColorChange={(color) => updateCategoryColor(category.id, color)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
