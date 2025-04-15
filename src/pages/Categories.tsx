import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Home, Briefcase, Users, MapPin, GraduationCap, Book, BookOpen, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addCategory, deleteCategory, getCategories, updateCategory } from '@/services/categoryService';
import CategoryForm from '@/components/category/CategoryForm';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
}

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
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error: any) {
      toast.error(`Error fetching categories: ${error.message}`);
    }
  };

  const handleAddCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      await addCategory(categoryData);
      fetchCategories();
      setIsAdding(false);
      toast.success("Category added successfully!");
    } catch (error: any) {
      toast.error(`Error adding category: ${error.message}`);
    }
  };

  const handleUpdateCategory = async (id: string, categoryData: Omit<Category, 'id'>) => {
    try {
      await updateCategory(id, categoryData);
      fetchCategories();
      setIsEditing(false);
      setSelectedCategory(null);
      toast.success("Category updated successfully!");
    } catch (error: any) {
      toast.error(`Error updating category: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      fetchCategories();
      toast.success("Category deleted successfully!");
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
                    {getIconComponent(category.icon)}
                    <span className="ml-2 text-sm text-gray-500">Icon: {category.icon}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className="inline-block px-2 py-1 text-xs font-semibold rounded-full"
                      style={{ backgroundColor: category.color, color: 'white' }}
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

      {/* Edit Category Modal */}
      {isEditing && selectedCategory && (
        <Modal open={isEditing} onOpenChange={setIsEditing}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Edit Category</ModalTitle>
              <ModalDescription>
                Edit the details of the selected category.
              </ModalDescription>
            </ModalHeader>
            <CategoryForm
              initialData={selectedCategory}
              onSubmit={(categoryData) => handleUpdateCategory(selectedCategory.id, categoryData)}
              onCancel={() => {
                setIsEditing(false);
                setSelectedCategory(null);
              }}
            />
            <ModalFooter>
              <Button type="button" variant="secondary" onClick={() => {
                setIsEditing(false);
                setSelectedCategory(null);
              }}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </motion.div>
  );
};

export default Categories;
