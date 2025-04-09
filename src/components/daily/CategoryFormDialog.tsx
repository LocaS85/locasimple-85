
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CategoryFormDialogProps {
  isOpen: boolean;
  isEditing: string | null;
  categoryData: {
    name: string;
    color: string;
  };
  onClose: () => void;
  onSubmit: () => void;
  onChange: (data: { name: string; color: string }) => void;
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  isOpen,
  isEditing,
  categoryData,
  onClose,
  onSubmit,
  onChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[400px] w-[95vw]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le groupe" : "Ajouter un groupe"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifiez les détails du groupe ci-dessous." 
              : "Entrez les détails du nouveau groupe ci-dessous."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Nom du groupe *</Label>
            <Input 
              id="groupName"
              value={categoryData.name} 
              onChange={(e) => onChange({...categoryData, name: e.target.value})}
              placeholder="Nom du groupe" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="groupColor">Couleur</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="groupColor"
                value={categoryData.color}
                onChange={(e) => onChange({...categoryData, color: e.target.value})}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">
                Choisissez une couleur pour identifier ce groupe
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onSubmit}>
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
