
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { DAILY_CATEGORIES, DailyCategory, DailyContactInfo, RELATION_TYPES } from '@/types/dailyCategories';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Star, Trash2, Edit2, MapPin } from 'lucide-react';
import EnhancedMapComponent from '@/components/map/EnhancedMapComponent';
import AddressSearch from '@/components/search/AddressSearch';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';

// Mock data storage (would be replaced with real storage solution)
const LOCAL_STORAGE_KEY = 'dailyContacts';

const DailyCategories = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<DailyCategory>(DAILY_CATEGORIES[0]);
  const [view, setView] = useState('list');
  const [contacts, setContacts] = useState<DailyContactInfo[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [newContact, setNewContact] = useState<Partial<DailyContactInfo>>({
    category: activeCategory.id,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([2.3522, 48.8566]); // Default: Paris
  
  // Filter contacts by active category
  const categoryContacts = contacts.filter(contact => contact.category === activeCategory.id);
  
  // User location
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  
  // Get user's current location
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
          setMapCenter([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Save contacts to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  // Handle address selection from the AddressSearch component
  const handleAddressSelect = (location: { name: string; longitude: number; latitude: number }) => {
    setNewContact({
      ...newContact,
      address: location.name,
      latitude: location.latitude,
      longitude: location.longitude
    });
  };

  // Save contact (new or edited)
  const handleSaveContact = () => {
    if (!newContact.firstName || !newContact.address || !newContact.latitude || !newContact.longitude) {
      toast({
        title: "Information incomplète",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    if (editingContactId) {
      // Updating existing contact
      setContacts(contacts.map(contact => 
        contact.id === editingContactId 
          ? { ...contact, ...newContact, id: editingContactId } as DailyContactInfo 
          : contact
      ));
      toast({
        title: "Contact modifié",
        description: `${newContact.firstName} ${newContact.lastName || ''} a été mis à jour.`
      });
    } else {
      // Adding new contact
      const newId = `contact-${Date.now()}`;
      const contactToAdd = { 
        ...newContact, 
        id: newId,
        isFavorite: false
      } as DailyContactInfo;
      
      setContacts([...contacts, contactToAdd]);
      toast({
        title: "Contact ajouté",
        description: `${newContact.firstName} ${newContact.lastName || ''} a été ajouté.`
      });
    }

    // Reset form and close dialog
    setNewContact({ category: activeCategory.id });
    setEditingContactId(null);
    setIsAddDialogOpen(false);
  };

  // Edit existing contact
  const handleEditContact = (contact: DailyContactInfo) => {
    setNewContact({
      firstName: contact.firstName,
      lastName: contact.lastName,
      companyName: contact.companyName,
      address: contact.address,
      latitude: contact.latitude,
      longitude: contact.longitude,
      relationType: contact.relationType,
      category: contact.category,
      isFavorite: contact.isFavorite
    });
    setEditingContactId(contact.id);
    setIsAddDialogOpen(true);
  };

  // Delete contact
  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact supprimé",
      description: "Le contact a été supprimé avec succès."
    });
  };

  // Toggle favorite status
  const handleToggleFavorite = (id: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id 
        ? { ...contact, isFavorite: !contact.isFavorite } 
        : contact
    ));
  };

  // Toggle contact selection for map view
  const handleToggleContactSelection = (id: string) => {
    setSelectedContacts(prev => 
      prev.includes(id) ? prev.filter(contactId => contactId !== id) : [...prev, id]
    );
  };

  // Format contact for map display
  const mapLocations = contacts
    .filter(contact => selectedContacts.includes(contact.id) || contact.category === activeCategory.id)
    .map(contact => ({
      id: contact.id,
      name: `${contact.firstName} ${contact.lastName || ''}`,
      latitude: contact.latitude,
      longitude: contact.longitude,
      category: contact.category,
      address: contact.address,
      isFavorite: contact.isFavorite
    }));

  // View contact details on the map
  const handleViewOnMap = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setMapCenter([contact.longitude, contact.latitude]);
      setView('map');
      
      // Ensure the contact is selected for display on the map
      if (!selectedContacts.includes(contactId)) {
        setSelectedContacts([...selectedContacts, contactId]);
      }
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 min-h-screen">
      <motion.h1 
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Quotidien
      </motion.h1>

      <Tabs value={view} onValueChange={setView} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="map">Carte</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="space-y-6">
          {/* Category Tabs */}
          <Card>
            <CardContent className="p-2 overflow-x-auto">
              <div className="flex space-x-2 py-2">
                {DAILY_CATEGORIES.map(category => (
                  <Button
                    key={category.id}
                    variant={activeCategory.id === category.id ? "default" : "outline"}
                    className={cn(
                      "flex items-center gap-2 whitespace-nowrap",
                      activeCategory.id === category.id && "shadow-md"
                    )}
                    style={{
                      backgroundColor: activeCategory.id === category.id ? category.color : undefined,
                      borderColor: category.color,
                      color: activeCategory.id === category.id ? "white" : undefined
                    }}
                    onClick={() => setActiveCategory(category)}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Add Contact Card */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex items-center justify-center h-full">
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full h-full flex flex-col items-center gap-3 p-8"
                      onClick={() => {
                        setNewContact({ category: activeCategory.id });
                        setEditingContactId(null);
                      }}
                    >
                      <PlusCircle className="h-12 w-12 text-primary" />
                      <span className="text-lg font-medium">Ajouter un contact</span>
                    </Button>
                  </DialogTrigger>
                </CardContent>
              </Card>
  
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingContactId ? 'Modifier le contact' : 'Ajouter un nouveau contact'}
                  </DialogTitle>
                </DialogHeader>
  
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={newContact.firstName || ''}
                        onChange={(e) => setNewContact({...newContact, firstName: e.target.value})}
                        placeholder="Prénom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={newContact.lastName || ''}
                        onChange={(e) => setNewContact({...newContact, lastName: e.target.value})}
                        placeholder="Nom"
                      />
                    </div>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Société / Organisation</Label>
                    <Input
                      id="companyName"
                      value={newContact.companyName || ''}
                      onChange={(e) => setNewContact({...newContact, companyName: e.target.value})}
                      placeholder="Société (optionnel)"
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse *</Label>
                    <AddressSearch 
                      onAddressSelect={handleAddressSelect}
                      placeholder="Rechercher une adresse" 
                      userLocation={userLocation}
                    />
                    {newContact.address && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Adresse sélectionnée: {newContact.address}
                      </div>
                    )}
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="relationType">Type de relation</Label>
                    <Select 
                      value={newContact.relationType || ''} 
                      onValueChange={(value) => setNewContact({
                        ...newContact, 
                        relationType: value as any
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATION_TYPES.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select 
                      value={newContact.category} 
                      onValueChange={(value) => setNewContact({
                        ...newContact, 
                        category: value as any
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAILY_CATEGORIES.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
  
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleSaveContact}>
                    {editingContactId ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Contact Cards */}
            {categoryContacts.length > 0 ? (
              categoryContacts.map((contact) => (
                <Card 
                  key={contact.id}
                  className={cn(
                    "overflow-hidden transition-all hover:shadow-md",
                    contact.isFavorite && "border-yellow-400 border-2"
                  )}
                >
                  <CardHeader 
                    className="p-4 pb-2"
                    style={{
                      backgroundColor: DAILY_CATEGORIES.find(cat => cat.id === contact.category)?.color + '20'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {DAILY_CATEGORIES.find(cat => cat.id === contact.category)?.icon}
                        </span>
                        <CardTitle className="text-lg">
                          {contact.firstName} {contact.lastName}
                        </CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={cn(
                            "rounded-full h-7 w-7",
                            contact.isFavorite && "text-yellow-500"
                          )}
                          onClick={() => handleToggleFavorite(contact.id)}
                        >
                          <Star className={cn(
                            "h-4 w-4",
                            contact.isFavorite && "fill-yellow-500"
                          )} />
                        </Button>
                      </div>
                    </div>
                    {contact.companyName && (
                      <div className="text-sm text-muted-foreground">{contact.companyName}</div>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-2">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                      <div className="text-sm">{contact.address}</div>
                    </div>
                    {contact.relationType && (
                      <div className="text-xs text-muted-foreground">
                        Relation: {RELATION_TYPES.find(type => type.id === contact.relationType)?.name}
                      </div>
                    )}
                    <div className="flex justify-between pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs" 
                        onClick={() => handleViewOnMap(contact.id)}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        Voir sur la carte
                      </Button>
                      <div className="space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditContact(contact)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-muted-foreground">
                <p>Aucun contact dans cette catégorie.</p>
                <p>Cliquez sur "Ajouter un contact" pour commencer.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardContent className="p-4 h-[70vh]">
              <EnhancedMapComponent 
                selectedLocations={mapLocations}
                userLocation={userLocation}
                transportMode="driving"
                searchRadius={5}
                mapCenter={mapCenter}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">Contacts sélectionnés</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-48">
                {contacts.length > 0 ? (
                  <div className="space-y-2">
                    {contacts.map(contact => (
                      <div 
                        key={contact.id} 
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => handleToggleContactSelection(contact.id)}
                            className="checkbox"
                          />
                          <span>{DAILY_CATEGORIES.find(cat => cat.id === contact.category)?.icon}</span>
                          <span>{contact.firstName} {contact.lastName}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewOnMap(contact.id)}
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Centrer
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>Aucun contact disponible.</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyCategories;
