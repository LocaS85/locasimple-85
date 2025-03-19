
# Configuration du Backend Flask

Pour utiliser les fonctionnalités de recherche et de génération de PDF, vous devez configurer et exécuter le serveur backend Flask.

## Prérequis

Assurez-vous d'avoir Python installé sur votre ordinateur.

## Installation des dépendances

```bash
pip install flask flask-cors requests reportlab
```

## Création du fichier app.py

Copiez le code suivant dans un fichier nommé `app.py` :

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

app = Flask(__name__)
CORS(app)  # Permet les requêtes du frontend

MAPBOX_ACCESS_TOKEN = "VOTRE_TOKEN_MAPBOX_ICI"  # Remplacez par votre token Mapbox

@app.route("/search", methods=["GET"])
def search_places():
    """Recherche des lieux et calcul des itinéraires"""
    query = request.args.get("query")
    mode = request.args.get("mode")
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    limit = int(request.args.get("limit", 3))  # Nombre de résultats

    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?proximity={lon},{lat}&limit={limit}&access_token={MAPBOX_ACCESS_TOKEN}"
    response = requests.get(url)
    data = response.json()

    results = []
    for place in data["features"]:
        place_name = place["text"]
        coords = place["center"]
        
        route_url = f"https://api.mapbox.com/directions/v5/mapbox/{mode}/{lon},{lat};{coords[0]},{coords[1]}?access_token={MAPBOX_ACCESS_TOKEN}&overview=full"
        route_res = requests.get(route_url).json()
        
        if "routes" in route_res and route_res["routes"]:
            duration = route_res["routes"][0]["duration"] / 60  # Convertir en minutes
            distance = route_res["routes"][0]["distance"] / 1000  # Convertir en km
            results.append({"name": place_name, "lat": coords[1], "lon": coords[0], "duration": round(duration, 1), "distance": round(distance, 1)})

    return jsonify(results)

@app.route("/generate_pdf", methods=["POST"])
def generate_pdf():
    """Génération d'un PDF avec les résultats"""
    data = request.json
    filename = "resultats.pdf"

    c = canvas.Canvas(filename, pagesize=letter)
    c.drawString(100, 750, "Résumé des distances et temps de trajet")

    y = 730
    for place in data["places"]:
        c.drawString(100, y, f"{place['name']}: {place['distance']} km, {place['duration']} min")
        y -= 20

    c.save()
    return jsonify({"message": "PDF généré", "file": filename})

if __name__ == "__main__":
    app.run(debug=True)
```

## Configuration

Remplacez `VOTRE_TOKEN_MAPBOX_ICI` par votre token d'accès Mapbox dans le fichier `app.py`.

## Exécution du serveur Flask

Dans un terminal, naviguez jusqu'au dossier contenant le fichier `app.py` et exécutez :

```bash
python app.py
```

Le serveur Flask démarrera sur http://localhost:5000.

## Utilisation avec l'application React

Une fois le serveur Flask en cours d'exécution, l'application React pourra :
1. Effectuer des recherches de lieux via l'API Flask
2. Générer des PDF avec les résultats trouvés

Si vous rencontrez des erreurs dans l'application React mentionnant que le serveur Flask n'est pas disponible, assurez-vous que :
1. Le serveur Flask est bien en cours d'exécution
2. CORS est correctement configuré (déjà inclus dans le code fourni)
3. Les ports ne sont pas bloqués par un pare-feu

## Génération de PDF

Les PDF générés seront sauvegardés dans le dossier où s'exécute le serveur Flask. Dans une application de production, vous voudriez probablement renvoyer le PDF directement au navigateur pour un téléchargement immédiat.
