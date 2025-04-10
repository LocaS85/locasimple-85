
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DailyCategoryType, DailyContactInfo } from '@/types/dailyCategories';
import { useToast } from "@/components/ui/use-toast";
import HorizontalScrollMenu from "@/components/daily/HorizontalScrollMenu";
import ContactFormDialog from '@/components/daily/ContactFormDialog';
import CategoryFormDialog from '@/components/daily/CategoryFormDialog';
import ContactsMap from '@/components/daily/ContactsMap';
import { useDailyContacts } from '@/hooks/useDailyContacts';
import { useDailyCategories } from '@/hooks/useDailyCategories';
import DailyCategoriesHeader from '@/components/daily/DailyCategoriesHeader';
import ContactsSection from '@/components/daily/ContactsSection';
import GeolocationProvider from '@/components/daily/GeolocationProvider';

const DailyCategories = () => {
  const { toast } = useToast();

  // State
  const [activeCategory, setActiveCategory] = useState<DailyCategoryType | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState<Partial<DailyContactInfo>>({
    firstName: '',
    lastName: '',
    companyName: '',
    address: '',
    latitude: 0,
    longitude: 0,
    relationType: '',
    category: 'adresse-principale',
  });

  // Map state
  const [transportMode, setTransportMode] = useState('driving');
  const [searchRadius, setSearchRadius] = useState<number>(5);

  // Custom hooks
  const {
    filteredContacts,
    selectedContactIds,
    handleAddContact,
    handleUpdateContact,
    handleDeleteContact,
    handleToggleFavorite,
    handleToggleContactSelection,
    updateContactsCategory
  } = useDailyContacts(activeCategory, showOnlyFavorites);

  const {
    categories,
    newCategory,
    isAddingCategory,
    isEditingCategory,
    getCategoryIcon,
    getCategoryColor,
    getCategoryName,
    setNewCategory,
    setIsAddingCategory,
    setIsEditingCategory,
    handleAddCategory,
    handleEditCategory,
    startEditingCategory,
    deleteCategory
  } = useDailyCategories();

  // Handlers
  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({
      firstName: '',
      lastName: '',
      companyName: '',
      address: '',
      latitude: 0,
      longitude: 0,
      relationType: '',
      category: activeCategory || 'adresse-principale',
    });
  };

  const handleEditContact = (contactId: string) => {
    const contact = filteredContacts.find(c => c.id === contactId);
    if (contact) {
      setIsEditing(contactId);
      setFormData({ ...contact });
    }
  };

  const handleFormSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.address) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (isEditing) {
      handleUpdateContact({
        ...formData,
        id: isEditing,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        address: formData.address!,
        latitude: formData.latitude!,
        longitude: formData.longitude!,
        category: formData.category as DailyCategoryType
      } as DailyContactInfo);
      setIsEditing(null);
    } else {
      const newContact: DailyContactInfo = {
        id: Date.now().toString(),
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        companyName: formData.companyName,
        address: formData.address!,
        latitude: formData.latitude!,
        longitude: formData.longitude!,
        relationType: formData.relationType,
        category: formData.category as DailyCategoryType,
        isFavorite: false
      };
      
      handleAddContact(newContact);
      setIsAddingNew(false);
    }
    
    resetForm();
  };

  const handleFormCancel = () => {
    setIsAddingNew(false);
    setIsEditing(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      companyName: '',
      address: '',
      latitude: 0,
      longitude: 0,
      relationType: '',
      category: activeCategory || 'adresse-principale',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof DailyContactInfo, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryFormSubmit = () => {
    if (isEditingCategory) {
      handleEditCategory();
    } else {
      handleAddCategory();
    }
  };

  const handleCategoryFormCancel = () => {
    setIsAddingCategory(false);
    setIsEditingCategory(null);
    setNewCategory({ name: '', color: '#10B981' });
  };

  const handleDeleteCategoryWithReassign = (categoryId: string) => {
    const defaultCategory = deleteCategory(categoryId);
    updateContactsCategory(categoryId, defaultCategory);
    
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    }
  };

  return (
    <GeolocationProvider>
      {({ userLocation }) => (
        <motion.div 
          className="container mx-auto py-4 md:py-8 px-2 md:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DailyCategoriesHeader 
            showOnlyFavorites={showOnlyFavorites}
            showMap={showMap}
            setShowOnlyFavorites={setShowOnlyFavorites}
            setShowMap={setShowMap}
          />

          <HorizontalScrollMenu 
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
            onAddCategory={() => setIsAddingCategory(true)}
          />

          {showMap && (
            <ContactsMap
              contacts={filteredContacts}
              selectedContactIds={selectedContactIds}
              userLocation={userLocation}
              transportMode={transportMode}
              searchRadius={searchRadius}
            />
          )}

          <ContactsSection 
            activeCategory={activeCategory}
            filteredContacts={filteredContacts}
            selectedContactIds={selectedContactIds}
            getCategoryName={getCategoryName}
            getCategoryColor={getCategoryColor}
            getCategoryIcon={getCategoryIcon}
            handleAddNew={handleAddNew}
            handleToggleContactSelection={handleToggleContactSelection}
            handleToggleFavorite={handleToggleFavorite}
            handleEditContact={handleEditContact}
            handleDeleteContact={handleDeleteContact}
          />

          <ContactFormDialog
            isOpen={isAddingNew || isEditing !== null}
            isEditing={isEditing}
            formData={formData}
            categories={categories}
            onClose={handleFormCancel}
            onSubmit={handleFormSubmit}
            onChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />

          <CategoryFormDialog
            isOpen={isAddingCategory || isEditingCategory !== null}
            isEditing={isEditingCategory}
            categoryData={newCategory as {name: string; color: string}}
            onClose={handleCategoryFormCancel}
            onSubmit={handleCategoryFormSubmit}
            onChange={setNewCategory}
          />
        </motion.div>
      )}
    </GeolocationProvider>
  );
};

export default DailyCategories;
