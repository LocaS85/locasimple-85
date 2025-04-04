
import React from 'react';
import { Map, Layers, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type MapStyle = 'streets' | 'satellite' | 'terrain';

interface MapStyleSelectorProps {
  onStyleChange: (style: MapStyle) => void;
  currentStyle: MapStyle;
}

const MAP_STYLES = [
  { id: 'streets', name: 'Standard', icon: <Map className="h-4 w-4" /> },
  { id: 'satellite', name: 'Satellite', icon: <Layers className="h-4 w-4" /> },
  { id: 'terrain', name: 'Relief', icon: <Mountain className="h-4 w-4" /> },
];

export const MapStyleSelector: React.FC<MapStyleSelectorProps> = ({
  onStyleChange,
  currentStyle,
}) => {
  const currentStyleObj = MAP_STYLES.find(style => style.id === currentStyle) || MAP_STYLES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center h-10 w-10 rounded-sm border-gray-300"
        >
          {currentStyleObj.icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {MAP_STYLES.map((style) => (
          <DropdownMenuItem
            key={style.id}
            onClick={() => onStyleChange(style.id as MapStyle)}
            className="flex items-center gap-2"
          >
            {style.icon}
            <span>{style.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MapStyleSelector;
