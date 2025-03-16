
/**
 * Utility functions for calculating distance and duration between coordinates
 */

/**
 * Calculates the distance in kilometers between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Haversine formula
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

/**
 * Converts degrees to radians
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Estimates duration based on distance and transport mode
 * @param distance Distance in kilometers
 * @param transportMode Mode of transport (driving, walking, cycling, transit)
 * @returns Estimated duration in minutes
 */
export const calculateDuration = (
  distance: number,
  transportMode: string
): number => {
  // Vitesses moyennes approximatives en km/h
  const speeds: Record<string, number> = {
    driving: 50, // Vitesse moyenne en voiture en ville
    walking: 5,  // Vitesse moyenne à pied
    cycling: 15, // Vitesse moyenne à vélo
    transit: 25, // Vitesse moyenne en transports en commun
  };

  // Utiliser une vitesse par défaut si le mode n'est pas reconnu
  const speed = speeds[transportMode] || speeds.driving;
  
  // Convertir de km/h à minutes pour la distance donnée
  const durationInHours = distance / speed;
  const durationInMinutes = durationInHours * 60;
  
  return durationInMinutes;
};

/**
 * Converts distance from kilometers to miles
 */
export const kmToMiles = (kilometers: number): number => {
  return kilometers * 0.621371;
};

/**
 * Converts distance from miles to kilometers
 */
export const milesToKm = (miles: number): number => {
  return miles * 1.60934;
};
