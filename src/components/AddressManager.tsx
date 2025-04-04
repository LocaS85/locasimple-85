
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useCategory } from './CategoryContext';
import { TransportModeSelector } from './TransportModeSelector';
import { Address, TransportMode } from '@/types/categoryTypes';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

interface AddressManagerProps {
  categoryId: string;
  maxAddresses?: number;
  allowedRoles?: string[];
  title?: string;
}

export function AddressManager({ 
  categoryId, 
  maxAddresses = 10,
  allowedRoles,
  title
}: AddressManagerProps) {
  const { addresses, addAddress, removeAddress, updateAddress } = useCategory();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    transportMode: 'car' as TransportMode
  });
  
  const currentAddresses = addresses[categoryId] || [];
  const canAddMore = currentAddresses.length < maxAddresses;
  
  const handleAddNew = () => {
    if (newAddress.name && newAddress.street && newAddress.city) {
      addAddress(categoryId, {
        id: uuidv4(),
        name: newAddress.name,
        street: newAddress.street,
        city: newAddress.city,
        postalCode: newAddress.postalCode || '',
        country: newAddress.country || 'France',
        transportMode: newAddress.transportMode || 'car'
      });
      
      setNewAddress({
        name: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'France',
        transportMode: 'car' as TransportMode
      });
      
      setIsAddingNew(false);
    }
  };
  
  const handleUpdate = (addressId: string) => {
    if (newAddress.name && newAddress.street && newAddress.city) {
      updateAddress(categoryId, addressId, {
        id: addressId,
        name: newAddress.name,
        street: newAddress.street,
        city: newAddress.city,
        postalCode: newAddress.postalCode || '',
        country: newAddress.country || 'France',
        transportMode: newAddress.transportMode || 'car'
      });
      
      setEditingId(null);
      setNewAddress({
        name: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'France',
        transportMode: 'car' as TransportMode
      });
    }
  };
  
  const startEditing = (address: Address) => {
    setEditingId(address.id);
    setNewAddress({
      name: address.name,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      transportMode: address.transportMode
    });
  };
  
  const cancelEditing = () => {
    setEditingId(null);
    setNewAddress({
      name: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
      transportMode: 'car' as TransportMode
    });
    setIsAddingNew(false);
  };
  
  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      
      <AnimatePresence>
        {currentAddresses.map((address) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              {editingId === address.id ? (
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${address.id}`}>Nom</Label>
                      <Input
                        id={`name-${address.id}`}
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        placeholder="Nom de l'adresse"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`street-${address.id}`}>Adresse</Label>
                      <Input
                        id={`street-${address.id}`}
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                        placeholder="Rue et numéro"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor={`city-${address.id}`}>Ville</Label>
                        <Input
                          id={`city-${address.id}`}
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          placeholder="Ville"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`postal-${address.id}`}>Code postal</Label>
                        <Input
                          id={`postal-${address.id}`}
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                          placeholder="Code postal"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`transport-${address.id}`}>Mode de transport</Label>
                      <TransportModeSelector
                        value={newAddress.transportMode as TransportMode}
                        onChange={(value) => setNewAddress({...newAddress, transportMode: value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" onClick={cancelEditing}>
                      Annuler
                    </Button>
                    <Button onClick={() => handleUpdate(address.id)}>
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{address.name}</span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(address)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeAddress(categoryId, address.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{address.street}</p>
                      <p className="text-sm text-muted-foreground">{address.postalCode} {address.city}</p>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getTransportModeColor(address.transportMode) }}
                        />
                        <p className="text-xs text-muted-foreground">
                          {getTransportModeName(address.transportMode)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isAddingNew ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle adresse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name-new">Nom</Label>
                  <Input
                    id="name-new"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                    placeholder="Nom de l'adresse"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="street-new">Adresse</Label>
                  <Input
                    id="street-new"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                    placeholder="Rue et numéro"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="city-new">Ville</Label>
                    <Input
                      id="city-new"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      placeholder="Ville"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-new">Code postal</Label>
                    <Input
                      id="postal-new"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                      placeholder="Code postal"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transport-new">Mode de transport</Label>
                  <TransportModeSelector
                    value={newAddress.transportMode as TransportMode}
                    onChange={(value) => setNewAddress({...newAddress, transportMode: value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelEditing}>
                Annuler
              </Button>
              <Button onClick={handleAddNew}>
                Ajouter
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : canAddMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsAddingNew(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une adresse
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Utility functions
function getTransportModeColor(transportMode: string): string {
  // Import this from transportModesWithColors
  const colorMap: Record<string, string> = {
    'car': '#3b82f6',
    'train': '#000000',
    'bus': '#eab308',
    'public': '#6b7280',
    'bike': '#ef4444',
    'walk': '#22c55e',
    'plane': '#06b6d4',
    'metro': '#8b5cf6',
    'tram': '#f97316',
    'coach': '#92400e',
    'airport': '#9333ea',
    'airstrip': '#ec4899'
  };
  
  return colorMap[transportMode] || '#3b82f6';
}

function getTransportModeName(transportMode: string): string {
  const nameMap: Record<string, string> = {
    'car': 'Voiture',
    'train': 'Train',
    'bus': 'Bus',
    'public': 'Transports en commun',
    'bike': 'Vélo',
    'walk': 'À pied',
    'plane': 'Avion',
    'metro': 'Métro',
    'tram': 'Tramway',
    'coach': 'Cars',
    'airport': 'Aéroport',
    'airstrip': 'Aérodrome'
  };
  
  return nameMap[transportMode] || transportMode;
}
