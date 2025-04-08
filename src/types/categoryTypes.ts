
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

export type DistanceUnit = "km" | "miles";
export type TransportMode = "driving" | "walking" | "bicycling" | "transit";
