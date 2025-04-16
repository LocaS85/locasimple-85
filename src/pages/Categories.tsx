
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CategoryForm from '@/components/category/CategoryForm';

interface Category {
  id: string;
  name: string;
  icon: string; // Adding the missing icon property
  color: string;
}

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Restaurants', icon: '🍽️', color: '#FF5733' },
    { id: '2', name: 'Shopping', icon: '🛍️', color: '#33FF57' },
    { id: '3', name: 'Divertissement', icon: '🎭', color: '#3357FF' },
    { id: '4', name: 'Santé', icon: '💊', color: '#FF33A8' },
    { id: '5', name: 'Services', icon: '🔧', color: '#33FFF3' },
    { id: '6', name: 'Transport', icon: '🚗', color: '#F3FF33' },
  ]);
  
  const [newCategory, setNewCategory] = useState<{ name: string; icon: string; color: string }>({
    name: '',
    icon: '📌',
    color: '#FF5733'
  });
  
  const addCategory = () => {
    if (newCategory.name.trim() === '') return;
    
    const newCat: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      icon: newCategory.icon,
      color: newCategory.color
    };
    
    setCategories([...categories, newCat]);
    setNewCategory({ name: '', icon: '📌', color: '#FF5733' });
  };
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/categories/${categoryId}`);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Catégories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {categories.map(category => (
          <Card 
            key={category.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCategoryClick(category.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                <span style={{ color: category.color }}>{category.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Cliquez pour voir les sous-catégories</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto">Ajouter une catégorie</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle catégorie</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input 
                id="name" 
                value={newCategory.name} 
                onChange={e => setNewCategory({...newCategory, name: e.target.value})} 
                placeholder="Nom de la catégorie"
              />
            </div>
            
            <div>
              <Label htmlFor="icon">Icône</Label>
              <Input 
                id="icon" 
                value={newCategory.icon} 
                onChange={e => setNewCategory({...newCategory, icon: e.target.value})} 
                placeholder="Emoji ou icône"
              />
            </div>
            
            <div>
              <Label htmlFor="color">Couleur</Label>
              <div className="flex gap-4">
                <Input 
                  id="color" 
                  type="color" 
                  value={newCategory.color} 
                  onChange={e => setNewCategory({...newCategory, color: e.target.value})} 
                  className="w-20 h-10"
                />
                <Input 
                  value={newCategory.color} 
                  onChange={e => setNewCategory({...newCategory, color: e.target.value})} 
                  placeholder="#HEX"
                />
              </div>
            </div>
            
            <Button onClick={addCategory} className="w-full">Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
