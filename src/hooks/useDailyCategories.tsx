
import { useState } from 'react';
import { DailyCategory, DAILY_CATEGORIES } from '@/types/dailyCategories';
import { useToast } from "@/components/ui/use-toast";
import { Home, Users, User, Briefcase, BookOpen, Star, MapPin } from 'lucide-react';

export const useDailyCategories = () => {
  const [categories, setCategories] = useState<DailyCategory[]>(DAILY_CATEGORIES);
  const [newCategory, setNewCategory] = useState<Partial<DailyCategory>>({
    name: '',
    color: '#10B981'
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const getCategoryIcon = (categoryId: string) => {
    switch(categoryId) {
      case 'adresse-principale': return <Home className="h-4 w-4" />;
      case 'famille': return <Users className="h-4 w-4" />;
      case 'amis': return <User className="h-4 w-4" />;
      case 'travail': return <Briefcase className="h-4 w-4" />;
      case 'ecole': return <BookOpen className="h-4 w-4" />;
      case 'activites': return <Star className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#888888';
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Information manquante",
        description: "Veuillez entrer un nom pour le groupe",
        variant: "destructive"
      });
      return;
    }

    const categoryId = `custom-${Date.now()}`;
    const category: DailyCategory = {
      id: categoryId,
      name: newCategory.name,
      icon: '📁',
      color: newCategory.color || '#10B981',
      isCustom: true
    };

    setCategories([...categories, category]);
    setIsAddingCategory(false);
    setNewCategory({ name: '', color: '#10B981' });
    toast({
      title: "Groupe ajouté",
      description: "Le nouveau groupe a été ajouté avec succès",
    });

    return category;
  };

  const handleEditCategory = () => {
    if (isEditingCategory && newCategory.name) {
      setCategories(categories.map(cat => 
        cat.id === isEditingCategory
          ? { ...cat, name: newCategory.name, color: newCategory.color || cat.color }
          : cat
      ));
      
      const result = {
        id: isEditingCategory,
        name: newCategory.name,
        color: newCategory.color || '#10B981'
      };
      
      setIsEditingCategory(null);
      setNewCategory({ name: '', color: '#10B981' });
      
      toast({
        title: "Groupe mis à jour",
        description: "Le groupe a été renommé avec succès",
      });
      
      return result;
    }
    return null;
  };

  const startEditingCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category && category.isCustom) {
      setIsEditingCategory(categoryId);
      setNewCategory({
        name: category.name,
        color: category.color
      });
      return true;
    }
    return false;
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    
    toast({
      title: "Groupe supprimé",
      description: "Le groupe a été supprimé avec succès",
    });
    
    return 'adresse-principale'; // Default category to reassign contacts
  };

  return {
    categories,
    newCategory,
    isAddingCategory,
    isEditingCategory,
    getCategoryIcon,
    getCategoryColor,
    getCategoryName,
    setNewCategory,
    setIsAddingCategory,
    setIsEditingCategory,
    handleAddCategory,
    handleEditCategory,
    startEditingCategory,
    deleteCategory
  };
};
