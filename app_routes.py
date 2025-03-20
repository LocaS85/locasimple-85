
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()

# Obtenir le token Mapbox depuis les variables d'environnement
MAPBOX_ACCESS_TOKEN = os.environ.get('MAPBOX_ACCESS_TOKEN', 'YOUR_MAPBOX_ACCESS_TOKEN')

def register_routes(app):
    """Enregistre toutes les routes de l'application Flask"""
    
    @app.route('/')
    def index():
        """Route principale qui affiche la page d'accueil"""
        return render_template('index.html', mapbox_token=MAPBOX_ACCESS_TOKEN)
    
    @app.route('/api/search')
    def api_search():
        """API de recherche qui renvoie les résultats au format JSON"""
        query = request.args.get('query')
        mode = request.args.get('mode', 'driving')
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        limit = request.args.get('limit', 5)
        
        if not all([query, lat, lon]):
            return jsonify({"error": "Paramètres manquants"}), 400
        
        # Appel à l'API Mapbox Geocoding
        try:
            geocoding_url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json"
            params = {
                "proximity": f"{lon},{lat}",
                "limit": limit,
                "access_token": MAPBOX_ACCESS_TOKEN
            }
            
            response = requests.get(geocoding_url, params=params)
            data = response.json()
            
            results = []
            for place in data.get("features", []):
                place_data = {
                    "name": place.get("text", ""),
                    "place_name": place.get("place_name", ""),
                    "coordinates": place.get("center", [0, 0]),
                    "category": query
                }
                results.append(place_data)
            
            return jsonify(results)
            
        except Exception as e:
            app.logger.error(f"Erreur de recherche: {str(e)}")
            return jsonify({"error": str(e)}), 500
