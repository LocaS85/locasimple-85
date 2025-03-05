
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MenuToggleHeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export const MenuToggleHeader: React.FC<MenuToggleHeaderProps> = ({
  menuOpen,
  setMenuOpen
}) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-12 h-1 bg-gray-300 rounded-full my-1.5 cursor-grab"
        onClick={() => setMenuOpen(!menuOpen)}
      ></div>
      <div 
        className="flex justify-between items-center px-3 py-1 w-full border-b cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <h2 className="text-base font-bold">LocaSimple</h2>
        <div className="h-6 w-6 p-0">
          {menuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </div>
      </div>
    </div>
  );
};
