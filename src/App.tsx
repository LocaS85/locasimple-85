
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import GoogleMapsLoader from "@/components/GoogleMapsLoader";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PlaceDetails from "./pages/PlaceDetails";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Help from "./pages/Help";
import Plan from "./pages/Plan";
import Payment from "./pages/Payment";
import Categories from "./pages/Categories";
import DailyCategories from "./pages/DailyCategories";
import DesignSystemShowcase from "./components/DesignSystemShowcase";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CategoryProvider } from "./components/CategoryContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { IconThemeProvider } from "./hooks/useIconTheme";

// Compose the App with all providers and routes
const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <CategoryProvider>
        <IconThemeProvider>
          <TooltipProvider>
            <GoogleMapsLoader>
              <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Toaster />
                <Sonner position="top-right" />
                <Routes>
                  {/* Main layout with navbar and footer */}
                  <Route element={<Layout />}>
                    {/* Home page */}
                    <Route path="/" element={<Index />} />
                    
                    {/* User pages */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/place/:id" element={<PlaceDetails />} />
                    
                    {/* Information pages */}
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/design-system" element={<DesignSystemShowcase />} />
                    
                    {/* Feature pages */}
                    <Route path="/plan" element={<Plan />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/categories/*" element={<Categories />} />
                    <Route path="/quotidien" element={<DailyCategories />} />
                    
                    {/* Fallback - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                  
                  {/* Pages without the main layout */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </div>
            </GoogleMapsLoader>
          </TooltipProvider>
        </IconThemeProvider>
      </CategoryProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
