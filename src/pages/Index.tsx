
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Navigation, MapPin, Info, Phone, Map, Check, ArrowRight, Star } from 'lucide-react';

const Index = () => {
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Écran de démarrage
    const timer = setTimeout(() => {
      setShowLaunchScreen(false);
    }, 2000);

    // Détection du défilement pour l'animation du header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation de l'écran de démarrage
  if (showLaunchScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-center text-white">
          <div 
            className="text-6xl font-bold mb-4 flex items-center justify-center"
            style={{
              animation: 'fadeInUp 0.8s ease-out forwards'
            }}
          >
            <MapPin className="mr-3 h-12 w-12" />
            LocaSimple
          </div>
          <p 
            className="text-xl mb-8 opacity-0"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.3s forwards'
            }}
          >
            Simplifiez vos trajets, optimisez votre temps
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center text-xl font-bold">
            <MapPin className="mr-2 h-6 w-6 text-primary" />
            <span className={isScrolled ? 'text-gray-800' : 'text-white'}>LocaSimple</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/search" className={`hover:text-primary transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
              Recherche
            </Link>
            <Link to="/categories" className={`hover:text-primary transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
              Catégories
            </Link>
            <Link to="/about" className={`hover:text-primary transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
              À propos
            </Link>
            <Link to="/contact" className={`hover:text-primary transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" className={`hidden md:flex ${isScrolled ? '' : 'border-white text-white hover:bg-white/20 hover:text-white'}`}>
              <Link to="/login">Connexion</Link>
            </Button>
            <Button asChild className="hidden md:flex">
              <Link to="/register">S'inscrire</Link>
            </Button>
            <button className="md:hidden text-2xl">
              <div className={`w-6 h-0.5 mb-1 ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></div>
              <div className={`w-6 h-0.5 mb-1 ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></div>
              <div className={`w-6 h-0.5 ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - avec image de fond */}
      <section className="relative pt-24 pb-16 md:py-32 flex items-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Trouvez vos lieux préférés en un instant
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl">
              Simplifiez vos trajets, optimisez votre temps et découvrez les meilleurs endroits autour de vous.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                <Link to="/search" className="flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Commencer la recherche
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/20 hover:text-white text-lg px-8 py-6">
                <Link to="/categories" className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explorer les catégories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Comment ça marche
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Trouvez facilement ce que vous cherchez en quelques étapes simples
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                1
              </div>
              <div className="bg-gray-50 rounded-lg p-8 text-center h-full flex flex-col items-center justify-center hover:shadow-lg transition-all">
                <Search className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  Recherchez
                </h3>
                <p className="text-gray-600">
                  Entrez votre localisation et choisissez les catégories qui vous intéressent
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                2
              </div>
              <div className="bg-gray-50 rounded-lg p-8 text-center h-full flex flex-col items-center justify-center hover:shadow-lg transition-all">
                <Navigation className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  Filtrez
                </h3>
                <p className="text-gray-600">
                  Affinez les résultats avec nos filtres de distance, d'horaires et de préférences
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                3
              </div>
              <div className="bg-gray-50 rounded-lg p-8 text-center h-full flex flex-col items-center justify-center hover:shadow-lg transition-all">
                <MapPin className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  Découvrez
                </h3>
                <p className="text-gray-600">
                  Obtenez le meilleur itinéraire et enregistrez vos lieux favoris
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités Section avec illustrations mises en valeur */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Fonctionnalités principales
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Des outils puissants pour optimiser vos recherches et déplacements
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Recherche multi-catégories
              </h3>
              <p className="text-gray-600">
                Trouvez plusieurs types de lieux en une seule recherche et gagnez du temps
              </p>
              <Link to="/features/search" className="inline-flex items-center mt-4 text-primary hover:underline">
                En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Navigation className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Itinéraires optimisés
              </h3>
              <p className="text-gray-600">
                Calculez les meilleurs trajets selon vos préférences de transport et de temps
              </p>
              <Link to="/features/routes" className="inline-flex items-center mt-4 text-primary hover:underline">
                En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Favoris personnalisés
              </h3>
              <p className="text-gray-600">
                Enregistrez vos lieux préférés et organisez-les par catégories pour y accéder rapidement
              </p>
              <Link to="/features/favorites" className="inline-flex items-center mt-4 text-primary hover:underline">
                En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/about" className="flex items-center">
                <Info className="mr-2 h-5 w-5" />
                Découvrir toutes les fonctionnalités
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Plans Section - Design amélioré */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Nos plans
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Choisissez l'offre qui correspond le mieux à vos besoins
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plan Gratuit */}
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all border border-gray-100 transform hover:-translate-y-1">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Gratuit</h3>
                <div className="my-6">
                  <p className="text-4xl font-bold inline-flex items-baseline">
                    0€
                    <span className="text-lg text-gray-500 ml-1">/mois</span>
                  </p>
                </div>
                <p className="text-gray-600 mb-4">Parfait pour découvrir l'application</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>3 recherches par jour</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Rayon de recherche jusqu'à 5 km</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Filtre par distance uniquement</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Max 3 résultats par recherche</span>
                </li>
              </ul>
              <Button asChild className="w-full py-6" variant="outline">
                <Link to="/register">
                  Commencer gratuitement
                </Link>
              </Button>
            </div>
            
            {/* Plan Premium */}
            <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-primary relative transform hover:-translate-y-1 hover:shadow-2xl transition-all">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                Populaire
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Premium</h3>
                <div className="my-6">
                  <p className="text-4xl font-bold inline-flex items-baseline">
                    9,99€
                    <span className="text-lg text-gray-500 ml-1">/mois</span>
                  </p>
                </div>
                <p className="text-gray-600 mb-4">Pour les utilisateurs réguliers</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Recherches illimitées</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Rayon de recherche jusqu'à 25 km</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Filtres avancés (durée et distance)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Jusqu'à 10 résultats par recherche</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Favoris illimités</span>
                </li>
              </ul>
              <Button asChild className="w-full py-6">
                <Link to="/register?plan=premium">
                  Essayer 14 jours gratuits
                </Link>
              </Button>
            </div>
            
            {/* Plan Pro */}
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all border border-gray-100 transform hover:-translate-y-1">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="my-6">
                  <p className="text-4xl font-bold inline-flex items-baseline">
                    19,99€
                    <span className="text-lg text-gray-500 ml-1">/mois</span>
                  </p>
                </div>
                <p className="text-gray-600 mb-4">Pour les professionnels</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Tout Premium +</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Rayon de recherche illimité</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Filtres personnalisables</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Résultats illimités par recherche</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Support prioritaire</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Analyses détaillées</span>
                </li>
              </ul>
              <Button asChild className="w-full py-6" variant="outline">
                <Link to="/contact?plan=pro">
                  Contactez-nous
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/plan" className="flex items-center">
                <Map className="mr-2 h-5 w-5" />
                Voir tous les détails des plans
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Ce que nos utilisateurs disent
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Découvrez les expériences de ceux qui utilisent LocaSimple au quotidien
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center text-yellow-400 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-gray-700 mb-6">
                "LocaSimple m'a fait gagner tellement de temps dans mes déplacements quotidiens. Je peux trouver tout ce dont j'ai besoin en un seul endroit."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Sophie M.</p>
                  <p className="text-sm text-gray-500">Utilisatrice Premium</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center text-yellow-400 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-gray-700 mb-6">
                "L'option pour combiner plusieurs catégories de recherche est géniale. Je peux organiser toute ma journée en quelques clics."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Thomas L.</p>
                  <p className="text-sm text-gray-500">Utilisateur Pro</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center text-yellow-400 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6">
                "Interface très intuitive et résultats pertinents. L'application me suggère toujours des endroits qui correspondent parfaitement à mes besoins."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Marie D.</p>
                  <p className="text-sm text-gray-500">Utilisatrice Premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Design amélioré */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-lg p-12 text-center text-white">
              <h3 className="text-3xl font-bold mb-6">Prêt à simplifier vos déplacements ?</h3>
              <p className="text-xl mb-8 max-w-xl mx-auto">
                Inscrivez-vous gratuitement et commencez à explorer les possibilités de LocaSimple
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 py-6 px-8">
                  <Link to="/register">Créer un compte</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/20 hover:text-white py-6 px-8">
                  <Link to="/contact" className="flex items-center">
                    <Phone className="mr-2 h-5 w-5" />
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
