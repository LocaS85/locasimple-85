
import React from 'react';
import { ShoppingCart, Shirt, Coffee, Utensils, Beer, Book, Landmark, Building, Briefcase, GraduationCap, Music, Film, Gamepad, Dumbbell, Users, Heart, Home } from 'lucide-react';

export interface SubCategoryType {
  id: string;
  name: string;
  icon: React.ReactNode;
  apiKey: string;
}

export interface CategoryType {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories: SubCategoryType[];
  color: string;
}

export interface SearchFilters {
  radius: number;
  unit: 'km' | 'mi';
  transport: 'driving' | 'walking' | 'bicycling' | 'transit';
  openNow: boolean;
}

// Configuration complète des catégories
export const DAILY_SEARCH_CATEGORIES: CategoryType[] = [
  {
    id: 'achat',
    name: 'Achat',
    icon: React.createElement(ShoppingCart),
    color: '#3B82F6',
    subcategories: [
      {
        id: 'vetements',
        name: 'Vêtements',
        icon: React.createElement(Shirt),
        apiKey: 'clothing_stores'
      },
      {
        id: 'supermarche',
        name: 'Supermarchés',
        icon: React.createElement(ShoppingCart),
        apiKey: 'supermarket'
      }
    ]
  },
  {
    id: 'alimentation',
    name: 'Alimentation',
    icon: React.createElement(Utensils),
    color: '#F59E0B',
    subcategories: [
      {
        id: 'restaurants',
        name: 'Restaurants',
        icon: React.createElement(Utensils),
        apiKey: 'restaurants'
      },
      {
        id: 'cafes',
        name: 'Cafés',
        icon: React.createElement(Coffee),
        apiKey: 'cafes'
      },
      {
        id: 'bars',
        name: 'Bars',
        icon: React.createElement(Beer),
        apiKey: 'bars'
      }
    ]
  },
  {
    id: 'services',
    name: 'Services',
    icon: React.createElement(Briefcase),
    color: '#10B981',
    subcategories: [
      {
        id: 'banques',
        name: 'Banques',
        icon: React.createElement(Building), // Changed from Bank to Building which exists in lucide-react
        apiKey: 'banks'
      },
      {
        id: 'administrations',
        name: 'Administrations',
        icon: React.createElement(Landmark),
        apiKey: 'local_government_office'
      }
    ]
  },
  {
    id: 'loisirs',
    name: 'Loisirs',
    icon: React.createElement(Music),
    color: '#8B5CF6',
    subcategories: [
      {
        id: 'cinema',
        name: 'Cinémas',
        icon: React.createElement(Film),
        apiKey: 'movie_theaters'
      },
      {
        id: 'jeux',
        name: 'Jeux vidéo',
        icon: React.createElement(Gamepad),
        apiKey: 'video_game_stores'
      },
      {
        id: 'sport',
        name: 'Sport',
        icon: React.createElement(Dumbbell),
        apiKey: 'gym'
      }
    ]
  }
];
