
import React from 'react';
import EnhancedMapComponent from '@/components/map/EnhancedMapComponent';
import { DailyContactInfo } from '@/types/dailyCategories';

interface ContactsMapProps {
  contacts: DailyContactInfo[];
  selectedContactIds: Set<string>;
  userLocation: [number, number];
  transportMode: string;
  searchRadius: number;
}

interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
  isFavorite?: boolean;
}

const ContactsMap: React.FC<ContactsMapProps> = ({
  contacts,
  selectedContactIds,
  userLocation,
  transportMode,
  searchRadius
}) => {
  const getSelectedContacts = () => {
    if (selectedContactIds.size === 0) return contacts;
    return contacts.filter(contact => selectedContactIds.has(contact.id));
  };

  const formatContactsForMap = (): MapLocation[] => {
    return getSelectedContacts().map(contact => ({
      id: contact.id,
      name: `${contact.firstName} ${contact.lastName}`,
      latitude: contact.latitude,
      longitude: contact.longitude,
      category: contact.category,
      address: contact.address,
      isFavorite: contact.isFavorite,
    }));
  };

  const getMapCenter = (): [number, number] => {
    if (contacts.length > 0) {
      return [contacts[0].longitude, contacts[0].latitude];
    }
    return userLocation;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 md:mb-6 h-[300px] md:h-[500px]">
      <EnhancedMapComponent 
        selectedLocations={formatContactsForMap()}
        userLocation={userLocation}
        transportMode={transportMode}
        searchRadius={searchRadius}
        center={getMapCenter()}
      />
    </div>
  );
};

export default ContactsMap;
