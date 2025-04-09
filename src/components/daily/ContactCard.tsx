
import React from 'react';
import { DailyContactInfo, getRelationTypeLabel, DailyCategoryType } from '@/types/dailyCategories';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Pencil, MapPin, Star, Trash2, Building } from 'lucide-react';

interface ContactCardProps {
  contact: DailyContactInfo;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  getCategoryName: (id: DailyCategoryType) => string;
  getCategoryColor: (id: DailyCategoryType) => string;
  getCategoryIcon: (id: DailyCategoryType) => React.ReactNode;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  isSelected,
  onToggleSelect,
  onToggleFavorite,
  onEdit,
  onDelete,
  getCategoryName,
  getCategoryColor,
  getCategoryIcon,
}) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-4 relative"
      style={{ borderLeft: `4px solid ${getCategoryColor(contact.category)}` }}
    >
      <div className="absolute top-2 right-2 flex space-x-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => onToggleFavorite(contact.id)}
        >
          {contact.isFavorite ? 
            <Star className="h-4 w-4 text-yellow-500" fill="#f59e0b" /> : 
            <Star className="h-4 w-4" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => onEdit(contact.id)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
          onClick={() => onDelete(contact.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-start mb-2">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(contact.id)}
          className="mr-2 mt-1"
        />
        
        <div>
          <div className="flex items-center flex-wrap gap-1">
            <h3 className="font-bold text-lg">{contact.firstName} {contact.lastName}</h3>
            <Badge variant="outline" className="ml-0 sm:ml-2 text-xs">
              {getCategoryIcon(contact.category)}
              <span className="ml-1">{getCategoryName(contact.category)}</span>
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
  );
};

export default ContactCard;
