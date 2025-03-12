
// Re-export everything from the new modular structure
export * from './mapbox';

// Re-export the main service for backwards compatibility
import { mapboxService as service } from './mapbox';
export const mapboxService = service;
