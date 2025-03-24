
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Import i18n configuration before any components that use it
import './i18n';
// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

// Fonction pour initialiser l'application
const initApp = () => {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log('Application mounted successfully');
    } catch (error) {
      console.error('Failed to render React application:', error);
    }
  } else {
    console.error("Root element not found! Make sure there is a div with id 'root' in your HTML.");
    // Tentative de récupération - créer l'élément root s'il n'existe pas
    const bodyElement = document.querySelector('body');
    if (bodyElement) {
      const newRootElement = document.createElement('div');
      newRootElement.id = 'root';
      bodyElement.appendChild(newRootElement);
      console.log('Created missing root element, attempting to mount application');
      initApp(); // Réessayer l'initialisation
    }
  }
};

// S'assurer que le DOM est complètement chargé avant de monter l'application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
