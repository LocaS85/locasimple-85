
// Types for the transport modes
export type TransportMode = 'driving' | 'walking' | 'cycling' | 'driving-traffic';

// Types for search results
export interface SearchResult {
  id: string;
  name: string;
  place_name: string;
  center: [number, number];
  properties: Record<string, any>;
  type: string;
}

// Types for routes (itineraries)
export interface RouteResponse {
  routes: Route[];
  waypoints: Waypoint[];
  code: string;
  uuid: string;
}

export interface Route {
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  legs: RouteLeg[];
  weight: number;
  weight_name: string;
}

export interface RouteLeg {
  distance: number;
  duration: number;
  summary: string;
  steps: RouteStep[];
}

export interface RouteStep {
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  name: string;
  maneuver: {
    instruction: string;
    bearing_before: number;
    bearing_after: number;
    location: [number, number];
    type: string;
    modifier?: string;
  };
}

export interface Waypoint {
  distance: number;
  name: string;
  location: [number, number];
}

// Types for search options
export interface SearchOptions {
  query: string;
  proximity?: [number, number];
  autocomplete?: boolean;
  types?: string[];
  limit?: number;
  bbox?: [number, number, number, number];
  language?: string;
}

// Types for route options
export interface RouteOptions {
  profile: TransportMode;
  alternatives?: boolean;
  geometries?: 'geojson' | 'polyline';
  steps?: boolean;
  overview?: 'simplified' | 'full' | 'false';
  annotations?: ('distance' | 'duration' | 'speed' | 'congestion')[];
  continue_straight?: boolean;
  voice_instructions?: boolean;
  banner_instructions?: boolean;
  waypoints_per_route?: boolean;
}
