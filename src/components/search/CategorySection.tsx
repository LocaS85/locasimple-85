
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

  // Fonction pour déterminer la couleur en fonction de l'item
  const getItemColor = (item: string) => {
    if (!selectedItems.includes(item)) return 'bg-white text-black hover:bg-gray-100';
    
    // Couleurs spécifiques pour chaque catégorie si sélectionnée
    switch (item) {
      case "Restaurant": return 'bg-red-100 text-red-800';
      case "Hôtel": return 'bg-blue-100 text-blue-800';
      case "Bar": return 'bg-purple-100 text-purple-800';
      case "Café": return 'bg-yellow-100 text-yellow-800';
      case "Shopping": return 'bg-pink-100 text-pink-800';
      case "Attraction": return 'bg-green-100 text-green-800';
      case "Transport": return 'bg-indigo-100 text-indigo-800';
      case "Parc": return 'bg-emerald-100 text-emerald-800';
      case "Musée": return 'bg-amber-100 text-amber-800';
      case "Cinéma": return 'bg-sky-100 text-sky-800';
      case "Théâtre": return 'bg-rose-100 text-rose-800';
      case "Bibliothèque": return 'bg-teal-100 text-teal-800';
      case "Plage": return 'bg-cyan-100 text-cyan-800';
      case "Montagne": return 'bg-lime-100 text-lime-800';
      case "Plus": return 'bg-gray-100 text-gray-800';
      
      // Favoris
      case "Famille": return 'bg-pink-100 text-pink-800';
      case "Amis": return 'bg-blue-100 text-blue-800';
      case "Travail": return 'bg-gray-100 text-gray-800';
      case "Sport": return 'bg-green-100 text-green-800';
      
      default: return `bg-${highlightColor}-100 text-${highlightColor}-800`;
    }
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
              className={`rounded-full border-2 border-black whitespace-nowrap px-4 py-1 h-auto flex-shrink-0 transition-colors ${getItemColor(item)}`}
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
