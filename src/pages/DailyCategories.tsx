import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { DailyCategoryType, DAILY_CATEGORIES, DailyContactInfo, getRelationTypeLabel } from "@/types/dailyCategories";
import { Pencil, MapPin, Plus, Star, StarOff, Trash2, User, Building, Users, Home, BookOpen, Briefcase } from "lucide-react";
import EnhancedMapComponent from "@/components/map/EnhancedMapComponent";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock data for demonstration
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

const DailyCategories = () => {
  const [activeCategory, setActiveCategory] = useState<DailyCategoryType | null>(null);
  const [contacts, setContacts] = useState<DailyContactInfo[]>(initialContacts);
  const [filteredContacts, setFilteredContacts] = useState<DailyContactInfo[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  // Create local state for geolocation functionality
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]); // Default to Paris
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [transportMode, setTransportMode] = useState('driving');
  const [searchRadius, setSearchRadius] = useState<number>(5);
  const [showMap, setShowMap] = useState(false);

  // New state for the form
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

  // We don't need the custom relation label state anymore since we're directly entering the relation type
  // Removed: const [customRelationLabel, setCustomRelationLabel] = useState('');
  // Removed: const [useCustomRelationLabel, setUseCustomRelationLabel] = useState(false);

  useEffect(() => {
    // Handle geolocation initialization if needed
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setIsLocationActive(true);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Keep default Paris coordinates
        }
      );
    }
  }, []);

  useEffect(() => {
    let result = contacts;

    // Filter by active category if selected
    if (activeCategory) {
      result = result.filter(contact => contact.category === activeCategory);
    }

    // Filter favorites if enabled
    if (showOnlyFavorites) {
      result = result.filter(contact => contact.isFavorite);
    }

    setFilteredContacts(result);
  }, [contacts, activeCategory, showOnlyFavorites]);

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
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setIsEditing(contactId);
      setFormData({
        ...contact,
      });
    }
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

  const handleFormSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.address) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // No need to handle custom relation label separately anymore
    if (isEditing) {
      // Update existing contact
      setContacts(contacts.map(contact => 
        contact.id === isEditing ? { ...contact, ...formData } : contact
      ));
      toast({
        title: "Contact mis à jour",
        description: "Les informations du contact ont été mises à jour",
      });
      setIsEditing(null);
    } else {
      // Add new contact
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
      
      setContacts([...contacts, newContact]);
      toast({
        title: "Contact ajouté",
        description: "Le nouveau contact a été ajouté avec succès",
      });
      setIsAddingNew(false);
    }
    
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

  const handleFormCancel = () => {
    setIsAddingNew(false);
    setIsEditing(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof DailyContactInfo, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const getSelectedContactsForMap = () => {
    if (selectedContactIds.size === 0) return filteredContacts;
    return filteredContacts.filter(contact => selectedContactIds.has(contact.id));
  };

  const formatContactsForMap = () => {
    return getSelectedContactsForMap().map(contact => ({
      id: contact.id,
      name: `${contact.firstName} ${contact.lastName}`,
      latitude: contact.latitude,
      longitude: contact.longitude,
      category: contact.category,
      address: contact.address,
      isFavorite: contact.isFavorite,
    }));
  };

  const getCategoryIcon = (categoryId: DailyCategoryType) => {
    switch(categoryId) {
      case 'adresse-principale': return <Home className="h-4 w-4" />;
      case 'famille': return <Users className="h-4 w-4" />;
      case 'amis': return <User className="h-4 w-4" />;
      case 'travail': return <Briefcase className="h-4 w-4" />;
      case 'ecole': return <BookOpen className="h-4 w-4" />;
      case 'activites': return <Star className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (categoryId: DailyCategoryType): string => {
    const category = DAILY_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.color || '#888888';
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  // Calculate map center based on first contact or user location
  const getMapCenter = (): [number, number] => {
    if (filteredContacts.length > 0) {
      return [filteredContacts[0].longitude, filteredContacts[0].latitude];
    }
    return userLocation;
  };

  return (
    <motion.div 
      className="container mx-auto py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quotidien</h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            {showOnlyFavorites ? <StarOff className="h-4 w-4 mr-2" /> : <Star className="h-4 w-4 mr-2" />}
            {showOnlyFavorites ? "Tous" : "Favoris"}
          </Button>
          
          <Button 
            variant={showMap ? "secondary" : "outline"} 
            size="sm"
            onClick={toggleMapView}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Carte
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all" onClick={() => setActiveCategory(null)}>
            Tous
          </TabsTrigger>
          
          {DAILY_CATEGORIES.map((category) => (
            <TabsTrigger 
              key={category.id}
              value={category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {showMap ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 h-[500px]">
          <EnhancedMapComponent 
            selectedLocations={formatContactsForMap()}
            userLocation={userLocation}
            transportMode={transportMode}
            searchRadius={searchRadius}
            center={getMapCenter()}
          />
        </div>
      ) : null}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {activeCategory ? 
            DAILY_CATEGORIES.find(c => c.id === activeCategory)?.name || "Contacts" : 
            "Tous les contacts"} 
          ({filteredContacts.length})
        </h2>
        
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau contact
        </Button>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Aucun contact trouvé dans cette catégorie.</p>
          <Button variant="outline" className="mt-4" onClick={handleAddNew}>Ajouter un contact</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div 
              key={contact.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative"
              style={{ borderLeft: `4px solid ${getCategoryColor(contact.category)}` }}
            >
              <div className="absolute top-3 right-3 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => handleToggleFavorite(contact.id)}
                >
                  {contact.isFavorite ? 
                    <Star className="h-4 w-4 text-yellow-500" fill="#f59e0b" /> : 
                    <Star className="h-4 w-4" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => handleEditContact(contact.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-start mb-2">
                <Checkbox 
                  checked={selectedContactIds.has(contact.id)}
                  onCheckedChange={() => handleToggleContactSelection(contact.id)}
                  className="mr-2 mt-1"
                />
                
                <div>
                  <div className="flex items-center">
                    <h3 className="font-bold text-lg">{contact.firstName} {contact.lastName}</h3>
                    <Badge variant="outline" className="ml-2">
                      {getCategoryIcon(contact.category)}
                      <span className="ml-1">{DAILY_CATEGORIES.find(cat => cat.id === contact.category)?.name}</span>
                    </Badge>
                  </div>
                  
                  {contact.companyName && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{contact.companyName}</span>
                    </div>
                  )}
                  
                  {contact.relationType && (
                    <div className="text-sm text-gray-500 mt-1">
                      Relation: {getRelationTypeLabel(contact.relationType)}
                    </div>
                  )}
                  
                  <div className="flex items-start mt-2 text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{contact.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Contact Dialog */}
      <Dialog open={isAddingNew || isEditing !== null} onOpenChange={(open) => {
        if (!open) handleFormCancel();
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Modifier le contact" : "Ajouter un contact"}</DialogTitle>
            <DialogDescription>
              {isEditing ? 
                "Mettez à jour les informations du contact ci-dessous." : 
                "Entrez les détails du nouveau contact ci-dessous."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input 
                id="firstName" 
                name="firstName" 
                value={formData.firstName || ''} 
                onChange={handleInputChange}
                placeholder="Prénom" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input 
                id="lastName" 
                name="lastName" 
                value={formData.lastName || ''} 
                onChange={handleInputChange}
                placeholder="Nom" 
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="companyName">Nom de société</Label>
              <Input 
                id="companyName" 
                name="companyName" 
                value={formData.companyName || ''} 
                onChange={handleInputChange}
                placeholder="Nom de la société (optionnel)" 
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address || ''} 
                onChange={handleInputChange}
                placeholder="Adresse complète" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input 
                id="latitude" 
                name="latitude" 
                type="number" 
                value={formData.latitude || ''} 
                onChange={handleInputChange}
                placeholder="Latitude" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input 
                id="longitude" 
                name="longitude" 
                type="number" 
                value={formData.longitude || ''} 
                onChange={handleInputChange}
                placeholder="Longitude" 
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: DailyCategoryType) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {DAILY_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="relationType">Type de relation</Label>
              <Input 
                id="relationType" 
                name="relationType" 
                value={formData.relationType || ''} 
                onChange={handleInputChange}
                placeholder="Entrez un type de relation" 
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleFormCancel}>Annuler</Button>
            <Button onClick={handleFormSubmit}>{isEditing ? "Mettre à jour" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default DailyCategories;
