
export const getColorForResult = (color: string): string => {
  const colorMap: Record<string, string> = {
    'primary': '#2563eb',
    'red': '#ef4444',
    'green': '#10b981',
    'blue': '#3b82f6',
    'orange': '#f97316',
    'purple': '#8b5cf6',
    'pink': '#ec4899'
  };
  
  return colorMap[color] || '#3b82f6';
};
