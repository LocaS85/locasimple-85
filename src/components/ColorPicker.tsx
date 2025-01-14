import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = [
  '#8B5CF6', // Violet
  '#D946EF', // Rose
  '#F97316', // Orange
  '#0EA5E9', // Bleu
  '#1EAEDB', // Bleu clair
  '#9b87f5', // Violet clair
  '#7E69AB', // Violet foncé
  '#6E59A5', // Indigo
  '#F2FCE2', // Vert clair
  '#FEC6A1', // Pêche
];

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export const ColorPicker = ({ currentColor, onColorChange, className }: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "p-1 rounded-md hover:bg-accent hover:bg-opacity-50 transition-colors",
            className
          )}
        >
          <Settings className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-5 gap-1">
          {COLORS.map((color) => (
            <button
              key={color}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-all",
                currentColor === color ? "border-gray-900" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};