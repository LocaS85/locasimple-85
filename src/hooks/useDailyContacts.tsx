
import { useState, useEffect } from 'react';
import { DailyContactInfo, DailyCategoryType } from '@/types/dailyCategories';
import { useToast } from "@/components/ui/use-toast";

// Mock initial data
const initialContacts: DailyContactInfo[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    address: '15 Rue de Paris, 75001 Paris',
    latitude: 48.856614,
    longitude: 2.3522219,
    relationType: 'ami',
    category: 'amis',
    isFavorite: true
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Dupont',
    address: '25 Avenue des Champs-Élysées, 75008 Paris',
    latitude: 48.8698,
    longitude: 2.3075,
    relationType: 'mere',
    category: 'famille',
    isFavorite: false
  },
  {
    id: '3',
    firstName: 'Entreprise',
    lastName: 'ABC',
    companyName: 'ABC Corporation',
    address: '5 Rue de Rivoli, 75004 Paris',
    latitude: 48.8558,
    longitude: 2.3581,
    relationType: 'collegue',
    category: 'travail',
    isFavorite: true
  }
];

export const useDailyContacts = (activeCategory: DailyCategoryType | null, showOnlyFavorites: boolean) => {
  const [contacts, setContacts] = useState<DailyContactInfo[]>(initialContacts);
  const [filteredContacts, setFilteredContacts] = useState<DailyContactInfo[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    let result = contacts;

    if (activeCategory) {
      result = result.filter(contact => contact.category === activeCategory);
    }

    if (showOnlyFavorites) {
      result = result.filter(contact => contact.isFavorite);
    }

    setFilteredContacts(result);
  }, [contacts, activeCategory, showOnlyFavorites]);

  const handleAddContact = (newContact: DailyContactInfo) => {
    setContacts([...contacts, newContact]);
    toast({
      title: "Contact ajouté",
      description: "Le nouveau contact a été ajouté avec succès",
    });
  };

  const handleUpdateContact = (updatedContact: DailyContactInfo) => {
    setContacts(contacts.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
    toast({
      title: "Contact mis à jour",
      description: "Les informations du contact ont été mises à jour",
    });
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
    toast({
      title: "Contact supprimé",
      description: "Le contact a été supprimé avec succès",
    });
  };

  const handleToggleFavorite = (contactId: string) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? {...contact, isFavorite: !contact.isFavorite} 
        : contact
    ));
  };

  const handleToggleContactSelection = (contactId: string) => {
    const newSelection = new Set(selectedContactIds);
    if (newSelection.has(contactId)) {
      newSelection.delete(contactId);
    } else {
      newSelection.add(contactId);
    }
    setSelectedContactIds(newSelection);
  };

  const updateContactsCategory = (oldCategoryId: string, newCategoryId: string) => {
    setContacts(contacts.map(contact => 
      contact.category === oldCategoryId 
        ? { ...contact, category: newCategoryId as DailyCategoryType } 
        : contact
    ));
  };

  return {
    contacts,
    filteredContacts,
    selectedContactIds,
    handleAddContact,
    handleUpdateContact,
    handleDeleteContact,
    handleToggleFavorite,
    handleToggleContactSelection,
    updateContactsCategory
  };
};
