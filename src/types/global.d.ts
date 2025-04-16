
import mapboxgl from 'mapbox-gl';

declare global {
  interface Window {
    mapboxgl?: typeof mapboxgl;
    MAPBOX_TOKEN_READY?: string;
    L?: any; // For Leaflet
  }
}

export {};
