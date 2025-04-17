
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

app = Flask(__name__, 
    static_folder="../dist/assets",
    template_folder="../dist"
)
CORS(app)

# Obtenir le token Mapbox des variables d'environnement
MAPBOX_ACCESS_TOKEN = os.environ.get('MAPBOX_ACCESS_TOKEN', 'YOUR_MAPBOX_ACCESS_TOKEN')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Vérification de l'état du serveur"""
    return jsonify({"status": "ok", "message": "Flask server is running"}), 200

@app.route('/api/search', methods=['GET'])
def search():
    """Recherche de lieux avec Mapbox"""
    query = request.args.get('query', '')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    limit = request.args.get('limit', 5)
    mode = request.args.get('mode', 'driving')
    
    if not all([query, lat, lon]):
        return jsonify({"error": "Les paramètres query, lat et lon sont requis"}), 400
    
    try:
        # Appel à l'API Mapbox Geocoding
        geocoding_url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json"
        params = {
            "proximity": f"{lon},{lat}",
            "limit": limit,
            "access_token": MAPBOX_ACCESS_TOKEN
        }
        
        response = requests.get(geocoding_url, params=params)
        data = response.json()
        
        if not data.get('features'):
            return jsonify([]), 200
        
        results = []
        for feature in data['features']:
            # Extraire les informations pertinentes
            place = {
                "id": feature.get('id'),
                "name": feature.get('text', ''),
                "address": feature.get('place_name', ''),
                "latitude": feature['center'][1],
                "longitude": feature['center'][0],
                # Simulation de la distance et de la durée
                "distance": f"~{round(float(limit) * 0.2)} km",
                "duration": f"~{round(float(limit) * 2)} min"
            }
            results.append(place)
        
        return jsonify(results), 200
        
    except Exception as e:
        app.logger.error(f"Erreur lors de la recherche: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Route pour servir l'application React
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
