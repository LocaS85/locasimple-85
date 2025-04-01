
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash, Edit, Save, X } from 'lucide-react';
import { useCategory } from './CategoryContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const CustomFieldsForm = ({ categoryId }: { categoryId: string }) => {
  const { customFields, addCustomField, updateCustomField, removeCustomField } = useCategory();
  const { t } = useLanguage();
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editValue, setEditValue] = useState('');

  const fields = customFields[categoryId] || [];
  const canAddField = fields.length < 10;

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    
    addCustomField(categoryId, {
      id: `field-${Date.now()}`,
      name: newFieldName.trim(),
      value: newFieldValue.trim()
    });
    
    setNewFieldName('');
    setNewFieldValue('');
  };

  const startEditing = (field: {id: string, name: string, value: string}) => {
    setEditingField(field.id);
    setEditName(field.name);
    setEditValue(field.value);
  };

  const saveEditing = (fieldId: string) => {
    updateCustomField(categoryId, fieldId, {
      name: editName.trim(),
      value: editValue.trim()
    });
    setEditingField(null);
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('customFields') || 'Champs personnalisés'}</h3>
      
      <AnimatePresence>
        {fields.map((field) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-2">
              <CardContent className="p-3">
                {editingField === field.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={t('fieldName') || 'Nom du champ'}
                      className="mb-2"
                    />
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder={t('fieldValue') || 'Valeur'}
                      className="mb-2"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {t('cancel') || 'Annuler'}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => saveEditing(field.id)}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {t('save') || 'Enregistrer'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{field.name}</div>
                      <div className="text-sm text-muted-foreground">{field.value}</div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(field)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">{t('edit') || 'Modifier'}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(categoryId, field.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                        <span className="sr-only">{t('delete') || 'Supprimer'}</span>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {canAddField && (
        <div className="space-y-2">
          <Input
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder={t('newFieldName') || 'Nouveau champ (ex: Sport, Musique...)'}
            className="mb-2"
          />
          <Input
            value={newFieldValue}
            onChange={(e) => setNewFieldValue(e.target.value)}
            placeholder={t('newFieldValue') || 'Valeur du champ'}
            className="mb-2"
          />
          <Button
            onClick={handleAddField}
            disabled={!newFieldName.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('addField') || 'Ajouter un champ'}
          </Button>
        </div>
      )}
      
      {!canAddField && (
        <p className="text-sm text-muted-foreground">
          {t('maxFieldsReached') || 'Maximum de 10 champs atteint'}
        </p>
      )}
    </div>
  );
};

export default CustomFieldsForm;
