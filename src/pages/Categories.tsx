
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Home, Briefcase, Users, MapPin, GraduationCap, Book, BookOpen, School, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CategoryForm from '@/components/category/CategoryForm';
import { toast } from 'sonner';
import categoryService, { Category } from '@/services/categoryService';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState("list");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
    } catch (error: any) {
      toast.error(`Error fetching categories: ${error.message}`);
    }
  };

  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'type' | 'subcategories'>) => {
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll just refresh the categories list
      toast.success("Category added successfully!");
      setIsAdding(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(`Error adding category: ${error.message}`);
    }
  };

  const handleUpdateCategory = async (id: string, categoryData: Omit<Category, 'id' | 'type' | 'subcategories'>) => {
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll just refresh the categories list
      toast.success("Category updated successfully!");
      setIsEditing(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(`Error updating category: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll just refresh the categories list
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error: any) {
      toast.error(`Error deleting category: ${error.message}`);
    }
  };

  // Function to get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home />;
      case 'Briefcase': return <Briefcase />;
      case 'Users': return <Users />;
      case 'MapPin': return <MapPin />;
      case 'GraduationCap': return <GraduationCap />;
      case 'Book': return <Book />;
      case 'BookOpen': return <BookOpen />;
      case 'School': return <School />;
      default: return <MapPin />;
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="list">Liste des Catégories</TabsTrigger>
          <TabsTrigger value="add">Ajouter une Catégorie</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setIsEditing(true);
                          setSelectedCategory(category);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    {getIconComponent(category.type)}
                    <span className="ml-2 text-sm text-gray-500">Type: {category.type}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className="inline-block px-2 py-1 text-xs font-semibold rounded-full"
                      style={{ backgroundColor: category.color || '#333', color: 'white' }}
                    >
                      Color: {category.color}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="add">
          <CategoryForm
            onSubmit={handleAddCategory}
            onCancel={() => setIsAdding(false)}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Category Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Edit the details of the selected category.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm
              initialData={selectedCategory}
              onSubmit={(categoryData) => handleUpdateCategory(selectedCategory.id, categoryData)}
              onCancel={() => {
                setIsEditing(false);
                setSelectedCategory(null);
              }}
            />
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => {
              setIsEditing(false);
              setSelectedCategory(null);
            }}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Categories;
