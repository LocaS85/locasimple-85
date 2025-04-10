
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { DailyContactInfo, DailyCategoryType } from '@/types/dailyCategories';
import ContactCard from './ContactCard';

interface ContactsSectionProps {
  activeCategory: DailyCategoryType | null;
  filteredContacts: DailyContactInfo[];
  selectedContactIds: Set<string>;
  getCategoryName: (id: DailyCategoryType) => string;
  getCategoryColor: (id: DailyCategoryType) => string;
  getCategoryIcon: (id: DailyCategoryType) => React.ReactNode;
  handleAddNew: () => void;
  handleToggleContactSelection: (id: string) => void;
  handleToggleFavorite: (id: string) => void;
  handleEditContact: (id: string) => void;
  handleDeleteContact: (id: string) => void;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({
  activeCategory,
  filteredContacts,
  selectedContactIds,
  getCategoryName,
  getCategoryColor,
  getCategoryIcon,
  handleAddNew,
  handleToggleContactSelection,
  handleToggleFavorite,
  handleEditContact,
  handleDeleteContact
}) => {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-3 md:mb-4 gap-2">
        <h2 className="text-lg md:text-xl font-semibold">
          {activeCategory ? 
            getCategoryName(activeCategory) : 
            "Tous les contacts"} 
          ({filteredContacts.length})
        </h2>
        
        <Button onClick={handleAddNew} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Nouveau contact
        </Button>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 md:p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Aucun contact trouvé dans cette catégorie.</p>
          <Button variant="outline" className="mt-4" onClick={handleAddNew}>Ajouter un contact</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isSelected={selectedContactIds.has(contact.id)}
              onToggleSelect={handleToggleContactSelection}
              onToggleFavorite={handleToggleFavorite}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
              getCategoryName={getCategoryName}
              getCategoryColor={getCategoryColor}
              getCategoryIcon={getCategoryIcon}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ContactsSection;
