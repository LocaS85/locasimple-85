
import React from 'react';
import { useCategory } from '../CategoryContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import CategoryNameEditor from '../CategoryNameEditor';

interface CategoryHeaderProps {
  categoryId: string;
  showAddressForm: boolean;
  onPrintClick: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ 
  categoryId, 
  showAddressForm, 
  onPrintClick
}) => {
  const { addresses, categoryVisibility, toggleCategoryVisibility } = useCategory();
  const { t } = useLanguage();
  
  const currentAddresses = addresses[categoryId] || [];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold">
          <CategoryNameEditor categoryId={categoryId} />
        </h1>
        <div className="flex items-center space-x-2">
          <Switch
            id={`toggle-${categoryId}`}
            checked={categoryVisibility[categoryId]}
            onCheckedChange={() => toggleCategoryVisibility(categoryId)}
          />
          <Label htmlFor={`toggle-${categoryId}`} className="text-sm">
            {categoryVisibility[categoryId] ? t('visible') : t('hidden')}
          </Label>
        </div>
      </div>
      
      {showAddressForm && (
        <span className="text-sm text-muted-foreground">
          {currentAddresses.length}/10 {t('addresses')}
        </span>
      )}
      
      <Button variant="outline" size="sm" onClick={onPrintClick}>
        <Printer className="h-4 w-4 mr-2" />
        {t('print') || 'Imprimer'}
      </Button>
    </motion.div>
  );
};

export default CategoryHeader;
