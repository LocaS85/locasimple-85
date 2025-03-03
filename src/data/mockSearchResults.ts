
import type { Result } from '@/components/ResultsList';

export const generateMockResults = (query: string = '', count: number = 3): Result[] => {
  // Generate a set of mock results based on query and count
  return [
    {
      id: '1',
      name: query ? `${query} Café` : 'Café Paris',
      address: '123 rue de Paris',
      distance: 0.8,
      duration: 12,
      category: 'restaurant',
      color: 'blue',
      latitude: 48.8566 + 0.01,
      longitude: 2.3522 + 0.01,
      rating: 4.5,
      openingHours: 'Ouvert jusqu\'à 22h'
    },
    {
      id: '2',
      name: query ? `${query} Supermarché` : 'Supermarché Express',
      address: '45 avenue Victor Hugo',
      distance: 1.2,
      duration: 18,
      category: 'shopping',
      color: 'green',
      latitude: 48.8566 - 0.008,
      longitude: 2.3522 + 0.015,
      rating: 3.8,
      openingHours: 'Ouvert 24/7'
    },
    {
      id: '3',
      name: query ? `${query} Parc` : 'Parc Central',
      address: 'Place de la République',
      distance: 2.5,
      duration: 25,
      category: 'loisirs',
      color: 'red',
      latitude: 48.8566 + 0.02,
      longitude: 2.3522 - 0.01,
      rating: 4.2
    }
  ].slice(0, count);
};

// More sophisticated mock data generation with location and filters
export const generateFilteredMockResults = (
  query: string = '',
  location: [number, number] = [2.3522, 48.8566],
  filters: {
    category?: string;
    radius?: number;
    radiusUnit?: 'km' | 'miles';
    duration?: number;
    transportMode?: string;
  } = {},
  count: number = 5
): Result[] => {
  // Generate random results within the specified radius
  const radius = filters.radius || 5;
  const colors = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'indigo', 'yellow', 'teal'];
  const categories = ['restaurant', 'shopping', 'loisirs', 'services', 'santé', 'éducation'];
  
  const results: Result[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate a random point within the radius
    const randomAngle = Math.random() * Math.PI * 2;
    const randomDistance = Math.random() * radius * 0.01; // Convert to rough coordinates
    
    const longitude = location[0] + randomDistance * Math.cos(randomAngle);
    const latitude = location[1] + randomDistance * Math.sin(randomAngle);
    
    // Calculate approximate distance (this is a simplification)
    const distance = Math.sqrt(
      Math.pow((longitude - location[0]) * 111 * Math.cos(location[1] * (Math.PI/180)), 2) +
      Math.pow((latitude - location[1]) * 111, 2)
    );
    
    const category = filters.category || categories[Math.floor(Math.random() * categories.length)];
    const queryPrefix = query ? `${query} ` : '';
    const nameOptions = [
      `${queryPrefix}Lieu ${i + 1}`,
      `${queryPrefix}Commerce ${i + 1}`,
      `${queryPrefix}Restaurant ${i + 1}`,
      `${queryPrefix}Boutique ${i + 1}`
    ];
    
    results.push({
      id: `result-${i}`,
      name: nameOptions[Math.floor(Math.random() * nameOptions.length)],
      address: `${Math.floor(Math.random() * 100) + 1} rue ${query || 'Principale'}, Paris`,
      distance: parseFloat(distance.toFixed(1)),
      duration: Math.floor(distance * (filters.transportMode === 'walking' ? 12 : 3)),
      category,
      color: colors[i % colors.length],
      latitude,
      longitude,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Rating between 3.0 and 5.0
      openingHours: Math.random() > 0.3 ? 'Ouvert maintenant' : 'Fermé'
    });
  }
  
  // Sort by distance
  results.sort((a, b) => a.distance - b.distance);
  
  return results;
};
