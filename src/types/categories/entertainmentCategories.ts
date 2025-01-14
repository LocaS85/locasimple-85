import { Category } from '../categoryTypes';

export const ENTERTAINMENT_CATEGORIES: Category[] = [
  {
    id: 'divertissement',
    name: 'Divertissement et Loisirs',
    icon: '🎉',
    subCategories: [
      { id: 'cinemas', name: 'Cinémas', parentId: 'divertissement' },
      { id: 'theatres', name: 'Théâtres', parentId: 'divertissement' },
      { id: 'musees', name: 'Musées', parentId: 'divertissement' },
      { id: 'parcs-d-attractions', name: 'Parcs d\'attractions', parentId: 'divertissement' },
      { id: 'salles-de-concert', name: 'Salles de concert', parentId: 'divertissement' },
      { id: 'clubs-et-discotheques', name: 'Clubs et discothèques', parentId: 'divertissement' },
      { id: 'parcs-et-jardins', name: 'Parcs et jardins', parentId: 'divertissement' },
      { id: 'centres-de-loisirs', name: 'Centres de loisirs', parentId: 'divertissement' },
      { id: 'bowling', name: 'Bowling', parentId: 'divertissement' },
      { id: 'patinoires', name: 'Patinoires', parentId: 'divertissement' },
      { id: 'piscines', name: 'Piscines', parentId: 'divertissement' },
      { id: 'plages', name: 'Plages', parentId: 'divertissement' },
    ],
  }
];