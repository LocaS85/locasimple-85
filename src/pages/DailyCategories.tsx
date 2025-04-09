
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { DailyCategoryType, DailyContactInfo } from '@/types/dailyCategories';
import { MapPin, Plus, Star, StarOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import HorizontalScrollMenu from "@/components/daily/HorizontalScrollMenu";
import ContactCard from '@/components/daily/ContactCard';
import ContactFormDialog from '@/components/daily/ContactFormDialog';
import CategoryFormDialog from '@/components/daily/CategoryFormDialog';
import ContactsMap from '@/components/daily/ContactsMap';
import { useDailyContacts } from '@/hooks/useDailyContacts';
import { useDailyCategories } from '@/hooks/useDailyCategories';

const DailyCategories = () => {
  const navigate = useNavigate();
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

  // Geolocation state
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [isLocationActive, setIsLocationActive] = useState(false);
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

  // Effects
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setIsLocationActive(true);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  // Handlers
  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({
      firstName: '',
      lastName: '',
      companyName: '',
      address: '',
      latitude: userLocation[1] || 48.85,
      longitude: userLocation[0] || 2.35,
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
      const result = handleEditCategory();
      if (result) {
        // Update contacts with this category if needed
      }
    } else {
      const newCat = handleAddCategory();
      if (newCat) {
        // Optionally switch to the new category
        // setActiveCategory(newCat.id);
      }
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

  const handleBack = () => {
    navigate('/categories');
  };

  return (
    <motion.div 
      className="container mx-auto py-4 md:py-8 px-2 md:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBack} 
        className="mb-4 flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>

      <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6 gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">Quotidien</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            {showOnlyFavorites ? <StarOff className="h-4 w-4 mr-1" /> : <Star className="h-4 w-4 mr-1" />}
            {showOnlyFavorites ? "Tous" : "Favoris"}
          </Button>
          
          <Button 
            variant={showMap ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setShowMap(!showMap)}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Carte
          </Button>
        </div>
      </div>

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
  );
};

export default DailyCategories;
