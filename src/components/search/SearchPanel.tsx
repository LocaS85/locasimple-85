
import React from 'react';
import { Button } from '@/components/ui/button';
import TransparentSearchBar from './TransparentSearchBar';

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
  onMenuClick = () => {}
}) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
      <div className="flex flex-col items-center gap-2">
        <TransparentSearchBar
          searchQuery={query}
          onSearchChange={setQuery}
          onSearch={search}
          isRecording={isRecording}
          onMicClick={onMicClick}
          isLocationActive={isLocationActive}
          onLocationClick={onLocationClick}
          loading={loading}
          transportMode={transportMode}
          onTransportModeChange={onTransportModeChange}
          onMenuClick={onMenuClick}
        />
      </div>
    </div>
  );
};

export default SearchPanel;
