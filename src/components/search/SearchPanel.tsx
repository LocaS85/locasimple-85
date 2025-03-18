import React from 'react';
import { Button } from '@/components/ui/button';
import type { Result } from '@/components/ResultsList';

interface SearchPanelProps {
  query: string;
  setQuery: (query: string) => void;
  search: (query: string) => void;
  isRecording?: boolean;
  onMicClick?: () => void;
  isLocationActive?: boolean;
  onLocationClick?: () => void;
  loading?: boolean;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  onMenuClick?: () => void;
  onResultSelect?: (result: Result) => void;
  resetSearch?: () => void;
  showHistory?: boolean;
  setShowHistory?: (show: boolean) => void;
  searchHistory?: string[];
  savedSearches?: string[];
  onHistoryItemClick?: (query: string) => void;
  onSaveSearch?: (query: string) => void;
  onRemoveSavedSearch?: (query: string) => void;
  userLocation?: [number, number];
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  setQuery,
  search,
  isRecording = false,
  onMicClick = () => {},
  isLocationActive = false,
  onLocationClick = () => {},
  loading = false,
  transportMode,
  onTransportModeChange,
  onMenuClick = () => {},
  onResultSelect = () => {},
  resetSearch = () => {},
  showHistory = false,
  setShowHistory = () => {},
  searchHistory = [],
  savedSearches = [],
  onHistoryItemClick = () => {},
  onSaveSearch = () => {},
  onRemoveSavedSearch = () => {},
  userLocation
}) => {
  return null;
};

export default SearchPanel;
