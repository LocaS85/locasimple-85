
export interface SearchResult {
  id: string;
  name: string;
  address: string;
  category: string;
  distance: string;
  distanceValue: number; // Numeric value for sorting
  time: string;
  timeValue: number; // Numeric value for sorting
  rating?: number;
  image?: string | null;
}

class SearchResultsService {
  private mockResults: SearchResult[] = [
    { 
      id: '1', 
      name: 'Grand Restaurant', 
      address: '123 Main St', 
      category: 'restaurants',
      distance: '0.5 km',
      distanceValue: 0.5,
      time: '5 min',
      timeValue: 5,
      rating: 4.2
    },
    { 
      id: '2', 
      name: 'Fashion Store', 
      address: '456 Shopping Ave', 
      category: 'shopping',
      distance: '1.2 km',
      distanceValue: 1.2,
      time: '12 min',
      timeValue: 12,
      rating: 3.8
    },
    { 
      id: '3', 
      name: 'Cinema Plus', 
      address: '789 Entertainment Blvd', 
      category: 'entertainment',
      distance: '2.0 km',
      distanceValue: 2.0,
      time: '18 min',
      timeValue: 18,
      rating: 4.5,
      image: '/lovable-uploads/ee881492-135d-48dc-bbda-6ada8828a366.png'
    },
    { 
      id: '4', 
      name: 'Coffee Shop', 
      address: '101 Cafe Street', 
      category: 'restaurants',
      distance: '0.3 km',
      distanceValue: 0.3,
      time: '3 min',
      timeValue: 3,
      rating: 4.0
    },
    { 
      id: '5', 
      name: 'Electronics Store', 
      address: '202 Tech Road', 
      category: 'shopping',
      distance: '1.5 km',
      distanceValue: 1.5,
      time: '14 min',
      timeValue: 14,
      rating: 3.9
    },
    { 
      id: '6', 
      name: 'Theater', 
      address: '303 Arts Avenue', 
      category: 'entertainment',
      distance: '1.8 km',
      distanceValue: 1.8,
      time: '16 min',
      timeValue: 16,
      rating: 4.3
    },
    { 
      id: '7', 
      name: 'Bistro Café', 
      address: '404 Bistro Lane', 
      category: 'restaurants',
      distance: '0.7 km',
      distanceValue: 0.7,
      time: '8 min',
      timeValue: 8,
      rating: 4.1
    },
    { 
      id: '8', 
      name: 'Clothing Boutique', 
      address: '505 Fashion Street', 
      category: 'shopping',
      distance: '1.0 km',
      distanceValue: 1.0,
      time: '10 min',
      timeValue: 10,
      rating: 4.2
    },
    { 
      id: '9', 
      name: 'Bookstore', 
      address: '606 Reading Road', 
      category: 'shopping',
      distance: '0.8 km',
      distanceValue: 0.8,
      time: '9 min',
      timeValue: 9,
      rating: 4.4
    },
    { 
      id: '10', 
      name: 'Museum', 
      address: '707 History Street', 
      category: 'entertainment',
      distance: '2.2 km',
      distanceValue: 2.2,
      time: '20 min',
      timeValue: 20,
      rating: 4.7
    }
  ];

  // Search with filters
  search(query: string = '', category: string | null = null, sort: string = 'distance'): SearchResult[] {
    // Simulate a network request with a delay
    return new Promise<SearchResult[]>((resolve) => {
      setTimeout(() => {
        let results = [...this.mockResults];
        
        // Filter by category if provided
        if (category) {
          results = results.filter(r => r.category === category);
        }
        
        // Filter by search query if provided
        if (query) {
          const normalizedQuery = query.toLowerCase();
          results = results.filter(r => 
            r.name.toLowerCase().includes(normalizedQuery) || 
            r.address.toLowerCase().includes(normalizedQuery)
          );
        }
        
        // Sort results
        if (sort === 'distance') {
          results = results.sort((a, b) => a.distanceValue - b.distanceValue);
        } else if (sort === 'time') {
          results = results.sort((a, b) => a.timeValue - b.timeValue);
        } else if (sort === 'rating') {
          results = results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        
        resolve(results);
      }, 500); // Simulate network delay
    });
  }

  // Get recent searches
  getRecentSearches(): string[] {
    try {
      const saved = localStorage.getItem('recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading recent searches:', e);
      return [];
    }
  }

  // Save a search to recent searches
  saveRecentSearch(query: string): void {
    if (!query.trim()) return;
    
    try {
      const searches = this.getRecentSearches();
      const updated = [query, ...searches.filter(s => s !== query)].slice(0, 5);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving recent search:', e);
    }
  }

  // Clear recent searches
  clearRecentSearches(): void {
    localStorage.removeItem('recent_searches');
  }
}

// Create a singleton instance
const searchResultsService = new SearchResultsService();
export default searchResultsService;
