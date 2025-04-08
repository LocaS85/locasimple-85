
import { Category, SubCategory } from '../categoryTypes';

const clothingSubCategories: SubCategory[] = [
  { id: 'pret-a-porter', name: 'Prêt-à-porter', parentId: 'vetements' },
  { id: 'boutiques-luxe', name: 'Boutiques de luxe', parentId: 'vetements' },
  { id: 'chaussures', name: 'Magasins de chaussures', parentId: 'vetements' },
  { id: 'accessoires', name: 'Accessoires', parentId: 'vetements' },
];

const electronicsSubCategories: SubCategory[] = [
  { id: 'telephonie', name: 'Téléphonie', parentId: 'electronique' },
  { id: 'informatique', name: 'Informatique', parentId: 'electronique' },
  { id: 'electromenager', name: 'Électroménager', parentId: 'electronique' },
];

const bookStoresSubCategories: SubCategory[] = [
  { id: 'librairies-generalistes', name: 'Généralistes', parentId: 'librairies' },
  { id: 'librairies-specialisees', name: 'Spécialisées', parentId: 'librairies' },
  { id: 'librairies-occasion', name: "D'occasion", parentId: 'librairies' },
];

const hairSalonsSubCategories: SubCategory[] = [
  { id: 'coiffeurs-hommes', name: 'Hommes', parentId: 'coiffeurs' },
  { id: 'coiffeurs-femmes', name: 'Femmes', parentId: 'coiffeurs' },
  { id: 'barbiers', name: 'Barbiers', parentId: 'coiffeurs' },
];

const beautySubCategories: SubCategory[] = [
  { id: 'salon-beaute', name: 'Salon de beauté', parentId: 'beaute' },
  { id: 'esthetique', name: 'Esthétique', parentId: 'beaute' },
  { id: 'ongleries', name: 'Ongleries', parentId: 'beaute' },
  { id: 'spa', name: 'Spa', parentId: 'beaute' },
];

const automotiveSubCategories: SubCategory[] = [
  { id: 'lavage-auto', name: 'Lavage auto', parentId: 'automobile' },
  { id: 'reparation-auto', name: 'Réparation auto', parentId: 'automobile' },
  { id: 'localisation-automobile', name: 'Localisation automatique', parentId: 'automobile' },
  { id: 'garages', name: 'Garages automobiles', parentId: 'automobile' },
  { id: 'parking', name: 'Parking', parentId: 'automobile' },
  { id: 'bornes-recharge', name: 'Bornes de recharge', parentId: 'automobile' },
  { id: 'stations-service', name: 'Stations-service', parentId: 'automobile' },
];

export const SHOPPING_CATEGORIES: Category[] = [
  {
    id: 'shopping',
    name: 'Achats',
    icon: '🛍️',
    subCategories: [
      {
        id: 'vetements',
        name: 'Magasins de vêtements',
        parentId: 'shopping',
        children: clothingSubCategories
      },
      {
        id: 'electronique',
        name: "Magasins d'électronique",
        parentId: 'shopping',
        children: electronicsSubCategories
      },
      {
        id: 'librairies',
        name: 'Bibliothèques',
        parentId: 'shopping',
        children: bookStoresSubCategories
      },
      { id: 'jouets', name: 'Magasins de jouets', parentId: 'shopping' },
      { id: 'parfumeries', name: 'Parfumeries', parentId: 'shopping' },
      { id: 'bijouteries', name: 'Bijouteries', parentId: 'shopping' },
      { id: 'opticiens-achats', name: 'Opticiens', parentId: 'shopping' },
      { id: 'sport', name: 'Magasins de sport', parentId: 'shopping' },
      { id: 'fleuristes', name: 'Fleuristes', parentId: 'shopping' },
      {
        id: 'coiffeurs',
        name: 'Coiffeurs',
        parentId: 'shopping',
        children: hairSalonsSubCategories
      },
      {
        id: 'beaute',
        name: 'Beauté',
        parentId: 'shopping',
        children: beautySubCategories
      },
      { id: 'pressing', name: 'Pressing', parentId: 'shopping' },
      {
        id: 'automobile',
        name: 'Automobile',
        parentId: 'shopping',
        children: automotiveSubCategories
      },
      { id: 'banques', name: 'Banques et DAB', parentId: 'shopping' },
    ]
  }
];
