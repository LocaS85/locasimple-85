
// Map style URLs for Mapbox
export const MAP_STYLE_URLS = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  terrain: 'mapbox://styles/mapbox/outdoors-v12'
};

export type MapStyle = keyof typeof MAP_STYLE_URLS;
