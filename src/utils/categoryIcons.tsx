import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Utensils, 
  Heart, 
  Briefcase, 
  BookOpen, 
  Film, 
  Hotel, 
  Coffee,
  Scissors,
  Map,
  Phone,
  Clock,
  Pizza,
  Wine,
  Beer,
  Smartphone,
  Laptop,
  Tv,
  Shirt,
  ShoppingCart,
  BookOpen as Book,
  Baby,
  Pill,
  Sparkles,
  GraduationCap,
  Bus,
  Car,
  CreditCard,
  Circle,
  BatteryCharging,
  Fuel,
  Building,
  Mail,
  Building2,
  UserCheck,
  Siren,
  Flag,
  Users,
  Landmark,
  BadgeDollarSign,
  Stethoscope,
  Glasses,
  Microscope,
  Brain,
  Dog,
  Cross,
  Music,
  Ticket,
  Gamepad2,
  Umbrella,
  Palmtree,
  Star,
  MapPin,
  CircleEllipsis,
  Search,
  Droplets
} from 'lucide-react';

export const getCategoryIcon = (categoryId: string, className = "h-12 w-12") => {
  // Main categories
  switch (categoryId) {
    // Main categories
    case 'adresse-principale':
      return <Home className={`${className} text-primary`} />;
    case 'famille':
      return <Users className={`${className} text-secondary`} />;
    case 'travail':
      return <Briefcase className={`${className} text-success`} />;
    case 'ecole':
      return <BookOpen className={`${className} text-accent`} />;
    
    // Main category groups
    case 'alimentation':
      return <Utensils className={`${className} text-green-500`} />;
    case 'achats':
      return <ShoppingBag className={`${className} text-blue-500`} />;
    case 'services':
      return <Star className={`${className} text-orange-500`} />;
    case 'sante':
      return <Heart className={`${className} text-red-500`} />;
    case 'divertissement':
      return <Film className={`${className} text-purple-500`} />;
    case 'hebergement':
      return <Hotel className={`${className} text-pink-500`} />;
    case 'divers':
      return <CircleEllipsis className={`${className} text-teal-500`} />;
    
    // Food subcategories
    case 'restaurants':
      return <Utensils className={`${className} text-orange-400`} />;
    case 'gastronomie':
      return <Utensils className={`${className}`} />;
    case 'rapide':
      return <Pizza className={`${className}`} />;
    case 'vegetariens':
      return <Utensils className={`${className} text-green-400`} />;
    case 'pizza':
      return <Pizza className={`${className}`} />;
    case 'sushi':
      return <Utensils className={`${className}`} />;
    case 'cuisine-monde':
      return <Map className={`${className}`} />;
    case 'bars':
      return <Beer className={`${className}`} />;
    case 'bars-vin':
      return <Wine className={`${className}`} />;
    case 'pubs':
      return <Beer className={`${className}`} />;
    case 'bars-cocktails':
      return <Wine className={`${className}`} />;
    case 'cafes-salons':
      return <Coffee className={`${className}`} />;
    case 'cafes':
      return <Coffee className={`${className}`} />;
    case 'salons-the':
      return <Coffee className={`${className}`} />;
    case 'boulangeries':
      return <Utensils className={`${className}`} />;
    case 'supermarches':
      return <ShoppingCart className={`${className}`} />;
    case 'vente-emporter':
      return <ShoppingBag className={`${className}`} />;
    case 'livraison':
      return <ShoppingBag className={`${className}`} />;
    
    // Shopping subcategories
    case 'vetements':
      return <Shirt className={`${className}`} />;
    case 'pret-a-porter':
      return <Shirt className={`${className}`} />;
    case 'boutiques-luxe':
      return <Shirt className={`${className}`} />;
    case 'chaussures':
      return <ShoppingBag className={`${className}`} />;
    case 'accessoires':
      return <ShoppingBag className={`${className}`} />;
    case 'electronique':
      return <Smartphone className={`${className}`} />;
    case 'telephonie':
      return <Smartphone className={`${className}`} />;
    case 'informatique':
      return <Laptop className={`${className}`} />;
    case 'electromenager':
      return <Tv className={`${className}`} />;
    case 'bibliotheques':
      return <Book className={`${className}`} />;
    case 'generalistes':
      return <Book className={`${className}`} />;
    case 'specialisees':
      return <Book className={`${className}`} />;
    case 'occasion':
      return <Book className={`${className}`} />;
    case 'jouets':
      return <Baby className={`${className}`} />;
    case 'pharmacies':
      return <Pill className={`${className}`} />;
    case 'parfumeries':
      return <Sparkles className={`${className}`} />;
    case 'bijouteries':
      return <Sparkles className={`${className}`} />;
    case 'opticiens':
      return <Glasses className={`${className}`} />;
    case 'sport':
      return <Heart className={`${className}`} />;
    case 'fleuristes':
      return <Sparkles className={`${className}`} />;
    case 'coiffeurs':
      return <Scissors className={`${className}`} />;
    case 'hommes':
      return <Scissors className={`${className}`} />;
    case 'femmes':
      return <Scissors className={`${className}`} />;
    case 'barbiers':
      return <Scissors className={`${className}`} />;
    case 'beaute':
      return <Sparkles className={`${className}`} />;
    case 'salon-beaute':
      return <Sparkles className={`${className}`} />;
    case 'esthetique':
      return <Sparkles className={`${className}`} />;
    case 'ongleries':
      return <Scissors className={`${className}`} />;
    case 'spa':
      return <Heart className={`${className}`} />;
    case 'pressing':
      return <Shirt className={`${className}`} />;
    case 'automobile':
      return <Car className={`${className}`} />;
    case 'lavage-auto':
      return <Car className={`${className}`} />;
    case 'reparation-auto':
      return <Car className={`${className}`} />;
    case 'localisation-auto':
      return <Car className={`${className}`} />;
    case 'garages':
      return <Car className={`${className}`} />;
    case 'parking':
      return <Car className={`${className}`} />;
    case 'bornes-recharge':
      return <BatteryCharging className={`${className}`} />;
    case 'stations-service':
      return <Fuel className={`${className}`} />;
    case 'banques':
      return <CreditCard className={`${className}`} />;
    
    // Services subcategories
    case 'poste':
      return <Mail className={`${className}`} />;
    case 'assurances':
      return <Building className={`${className}`} />;
    case 'immobilier':
      return <Building2 className={`${className}`} />;
    case 'services-publics':
      return <Landmark className={`${className}`} />;
    case 'mairie':
      return <Landmark className={`${className}`} />;
    case 'police':
      return <UserCheck className={`${className}`} />;
    case 'pompiers':
      return <Siren className={`${className}`} />;
    case 'ambassade':
      return <Flag className={`${className}`} />;
    case 'emploi':
      return <Briefcase className={`${className}`} />;
    case 'impots':
      return <BadgeDollarSign className={`${className}`} />;
    
    // Health subcategories
    case 'hopitaux':
      return <Heart className={`${className}`} />;
    case 'cliniques':
      return <Heart className={`${className}`} />;
    case 'dentistes':
      return <Stethoscope className={`${className}`} />;
    case 'medecins':
      return <Stethoscope className={`${className}`} />;
    case 'laboratoires':
      return <Microscope className={`${className}`} />;
    case 'radiologie':
      return <Microscope className={`${className}`} />;
    case 'psychologues':
      return <Brain className={`${className}`} />;
    case 'veterinaires':
      return <Dog className={`${className}`} />;
    
    // Entertainment subcategories
    case 'cinemas':
      return <Film className={`${className}`} />;
    case 'theatres':
      return <Ticket className={`${className}`} />;
    case 'musees':
      return <Landmark className={`${className}`} />;
    case 'parcs-attractions':
      return <Ticket className={`${className}`} />;
    case 'salles-concert':
      return <Music className={`${className}`} />;
    case 'clubs':
      return <Music className={`${className}`} />;
    case 'parcs':
      return <Umbrella className={`${className}`} />;
    case 'centres-loisirs':
      return <Gamepad2 className={`${className}`} />;
    case 'bowling':
      return <Circle className={`${className}`} />;
    case 'patinoires':
      return <Circle className={`${className}`} />;
    case 'piscines':
      return <Droplets className={`${className}`} />;
    case 'plages':
      return <Palmtree className={`${className}`} />;
    
    // Accommodation subcategories
    case 'hotels':
      return <Hotel className={`${className}`} />;
    case 'auberges':
      return <Hotel className={`${className}`} />;
    case 'chambres-hotes':
      return <Hotel className={`${className}`} />;
    case 'camping':
      return <Umbrella className={`${className}`} />;
    case 'locations-vacances':
      return <Home className={`${className}`} />;
    
    // Default case
    default:
      return <MapPin className={`${className} text-gray-500`} />;
  }
};
