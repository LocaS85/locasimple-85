
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Import i18n configuration before any components that use it
import './i18n';
// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

// Ensure DOM is ready before mounting
const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found! Make sure there is a div with id 'root' in your HTML.");
}
