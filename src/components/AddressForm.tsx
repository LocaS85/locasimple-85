
import React from 'react';
import { useForm } from 'react-hook-form';
import { useCategory } from './CategoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { TransportMode } from '@/types/categoryTypes';
import { transportModesWithColors } from '@/data/transportModesWithColors';

interface AddressFormData {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  transportMode: TransportMode;
}

export const AddressForm = ({ categoryId }: { categoryId: string }) => {
  const { register, handleSubmit, reset, setValue } = useForm<AddressFormData>();
  const { addAddress } = useCategory();
  const { toast } = useToast();

  const onSubmit = (data: AddressFormData) => {
    // Add default values for required fields
    addAddress(categoryId, {
      id: crypto.randomUUID(),
      ...data,
      latitude: 0, // Default value
      longitude: 0, // Default value
      category: categoryId,
      isFavorite: false, // Default value
    });
    
    toast({
      title: "Adresse ajoutée",
      description: "L'adresse a été ajoutée avec succès.",
    });
    reset();
  };

  // Filter transport modes to only show common ones
  const commonTransportModes = transportModesWithColors
    .filter(mode => ['car', 'train', 'bus', 'public', 'bike', 'walk', 'plane'].includes(mode.id));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" {...register('name', { required: true })} placeholder="Ex: Maison de Papa" />
      </div>

      <div>
        <Label htmlFor="street">Rue</Label>
        <Input id="street" {...register('street', { required: true })} placeholder="123 rue Example" />
      </div>

      <div>
        <Label htmlFor="city">Ville</Label>
        <Input id="city" {...register('city', { required: true })} placeholder="Paris" />
      </div>

      <div>
        <Label htmlFor="postalCode">Code Postal</Label>
        <Input id="postalCode" {...register('postalCode', { required: true })} placeholder="75000" />
      </div>

      <div>
        <Label htmlFor="country">Pays</Label>
        <Input id="country" {...register('country', { required: true })} defaultValue="France" placeholder="France" />
      </div>

      <div>
        <Label htmlFor="transportMode">Mode de transport</Label>
        <Select onValueChange={(value: TransportMode) => setValue('transportMode', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un mode de transport" />
          </SelectTrigger>
          <SelectContent>
            {commonTransportModes.map(mode => (
              <SelectItem key={mode.id} value={mode.id}>{mode.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Ajouter l'adresse</Button>
    </form>
  );
};
