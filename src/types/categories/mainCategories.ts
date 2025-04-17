
import { Category } from '../categoryTypes';
import { createEmojiIcon } from '@/utils/iconHelpers';

// Catégories principales
export const MAIN_CATEGORIES: Category[] = [
  {
    id: 'daily',
    name: 'Quotidien',
    icon: createEmojiIcon('🏠'),
    color: '#4CAF50',
    subcategories: []
  },
  {
    id: 'food',
    name: 'Alimentation',
    icon: createEmojiIcon('🍽️'),
    color: '#FF9800',
    subcategories: []
  },
  {
    id: 'shopping',
    name: 'Achats',
    icon: createEmojiIcon('🛍️'),
    color: '#2196F3',
    subcategories: []
  },
  {
    id: 'services',
    name: 'Services',
    icon: createEmojiIcon('🔧'),
    color: '#9C27B0',
    subcategories: []
  },
  {
    id: 'health',
    name: 'Santé et Bien-être',
    icon: createEmojiIcon('💊'),
    color: '#F44336',
    subcategories: []
  },
  {
    id: 'entertainment',
    name: 'Divertissement',
    icon: createEmojiIcon('🎭'),
    color: '#3F51B5',
    subcategories: []
  },
  {
    id: 'accommodation',
    name: 'Hébergement',
    icon: createEmojiIcon('🏨'),
    color: '#795548',
    subcategories: []
  }
];
