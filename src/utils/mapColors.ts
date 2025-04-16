
// Color palette for map markers
const colorPalette = [
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'indigo',
  'pink',
  'yellow',
  'teal',
  'cyan'
];

// Get color based on category or index
export const getColorForCategory = (category: string): string => {
  const categories: { [key: string]: string } = {
    restaurant: 'red',
    cafe: 'orange',
    shopping: 'pink',
    hotel: 'blue',
    attraction: 'purple',
    education: 'yellow',
    transport: 'green',
    business: 'indigo',
    health: 'teal',
    sport: 'cyan'
  };
  
  return categories[category] || 'blue';
};

// Get color for result (either from result.color or generate one)
export const getColorForResult = (color?: string): string => {
  if (color && color.startsWith('#')) {
    return color;
  }
  
  const colorName = color || 'blue';
  const colorMap: { [key: string]: string } = {
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f59e0b',
    purple: '#8b5cf6',
    red: '#ef4444',
    indigo: '#6366f1',
    pink: '#ec4899',
    yellow: '#eab308',
    teal: '#14b8a6',
    cyan: '#06b6d4'
  };
  
  return colorMap[colorName] || '#3b82f6';
};

// Get a color based on index (for cycling through colors)
export const getColorByIndex = (index: number): string => {
  const colorIndex = index % colorPalette.length;
  return colorPalette[colorIndex];
};
