
// Initialisation de la carte Mapbox
document.addEventListener('DOMContentLoaded', function() {
    // Vérification du token Mapbox
    if (!mapboxgl.accessToken || mapboxgl.accessToken === 'undefined') {
        console.error('Token Mapbox manquant ou invalide');
        document.getElementById('map').innerHTML = '<div class="error-message">Erreur de chargement de la carte: Token Mapbox manquant</div>';
        return;
    }
    
    // Configuration de la carte
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [2.3522, 48.8566], // Paris par défaut
        zoom: 12
    });

    // Variables d'état
    let userMarker = null;
    let searchResults = [];
    let distanceUnit = 'km';
    let selectedTransportMode = 'driving';
    let directionsLayer = null;
    let directionsSource = null;

    // Référence aux éléments DOM
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('resultsContainer');
    const loader = document.getElementById('loader');
    const locationButton = document.getElementById('locationButton');
    const resetButton = document.getElementById('resetButton');
    const printButton = document.getElementById('printButton');
    const durationValue = document.getElementById('durationValue');
    const distanceValue = document.getElementById('distanceValue');
    const toggleUnitButton = document.getElementById('toggleUnit');
    const transportButtons = document.querySelectorAll('.transport-button');
    const filterHeaders = document.querySelectorAll('.filter-header');
    const settingsButton = document.getElementById('settingsButton');
    const filtersMenu = document.getElementById('filtersMenu');
    const categoryCheckboxes = document.querySelectorAll('.category-item input[type="checkbox"]');

    // Gestion du bouton de paramètres
    settingsButton.addEventListener('click', function() {
        filtersMenu.classList.toggle('hidden');
    });

    // Gestionnaire pour fermer le menu des filtres si on clique en dehors
    document.addEventListener('click', function(event) {
        const isClickInside = filtersMenu.contains(event.target) || settingsButton.contains(event.target);
        if (!isClickInside && !filtersMenu.classList.contains('hidden')) {
            filtersMenu.classList.add('hidden');
        }
    });

    // Gestionnaire pour les en-têtes des filtres (accordéon)
    filterHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const content = document.getElementById(target);
            
            // Toggle class active
            content.classList.toggle('active');
            
            // Mise à jour de l'icône
            const icon = this.querySelector('.fa-chevron-right, .fa-chevron-down');
            if (content.classList.contains('active')) {
                icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
            } else {
                icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
            }
        });
    });

    // Gestionnaire pour les boutons de mode de transport
    transportButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            transportButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Mettre à jour le mode de transport sélectionné
            selectedTransportMode = this.getAttribute('data-mode');
            
            // Si des résultats sont déjà affichés, mettre à jour les itinéraires
            if (searchResults.length > 0 && directionsSource) {
                updateRoutes();
            }
        });
    });

    // Gestionnaire pour le bouton de changement d'unité
    toggleUnitButton.addEventListener('click', function() {
        if (distanceUnit === 'km') {
            distanceUnit = 'miles';
            toggleUnitButton.textContent = 'miles';
            // Conversion des kilomètres en miles
            if (distanceValue.textContent) {
                distanceValue.textContent = (parseFloat(distanceValue.textContent) * 0.621371).toFixed(1);
            }
        } else {
            distanceUnit = 'km';
            toggleUnitButton.textContent = 'km';
            // Conversion des miles en kilomètres
            if (distanceValue.textContent) {
                distanceValue.textContent = (parseFloat(distanceValue.textContent) / 0.621371).toFixed(1);
            }
        }
        
        // Si des résultats sont déjà affichés, mettre à jour les distances
        if (searchResults.length > 0) {
            updateDistances();
        }
    });

    // Gestionnaire pour le bouton de géolocalisation
    locationButton.addEventListener('click', function() {
        loader.classList.remove('hidden');
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const { latitude, longitude } = position.coords;
                    
                    // Création ou mise à jour du marqueur utilisateur
                    if (userMarker) {
                        userMarker.setLngLat([longitude, latitude]);
                    } else {
                        const el = document.createElement('div');
                        el.className = 'user-marker';
                        el.style.width = '20px';
                        el.style.height = '20px';
                        el.style.borderRadius = '50%';
                        el.style.backgroundColor = '#4285F4';
                        el.style.border = '2px solid white';
                        
                        userMarker = new mapboxgl.Marker(el)
                            .setLngLat([longitude, latitude])
                            .addTo(map);
                    }
                    
                    // Centrer la carte sur la position de l'utilisateur
                    map.flyTo({
                        center: [longitude, latitude],
                        zoom: 14
                    });
                    
                    loader.classList.add('hidden');
                },
                function(error) {
                    console.error('Erreur de géolocalisation:', error);
                    alert('Impossible d\'obtenir votre position');
                    loader.classList.add('hidden');
                }
            );
        } else {
            alert('La géolocalisation n\'est pas prise en charge par votre navigateur');
            loader.classList.add('hidden');
        }
    });

    // Gestionnaire pour le bouton de réinitialisation
    resetButton.addEventListener('click', function() {
        // Réinitialiser la recherche
        searchInput.value = '';
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
        
        // Retirer les marqueurs des résultats
        searchResults.forEach(marker => {
            if (marker.marker) marker.marker.remove();
        });
        searchResults = [];
        
        // Supprimer les itinéraires
        if (directionsSource && map.getSource('directions')) {
            if (map.getLayer('directions-route')) {
                map.removeLayer('directions-route');
            }
            if (map.getLayer('directions-route-outline')) {
                map.removeLayer('directions-route-outline');
            }
            map.removeSource('directions');
            directionsSource = null;
        }
        
        // Réinitialiser la carte
        map.flyTo({
            center: [2.3522, 48.8566], // Paris
            zoom: 12
        });
    });

    // Gestionnaire pour le bouton d'impression
    if (printButton) {
        printButton.addEventListener('click', function() {
            if (searchResults.length === 0) {
                alert('Veuillez effectuer une recherche avant d\'imprimer');
                return;
            }
            
            // Préparation des données pour l'impression
            const printData = {
                title: `Résultats pour "${searchInput.value}"`,
                date: new Date().toLocaleDateString(),
                results: searchResults.map(result => ({
                    name: result.name,
                    address: result.place_name,
                    distance: `${calculateDistance(
                        map.getCenter(), 
                        [result.coordinates[0], result.coordinates[1]]
                    ).toFixed(1)} ${distanceUnit}`,
                    category: result.category || 'Non spécifiée'
                }))
            };
            
            // Génération du PDF (simulation)
            console.log('Données pour impression:', printData);
            alert('Fonctionnalité d\'impression en cours de développement');
            
            // Ici, vous pourriez implémenter une vraie génération de PDF
            // ou envoyer les données à une API pour générer le PDF
        });
    }

    // Gestionnaire pour le formulaire de recherche
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (!query) {
            alert('Veuillez entrer un terme de recherche');
            return;
        }
        
        // Afficher le chargement
        loader.classList.remove('hidden');
        
        // Récupérer les catégories sélectionnées
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => (checkbox as HTMLInputElement).checked)
            .map(checkbox => checkbox.id.replace('cat-', ''));
        
        // Récupérer les coordonnées actuelles de la carte
        const center = map.getCenter();
        
        // Récupérer le nombre de résultats demandé
        const resultCount = parseInt(document.getElementById('resultCount').value);
        
        // Envoyer la requête à l'API Mapbox
        searchMapbox(query, center, selectedCategories, resultCount);
    });

    // Fonction pour rechercher via l'API Mapbox
    function searchMapbox(query, center, categories, limit) {
        const categoriesParam = categories.length > 0 ? categories.join(',') : '';
        
        // Construire l'URL de l'API Mapbox Geocoding
        const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
        const params = {
            proximity: `${center.lng},${center.lat}`,
            limit: limit,
            access_token: mapboxgl.accessToken,
            types: 'poi,place,address'
        };
        
        if (categoriesParam) {
            params.categories = categoriesParam;
        }
        
        // Construire l'URL avec les paramètres
        const url = geocodingUrl + '?' + Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        
        // Faire la requête
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Vider les résultats précédents
                resultsContainer.innerHTML = '';
                
                // Retirer les marqueurs des résultats précédents
                searchResults.forEach(marker => {
                    if (marker.marker) marker.marker.remove();
                });
                searchResults = [];
                
                if (!data.features || data.features.length === 0) {
                    resultsContainer.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
                    resultsContainer.classList.remove('hidden');
                    loader.classList.add('hidden');
                    return;
                }
                
                // Traiter les résultats
                searchResults = data.features.map((feature, index) => {
                    const result = {
                        id: feature.id,
                        name: feature.text,
                        place_name: feature.place_name,
                        coordinates: feature.center,
                        category: feature.properties?.category || query,
                        marker: null
                    };
                    
                    // Créer le marqueur sur la carte
                    const el = document.createElement('div');
                    el.className = 'result-marker';
                    el.innerHTML = `<span>${index + 1}</span>`;
                    el.style.backgroundColor = '#4285F4';
                    el.style.color = 'white';
                    el.style.width = '24px';
                    el.style.height = '24px';
                    el.style.borderRadius = '50%';
                    el.style.display = 'flex';
                    el.style.alignItems = 'center';
                    el.style.justifyContent = 'center';
                    el.style.fontWeight = 'bold';
                    el.style.border = '2px solid white';
                    
                    result.marker = new mapboxgl.Marker(el)
                        .setLngLat(feature.center)
                        .addTo(map);
                    
                    return result;
                });
                
                // Ajouter les résultats à la liste
                searchResults.forEach((result, index) => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    
                    const distance = calculateDistance(center, result.coordinates);
                    
                    resultItem.innerHTML = `
                        <div class="result-title">${result.name}</div>
                        <div class="result-address">${result.place_name}</div>
                        <div class="result-info">
                            <span>Distance: ${distance.toFixed(1)} ${distanceUnit}</span>
                            <span>Catégorie: ${result.category}</span>
                        </div>
                    `;
                    
                    // Ajouter un gestionnaire de clic sur le résultat
                    resultItem.addEventListener('click', function() {
                        map.flyTo({
                            center: result.coordinates,
                            zoom: 15
                        });
                        
                        // Obtenir les itinéraires depuis la position actuelle vers ce résultat
                        if (userMarker) {
                            getDirections(userMarker.getLngLat(), result.coordinates, selectedTransportMode);
                        }
                    });
                    
                    resultsContainer.appendChild(resultItem);
                });
                
                // Afficher les résultats
                resultsContainer.classList.remove('hidden');
                
                // Adapter la vue pour montrer tous les résultats
                if (searchResults.length > 1) {
                    const bounds = new mapboxgl.LngLatBounds();
                    searchResults.forEach(result => bounds.extend(result.coordinates));
                    map.fitBounds(bounds, { padding: 100 });
                } else if (searchResults.length === 1) {
                    map.flyTo({
                        center: searchResults[0].coordinates,
                        zoom: 15
                    });
                }
                
                // Mettre à jour la durée et la distance pour le premier résultat
                if (searchResults.length > 0 && userMarker) {
                    getDirections(userMarker.getLngLat(), searchResults[0].coordinates, selectedTransportMode);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la recherche:', error);
                alert('Une erreur est survenue lors de la recherche');
            })
            .finally(() => {
                loader.classList.add('hidden');
            });
    }

    // Fonction pour obtenir les itinéraires
    function getDirections(start, end, mode) {
        const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${start.lng},${start.lat};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.routes || data.routes.length === 0) {
                    console.error('Aucun itinéraire trouvé');
                    return;
                }
                
                const route = data.routes[0];
                
                // Mettre à jour les valeurs de durée et de distance
                if (durationValue) {
                    durationValue.textContent = Math.round(route.duration / 60).toString();
                }
                
                if (distanceValue) {
                    const distanceInKm = route.distance / 1000;
                    const distanceToShow = distanceUnit === 'km' ? 
                        distanceInKm : 
                        distanceInKm * 0.621371;
                    distanceValue.textContent = distanceToShow.toFixed(1);
                }
                
                // Afficher l'itinéraire sur la carte
                const coordinates = route.geometry.coordinates;
                
                // Si la source d'itinéraire existe déjà, la mettre à jour
                if (directionsSource) {
                    directionsSource.setData({
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coordinates
                        }
                    });
                } else {
                    // Sinon, créer une nouvelle source et des couches
                    map.addSource('directions', {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: coordinates
                            }
                        }
                    });
                    
                    directionsSource = map.getSource('directions');
                    
                    // Ajouter la couche de contour d'itinéraire
                    map.addLayer({
                        id: 'directions-route-outline',
                        type: 'line',
                        source: 'directions',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#ffffff',
                            'line-width': 8
                        }
                    });
                    
                    // Ajouter la couche d'itinéraire
                    map.addLayer({
                        id: 'directions-route',
                        type: 'line',
                        source: 'directions',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#4285F4',
                            'line-width': 4
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Erreur lors de l\'obtention des itinéraires:', error);
            });
    }

    // Fonction pour mettre à jour les itinéraires quand le mode de transport change
    function updateRoutes() {
        if (userMarker && searchResults.length > 0) {
            getDirections(userMarker.getLngLat(), searchResults[0].coordinates, selectedTransportMode);
        }
    }

    // Fonction pour mettre à jour les distances quand l'unité change
    function updateDistances() {
        const center = map.getCenter();
        
        // Mettre à jour les distances dans la liste de résultats
        const resultItems = resultsContainer.querySelectorAll('.result-item');
        resultItems.forEach((item, index) => {
            if (index < searchResults.length) {
                const distance = calculateDistance(center, searchResults[index].coordinates);
                const distanceSpan = item.querySelector('.result-info span:first-child');
                if (distanceSpan) {
                    distanceSpan.textContent = `Distance: ${distance.toFixed(1)} ${distanceUnit}`;
                }
            }
        });
    }

    // Fonction pour calculer la distance entre deux points
    function calculateDistance(point1, point2) {
        // Conversion des coordonnées en radians
        const lat1 = point1.lat * Math.PI / 180;
        const lon1 = point1.lng * Math.PI / 180;
        const lat2 = point2[1] * Math.PI / 180;
        const lon2 = point2[0] * Math.PI / 180;
        
        // Rayon de la Terre en kilomètres
        const R = 6371;
        
        // Formule de Haversine
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let distance = R * c;
        
        // Conversion en miles si nécessaire
        if (distanceUnit === 'miles') {
            distance *= 0.621371;
        }
        
        return distance;
    }
});
