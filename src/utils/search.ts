
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

// Initialize Mapbox token
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
} else {
  console.error('Missing Mapbox token');
}

export class MapService {
  private map: mapboxgl.Map | null = null;
  private userMarker: mapboxgl.Marker | null = null;
  private resultMarkers: mapboxgl.Marker[] = [];

  initMap(containerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          container: containerId,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [2.3488, 48.8534], // Paris default
          zoom: 12
        });

        this.map.addControl(new mapboxgl.NavigationControl());
        
        this.map.on('load', () => {
          console.log('Map initialized successfully');
          resolve();
        });

      } catch (error) {
        console.error('Map initialization failed:', error);
        reject(error);
      }
    });
  }

  getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];

          if (this.map) {
            // Move map to user location
            this.map.flyTo({ 
              center: userLocation, 
              zoom: 14,
              essential: true 
            });

            // Add or update user marker
            if (this.userMarker) {
              this.userMarker.setLngLat(userLocation);
            } else {
              this.userMarker = new mapboxgl.Marker({ color: '#4285F4' })
                .setLngLat(userLocation)
                .addTo(this.map);
            }
          }

          resolve(userLocation);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error("Impossible d'obtenir votre position");
          reject(error);
        }
      );
    });
  }

  displayResults(results: Array<{
    lng: number;
    lat: number;
    name: string;
    category?: string;
    distance?: number;
  }>) {
    // Clear previous markers
    this.clearMarkers();

    if (!this.map) {
      console.error('Map not initialized');
      return;
    }

    // Create bounds to fit all markers
    const bounds = new mapboxgl.LngLatBounds();

    results.forEach((place, index) => {
      // Create marker
      const marker = new mapboxgl.Marker({ color: '#FF4B4B' })
        .setLngLat([place.lng, place.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="font-semibold">${place.name}</div>
              ${place.category ? `<div class="text-sm text-gray-600">${place.category}</div>` : ''}
              ${place.distance ? `<div class="text-sm">${place.distance.toFixed(1)} km</div>` : ''}
            `)
        )
        .addTo(this.map!);

      this.resultMarkers.push(marker);
      bounds.extend([place.lng, place.lat]);
    });

    // Adjust map to show all markers
    if (results.length > 0) {
      this.map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15
      });
    }
  }

  clearMarkers() {
    this.resultMarkers.forEach(marker => marker.remove());
    this.resultMarkers = [];
  }

  updateView(center: [number, number], zoom: number) {
    if (this.map) {
      this.map.flyTo({
        center,
        zoom,
        essential: true
      });
    }
  }
}

export const mapService = new MapService();
