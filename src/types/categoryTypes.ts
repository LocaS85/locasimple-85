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