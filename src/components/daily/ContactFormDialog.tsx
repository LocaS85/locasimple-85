
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DailyCategory, DailyCategoryType, DailyContactInfo } from '@/types/dailyCategories';

interface ContactFormDialogProps {
  isOpen: boolean;
  isEditing: string | null;
  formData: Partial<DailyContactInfo>;
  categories: DailyCategory[];
  onClose: () => void;
  onSubmit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: keyof DailyContactInfo, value: any) => void;
}

const ContactFormDialog: React.FC<ContactFormDialogProps> = ({
  isOpen,
  isEditing,
  formData,
  categories,
  onClose,
  onSubmit,
  onChange,
  onSelectChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
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
              onChange={onChange}
              placeholder="Prénom" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom *</Label>
            <Input 
              id="lastName" 
              name="lastName" 
              value={formData.lastName || ''} 
              onChange={onChange}
              placeholder="Nom" 
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label htmlFor="companyName">Nom de société</Label>
            <Input 
              id="companyName" 
              name="companyName" 
              value={formData.companyName || ''} 
              onChange={onChange}
              placeholder="Nom de la société (optionnel)" 
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label htmlFor="address">Adresse *</Label>
            <Input 
              id="address" 
              name="address" 
              value={formData.address || ''} 
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              placeholder="Longitude" 
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => onSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
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
              onChange={onChange}
              placeholder="Entrez un type de relation" 
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={onSubmit}>{isEditing ? "Mettre à jour" : "Ajouter"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormDialog;
