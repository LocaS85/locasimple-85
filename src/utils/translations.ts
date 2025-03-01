
interface Translations {
  [language: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  fr: {
    search: "Recherche",
    categories: "Catégories",
    plans: "Plans",
    about: "À propos",
    login: "Connexion",
    register: "Inscription",
    home: "Accueil",
    settings: "Paramètres",
    saved: "Enregistré",
    price: "Prix",
    searchPlaceholder: "Rechercher un lieu...",
    backToHome: "Retour à l'accueil",
    contactUs: "Contactez-nous",
  },
  en: {
    search: "Search",
    categories: "Categories",
    plans: "Plans",
    about: "About",
    login: "Login",
    register: "Register",
    home: "Home",
    settings: "Settings",
    saved: "Saved",
    price: "Price",
    searchPlaceholder: "Search for a place...",
    backToHome: "Back to home",
    contactUs: "Contact us",
  },
  es: {
    search: "Búsqueda",
    categories: "Categorías",
    plans: "Planes",
    about: "Acerca de",
    login: "Iniciar sesión",
    register: "Registrarse",
    home: "Inicio",
    settings: "Configuración",
    saved: "Guardado",
    price: "Precio",
    searchPlaceholder: "Buscar un lugar...",
    backToHome: "Volver al inicio",
    contactUs: "Contáctenos",
  },
  it: {
    search: "Ricerca",
    categories: "Categorie",
    plans: "Piani",
    about: "Chi siamo",
    login: "Accedi",
    register: "Registrati",
    home: "Home",
    settings: "Impostazioni",
    saved: "Salvato",
    price: "Prezzo",
    searchPlaceholder: "Cerca un luogo...",
    backToHome: "Torna alla home",
    contactUs: "Contattaci",
  },
  pt: {
    search: "Pesquisa",
    categories: "Categorias",
    plans: "Planos",
    about: "Sobre",
    login: "Entrar",
    register: "Registrar",
    home: "Início",
    settings: "Configurações",
    saved: "Salvo",
    price: "Preço",
    searchPlaceholder: "Procurar um lugar...",
    backToHome: "Voltar ao início",
    contactUs: "Contacte-nos",
  }
};

export default translations;
