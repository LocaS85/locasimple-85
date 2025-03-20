
# Instructions pour configurer et démarrer l'application Flask

Ce document fournit des instructions détaillées pour configurer et démarrer l'application de recherche de lieux avec Flask et Mapbox.

## Prérequis

Assurez-vous d'avoir Python 3.7+ installé sur votre système. Vous pouvez télécharger Python depuis [python.org](https://www.python.org/downloads/).

## Installation des dépendances

1. Ouvrez un terminal ou une invite de commande.
2. Naviguez vers le répertoire du projet.
3. Installez les dépendances nécessaires:

```bash
pip install -r requirements.txt
```

## Configuration de Mapbox

1. Créez un compte sur [Mapbox](https://www.mapbox.com/) si vous n'en avez pas déjà un.
2. Après vous être connecté, accédez à votre [compte](https://account.mapbox.com/) et copiez votre jeton d'accès par défaut.
3. Créez un fichier `.env` à la racine du projet et ajoutez-y votre jeton:

```
MAPBOX_ACCESS_TOKEN=votre_token_mapbox_ici
```

## Démarrage de l'application

1. Dans le terminal, assurez-vous d'être dans le répertoire du projet.
2. Démarrez l'application Flask:

```bash
python app.py
```

3. Ouvrez votre navigateur et accédez à `http://127.0.0.1:5000/` pour voir l'application.

## Résolution des problèmes

Si vous rencontrez des problèmes lors de l'installation ou du démarrage:

1. **Erreur ModuleNotFoundError**: Assurez-vous d'avoir installé toutes les dépendances avec `pip install -r requirements.txt`.
2. **Erreur de connexion à Mapbox**: Vérifiez que votre jeton Mapbox est valide et correctement configuré dans le fichier `.env`.
3. **L'application ne démarre pas**: Vérifiez que le port 5000 n'est pas déjà utilisé par une autre application.

## API disponibles

L'application expose les API suivantes:

- `/api/search`: Recherche des lieux à proximité d'un point donné
- `/generate_pdf`: Génère un PDF avec les résultats de recherche
- `/health`: Vérification de l'état de l'API

## Personnalisation

Vous pouvez personnaliser l'apparence et le comportement de l'application en modifiant les fichiers:

- `static/style.css`: Pour l'apparence
- `static/script.js`: Pour le comportement côté client
- `templates/index.html`: Pour la structure HTML
- `app.py`: Pour la logique côté serveur
