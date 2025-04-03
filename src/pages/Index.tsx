
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SearchSection from "@/components/home/SearchSection";
import { categories } from "@/data/categories";
import CategoriesGridCompact from "@/components/categories/CategoryGrid";
import type { Result } from "@/components/ResultsList";

const Index = () => {
  const { t } = useLanguage();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [radius, setRadius] = useState(5);
  const [transportMode, setTransportMode] = useState("driving");
  const [resultsCount, setResultsCount] = useState(10);
  
  // Mock results for the SearchSection
  const mockResults: Result[] = [];

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
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
      <FeaturesSection />
    </div>
  );
};

export default Index;
