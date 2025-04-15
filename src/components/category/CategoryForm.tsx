
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Briefcase, Users, MapPin, GraduationCap, Book, BookOpen, School } from 'lucide-react';

interface CategoryFormProps {
  initialData?: {
    name: string;
    icon: string;
    color: string;
  };
  onSubmit: (data: { name: string; icon: string; color: string; userId: string }) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [icon, setIcon] = useState(initialData?.icon || 'Home');
  const [color, setColor] = useState(initialData?.color || '#4F46E5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    onSubmit({
      name,
      icon,
      color,
      userId: 'current-user', // In a real app, this would come from auth context
    });
  };

  const iconOptions = [
    { value: 'Home', label: 'Home', icon: <Home /> },
    { value: 'Briefcase', label: 'Briefcase', icon: <Briefcase /> },
    { value: 'Users', label: 'Users', icon: <Users /> },
    { value: 'MapPin', label: 'MapPin', icon: <MapPin /> },
    { value: 'GraduationCap', label: 'GraduationCap', icon: <GraduationCap /> },
    { value: 'Book', label: 'Book', icon: <Book /> },
    { value: 'BookOpen', label: 'BookOpen', icon: <BookOpen /> },
    { value: 'School', label: 'School', icon: <School /> },
  ];
  
  const colorOptions = [
    '#4F46E5', // Indigo
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#8B5CF6', // Violet
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Restaurants, Shopping"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="icon">Icon</Label>
        <Select value={icon} onValueChange={setIcon}>
          <SelectTrigger id="icon" className="w-full">
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  {option.icon}
                  <span className="ml-2">{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="grid grid-cols-4 gap-2">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              className={`w-full h-10 rounded-md border-2 ${
                color === colorOption ? 'border-black' : 'border-transparent'
              }`}
              style={{ backgroundColor: colorOption }}
              onClick={() => setColor(colorOption)}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
