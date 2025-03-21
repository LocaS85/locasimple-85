
// Variables globales
let map;
let userMarker;
let searchResults = [];
let activeTransportMode = 'driving';
let distanceUnit = 'km';
let isFilterMenuOpen = false;

// Initialisation de la carte
function initMap() {
    try {
        // Vérifier si le token est défini
        if (!mapboxgl.accessToken || mapboxgl.accessToken === 'undefined' || mapboxgl.accessToken === '') {
            showError("Token Mapbox non défini. Veuillez configurer votre fichier .env avec MAPBOX_ACCESS_TOKEN");
            return;
        }

        // Créer la carte
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2.3522, 48.8566], // Paris par défaut
            zoom: 12,
            minZoom: 3
        });

        // Ajouter les contrôles de navigation (zoom, etc.)
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Gestionnaire d'événement pour la fin du chargement de la carte
        map.on('load', () => {
            console.log('Carte chargée avec succès');
            
            // Ajouter une source pour les itinéraires
            map.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': []
                    }
                }
            });
            
            // Ajouter une couche pour afficher les itinéraires
            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#4285F4',
                    'line-width': 5,
                    'line-opacity': 0.7
                }
            });
        });

        // Gestionnaire d'erreur pour la carte
        map.on('error', (e) => {
            console.error('Erreur de carte Mapbox:', e);
            showError("Erreur lors du chargement de la carte. Vérifiez votre connexion internet et votre token Mapbox.");
        });

    } catch (error) {
        console.error('Erreur d\'initialisation de la carte:', error);
        showError("Erreur d'initialisation de la carte. Vérifiez votre token Mapbox et votre connexion.");
    }
}

// Afficher une erreur sur la page
function showError(message) {
    // Masquer la carte
    document.getElementById('map').style.display = 'none';
    
    // Créer et afficher le message d'erreur
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `
        <i class="fa-solid fa-circle-exclamation"></i>
        <p>${message}</p>
    `;
    document.body.appendChild(errorElement);
}

// Gérer la soumission du formulaire de recherche
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput').value.trim();
    
    if (searchInput === '') return;
    
    searchPlaces(searchInput);
});

// Rechercher des lieux
async function searchPlaces(query) {
    try {
        showLoader(true);
        
        // Vérifier si l'utilisateur a une position
        if (!userMarker) {
            // Par défaut, utiliser Paris
            userMarker = new mapboxgl.Marker({ color: '#4285F4' })
                .setLngLat([2.3522, 48.8566])
                .addTo(map);
        }

        const userPosition = userMarker.getLngLat();
        const resultCount = document.getElementById('resultCount').value;
        
        // Faire la requête au serveur Flask
        const response = await fetch(`/search?query=${encodeURIComponent(query)}&mode=${activeTransportMode}&lat=${userPosition.lat}&lon=${userPosition.lng}&limit=${resultCount}`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Afficher les résultats
        displayResults(data);
        
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        alert(`Erreur de recherche: ${error.message}`);
    } finally {
        showLoader(false);
    }
}

// Afficher les résultats sur la carte et dans le panneau
function displayResults(results) {
    // Effacer les résultats précédents
    clearResults();
    
    // Stocker les nouveaux résultats
    searchResults = results;
    
    if (results.length === 0) {
        // Aucun résultat
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
        return;
    }
    
    // Ajouter les marqueurs sur la carte
    const bounds = new mapboxgl.LngLatBounds();
    
    results.forEach((result, index) => {
        // Créer un élément HTML pour le marqueur
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `<div class="marker-label">${index + 1}</div>`;
        
        // Ajouter le marqueur à la carte
        const marker = new mapboxgl.Marker(el)
            .setLngLat([result.lon, result.lat])
            .addTo(map);
        
        // Ajouter un popup
        const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
                <h3>${result.name}</h3>
                <p>${result.place_name || ''}</p>
                <p>Distance: ${result.distance} km</p>
                <p>Durée: ${result.duration} min</p>
            `);
        
        marker.setPopup(popup);
        
        // Étendre les limites pour inclure ce point
        bounds.extend([result.lon, result.lat]);
    });
    
    // Inclure la position de l'utilisateur dans les limites
    bounds.extend(userMarker.getLngLat());
    
    // Ajuster la carte pour afficher tous les points
    map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
    });
    
    // Afficher le panneau de résultats
    displayResultsPanel(results);
    
    // Afficher les informations de distance et durée pour le premier résultat
    updateDistanceDuration(results[0]);
    
    // Afficher le tracé pour le premier résultat
    showRoute(userMarker.getLngLat(), [results[0].lon, results[0].lat]);
}

// Afficher le panneau de résultats
function displayResultsPanel(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
    resultsContainer.classList.remove('hidden');
    
    results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-title">${index + 1}. ${result.name}</div>
            <div class="result-address">${result.place_name || ''}</div>
            <div class="result-info">
                <span><i class="fa-solid fa-route"></i> ${result.distance} km</span>
                <span><i class="fa-regular fa-clock"></i> ${result.duration} min</span>
            </div>
        `;
        
        // Ajouter un gestionnaire d'événement pour cliquer sur un résultat
        resultItem.addEventListener('click', () => {
            // Centrer la carte sur ce résultat
            map.flyTo({
                center: [result.lon, result.lat],
                zoom: 14
            });
            
            // Afficher le tracé pour ce résultat
            showRoute(userMarker.getLngLat(), [result.lon, result.lat]);
            
            // Mettre à jour les informations de distance et durée
            updateDistanceDuration(result);
        });
        
        resultsContainer.appendChild(resultItem);
    });
}

// Afficher le tracé entre deux points
async function showRoute(start, end) {
    try {
        // Obtenir les coordonnées
        const startCoords = Array.isArray(start) ? start : [start.lng, start.lat];
        const endCoords = Array.isArray(end) ? end : [end.lng, end.lat];
        
        // Construire l'URL pour l'API Directions
        const url = `https://api.mapbox.com/directions/v5/mapbox/${activeTransportMode}/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
        
        // Faire la requête
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
            // Mettre à jour la source de données pour le tracé
            map.getSource('route').setData({
                type: 'Feature',
                properties: {},
                geometry: data.routes[0].geometry
            });
        }
    } catch (error) {
        console.error('Erreur lors de l\'affichage du tracé:', error);
    }
}

// Mettre à jour les informations de distance et durée
function updateDistanceDuration(result) {
    if (!result) return;
    
    document.getElementById('durationValue').textContent = result.duration;
    
    // Mettre à jour la distance en fonction de l'unité sélectionnée
    const distance = distanceUnit === 'km' ? result.distance : result.distance * 0.621371;
    document.getElementById('distanceValue').textContent = distance.toFixed(1);
    document.getElementById('toggleUnit').textContent = distanceUnit;
}

// Nettoyer les résultats précédents
function clearResults() {
    // Supprimer tous les marqueurs sauf celui de l'utilisateur
    document.querySelectorAll('.mapboxgl-marker:not(.user-marker)').forEach(marker => {
        marker.remove();
    });
    
    // Vider le panneau de résultats
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
    resultsContainer.classList.add('hidden');
    
    // Réinitialiser le tracé
    if (map.getSource('route')) {
        map.getSource('route').setData({
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        });
    }
}

// Gérer le bouton de géolocalisation
document.getElementById('locationButton').addEventListener('click', function() {
    getUserLocation();
});

// Obtenir la position de l'utilisateur
function getUserLocation() {
    showLoader(true);
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Succès
            (position) => {
                const { latitude, longitude } = position.coords;
                
                // Mettre à jour ou créer le marqueur de l'utilisateur
                if (userMarker) {
                    userMarker.setLngLat([longitude, latitude]);
                } else {
                    userMarker = new mapboxgl.Marker({ color: '#4285F4', className: 'user-marker' })
                        .setLngLat([longitude, latitude])
                        .addTo(map);
                }
                
                // Centrer la carte sur la position de l'utilisateur
                map.flyTo({
                    center: [longitude, latitude],
                    zoom: 14
                });
                
                showLoader(false);
            },
            // Erreur
            (error) => {
                console.error('Erreur de géolocalisation:', error);
                alert("Impossible d'obtenir votre position. Vérifiez que vous avez autorisé la géolocalisation.");
                showLoader(false);
            }
        );
    } else {
        alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
        showLoader(false);
    }
}

// Gérer le bouton de réinitialisation
document.getElementById('resetButton').addEventListener('click', function() {
    // Réinitialiser la recherche
    document.getElementById('searchInput').value = '';
    clearResults();
    
    // Centrer la carte sur Paris (par défaut)
    map.flyTo({
        center: [2.3522, 48.8566],
        zoom: 12
    });
    
    // Réinitialiser les filtres
    resetFilters();
});

// Gérer le bouton d'impression
document.getElementById('printButton').addEventListener('click', function() {
    if (searchResults.length === 0) {
        alert("Aucun résultat à imprimer. Faites d'abord une recherche.");
        return;
    }
    
    generatePDF(searchResults);
});

// Générer un PDF avec les résultats
async function generatePDF(results) {
    try {
        showLoader(true);
        
        // Faire la requête pour générer le PDF
        const response = await fetch('/generate_pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ places: results })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Ouvrir le PDF dans un nouvel onglet
            window.open(data.url, '_blank');
        } else {
            throw new Error(data.error || "Erreur lors de la génération du PDF");
        }
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert(`Erreur: ${error.message}`);
    } finally {
        showLoader(false);
    }
}

// Gérer le bouton de paramètres
document.getElementById('settingsButton').addEventListener('click', function() {
    toggleFiltersMenu();
});

// Afficher/masquer le menu de filtres
function toggleFiltersMenu() {
    const filtersMenu = document.getElementById('filtersMenu');
    isFilterMenuOpen = !isFilterMenuOpen;
    
    if (isFilterMenuOpen) {
        filtersMenu.classList.remove('hidden');
    } else {
        filtersMenu.classList.add('hidden');
    }
}

// Initialiser les panneaux de filtres dépliables
function initFilterPanels() {
    const filterHeaders = document.querySelectorAll('.filter-header');
    
    filterHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            
            // Replier tous les autres panneaux
            document.querySelectorAll('.filter-content').forEach(content => {
                if (content.id !== targetId) {
                    content.classList.remove('active');
                }
            });
            
            // Déplier ou replier le panneau actuel
            targetContent.classList.toggle('active');
            
            // Faire pivoter l'icône
            const icon = this.querySelector('.fa-chevron-right');
            if (targetContent.classList.contains('active')) {
                icon.style.transform = 'rotate(90deg)';
            } else {
                icon.style.transform = 'rotate(0)';
            }
        });
    });
    
    // Ouvrir le premier panneau par défaut
    if (filterHeaders.length > 0) {
        const firstHeader = filterHeaders[0];
        const firstTargetId = firstHeader.getAttribute('data-target');
        document.getElementById(firstTargetId).classList.add('active');
        firstHeader.querySelector('.fa-chevron-right').style.transform = 'rotate(90deg)';
    }
}

// Gérer les modes de transport
document.querySelectorAll('.transport-button').forEach(button => {
    button.addEventListener('click', function() {
        // Supprimer la classe active de tous les boutons
        document.querySelectorAll('.transport-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Ajouter la classe active au bouton cliqué
        this.classList.add('active');
        
        // Mettre à jour le mode de transport actif
        activeTransportMode = this.getAttribute('data-mode');
        
        // Si des résultats sont affichés, mettre à jour le tracé
        if (searchResults.length > 0) {
            showRoute(userMarker.getLngLat(), [searchResults[0].lon, searchResults[0].lat]);
        }
    });
});

// Basculer entre kilomètres et miles
document.getElementById('toggleUnit').addEventListener('click', function() {
    distanceUnit = distanceUnit === 'km' ? 'miles' : 'km';
    this.textContent = distanceUnit;
    
    // Mettre à jour la distance affichée
    if (searchResults.length > 0) {
        updateDistanceDuration(searchResults[0]);
    }
});

// Afficher/masquer le chargeur
function showLoader(show) {
    const loader = document.getElementById('loader');
    if (show) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

// Réinitialiser les filtres
function resetFilters() {
    // Réinitialiser les catégories
    document.querySelectorAll('.category-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Réinitialiser le nombre de résultats
    document.getElementById('resultCount').value = '5';
    
    // Réinitialiser le mode de transport
    document.querySelectorAll('.transport-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.transport-button[data-mode="driving"]').classList.add('active');
    activeTransportMode = 'driving';
    
    // Réinitialiser l'unité de distance
    distanceUnit = 'km';
    document.getElementById('toggleUnit').textContent = distanceUnit;
    
    // Réinitialiser les valeurs de durée et distance
    document.getElementById('durationValue').textContent = '--';
    document.getElementById('distanceValue').textContent = '--';
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser la carte
    initMap();
    
    // Initialiser les panneaux de filtres
    initFilterPanels();
});
