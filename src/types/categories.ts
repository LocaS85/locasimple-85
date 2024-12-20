export interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  parentId: string;
  children?: SubCategory[];
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  transportMode: TransportMode;
}

export type TransportMode = 'car' | 'train' | 'bus' | 'public' | 'bike' | 'walk' | 'plane';

export const CATEGORIES: Category[] = [
  {
    id: 'adresse-principale',
    name: 'Adresse principale',
    icon: '🏠',
  },
  {
    id: 'famille',
    name: 'Famille',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'travail',
    name: 'Travail',
    icon: '💼',
  },
  {
    id: 'ecole',
    name: 'École',
    icon: '🏫',
  },
  {
    id: 'alimentation',
    name: 'Alimentation et Boissons',
    icon: '🍽️',
    subCategories: [
      {
        id: 'restaurants',
        name: 'Restaurants',
        parentId: 'alimentation',
        children: [
          { id: 'gastronomie', name: 'Gastronomie', parentId: 'restaurants' },
          { id: 'rapide', name: 'Rapide', parentId: 'restaurants' },
          { id: 'vegan', name: 'Végétariens/Végans', parentId: 'restaurants' },
          { id: 'pizza', name: 'Pizza', parentId: 'restaurants' },
          { id: 'sushi', name: 'Sushi', parentId: 'restaurants' },
          { id: 'monde', name: 'Cuisine du monde', parentId: 'restaurants' },
        ],
      },
      {
        id: 'bars',
        name: 'Bars',
        parentId: 'alimentation',
        children: [
          { id: 'bars-a-vin', name: 'Bars à vin', parentId: 'bars' },
          { id: 'pubs', name: 'Pubs', parentId: 'bars' },
          { id: 'bars-a-cocktails', name: 'Bars à cocktails', parentId: 'bars' },
        ],
      },
      {
        id: 'cafes',
        name: 'Cafés et Salons de thé',
        parentId: 'alimentation',
        children: [
          { id: 'cafes', name: 'Cafés', parentId: 'cafes' },
          { id: 'salons-de-the', name: 'Salons de thé', parentId: 'cafes' },
        ],
      },
      { id: 'boulangeries', name: 'Boulangeries', parentId: 'alimentation' },
      { id: 'supermarches', name: 'Supermarchés', parentId: 'alimentation' },
      { id: 'vente-a-emporter', name: 'Vente à emporter', parentId: 'alimentation' },
      { id: 'livraison', name: 'Livraison', parentId: 'alimentation' },
    ],
  },
  {
    id: 'achats',
    name: 'Achats',
    icon: '🛍️',
    subCategories: [
      {
        id: 'magasins-de-vetements',
        name: 'Magasins de vêtements',
        parentId: 'achats',
        children: [
          { id: 'pret-a-porter', name: 'Prêt-à-porter', parentId: 'magasins-de-vetements' },
          { id: 'boutiques-de-luxe', name: 'Boutiques de luxe', parentId: 'magasins-de-vetements' },
          { id: 'magasins-de-chaussures', name: 'Magasins de chaussures', parentId: 'magasins-de-vetements' },
          { id: 'accessoires', name: 'Accessoires', parentId: 'magasins-de-vetements' },
        ],
      },
      {
        id: 'magasins-d-electronique',
        name: 'Magasins d\'électronique',
        parentId: 'achats',
        children: [
          { id: 'telephonie', name: 'Téléphonie', parentId: 'magasins-d-electronique' },
          { id: 'informatique', name: 'Informatique', parentId: 'magasins-d-electronique' },
          { id: 'electromenager', name: 'Électroménager', parentId: 'magasins-d-electronique' },
        ],
      },
      {
        id: 'bibliotheques',
        name: 'Bibliothèques',
        parentId: 'achats',
        children: [
          { id: 'generalistes', name: 'Généralistes', parentId: 'bibliotheques' },
          { id: 'specialisees', name: 'Spécialisées', parentId: 'bibliotheques' },
          { id: 'd-occasion', name: 'D\'occasion', parentId: 'bibliotheques' },
        ],
      },
      { id: 'magasins-de-jouets', name: 'Magasins de jouets', parentId: 'achats' },
      { id: 'pharmacies', name: 'Pharmacies', parentId: 'achats' },
      { id: 'parfumeries', name: 'Parfumeries', parentId: 'achats' },
      { id: 'bijouteries', name: 'Bijouteries', parentId: 'achats' },
      { id: 'opticiens', name: 'Opticiens', parentId: 'achats' },
      { id: 'magasins-de-sport', name: 'Magasins de sport', parentId: 'achats' },
      { id: 'fleuristes', name: 'Fleuristes', parentId: 'achats' },
      {
        id: 'coiffeurs',
        name: 'Coiffeurs',
        parentId: 'achats',
        children: [
          { id: 'hommes', name: 'Hommes', parentId: 'coiffeurs' },
          { id: 'femmes', name: 'Femmes', parentId: 'coiffeurs' },
          { id: 'barbiers', name: 'Barbiers', parentId: 'coiffeurs' },
        ],
      },
      {
        id: 'beaute',
        name: 'Beauté',
        parentId: 'achats',
        children: [
          { id: 'salon-de-beaute', name: 'Salon de beauté', parentId: 'beaute' },
          { id: 'esthetique', name: 'Esthétique', parentId: 'beaute' },
          { id: 'ongleries', name: 'Ongleries', parentId: 'beaute' },
          { id: 'spa', name: 'Spa', parentId: 'beaute' },
        ],
      },
      { id: 'pressing', name: 'Pressing', parentId: 'achats' },
      {
        id: 'automobile',
        name: 'Automobile',
        parentId: 'achats',
        children: [
          { id: 'lavage-auto', name: 'Lavage auto', parentId: 'automobile' },
          { id: 'reparation-auto', name: 'Réparation auto', parentId: 'automobile' },
          { id: 'localisation-automatique', name: 'Localisation automatique', parentId: 'automobile' },
          { id: 'garages-automobiles', name: 'Garages automobiles', parentId: 'automobile' },
          { id: 'parking', name: 'Parking', parentId: 'automobile' },
          { id: 'bornes-de-recharge', name: 'Bornes de recharge', parentId: 'automobile' },
          { id: 'stations-service', name: 'Stations-service', parentId: 'automobile' },
        ],
      },
      { id: 'banques', name: 'Banques et DAB', parentId: 'achats' },
    ],
  },
  {
    id: 'sante',
    name: 'Santé et Bien-être',
    icon: '💊',
    subCategories: [
      { id: 'hopitaux', name: 'Hôpitaux', parentId: 'sante' },
      { id: 'cliniques', name: 'Cliniques', parentId: 'sante' },
      { id: 'dentistes', name: 'Dentistes', parentId: 'sante' },
      { id: 'medecins-generalistes', name: 'Médecins généralistes', parentId: 'sante' },
      { id: 'pharmacies', name: 'Pharmacies', parentId: 'sante' },
      { id: 'laboratoires', name: 'Laboratoires d\'analyses médicales', parentId: 'sante' },
      { id: 'opticiens', name: 'Opticiens', parentId: 'sante' },
      { id: 'centres-de-radiologie', name: 'Centres de radiologie', parentId: 'sante' },
      { id: 'psychologues', name: 'Psychologues', parentId: 'sante' },
      { id: 'veterinaires', name: 'Vétérinaires', parentId: 'sante' },
    ],
  },
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
  },
  {
    id: 'hebergement',
    name: 'Hébergement',
    icon: '🏨',
    subCategories: [
      { id: 'hotels', name: 'Hôtels', parentId: 'hebergement' },
      { id: 'auberges', name: 'Auberges', parentId: 'hebergement' },
      { id: 'chambres-d-hotes', name: 'Chambres d\'hôtes', parentId: 'hebergement' },
      { id: 'camping', name: 'Camping', parentId: 'hebergement' },
      { id: 'locations-de-vacances', name: 'Locations de vacances', parentId: 'hebergement' },
    ],
  },
];
