
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  items: string[];
  selectedItems: string[];
  onItemClick?: (item: string) => void;
  className?: string;
  highlightColor?: string;
}

const CategorySection = ({
  title,
  items,
  selectedItems,
  onItemClick,
  className = '',
  highlightColor = 'blue'
}: CategorySectionProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className={`px-4 py-3 ${className}`}>
      <div className="mb-2 flex justify-center">
        <div className="rounded-full border-2 border-black px-6 py-1 bg-white">
          {title}
        </div>
      </div>
      
      <div className="flex justify-center items-center">
        <ArrowLeft className="h-6 w-6 mr-2 text-gray-400 cursor-pointer hover:text-black" />
        
        <div 
          ref={containerRef}
          className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 max-w-full"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {items.map((item, index) => (
            <Button 
              key={index} 
              className={`rounded-full border-2 border-black hover:bg-gray-100 whitespace-nowrap px-4 py-1 h-auto flex-shrink-0 transition-colors ${
                selectedItems.includes(item) 
                  ? `bg-${highlightColor}-100 text-${highlightColor}-800` 
                  : 'bg-white text-black'
              }`}
              onClick={() => onItemClick?.(item)}
            >
              {item === "Plus" ? <Plus className="h-4 w-4" /> : item}
            </Button>
          ))}
        </div>
        
        <ArrowRight className="h-6 w-6 ml-2 text-gray-400 cursor-pointer hover:text-black" />
      </div>
    </div>
  );
};

export default CategorySection;
