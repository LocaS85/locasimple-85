
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { getCategoryColorClass } from '@/utils/categoryColors';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  address?: string;
}

interface LocationSelectorProps {
  locations: Location[];
  selectedLocations: Location[];
  onSelectionChange: (locations: Location[]) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  locations,
  selectedLocations,
  onSelectionChange
}) => {
  // Group locations by category
  const categorizedLocations = locations.reduce((acc, location) => {
    if (!acc[location.category]) {
      acc[location.category] = [];
    }
    acc[location.category].push(location);
    return acc;
  }, {} as Record<string, Location[]>);

  // Handle selection change
  const toggleLocation = (location: Location) => {
    const isSelected = selectedLocations.some(loc => loc.id === location.id);
    let newSelectedLocations: Location[];
    
    if (isSelected) {
      newSelectedLocations = selectedLocations.filter(loc => loc.id !== location.id);
    } else {
      newSelectedLocations = [...selectedLocations, location];
    }
    
    onSelectionChange(newSelectedLocations);
  };

  // Select all locations in a category
  const selectCategory = (category: string, select: boolean) => {
    let newSelectedLocations: Location[];
    
    if (select) {
      // Add all locations from this category that aren't already selected
      const categoryLocations = categorizedLocations[category];
      const locationsToAdd = categoryLocations.filter(
        loc => !selectedLocations.some(selected => selected.id === loc.id)
      );
      newSelectedLocations = [...selectedLocations, ...locationsToAdd];
    } else {
      // Remove all locations from this category
      newSelectedLocations = selectedLocations.filter(
        loc => loc.category !== category
      );
    }
    
    onSelectionChange(newSelectedLocations);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium p-4 border-b">Sélection des lieux</h3>
      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-4">
          {Object.entries(categorizedLocations).map(([category, categoryLocations]) => {
            const categoryIcon = getCategoryIcon(category);
            const colorClass = getCategoryColorClass(category);
            
            // Check if all locations from this category are selected
            const allSelected = categoryLocations.every(
              loc => selectedLocations.some(selected => selected.id === loc.id)
            );
            
            // Check if some locations from this category are selected
            const someSelected = categoryLocations.some(
              loc => selectedLocations.some(selected => selected.id === loc.id)
            );
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`}
                    checked={allSelected}
                    className={cn("border-2", allSelected ? colorClass : "")}
                    onCheckedChange={(checked) => selectCategory(category, !!checked)}
                  />
                  <div className="flex items-center space-x-2">
                    <span className={cn("w-5 h-5 flex items-center justify-center", colorClass)}>
                      {React.isValidElement(categoryIcon) ? categoryIcon : '📍'}
                    </span>
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({categoryLocations.length} lieux)
                  </span>
                </div>
                
                <div className="ml-7 space-y-1">
                  {categoryLocations.map(location => (
                    <div key={location.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`location-${location.id}`}
                        checked={selectedLocations.some(loc => loc.id === location.id)}
                        onCheckedChange={() => toggleLocation(location)}
                      />
                      <label
                        htmlFor={`location-${location.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {location.name}
                        {location.address && (
                          <span className="text-xs text-gray-500 block">
                            {location.address}
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LocationSelector;
