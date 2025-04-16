
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
  transportMode: string;
  latitude: number;
  longitude: number;
  category: string;
  favorite: boolean;
  title?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type DistanceUnit = "km" | "miles";
export type TransportMode = "driving" | "walking" | "bicycling" | "transit" | 
  "car" | "train" | "bus" | "public" | "bike" | "walk" | "plane" | 
  "metro" | "tram" | "coach" | "airport" | "airstrip";

export interface TransportModeWithColor {
  id: TransportMode;
  name: string;
  icon: string;
  color: string;
  defaultColor?: string;
}
