
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
      category: 'restaurants',
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
  const maxDuration = filters.duration || 30;
  const colors = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'indigo', 'yellow', 'teal'];
  const categoryMap: Record<string, string[]> = {
    'restaurants': ['Restaurant', 'Bistro', 'Café', 'Brasserie'],
    'bars': ['Bar', 'Pub', 'Lounge', 'Club'],
    'cafes': ['Café', 'Salon de thé', 'Coffee Shop'],
    'shopping': ['Boutique', 'Centre commercial', 'Magasin'],
    'hotels': ['Hôtel', 'Auberge', 'Pension'],
    'entertainment': ['Cinéma', 'Théâtre', 'Musée', 'Galerie'],
    'health': ['Pharmacie', 'Clinique', 'Cabinet médical'],
    'services': ['Banque', 'Poste', 'Coiffeur', 'Pressing'],
    'education': ['École', 'Université', 'Bibliothèque'],
    'transport': ['Gare', 'Station', 'Arrêt de bus']
  };
  const categories = Object.keys(categoryMap);
  
  let results: Result[] = [];
  let actualCount = count * 2; // Generate more to have enough after filtering
  
  // Determine travel speed based on transport mode (km per minute)
  const speedFactor = filters.transportMode === 'walking' ? 0.08 : 
                      filters.transportMode === 'cycling' ? 0.25 : 
                      filters.transportMode === 'transit' ? 0.5 : 0.8; // driving
  
  for (let i = 0; i < actualCount; i++) {
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
    
    // Calculate duration based on transport mode
    const duration = Math.floor(distance / speedFactor);
    
    // Select a random category or use the one from filters
    const category = filters.category || categories[Math.floor(Math.random() * categories.length)];
    
    // Generate a name based on the category
    const placeTypes = categoryMap[category] || ['Lieu'];
    const placeType = placeTypes[Math.floor(Math.random() * placeTypes.length)];
    
    // Use query as part of the name if provided
    let name = '';
    if (query) {
      name = `${placeType} ${query} ${i + 1}`;
    } else {
      name = `${placeType} ${i + 1}`;
    }
    
    results.push({
      id: `result-${i}`,
      name,
      address: `${Math.floor(Math.random() * 100) + 1} rue ${category.charAt(0).toUpperCase() + category.slice(1)}, Paris`,
      distance: parseFloat(distance.toFixed(1)),
      duration,
      category,
      color: colors[i % colors.length],
      latitude,
      longitude,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Rating between 3.0 and 5.0
      openingHours: Math.random() > 0.3 ? 'Ouvert maintenant' : 'Fermé'
    });
  }
  
  // Apply all filters
  results = results.filter(result => {
    // Apply category filter if specified
    if (filters.category && result.category !== filters.category) {
      return false;
    }
    
    // Apply radius filter
    if (filters.radius && result.distance > filters.radius) {
      return false;
    }
    
    // Apply duration filter
    if (filters.duration && result.duration > filters.duration) {
      return false;
    }
    
    return true;
  });
  
  // Sort by distance
  results.sort((a, b) => a.distance - b.distance);
  
  // Make sure we don't return more than requested
  results = results.slice(0, count);
  
  return results;
};
