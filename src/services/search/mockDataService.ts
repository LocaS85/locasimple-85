
import { Result } from '@/components/ResultsList';
import { generateFilteredMockResults } from '@/data/mockSearchResults';

export interface MockSearchParams {
  searchQuery: string;
  userLocation: [number, number];
  transportMode: string;
  category?: string | null;
  distance?: number | null;
  duration?: number | null;
  distanceUnit: 'km' | 'miles';
  resultsCount: number;
}

export const mockDataService = {
  /**
   * Generate mock search results when the API is unavailable
   */
  async getMockSearchResults({
    searchQuery,
    userLocation,
    transportMode,
    category = null,
    distance = null,
    duration = null,
    distanceUnit = 'km',
    resultsCount = 5
  }: MockSearchParams): Promise<Result[]> {
    return new Promise<Result[]>((resolve) => {
      setTimeout(() => {
        try {
          const results = generateFilteredMockResults(
            searchQuery,
            userLocation,
            {
              category: category || undefined,
              radius: distance,
              radiusUnit: distanceUnit,
              duration: duration,
              transportMode
            },
            resultsCount
          );
          console.log(`Generated ${results.length} mock results`);
          resolve(results);
        } catch (error) {
          console.error('Error with mock data:', error);
          resolve([]);
        }
      }, 1000);
    });
  }
};

export default mockDataService;
