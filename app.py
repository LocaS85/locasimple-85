
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Replace with your actual Mapbox API key
MAPBOX_ACCESS_TOKEN = os.environ.get('MAPBOX_ACCESS_TOKEN', 'YOUR_MAPBOX_ACCESS_TOKEN')

@app.route("/search", methods=["GET"])
def search_places():
    """Search for places and calculate routes"""
    query = request.args.get("query")
    mode = request.args.get("mode")
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    limit = int(request.args.get("limit", 5))  # Default to 5 results
    
    if not all([query, lat, lon]):
        return jsonify({"error": "Missing required parameters"}), 400
    
    try:
        # Search for places using Mapbox Geocoding API
        geocoding_url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json"
        params = {
            "proximity": f"{lon},{lat}",
            "limit": limit,
            "access_token": MAPBOX_ACCESS_TOKEN
        }
        
        response = requests.get(geocoding_url, params=params)
        response.raise_for_status()  # Raise an exception for 4XX/5XX responses
        
        data = response.json()
        features = data.get("features", [])
        
        results = []
        # Calculate routes to each place
        for place in features:
            place_name = place.get("text", "Unknown place")
            coords = place.get("center", [0, 0])
            
            # Skip if no coordinates
            if not coords:
                continue
                
            # Get route from user location to place
            # Default to driving if mode not specified
            transport_mode = mode if mode in ["driving", "walking", "cycling"] else "driving"
            
            route_url = f"https://api.mapbox.com/directions/v5/mapbox/{transport_mode}/{lon},{lat};{coords[0]},{coords[1]}"
            route_params = {
                "access_token": MAPBOX_ACCESS_TOKEN,
                "overview": "full",
                "geometries": "geojson"
            }
            
            try:
                route_res = requests.get(route_url, params=route_params)
                route_res.raise_for_status()
                route_data = route_res.json()
                
                if "routes" in route_data and route_data["routes"]:
                    route = route_data["routes"][0]
                    duration = route.get("duration", 0) / 60  # Convert to minutes
                    distance = route.get("distance", 0) / 1000  # Convert to km
                    
                    results.append({
                        "name": place_name,
                        "place_name": place.get("place_name", ""),
                        "lat": coords[1],
                        "lon": coords[0],
                        "duration": round(duration, 1),
                        "distance": round(distance, 1),
                        "category": query  # Use the search query as category
                    })
            except Exception as route_error:
                print(f"Error getting route to {place_name}: {route_error}")
                # Still add the place even if route calculation fails
                results.append({
                    "name": place_name,
                    "place_name": place.get("place_name", ""),
                    "lat": coords[1],
                    "lon": coords[0],
                    "duration": None,
                    "distance": None,
                    "category": query
                })
        
        return jsonify(results)
    
    except Exception as e:
        print(f"Error in search: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/generate_pdf", methods=["POST"])
def generate_pdf():
    """Generate a PDF with search results"""
    try:
        data = request.json
        places = data.get("places", [])
        
        if not places:
            return jsonify({"error": "No places provided"}), 400
            
        filename = "resultats.pdf"
        
        # Create PDF
        c = canvas.Canvas(filename, pagesize=letter)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, 750, "Résultats de recherche")
        
        c.setFont("Helvetica", 12)
        c.drawString(50, 730, f"Nombre de résultats: {len(places)}")
        
        y = 700
        for i, place in enumerate(places, 1):
            # Skip if y position is too low (page overflow)
            if y < 50:
                c.showPage()  # Start new page
                y = 750
                
            name = place.get("name", "Sans nom")
            distance = place.get("distance", "N/A")
            duration = place.get("duration", "N/A")
            
            c.setFont("Helvetica-Bold", 12)
            c.drawString(50, y, f"{i}. {name}")
            y -= 20
            
            c.setFont("Helvetica", 10)
            c.drawString(70, y, f"Distance: {distance} km")
            y -= 15
            
            c.drawString(70, y, f"Durée: {duration} min")
            y -= 25
        
        c.save()
        
        return jsonify({
            "success": True,
            "message": "PDF généré avec succès",
            "filename": filename
        })
        
    except Exception as e:
        print(f"Error generating PDF: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "ok", "message": "Flask server is running"})

if __name__ == "__main__":
    app.run(debug=True)
