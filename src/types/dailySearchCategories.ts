
import React from 'react';
import { ShoppingCart, Shirt, Coffee, Utensils, Beer, Book, Landmark, Bank, Briefcase, GraduationCap, Music, Film, Gamepad, Dumbbell, Users, Heart, Home } from 'lucide-react';

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
    icon: <ShoppingCart />,
    color: '#3B82F6',
    subcategories: [
      {
        id: 'vetements',
        name: 'Vêtements',
        icon: <Shirt />,
        apiKey: 'clothing_stores'
      },
      {
        id: 'supermarche',
        name: 'Supermarchés',
        icon: <ShoppingCart />,
        apiKey: 'supermarket'
      }
    ]
  },
  {
    id: 'alimentation',
    name: 'Alimentation',
    icon: <Utensils />,
    color: '#F59E0B',
    subcategories: [
      {
        id: 'restaurants',
        name: 'Restaurants',
        icon: <Utensils />,
        apiKey: 'restaurants'
      },
      {
        id: 'cafes',
        name: 'Cafés',
        icon: <Coffee />,
        apiKey: 'cafes'
      },
      {
        id: 'bars',
        name: 'Bars',
        icon: <Beer />,
        apiKey: 'bars'
      }
    ]
  },
  {
    id: 'services',
    name: 'Services',
    icon: <Briefcase />,
    color: '#10B981',
    subcategories: [
      {
        id: 'banques',
        name: 'Banques',
        icon: <Bank />,
        apiKey: 'banks'
      },
      {
        id: 'administrations',
        name: 'Administrations',
        icon: <Landmark />,
        apiKey: 'local_government_office'
      }
    ]
  },
  {
    id: 'loisirs',
    name: 'Loisirs',
    icon: <Music />,
    color: '#8B5CF6',
    subcategories: [
      {
        id: 'cinema',
        name: 'Cinémas',
        icon: <Film />,
        apiKey: 'movie_theaters'
      },
      {
        id: 'jeux',
        name: 'Jeux vidéo',
        icon: <Gamepad />,
        apiKey: 'video_game_stores'
      },
      {
        id: 'sport',
        name: 'Sport',
        icon: <Dumbbell />,
        apiKey: 'gym'
      }
    ]
  }
];
