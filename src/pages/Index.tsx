
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SearchSection from "@/components/home/SearchSection";
import { categories } from "@/data/categories";
import type { Result } from "@/components/ResultsList";
import { Hotel, Store, Heart, Car, Utensils } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [radius, setRadius] = useState(5);
  const [transportMode, setTransportMode] = useState("driving");
  const [resultsCount, setResultsCount] = useState(10);
  
  // Mock results for the SearchSection
  const mockResults: Result[] = [];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  return (
    <div className="w-full">
      <HeroSection />
      <SearchSection 
        categories={categories}
        selectedCategories={selectedCategories}
        onCategorySelect={handleCategorySelect}
        radius={radius}
        onRadiusChange={setRadius}
        transportMode={transportMode}
        onTransportModeChange={setTransportMode}
        resultsCount={resultsCount}
        onResultsCountChange={setResultsCount}
        results={mockResults}
      />
      <CategoriesSection selectedCategories={selectedCategories} onCategorySelect={handleCategorySelect} />
      <FeaturesSection />
    </div>
  );
};

const CategoriesSection = ({ selectedCategories, onCategorySelect }: { selectedCategories: string[], onCategorySelect: (id: string) => void }) => {
  const { t } = useLanguage();
  
  const categoryIcons = {
    alimentation: <Utensils size={48} className="text-orange-400" />,
    shopping: <Store size={48} className="text-green-400" />,
    sante: <Heart size={48} className="text-red-400" />,
    travail: <Car size={48} className="text-purple-400" />,
    hotel: <Hotel size={48} className="text-cyan-400" />,
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-8 text-center">{t('exploreCategories') || 'Explore Categories'}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Object.entries(categoryIcons).map(([category, icon]) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`relative flex flex-col items-center justify-center p-6 rounded-xl shadow-xl transition-all 
              transform hover:scale-105 hover:-translate-y-2 
              bg-gray-900 hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-900
              ${selectedCategories.includes(category) ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''}`}
          >
            <div className="transition-all transform hover:rotate-12">
              {icon}
            </div>
            <p className="mt-2 text-white uppercase tracking-wider text-sm">
              {t(category) || category}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Index;
