
# Application de recherche de lieux

Cette application permet de rechercher des lieux à proximité d'une position donnée et de calculer les itinéraires vers ces lieux.

## Architecture

L'application est composée de deux parties :
- **Frontend** : Interface utilisateur React avec Mapbox GL JS
- **Backend** : Serveur Flask qui sert d'intermédiaire pour les API Mapbox

## Configuration du frontend

Le frontend est déjà configuré. Assurez-vous d'avoir un token Mapbox valide dans votre fichier d'environnement.

## Configuration du backend Flask

Voir les instructions détaillées dans le fichier `FLASK_SETUP_INSTRUCTIONS.md`.

## Fonctionnalités

- Recherche de lieux par nom ou catégorie
- Filtrage par type de lieu
- Calcul d'itinéraires avec différents modes de transport
- Génération de PDF avec les résultats de recherche
- Affichage des lieux sur une carte interactive

## Utilisation des filtres

L'application dispose d'un panneau de filtres accessible via le bouton ⚙️ :

- **Catégories** : Filtrer par type de lieu (restaurants, bars, magasins, etc.)
- **Nombre de résultats** : Limiter le nombre de résultats affichés
- **Mode de transport** : Choisir entre voiture, marche à pied ou vélo
- **Durée** : Filtrer par temps de trajet maximal
- **Distance** : Filtrer par distance maximale

## Résolution des problèmes

Si vous rencontrez des erreurs lors de l'utilisation de l'application, vérifiez que :
1. Le serveur Flask est en cours d'exécution
2. Votre token Mapbox est valide et dispose des droits nécessaires
3. Votre connexion internet est active
