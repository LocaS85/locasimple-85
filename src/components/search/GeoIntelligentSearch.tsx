
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { SearchContext, SearchIntent, LocationSuggestion } from '@/types/search';
import { SearchContextPreview } from './SearchContextPreview';

// Simple intent detection - would be enhanced with AI in production
const detectSearchIntent = async (text: string): Promise<SearchIntent> => {
  // Basic intent detection logic
  if (text.match(/près de|à côté de|autour de|proche/i)) {
    return {
      type: 'LOCATION',
      confidence: 0.8,
      extracted: { location: text.replace(/près de|à côté de|autour de|proche/i, '').trim() }
    };
  } else if (text.match(/restaurant|café|bar|hôtel|magasin/i)) {
    return {
      type: 'SERVICE',
      confidence: 0.7,
      extracted: { service: text }
    };
  } else if (text.match(/nourriture|shopping|santé|loisirs/i)) {
    return {
      type: 'CATEGORY',
      confidence: 0.6,
      extracted: { category: text }
    };
  }
  
  return { type: 'GENERAL', confidence: 0.5 };
};

interface GeoIntelligentSearchProps {
  onIntentDetected: (intent: SearchIntent) => void;
  onLocationSuggest: (query: string) => Promise<LocationSuggestion[]>;
}

export const GeoIntelligentSearch = ({ 
  onIntentDetected,
  onLocationSuggest 
}: GeoIntelligentSearchProps) => {
  const [query, setQuery] = useState('');
  const [context, setContext] = useState<SearchContext>({});
  
  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);
    
    if (text.length < 2) {
      setContext({});
      return;
    }
    
    try {
      // Détection d'intention en temps réel
      const detectedIntent = await detectSearchIntent(text);
      onIntentDetected(detectedIntent);
      
      // Suggestions contextuelles
      if (detectedIntent.type === 'LOCATION' || text.length > 3) {
        const suggestions = await onLocationSuggest(text);
        setContext(prev => ({ ...prev, suggestions, userIntent: detectedIntent }));
      }
    } catch (error) {
      console.error('Error during search processing:', error);
    }
  };

  return (
    <div className="geo-intelligent-search w-full max-w-xl">
      <div className="relative">
        <Input 
          value={query}
          onChange={handleInput}
          placeholder="Rechercher un lieu ou décrire un besoin..."
          className="w-full py-3 px-4 rounded-lg shadow-md border border-gray-200"
        />
      </div>
      
      {(context.suggestions?.length ?? 0) > 0 && (
        <SearchContextPreview context={context} />
      )}
    </div>
  );
};
