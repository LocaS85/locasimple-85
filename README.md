
# Application de recherche de lieux avec Flask et Mapbox

Cette application permet de rechercher des lieux à proximité et d'afficher les itinéraires.

## Installation

1. Clonez ce dépôt
2. Installez les dépendances : `pip install -r requirements.txt`
3. Configurez votre token Mapbox dans le fichier `.env` (copiez `.env.example` en `.env`)

## Démarrage du serveur

Pour démarrer le serveur Flask, exécutez :

```bash
python run_server.py
```

Ou directement :

```bash
python app.py
```

L'application sera accessible à l'adresse : http://127.0.0.1:5000/

## Fonctionnalités

- Recherche de lieux à proximité
- Affichage des itinéraires
- Calcul des distances et durées
- Filtrage par catégorie et mode de transport
- Génération de PDF avec les résultats

## Configuration

Les paramètres de l'application sont configurés dans le fichier `.env` :

- `MAPBOX_ACCESS_TOKEN` : Votre token d'accès Mapbox
- `FLASK_ENV` : Environnement Flask (development, production)
- `DEBUG` : Mode debug (True/False)
