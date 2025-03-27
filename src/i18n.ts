
// Configuration pour les traductions
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      // Général
      'app.name': 'Locasimple Explorer',
      'app.slogan': 'Explorez facilement autour de vous',
      
      // Navigation
      'nav.home': 'Accueil',
      'nav.search': 'Recherche',
      'nav.profile': 'Profil',
      'nav.about': 'À propos',
      
      // Recherche
      'search.placeholder': 'Rechercher un lieu...',
      'search.button': 'Rechercher',
      'search.noresults': 'Aucun résultat trouvé',
      'search.results': 'résultats trouvés',
      'search.location': 'Ma position',
      'search.history': 'Historique',
      'search.saved': 'Recherches sauvegardées',
      
      // Transport
      'transport.driving': 'Voiture',
      'transport.walking': 'À pied',
      'transport.cycling': 'Vélo',
      'transport.transit': 'Transport',
      
      // Erreurs
      'error.location': 'Impossible d\'obtenir votre position',
      'error.search': 'Erreur lors de la recherche',
      'error.server': 'Le serveur n\'est pas disponible',
      
      // Actions
      'action.save': 'Sauvegarder',
      'action.delete': 'Supprimer',
      'action.export': 'Exporter',
      'action.route': 'Itinéraire',
      'action.filters': 'Filtres',
      
      // Places
      'place.distance': 'Distance',
      'place.duration': 'Durée',
      'place.address': 'Adresse'
    }
  },
  en: {
    translation: {
      // General
      'app.name': 'Locasimple Explorer',
      'app.slogan': 'Easily explore around you',
      
      // Navigation
      'nav.home': 'Home',
      'nav.search': 'Search',
      'nav.profile': 'Profile',
      'nav.about': 'About',
      
      // Search
      'search.placeholder': 'Search a place...',
      'search.button': 'Search',
      'search.noresults': 'No results found',
      'search.results': 'results found',
      'search.location': 'My location',
      'search.history': 'History',
      'search.saved': 'Saved searches',
      
      // Transport
      'transport.driving': 'Driving',
      'transport.walking': 'Walking',
      'transport.cycling': 'Cycling',
      'transport.transit': 'Transit',
      
      // Errors
      'error.location': 'Unable to get your location',
      'error.search': 'Error during search',
      'error.server': 'Server is not available',
      
      // Actions
      'action.save': 'Save',
      'action.delete': 'Delete',
      'action.export': 'Export',
      'action.route': 'Route',
      'action.filters': 'Filters',
      
      // Places
      'place.distance': 'Distance',
      'place.duration': 'Duration',
      'place.address': 'Address'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
