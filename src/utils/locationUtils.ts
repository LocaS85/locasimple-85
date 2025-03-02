
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c;
  return Math.round(distance * 10) / 10;
};

export const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

export const generateMockResults = (
  query: string, 
  location: [number, number], 
  filters: { category: string; sortBy: string; radius: string },
  count: number
) => {
  const radius = parseInt(filters.radius);
  
  const colors = ['primary', 'red', 'green', 'blue', 'orange', 'purple', 'pink', 'indigo', 'yellow', 'teal'];
  
  const results = Array.from({ length: count }, (_, i) => {
    const randomAngle = Math.random() * Math.PI * 2;
    const randomDistance = Math.random() * radius * 0.01;
    
    const longitude = location[0] + randomDistance * Math.cos(randomAngle);
    const latitude = location[1] + randomDistance * Math.sin(randomAngle);
    
    const distance = calculateDistance(location[1], location[0], latitude, longitude);
    
    return {
      id: `result-${i}`,
      name: `${query} Place ${i + 1}`,
      address: `${i + 100} ${query.charAt(0).toUpperCase() + query.slice(1)} Street`,
      category: ['restaurant', 'cafe', 'store', 'service', 'entertainment'][Math.floor(Math.random() * 5)],
      distance: distance,
      duration: Math.floor(distance * 3),
      color: colors[i % colors.length],
      latitude,
      longitude,
      rating: Math.floor(Math.random() * 5) + 1,
      openingHours: '9:00 - 18:00',
    };
  });
  
  if (filters.sortBy === 'distance') {
    results.sort((a, b) => a.distance - b.distance);
  } else if (filters.sortBy === 'rating') {
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  
  return results;
};
