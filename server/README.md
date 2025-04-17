
# Serveur Flask pour l'application de géolocalisation

Ce serveur Flask fournit une API pour la recherche de lieux et d'itinéraires pour l'application de géolocalisation.

## Prérequis

- Python 3.7+
- pip (gestionnaire de paquets Python)

## Installation

1. Créez un environnement virtuel (recommandé):
   ```bash
   python -m venv venv
   ```

2. Activez l'environnement virtuel:
   - Sur Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Sur macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Installez les dépendances:
   ```bash
   pip install flask flask-cors python-dotenv requests
   ```

4. Créez un fichier `.env` dans le dossier `server` avec vos clés API:
   ```
   MAPBOX_ACCESS_TOKEN=votre_token_mapbox
   ```

## Démarrage du serveur

```bash
python app.py
```

Le serveur sera accessible à l'adresse http://localhost:5000

## Endpoints API

### Vérification de l'état
- **GET** `/api/health`
  - Retourne l'état du serveur

### Recherche de lieux
- **GET** `/api/search`
  - Paramètres:
    - `query` (requis): terme de recherche
    - `lat` (requis): latitude du point de référence
    - `lon` (requis): longitude du point de référence
    - `limit` (optionnel): nombre maximum de résultats (défaut: 5)
    - `mode` (optionnel): mode de transport (défaut: 'driving')
  - Retourne une liste de lieux correspondant à la recherche
