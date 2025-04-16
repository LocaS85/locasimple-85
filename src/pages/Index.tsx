<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recherche Géolocalisée</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
  <link href="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <style>
    :root {
      --primary-color: #2A5C82;
      --secondary-color: #5BA4E6;
    }

    body {
      margin: 0;
      display: grid;
      grid-template-columns: 300px 1fr;
      height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .filters-panel {
      background: white;
      padding: 20px;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      z-index: 1001;
    }

    .search-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    #searchInput {
      flex: 1;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 25px;
    }

    .voice-search {
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 50%;
      width: 45px;
      height: 45px;
      cursor: pointer;
    }

    .voice-search:hover {
      background: var(--secondary-color);
    }

    .filter-group {
      margin: 20px 0;
    }

    .transport-filter {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .transport-btn {
      border: none;
      padding: 8px 12px;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      color: white;
      font-size: 14px;
      transition: transform 0.2s ease;
    }

    .transport-btn:hover {
      transform: scale(1.05);
    }

    .subcategories-scroll {
      display: flex;
      overflow-x: auto;
      gap: 15px;
      padding: 10px 0;
    }

    .subcategory-item {
      flex: 0 0 auto;
      padding: 8px 15px;
      border-radius: 20px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      white-space: nowrap;
    }

    .subcategory-item:hover {
      background: var(--secondary-color);
      color: white;
    }

    #map {
      height: 100vh;
      z-index: 0;
    }

    .distance-filter {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    button:focus {
      outline: none;
    }

    @media (max-width: 768px) {
      body {
        grid-template-columns: 1fr;
      }

      .filters-panel {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60vh;
        transform: translateY(100%);
        transition: transform 0.3s;
      }

      .filters-active .filters-panel {
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <div class="filters-panel">
    <div class="search-bar">
      <input type="text" id="searchInput" placeholder="Rechercher..." />
      <button class="voice-search" title="Recherche vocale"><i class="fas fa-microphone"></i></button>
    </div>

    <div class="filter-group">
      <h4>Catégorie</h4>
      <select onchange="showSubcategories(this.value)">
        <option value="">Choisir</option>
        <option value="Adresse principale">Adresse principale</option>
        <option value="Famille">Famille</option>
        <option value="Travail">Travail</option>
        <option value="École">École</option>
        <option value="Alimentation et Boissons">Alimentation et Boissons</option>
        <option value="Achats">Achats</option>
        <option value="Services">Services</option>
        <option value="Santé et Bien-être">Santé et Bien-être</option>
        <option value="Divertissement et Loisirs">Divertissement et Loisirs</option>
        <option value="Hébergement">Hébergement</option>
      </select>
    </div>

    <div class="filter-group">
      <div class="subcategories-scroll" id="subcategories"></div>
    </div>

    <div class="filter-group">
      <h4>Nombre de résultats</h4>
      <input type="range" min="1" max="10" value="5" id="resultRange" />
    </div>

    <div class="filter-group">
      <h4>Rayon de recherche</h4>
      <div class="distance-filter">
        <button onclick="setUnit('km')">km</button>
        <button onclick="setUnit('mi')">mi</button>
        <input type="number" id="distanceInput" value="5" onchange="updateRadius(this.value)" />
      </div>
    </div>

    <div class="filter-group">
      <h4>Mode de transport</h4>
      <div class="transport-filter">
        <button class="transport-btn" style="background: #FF6B6B"><i class="fas fa-car"></i> Voiture</button>
        <button class="transport-btn" style="background: #4ECDC4"><i class="fas fa-walking"></i> À pied</button>
        <button class="transport-btn" style="background: #45B7D1"><i class="fas fa-bicycle"></i> Vélo</button>
        <button class="transport-btn" style="background: #96CEB4"><i class="fas fa-bus"></i> Transports</button>
        <button class="transport-btn" style="background: #FFEEAD"><i class="fas fa-train"></i> Train</button>
        <button class="transport-btn" style="background: #D4A5A5"><i class="fas fa-ship"></i> Bateau</button>
        <button class="transport-btn" style="background: #774F38"><i class="fas fa-users"></i> Co-voiturage</button>
        <button class="transport-btn" style="background: #8E44AD"><i class="fas fa-plane"></i> Avion</button>
      </div>
    </div>
  </div>

  <div id="map"></div>

  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <script>
    const map = L.map('map', { zoomControl: false }).setView([48.8566, 2.3522], 13);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    let currentRadius;
    function updateRadius(radius) {
      if (currentRadius) map.removeLayer(currentRadius);
      currentRadius = L.circle(map.getCenter(), {
        radius: radius * 1000,
        color: '#2A5C82',
        fillOpacity: 0.1
      }).addTo(map);
    }

    let unit = 'km';
    function setUnit(selected) {
      unit = selected;
    }
  </script>
</body>
</html>

