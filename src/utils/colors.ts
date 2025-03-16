
/**
 * Utility functions for color generation and management
 */

/**
 * Returns a random color from a predefined palette for category markers
 */
export const getRandomColor = (): string => {
  const colors = [
    "#4299E1", // blue
    "#48BB78", // green
    "#F6AD55", // orange
    "#F687B3", // pink
    "#805AD5", // purple
    "#E53E3E", // red
    "#ECC94B", // yellow
    "#319795", // teal
    "#667EEA", // indigo
    "#FC8181", // light red
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Generates a color with specified opacity
 */
export const withOpacity = (color: string, opacity: number): string => {
  // Si le format est #RRGGBB, convertir en rgba
  if (color.startsWith('#') && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

/**
 * Lighten a color by mixing it with white
 */
export const lightenColor = (color: string, amount: number): string => {
  // Cette fonction simplifie, pour une vraie application utilisez une bibliothèque de couleur
  // comme color, chroma.js, etc.
  const clamp = (num: number) => Math.min(255, Math.max(0, num));
  
  if (color.startsWith('#') && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    const newR = clamp(r + Math.floor((255 - r) * amount));
    const newG = clamp(g + Math.floor((255 - g) * amount));
    const newB = clamp(b + Math.floor((255 - b) * amount));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
  
  return color;
};
