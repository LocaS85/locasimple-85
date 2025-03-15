
import { Result } from '@/components/ResultsList';
import { getRandomColor } from '@/utils/colors';
import { calculateDistance, calculateDuration } from '@/utils/distanceCalculator';

export const searchMapper = {
  /**
   * Convertit un résultat de l'API de recherche en un objet Result
   */
  mapFeatureToResult: async (
    feature: any,
    index: number,
    userLocation: [number, number],
    transportMode: string
  ): Promise<Result> => {
    // Calculer la distance et la durée depuis la position de l'utilisateur
    const distance = calculateDistance(
      userLocation[1],
      userLocation[0],
      feature.center[1],
      feature.center[0]
    );
    
    const duration = calculateDuration(distance, transportMode);
    
    // Extraire les informations du résultat
    return {
      id: feature.id || `result-${index}`,
      name: feature.text || feature.place_name?.split(',')[0] || `Résultat ${index + 1}`,
      address: feature.place_name || '',
      category: feature.properties?.category || feature.properties?.type || 'general',
      categories: feature.properties?.categories || [],
      distance: parseFloat(distance.toFixed(2)),
      duration: Math.round(duration),
      latitude: feature.center[1],
      longitude: feature.center[0],
      distanceInMeters: distance * 1000,
      durationInSeconds: duration * 60,
      rating: feature.properties?.rating,
      openingHours: feature.properties?.hours,
      color: getRandomColor(),
      phoneNumber: feature.properties?.phone,
      website: feature.properties?.website,
      isFavorite: feature.isFavorite || false,
      description: feature.properties?.description || ''
    };
  }
};

export default searchMapper;
