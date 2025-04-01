
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, MapPin, ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCategoryColor } from '@/utils/categoryColors';

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
  }
];

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);

  // Filter results based on search query and selected category
  useEffect(() => {
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
  }, [searchQuery, selectedCategory]);

  // Update selected category when URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="min-h-screen bg-app-light">
      {/* Header */}
      <div className="bg-white py-3 px-4 shadow-sm flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 text-app-dark" />
        </Button>
        
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places..."
            className="pl-9 pr-3 py-1.5 text-sm w-full rounded-full border-gray-200 focus:ring-app-primary focus:border-app-primary"
          />
        </div>
        
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
          <Button
            key={category}
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
        ))}
      </div>

      {/* Results */}
      <div className="p-3">
        <h2 className="text-sm font-medium mb-3 text-app-dark">
          {results.length} {results.length === 1 ? 'result' : 'results'} found
        </h2>
        
        <div className="space-y-2.5">
          {results.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
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
          
          {results.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No results found</p>
              <p className="text-xs mt-1">Try changing your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
