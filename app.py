
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import os
import json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()

# Obtenir le token Mapbox depuis les variables d'environnement
MAPBOX_ACCESS_TOKEN = os.environ.get('MAPBOX_ACCESS_TOKEN', 'YOUR_MAPBOX_ACCESS_TOKEN')

# Créer l'application Flask
app = Flask(__name__)
CORS(app)

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

@app.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    """Générer un PDF avec les résultats de recherche"""
    try:
        # Récupérer les données depuis la requête
        data = request.get_json()
        places = data.get('places', [])
        
        if not places:
            return jsonify({"error": "Aucun lieu fourni"}), 400
        
        # Créer un PDF
        pdf_path = os.path.join(app.root_path, 'static', 'resultats.pdf')
        c = canvas.Canvas(pdf_path, pagesize=letter)
        
        # Titre
        c.setFont("Helvetica-Bold", 16)
        c.drawString(30, 750, "Résultats de recherche de lieux")
        
        # Date
        from datetime import datetime
        c.setFont("Helvetica", 10)
        c.drawString(30, 730, f"Généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}")
        
        # Ligne de séparation
        c.line(30, 720, 550, 720)
        
        # En-têtes
        c.setFont("Helvetica-Bold", 12)
        c.drawString(30, 700, "Nom")
        c.drawString(230, 700, "Catégorie")
        c.drawString(350, 700, "Distance")
        c.drawString(450, 700, "Durée")
        
        # Ligne sous les en-têtes
        c.line(30, 690, 550, 690)
        
        # Données
        y = 670
        c.setFont("Helvetica", 11)
        
        for place in places:
            if y < 50:  # Nouvelle page si on atteint le bas
                c.showPage()
                c.setFont("Helvetica-Bold", 12)
                c.drawString(30, 750, "Résultats de recherche (suite)")
                c.line(30, 740, 550, 740)
                
                c.setFont("Helvetica-Bold", 12)
                c.drawString(30, 720, "Nom")
                c.drawString(230, 720, "Catégorie")
                c.drawString(350, 720, "Distance")
                c.drawString(450, 720, "Durée")
                
                c.line(30, 710, 550, 710)
                
                y = 690
                c.setFont("Helvetica", 11)
            
            # Nom (limité à 25 caractères)
            name = place.get('name', '')
            if len(name) > 25:
                name = name[:22] + '...'
            c.drawString(30, y, name)
            
            # Catégorie
            c.drawString(230, y, place.get('category', ''))
            
            # Distance
            distance = place.get('distance', '')
            if distance:
                c.drawString(350, y, f"{distance} km")
            
            # Durée
            duration = place.get('duration', '')
            if duration:
                c.drawString(450, y, f"{duration} min")
            
            y -= 20
        
        # Finaliser le PDF
        c.save()
        
        return jsonify({"success": True, "url": "/static/resultats.pdf"})
        
    except Exception as e:
        app.logger.error(f"Erreur lors de la génération du PDF: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/health')
def health_check():
    """Vérification de l'état de santé de l'API"""
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True)
