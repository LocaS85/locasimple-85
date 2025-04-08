
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
  title: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type DistanceUnit = "km" | "miles";
export type TransportMode = "driving" | "walking" | "bicycling" | "transit";

export interface TransportModeWithColor {
  id: TransportMode;
  name: string;
  icon: string;
  color: string;
}
