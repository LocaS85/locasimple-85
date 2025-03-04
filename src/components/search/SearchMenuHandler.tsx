
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
      {/* This is a utility component that only provides functionality */}
    </React.Fragment>
  );
};

// Export the handler separately
export const useSearchMenuHandler = ({
  menuRef,
  menuOpen,
  setMenuOpen,
  setDragging,
  setStartY,
  dragging,
  startY,
}: SearchMenuHandlerProps) => {
  const handleTouchStart = (e: React.TouchEvent) => {
    if (menuRef.current) {
      setDragging(true);
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || !menuRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;
    
    if (Math.abs(diff) > 30) {
      if (diff > 0 && !menuOpen) {
        setMenuOpen(true);
      } else if (diff < 0 && menuOpen) {
        setMenuOpen(false);
      }
      setDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  const handleMapInteraction = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd, handleMapInteraction };
};

export default SearchMenuHandler;
