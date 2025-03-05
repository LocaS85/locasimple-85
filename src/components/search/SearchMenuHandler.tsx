
import React from 'react';

interface SearchMenuHandlerProps {
  menuRef: React.RefObject<HTMLDivElement>;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setDragging: (dragging: boolean) => void;
  setStartY: (startY: number) => void;
  dragging: boolean;
  startY: number;
}

export const SearchMenuHandler: React.FC<SearchMenuHandlerProps> = (props) => {
  return (
    <React.Fragment>
      {/* This component is deprecated and its functionality has been moved to useSearchMenu */}
    </React.Fragment>
  );
};

// This export is kept for backward compatibility
export const useSearchMenuHandler = ({
  menuRef,
  menuOpen,
  setMenuOpen,
  setDragging,
  setStartY,
  dragging,
  startY,
}: SearchMenuHandlerProps) => {
  console.warn('useSearchMenuHandler is deprecated. Use useSearchMenu instead.');
  
  // All functionality has been moved to useSearchMenu
  return { 
    handleTouchStart: () => {},
    handleTouchMove: () => {},
    handleTouchEnd: () => {},
    handleMapInteraction: () => {}
  };
};

export default SearchMenuHandler;
