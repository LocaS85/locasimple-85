
#!/usr/bin/env sh

# Arrêter le script en cas d'erreur
set -e

# Construction du projet
echo "Construction du projet..."
npm run build

# Utiliser gh-pages pour déployer le contenu du dossier dist
echo "Déploiement sur GitHub Pages..."
npx gh-pages -d dist

echo "Déploiement terminé avec succès!"
