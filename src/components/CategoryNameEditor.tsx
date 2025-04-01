
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, X } from 'lucide-react';
import { useCategory } from './CategoryContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryNameEditorProps {
  categoryId: string;
}

const CategoryNameEditor = ({ categoryId }: CategoryNameEditorProps) => {
  const { categoryNames, updateCategoryName } = useCategory();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(categoryNames[categoryId] || '');

  const handleSave = () => {
    if (name.trim()) {
      updateCategoryName(categoryId, name.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setName(categoryNames[categoryId] || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center">
      {isEditing ? (
        <div className="flex items-center space-x-2 w-full">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8"
            autoFocus
          />
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <span className="font-medium">{categoryNames[categoryId] || t(categoryId) || categoryId}</span>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">{t('edit') || 'Modifier'}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryNameEditor;
