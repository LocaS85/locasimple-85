
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import L from 'leaflet';
import { jsPDF } from 'jspdf';
import 'leaflet/dist/leaflet.css';
import { MAPBOX_TOKEN } from '@/config/environment';

// Correction pour les icônes Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
}

interface RouteCategory {
  color: string;
  visible: boolean;
  points: RoutePoint[];
}

interface Routes {
  [key: string]: RouteCategory;
}

const Categories = () => {
  const [routes, setRoutes] = useState<Routes>({
    famille: { color: 'red', visible: true, points: [] },
    travail: { color: 'blue', visible: true, points: [] },
    ecole: { color: 'green', visible: true, points: [] },
    divers: { color: 'purple', visible: true, points: [] }
  });
  
  const [newPlace, setNewPlace] = useState({
    name: '',
    category: 'famille'
  });
  
  const [filters, setFilters] = useState({
    distance: 'km',
    transport: 'voiture',
    duree: '30'
  });
  
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Fonction pour basculer la visibilité d'une catégorie
  const toggleCategory = (category: string) => {
    setRoutes(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        visible: !prev[category].visible
      }
    }));
  };

  // Fonction pour ajouter un nouveau lieu
  const addPlace = () => {
    if (!newPlace.name.trim()) {
      alert('Veuillez entrer un nom pour le lieu');
      return;
    }
    
    // Générer des coordonnées aléatoires autour de Paris pour la démo
    const lat = 48.8566 + (Math.random() - 0.5) * 0.1;
    const lng = 2.3522 + (Math.random() - 0.5) * 0.1;
    
    setRoutes(prev => ({
      ...prev,
      [newPlace.category]: {
        ...prev[newPlace.category],
        points: [...prev[newPlace.category].points, { lat, lng, name: newPlace.name }]
      }
    }));
    
    setNewPlace({
      name: '',
      category: 'famille'
    });
  };

  // Fonction pour filtrer les résultats
  const filterResults = () => {
    alert("Filtrage appliqué !");
    console.log("Filtres appliqués:", filters);
  };

  // Fonction pour générer un PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Carte et Descriptif des Trajets", 10, 10);
    
    let y = 30;
    Object.entries(routes).forEach(([category, data]) => {
      if (data.visible) {
        // Utilisation d'une couleur approximative pour le texte
        doc.setTextColor(data.color === 'red' ? '#FF0000' : 
                        data.color === 'blue' ? '#0000FF' :
                        data.color === 'green' ? '#008000' : '#800080');
                        
        doc.text(`${category.toUpperCase()} : ${data.points.length} points`, 10, y);
        y += 10;
        
        data.points.forEach((point, index) => {
          doc.text(`  - ${point.name}`, 20, y);
          y += 7;
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
        });
      }
    });
    
    doc.save("geolocalisation.pdf");
  };

  // Composant pour capturer la référence de la carte
  const MapReference = () => {
    const map = useMap();
    mapRef.current = map;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 mr-4">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">Catégories et Trajets</h1>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        {/* Carte */}
        <div className="border rounded-lg overflow-hidden shadow-md mb-6" style={{ height: "500px" }}>
          <MapContainer 
            center={[48.8566, 2.3522]} 
            zoom={12} 
            style={{ height: "100%", width: "100%" }}
            ref={mapContainerRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
            />
            <MapReference />
            
            {/* Afficher les polylines pour chaque catégorie */}
            {Object.entries(routes).map(([category, data]) => 
              data.visible && data.points.length > 0 && (
                <Polyline 
                  key={category} 
                  positions={data.points.map(p => [p.lat, p.lng])} 
                  color={data.color} 
                />
              )
            )}
            
            {/* Afficher les marqueurs pour chaque point */}
            {Object.entries(routes).map(([category, data]) => 
              data.visible && data.points.map((point, index) => (
                <Marker 
                  key={`${category}-${index}`} 
                  position={[point.lat, point.lng]} 
                  title={point.name}
                />
              ))
            )}
          </MapContainer>
        </div>
        
        {/* Filtres */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <select 
              className="px-3 py-2 border rounded-md"
              value={filters.distance}
              onChange={(e) => setFilters({...filters, distance: e.target.value})}
            >
              <option value="km">Distance en Km</option>
              <option value="miles">Distance en Miles</option>
            </select>
            
            <select 
              className="px-3 py-2 border rounded-md"
              value={filters.transport}
              onChange={(e) => setFilters({...filters, transport: e.target.value})}
            >
              <option value="voiture">Voiture</option>
              <option value="train">Train</option>
              <option value="velo">Vélo</option>
              <option value="pied">À pied</option>
            </select>
            
            <select 
              className="px-3 py-2 border rounded-md"
              value={filters.duree}
              onChange={(e) => setFilters({...filters, duree: e.target.value})}
            >
              <option value="10">Moins de 10 min</option>
              <option value="30">Moins de 30 min</option>
              <option value="60">Moins de 1 heure</option>
            </select>
            
            <Button onClick={filterResults}>
              Filtrer
            </Button>
          </div>
        </div>
        
        {/* Contrôles des catégories */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={routes.famille.visible ? "default" : "outline"}
              onClick={() => toggleCategory('famille')}
              className={routes.famille.visible ? "bg-red-500 hover:bg-red-600" : ""}
            >
              Famille ON/OFF
            </Button>
            
            <Button 
              variant={routes.travail.visible ? "default" : "outline"}
              onClick={() => toggleCategory('travail')}
              className={routes.travail.visible ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              Travail ON/OFF
            </Button>
            
            <Button 
              variant={routes.ecole.visible ? "default" : "outline"}
              onClick={() => toggleCategory('ecole')}
              className={routes.ecole.visible ? "bg-green-500 hover:bg-green-600" : ""}
            >
              École ON/OFF
            </Button>
            
            <Button 
              variant={routes.divers.visible ? "default" : "outline"}
              onClick={() => toggleCategory('divers')}
              className={routes.divers.visible ? "bg-purple-500 hover:bg-purple-600" : ""}
            >
              Divers ON/OFF
            </Button>
            
            <Button onClick={generatePDF}>
              📄 Exporter en PDF
            </Button>
          </div>
        </div>
        
        {/* Légende */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="px-3 py-2 rounded-md bg-red-500 text-white">🔴 Famille</div>
            <div className="px-3 py-2 rounded-md bg-blue-500 text-white">🔵 Travail</div>
            <div className="px-3 py-2 rounded-md bg-green-500 text-white">🟢 École</div>
            <div className="px-3 py-2 rounded-md bg-purple-500 text-white">🟣 Divers</div>
          </div>
        </div>
        
        {/* Formulaire d'ajout */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Ajouter un Lieu</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Nom du lieu</label>
              <input 
                type="text" 
                className="px-3 py-2 border rounded-md" 
                placeholder="Nom du lieu"
                value={newPlace.name}
                onChange={(e) => setNewPlace({...newPlace, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select 
                className="px-3 py-2 border rounded-md"
                value={newPlace.category}
                onChange={(e) => setNewPlace({...newPlace, category: e.target.value})}
              >
                <option value="famille">Famille</option>
                <option value="travail">Travail</option>
                <option value="ecole">École</option>
                <option value="divers">Divers</option>
              </select>
            </div>
            
            <Button onClick={addPlace}>
              Ajouter
            </Button>
          </div>
        </div>
        
        {/* Descriptif */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Descriptif des trajets</h2>
          <div>
            {Object.entries(routes).map(([category, data]) => 
              data.visible && (
                <div 
                  key={category}
                  className="p-3 mb-3 rounded-md text-white"
                  style={{ backgroundColor: data.color }}
                >
                  <h3 className="font-semibold mb-2">
                    {category.charAt(0).toUpperCase() + category.slice(1)}: {data.points.length} points
                  </h3>
                  {data.points.length > 0 && (
                    <ul className="list-disc pl-5">
                      {data.points.map((point, index) => (
                        <li key={index}>{point.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
