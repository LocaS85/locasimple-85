
import { Category, SubCategory } from '../categoryTypes';

const vetementSubCategories: SubCategory[] = [
  { id: 'pret-a-porter', name: 'Prêt-à-porter', parentId: 'vetements' },
  { id: 'boutiques-luxe', name: 'Boutiques de luxe', parentId: 'vetements' },
  { id: 'chaussures', name: 'Magasins de chaussures', parentId: 'vetements' },
  { id: 'accessoires', name: 'Accessoires', parentId: 'vetements' },
];

const electroniqueSubCategories: SubCategory[] = [
  { id: 'telephonie', name: 'Téléphonie', parentId: 'electronique' },
  { id: 'informatique', name: 'Informatique', parentId: 'electronique' },
  { id: 'electromenager', name: 'Électroménager', parentId: 'electronique' },
];

const bibliothequeSubCategories: SubCategory[] = [
  { id: 'generalistes', name: 'Généralistes', parentId: 'bibliotheques' },
  { id: 'specialisees', name: 'Spécialisées', parentId: 'bibliotheques' },
  { id: 'occasion', name: "D'occasion", parentId: 'bibliotheques' },
];

const coiffureSubCategories: SubCategory[] = [
  { id: 'hommes', name: 'Hommes', parentId: 'coiffeurs' },
  { id: 'femmes', name: 'Femmes', parentId: 'coiffeurs' },
  { id: 'barbiers', name: 'Barbiers', parentId: 'coiffeurs' },
];

const beauteSubCategories: SubCategory[] = [
  { id: 'salon-beaute', name: 'Salon de beauté', parentId: 'beaute' },
  { id: 'esthetique', name: 'Esthétique', parentId: 'beaute' },
  { id: 'ongleries', name: 'Ongleries', parentId: 'beaute' },
  { id: 'spa', name: 'Spa', parentId: 'beaute' },
];

const automobileSubCategories: SubCategory[] = [
  { id: 'lavage-auto', name: 'Lavage auto', parentId: 'automobile' },
  { id: 'reparation-auto', name: 'Réparation auto', parentId: 'automobile' },
  { id: 'localisation-auto', name: 'Localisation automatique', parentId: 'automobile' },
  { id: 'garages', name: 'Garages automobiles', parentId: 'automobile' },
  { id: 'parking', name: 'Parking', parentId: 'automobile' },
  { id: 'bornes-recharge', name: 'Bornes de recharge', parentId: 'automobile' },
  { id: 'stations-service', name: 'Stations-service', parentId: 'automobile' },
];

export const SHOPPING_CATEGORIES: Category[] = [
  {
    id: 'achats',
    name: 'Achats',
    icon: '🛍️',
    subCategories: [
      {
        id: 'vetements',
        name: 'Magasins de vêtements',
        parentId: 'achats',
        children: vetementSubCategories
      },
      {
        id: 'electronique',
        name: "Magasins d'électronique",
        parentId: 'achats',
        children: electroniqueSubCategories
      },
      {
        id: 'bibliotheques',
        name: 'Bibliothèques',
        parentId: 'achats',
        children: bibliothequeSubCategories
      },
      { id: 'jouets', name: 'Magasins de jouets', parentId: 'achats' },
      { id: 'pharmacies', name: 'Pharmacies', parentId: 'achats' },
      { id: 'parfumeries', name: 'Parfumeries', parentId: 'achats' },
      { id: 'bijouteries', name: 'Bijouteries', parentId: 'achats' },
      { id: 'opticiens', name: 'Opticiens', parentId: 'achats' },
      { id: 'sport', name: 'Magasins de sport', parentId: 'achats' },
      { id: 'fleuristes', name: 'Fleuristes', parentId: 'achats' },
      {
        id: 'coiffeurs',
        name: 'Coiffeurs',
        parentId: 'achats',
        children: coiffureSubCategories
      },
      {
        id: 'beaute',
        name: 'Beauté',
        parentId: 'achats',
        children: beauteSubCategories
      },
      { id: 'pressing', name: 'Pressing', parentId: 'achats' },
      {
        id: 'automobile',
        name: 'Automobile',
        parentId: 'achats',
        children: automobileSubCategories
      },
      { id: 'banques', name: 'Banques et DAB', parentId: 'achats' },
    ]
  }
];
