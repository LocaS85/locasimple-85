
# Configuration du serveur Flask

Ce document explique comment configurer et démarrer le serveur backend Flask pour l'application de recherche.

## Prérequis

- Python 3.7 ou version ultérieure
- pip (gestionnaire de paquets Python)

## Installation

1. Créez un environnement virtuel Python (recommandé) :
   ```bash
   python -m venv venv
   ```

2. Activez l'environnement virtuel :
   - Sur Windows :
     ```bash
     venv\Scripts\activate
     ```
   - Sur macOS et Linux :
     ```bash
     source venv/bin/activate
     ```

3. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

4. Configurez votre token Mapbox :
   - Copiez le fichier `.env.example` en `.env`
   - Modifiez le fichier `.env` pour ajouter votre token Mapbox :
     ```
     MAPBOX_ACCESS_TOKEN=votre_token_mapbox_ici
     ```

## Démarrage du serveur

1. Assurez-vous que votre environnement virtuel est activé.

2. Lancez le serveur Flask :
   ```bash
   python app.py
   ```

   Le serveur démarrera sur http://127.0.0.1:5000

## Vérification du fonctionnement

Vous pouvez vérifier si le serveur fonctionne correctement en accédant à :
```
http://127.0.0.1:5000/health
```

Vous devriez recevoir une réponse JSON avec `{"status": "ok"}`.

## Endpoints API disponibles

1. **Recherche de lieux** :
   ```
   GET /search?query=restaurant&mode=driving&lat=48.8566&lon=2.3522&limit=5
   ```
   Paramètres :
   - `query` : terme de recherche (obligatoire)
   - `mode` : mode de transport (driving, walking, cycling)
   - `lat` : latitude (obligatoire)
   - `lon` : longitude (obligatoire)
   - `limit` : nombre maximum de résultats (défaut: 5)

2. **Génération de PDF** :
   ```
   POST /generate_pdf
   ```
   Corps de la requête (JSON) :
   ```json
   {
     "places": [
       {
         "name": "Restaurant Example",
         "distance": 1.2,
         "duration": 5
       }
     ]
   }
   ```

## Résolution des problèmes courants

1. **Erreur "ModuleNotFoundError"** :
   - Vérifiez que toutes les dépendances sont installées : `pip install -r requirements.txt`

2. **Erreur CORS** :
   - Vérifiez que flask-cors est bien installé
   - Assurez-vous que `CORS(app)` est présent dans app.py

3. **Erreur d'authentification Mapbox** :
   - Vérifiez que votre token Mapbox est correct dans le fichier .env
   - Assurez-vous que le token a les droits nécessaires (Geocoding API, Directions API)

## Déploiement en production

Pour un environnement de production :
1. Désactivez le mode debug : modifiez `app.run(debug=True)` en `app.run(debug=False)`
2. Utilisez un serveur WSGI comme Gunicorn ou uWSGI
3. Configurez un proxy inverse (Nginx, Apache) si nécessaire
