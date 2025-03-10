
// Utility to load Google Maps API dynamically
export const loadGoogleMapsApi = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps API already loaded');
      resolve();
      return;
    }

    console.log('Loading Google Maps API...');
    
    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Set callbacks
    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      resolve();
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
      reject(new Error('Failed to load Google Maps API'));
    };
    
    // Append to document head
    document.head.appendChild(script);
  });
};

// Function to initialize maps when needed
export const initGoogleMaps = async (): Promise<void> => {
  // Use a placeholder API key - should be replaced with environment variable
  const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
  
  try {
    await loadGoogleMapsApi(apiKey);
  } catch (error) {
    console.error('Error initializing Google Maps:', error);
  }
};

// Function to clean up Google Maps API script
export const cleanupGoogleMaps = (): void => {
  const script = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
  if (script) {
    script.remove();
  }
};
