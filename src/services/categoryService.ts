
import { toast } from 'sonner';

export interface Category {
  id: string;
  type: string;
  name?: string;
  image?: string | null;
  color?: string;
  subcategories?: Category[];
}

export interface CategoryFilter {
  id: string;
  label: string;
  count?: number;
}

class CategoryService {
  private categories: Category[] = [
    { id: 'restaurants-1', type: 'restaurants', name: 'Fine Dining', image: null, color: 'from-app-gray to-app-primary' },
    { id: 'restaurants-2', type: 'restaurants', name: 'Fast Food', image: '/lovable-uploads/ee881492-135d-48dc-bbda-6ada8828a366.png', color: 'from-app-gray to-app-primary' },
    { id: 'shopping-1', type: 'shopping', name: 'Clothing', image: null, color: 'from-app-gray to-app-primary' },
    { id: 'shopping-2', type: 'shopping', name: 'Electronics', image: null, color: 'from-amber-200 to-amber-400' },
    { id: 'shopping-3', type: 'shopping', name: 'Groceries', image: null, color: 'from-app-secondary to-red-500' },
    { id: 'shopping-4', type: 'shopping', name: 'Accessories', image: null, color: 'from-stone-300 to-stone-500' },
    { id: 'entertainment-1', type: 'entertainment', name: 'Movies', image: '/lovable-uploads/ee881492-135d-48dc-bbda-6ada8828a366.png', color: 'from-app-gray to-app-primary' },
    { id: 'entertainment-2', type: 'entertainment', name: 'Concerts', image: null, color: 'from-app-gray to-app-primary' },
    { id: 'entertainment-3', type: 'entertainment', name: 'Parks', image: null, color: 'from-amber-100 to-amber-300' },
    { id: 'entertainment-4', type: 'entertainment', name: 'Art Galleries', image: null, color: 'from-zinc-200 to-zinc-400' },
  ];

  private filters: CategoryFilter[] = [
    { id: 'shopping', label: 'Shopping', count: 4 },
    { id: 'entertainment', label: 'Entertainment', count: 4 },
    { id: 'restaurants', label: 'Restaurants', count: 2 }
  ];

  private mainCategoryTypes = ['restaurants', 'shopping', 'entertainment'];

  // Get all categories
  getAllCategories(): Category[] {
    return this.categories;
  }

  // Get all main category types
  getMainCategoryTypes(): string[] {
    return this.mainCategoryTypes;
  }

  // Get all category filters
  getCategoryFilters(): CategoryFilter[] {
    return this.filters;
  }

  // Get categories by type
  getCategoriesByType(type: string): Category[] {
    return this.categories.filter(cat => cat.type === type);
  }

  // Get category by ID
  getCategoryById(id: string): Category | undefined {
    return this.categories.find(cat => cat.id === id);
  }

  // Filter categories by search term and type
  filterCategories(searchTerm: string = '', type: string | null = null): Category[] {
    let filtered = [...this.categories];
    
    if (type) {
      filtered = filtered.filter(cat => cat.type === type);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(cat => 
        cat.name?.toLowerCase().includes(term) || 
        cat.type.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }

  // Navigation utility to go to search with category filter
  navigateToSearch(navigate: (path: string) => void, categoryType: string): void {
    // Add analytics tracking or other logic here
    console.log(`Navigating to search with category: ${categoryType}`);
    
    navigate(`/search?category=${categoryType}`);
    toast.success(`Showing ${categoryType} results`);
  }
}

// Create a singleton instance
const categoryService = new CategoryService();
export default categoryService;
