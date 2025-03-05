
import { useState, useRef } from 'react';

export const useSearchMenu = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  
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

  // Ajout d'une fonction pour basculer l'état du menu quand on clique sur la barre
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return {
    menuOpen,
    setMenuOpen,
    dragging,
    setDragging,
    startY,
    setStartY,
    menuRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMapInteraction,
    toggleMenu
  };
};

export default useSearchMenu;
