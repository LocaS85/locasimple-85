
import { Home, Utensils, ShoppingBag, Heart, Briefcase, BookOpen, Film, Hotel } from 'lucide-react';

export const categories = [
  { id: 'alimentation', name: 'Alimentation', icon: Utensils, link: '/search?category=alimentation' },
  { id: 'divertissement', name: 'Divertissement', icon: Film, link: '/search?category=divertissement' },
  { id: 'sante', name: 'Santé', icon: Heart, link: '/search?category=sante' },
  { id: 'travail', name: 'Travail', icon: Briefcase, link: '/search?category=travail' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, link: '/search?category=shopping' },
  { id: 'education', name: 'Éducation', icon: BookOpen, link: '/search?category=education' },
  { id: 'home', name: 'Domicile', icon: Home, link: '/search?category=home' },
  { id: 'hotel', name: 'Hôtels', icon: Hotel, link: '/search?category=hotel' }
];
