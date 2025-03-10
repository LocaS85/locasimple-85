
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';
// Import our Google Maps loader
import { initGoogleMaps } from './utils/loadGoogleMaps';

// Initialize Google Maps
initGoogleMaps()
  .then(() => console.log('Google Maps initialized'))
  .catch(error => console.error('Error initializing Google Maps:', error));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
