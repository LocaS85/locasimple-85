
import { useState } from 'react';

export const useSearchInputState = () => {
  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [isRecording, setIsRecording] = useState(false);
  const [transportMode, setTransportMode] = useState('driving');
  const [showMenu, setShowMenu] = useState(false);

  return {
    searchQuery,
    setSearchQuery,
    loading,
    setLoading,
    isLocationActive,
    setIsLocationActive,
    userLocation,
    setUserLocation,
    isRecording,
    setIsRecording,
    transportMode,
    setTransportMode,
    showMenu,
    setShowMenu
  };
};

export default useSearchInputState;
