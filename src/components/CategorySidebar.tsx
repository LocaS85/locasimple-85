
import React from 'react';
import { useCategory } from './CategoryContext';
import { CATEGORIES } from '@/types/categories';
import { cn } from '@/lib/utils';
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

export const CategorySidebar = () => {
  const { selectedCategory, setSelectedCategory, categoryColors, updateCategoryColor } = useCategory();

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
              {CATEGORIES.map((category) => (
                <SidebarMenuItem key={category.id}>
                  <div className="group relative w-full">
                    <SidebarMenuButton
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        'flex items-center gap-2 w-full p-2 rounded-md transition-colors',
                        selectedCategory === category.id && 'bg-accent'
                      )}
                      style={{
                        backgroundColor: selectedCategory === category.id ? categoryColors[category.id] : undefined,
                        color: selectedCategory === category.id ? '#ffffff' : undefined,
                      }}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </SidebarMenuButton>
                    {selectedCategory === category.id && (
                      <ColorPicker
                        currentColor={categoryColors[category.id]}
                        onColorChange={(color) => updateCategoryColor(category.id, color)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
