
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SearchSection from "@/components/home/SearchSection";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <HeroSection />
      <SearchSection />
      <FeaturesSection />
    </div>
  );
};

export default Index;
