
import React, { useState } from 'react';
import { useCategory } from '../CategoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

const CustomFieldsSection = ({ categoryId }: { categoryId: string }) => {
  const { customFields, addCustomField, updateCustomField, removeCustomField } = useCategory();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldName, setFieldName] = useState('');
  const [fieldValue, setFieldValue] = useState('');

  const fields = customFields[categoryId] || [];
  const canAddMore = fields.length < 10;

  const handleAddField = () => {
    if (fieldName && fieldValue) {
      addCustomField(categoryId, {
        id: uuidv4(),
        name: fieldName,
        value: fieldValue
      });
      setFieldName('');
      setFieldValue('');
      setIsAddingNew(false);
    }
  };

  const handleUpdateField = (fieldId: string) => {
    if (fieldName && fieldValue) {
      updateCustomField(categoryId, fieldId, {
        name: fieldName,
        value: fieldValue
      });
      setFieldName('');
      setFieldValue('');
      setEditingId(null);
    }
  };

  const startEditing = (field: { id: string, name: string, value: string }) => {
    setEditingId(field.id);
    setFieldName(field.name);
    setFieldValue(field.value);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFieldName('');
    setFieldValue('');
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-4 py-4">
      <h2 className="text-xl font-semibold">Champs personnalisés</h2>

      <AnimatePresence>
        {fields.map((field) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              {editingId === field.id ? (
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${field.id}`}>Nom</Label>
                      <Input
                        id={`name-${field.id}`}
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        placeholder="Nom du champ"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`value-${field.id}`}>Valeur</Label>
                      <Input
                        id={`value-${field.id}`}
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        placeholder="Valeur du champ"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" onClick={cancelEditing}>
                      Annuler
                    </Button>
                    <Button onClick={() => handleUpdateField(field.id)}>
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{field.name}</span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(field)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeCustomField(categoryId, field.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{field.value}</p>
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
              <CardTitle>Nouveau champ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name-new">Nom</Label>
                  <Input
                    id="name-new"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    placeholder="Nom du champ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value-new">Valeur</Label>
                  <Input
                    id="value-new"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder="Valeur du champ"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelEditing}>
                Annuler
              </Button>
              <Button onClick={handleAddField}>
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
            Ajouter un champ
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CustomFieldsSection;
