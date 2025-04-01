import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, MapPin, ArrowLeft, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ResultItem {
  id: string;
  name: string;
  address: string;
  category: string;
  distance: string;
  time: string;
}

// Mock search results
const mockResults: ResultItem[] = [
  { 
    id: '1', 
    name: 'Grand Restaurant', 
    address: '123 Main St', 
    category: 'restaurants',
    distance: '0.5 km',
    time: '5 min'
  },
  { 
    id: '2', 
    name: 'Fashion Store', 
    address: '456 Shopping Ave', 
    category: 'shopping',
    distance: '1.2 km',
    time: '12 min' 
  },
  { 
    id: '3', 
    name: 'Cinema Plus', 
    address: '789 Entertainment Blvd', 
    category: 'entertainment',
    distance: '2.0 km',
    time: '18 min'
  },
  { 
    id: '4', 
    name: 'Coffee Shop', 
    address: '101 Cafe Street', 
    category: 'restaurants',
    distance: '0.3 km',
    time: '3 min'
  },
  { 
    id: '5', 
    name: 'Electronics Store', 
    address: '202 Tech Road', 
    category: 'shopping',
    distance: '1.5 km',
    time: '14 min'
  },
  { 
    id: '6', 
    name: 'Theater', 
    address: '303 Arts Avenue', 
    category: 'entertainment',
    distance: '1.8 km',
    time: '16 min'
  },
  { 
    id: '7', 
    name: 'Bistro Café', 
    address: '404 Bistro Lane', 
    category: 'restaurants',
    distance: '0.7 km',
    time: '8 min'
  },
  { 
    id: '8', 
    name: 'Clothing Boutique', 
    address: '505 Fashion Street', 
    category: 'shopping',
    distance: '1.0 km',
    time: '10 min'
  }
];

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [loading, setLoading] = useState(false);

  // Filter results based on search query and selected category
  useEffect(() => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      let filtered = [...mockResults];
      
      if (searchQuery) {
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedCategory) {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }
      
      setResults(filtered);
      setLoading(false);
      
      // Show toast when filter is applied
      if (selectedCategory && !searchQuery) {
        toast.success(`Showing ${selectedCategory} results`);
      }
    }, 500);
  }, [searchQuery, selectedCategory]);

  // Update selected category when URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryToggle = (category: string) => {
    // If already selected, deselect it
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSearchParams(params => {
        params.delete('category');
        return params;
      });
    } else {
      // Otherwise select it
      setSelectedCategory(category);
      setSearchParams(params => {
        params.set('category', category);
        return params;
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter is already applied through useEffect
    toast.success('Search applied');
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (selectedCategory) {
      // Keep category filter when clearing search
      toast.info(`Search cleared, still filtering by ${selectedCategory}`);
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchParams({});
    toast.info('All filters cleared');
  };

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }
    }
  };

  return (
    <div className="min-h-screen bg-app-light text-app-dark">
      {/* Header */}
      <div className="bg-white py-3 px-4 shadow-sm flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-app-dark">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <form onSubmit={handleSearch} className="relative flex-1 flex items-center">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places..."
            className="pl-9 pr-9 py-1.5 text-sm w-full rounded-full border-gray-200 focus:ring-app-primary focus:border-app-primary"
          />
          {searchQuery && (
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className="absolute right-1 h-7 w-7"
              onClick={clearSearch}
            >
              <X className="h-3.5 w-3.5 text-gray-400" />
            </Button>
          )}
        </form>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-8 w-8"
          onClick={() => navigate('/categories')}
        >
          <Filter className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Category Filters */}
      <div className="bg-white px-3 py-2 flex space-x-2 overflow-x-auto scrollbar-hide border-b border-gray-100">
        {['restaurants', 'shopping', 'entertainment'].map((category) => (
          <motion.div
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full text-xs py-1 px-3 h-auto ${
                selectedCategory === category 
                  ? `bg-app-${category === 'restaurants' ? 'secondary' : category === 'shopping' ? 'primary' : 'gray'}`
                  : "border-gray-200 text-gray-600"
              }`}
              onClick={() => handleCategoryToggle(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          </motion.div>
        ))}
        
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs py-1 px-2 h-auto text-gray-500 flex items-center"
              onClick={clearFilters}
            >
              Clear <X className="ml-1 h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Results */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium text-app-dark">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </h2>
          
          {loading && (
            <div className="text-xs text-app-primary animate-pulse">Loading...</div>
          )}
        </div>
        
        <motion.div 
          className="space-y-2.5"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {results.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 preserve-3d hover:shadow-md transition-all duration-300"
              whileHover={{
                y: -2,
                scale: 1.01,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center mt-0.5">
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.address}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-medium">{item.distance}</p>
                  <p className="text-gray-500">{item.time}</p>
                </div>
              </div>
              <div className="mt-2">
                <span 
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    item.category === 'restaurants' ? 'bg-app-secondary/10 text-app-secondary' :
                    item.category === 'shopping' ? 'bg-app-primary/10 text-app-primary' :
                    'bg-purple-100 text-purple-800'
                  }`}
                >
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
          
          {results.length === 0 && !loading && (
            <motion.div 
              className="text-center py-10 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm">No results found</p>
              <p className="text-xs mt-1">Try changing your search or filters</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3" 
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Search;
