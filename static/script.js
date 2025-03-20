
// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Référence à la carte Mapbox
    let map;
    
    // Position par défaut (Paris)
    const defaultLocation = [2.3522, 48.8566];
    
    // Dernière position connue de l'utilisateur
    let userLocation = null;
    
    // État des filtres
    const filters = {
        category: 'restaurant',
        resultCount: 5,
        transportMode: 'driving', // 'driving', 'walking', 'cycling'
        duration: 15,
        distance: 5
    };
    
    // Initialiser la carte Mapbox
    initMap();
    
    // Fonctions d'initialisation et d'événements
    function initMap() {
        // Créer une nouvelle carte
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: defaultLocation,
            zoom: 13
        });
        
        // Ajouter les contrôles de navigation (zoom, etc.)
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Quand la carte est chargée
        map.on('load', function() {
            console.log('Carte chargée avec succès');
        });
    }
    
    // Gestion du bouton de filtre
    document.getElementById('toggleFilters').addEventListener('click', function() {
        document.getElementById('filtersContainer').classList.toggle('hidden');
    });
    
    // Gestion du formulaire de recherche
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchInput = document.getElementById('searchInput').value.trim();
        
        if (searchInput === '') {
            alert('Veuillez entrer un lieu à rechercher');
            return;
        }
        
        searchLocation(searchInput);
    });
    
    // Gestion du bouton de position actuelle
    document.getElementById('locationButton').addEventListener('click', function() {
        if (navigator.geolocation) {
            // Afficher un indicateur de chargement
            showLoader();
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    userLocation = [position.coords.longitude, position.coords.latitude];
                    
                    // Centrer la carte sur la position de l'utilisateur
                    map.flyTo({
                        center: userLocation,
                        zoom: 14,
                        essential: true
                    });
                    
                    // Ajouter un marqueur à la position de l'utilisateur
                    addUserMarker(userLocation);
                    
                    // Masquer l'indicateur de chargement
                    hideLoader();
                },
                function(error) {
                    hideLoader();
                    console.error('Erreur de géolocalisation:', error);
                    alert('Impossible d\'obtenir votre position. Vérifiez que la géolocalisation est activée dans votre navigateur.');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            alert('La géolocalisation n\'est pas prise en charge par votre navigateur.');
        }
    });
    
    // Gestion du bouton de réinitialisation
    document.getElementById('resetButton').addEventListener('click', function() {
        // Réinitialiser la carte
        map.flyTo({
            center: defaultLocation,
            zoom: 13,
            essential: true
        });
        
        // Effacer la recherche
        document.getElementById('searchInput').value = '';
        
        // Réinitialiser les filtres
        resetFilters();
        
        // Effacer les résultats
        clearResults();
    });
    
    // Gestion des options de transport
    const transportButtons = document.querySelectorAll('.transport-button');
    transportButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            transportButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Mettre à jour le mode de transport
            const modes = ['driving', 'walking', 'cycling'];
            filters.transportMode = modes[index];
            
            console.log('Mode de transport:', filters.transportMode);
        });
    });
    
    // Gestion du changement de catégorie
    document.getElementById('categories').addEventListener('change', function() {
        filters.category = this.value;
        console.log('Catégorie:', filters.category);
    });
    
    // Gestion du changement du nombre de résultats
    document.getElementById('resultCount').addEventListener('change', function() {
        filters.resultCount = parseInt(this.value, 10);
        console.log('Nombre de résultats:', filters.resultCount);
    });
    
    // Gestion du changement de durée
    document.getElementById('duration').addEventListener('input', function() {
        filters.duration = parseInt(this.value, 10);
        document.getElementById('durationValue').textContent = this.value;
        console.log('Durée max:', filters.duration, 'min');
    });
    
    // Gestion du changement de distance
    document.getElementById('distance').addEventListener('input', function() {
        filters.distance = parseInt(this.value, 10);
        document.getElementById('distanceValue').textContent = this.value;
        console.log('Distance max:', filters.distance, 'km');
    });
    
    // Fonction pour rechercher un lieu
    function searchLocation(query) {
        // Afficher un indicateur de chargement
        showLoader();
        
        // Construire l'URL de recherche
        const searchUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&limit=1`;
        
        // Effectuer la recherche
        fetch(searchUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                if (data.features && data.features.length > 0) {
                    const result = data.features[0];
                    const coordinates = result.center;
                    
                    // Centrer la carte sur le résultat
                    map.flyTo({
                        center: coordinates,
                        zoom: 14,
                        essential: true
                    });
                    
                    // Ajouter un marqueur
                    addMarker(coordinates, result.place_name);
                    
                    // Rechercher des lieux à proximité
                    searchNearbyPlaces(coordinates);
                } else {
                    alert('Aucun résultat trouvé pour cette recherche');
                    hideLoader();
                }
            })
            .catch(error => {
                console.error('Erreur de recherche:', error);
                alert('Erreur lors de la recherche. Veuillez réessayer.');
                hideLoader();
            });
    }
    
    // Fonction pour rechercher des lieux à proximité
    function searchNearbyPlaces(coordinates) {
        // Construire l'URL de recherche
        const url = `/api/search?query=${filters.category}&mode=${filters.transportMode}&lat=${coordinates[1]}&lon=${coordinates[0]}&limit=${filters.resultCount}`;
        
        // Effectuer la recherche
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                // Afficher les résultats
                displayResults(data, coordinates);
                hideLoader();
            })
            .catch(error => {
                console.error('Erreur de recherche des lieux à proximité:', error);
                alert('Erreur lors de la recherche des lieux à proximité');
                hideLoader();
            });
    }
    
    // Fonction pour afficher les résultats
    function displayResults(results, origin) {
        // Effacer les résultats précédents
        clearResults();
        
        // Créer un conteneur pour les résultats
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'results-container';
        
        // Ajouter des marqueurs et des informations pour chaque résultat
        results.forEach((place, index) => {
            // Ajouter un marqueur
            addMarker([place.coordinates[0], place.coordinates[1]], place.name);
            
            // Créer un élément pour le résultat
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            // Ajouter le titre
            const title = document.createElement('div');
            title.className = 'result-title';
            title.textContent = place.name;
            resultItem.appendChild(title);
            
            // Ajouter l'adresse
            const address = document.createElement('div');
            address.className = 'result-address';
            address.textContent = place.place_name;
            resultItem.appendChild(address);
            
            // Ajouter des informations supplémentaires (à implémenter)
            
            // Ajouter un événement de clic pour centrer la carte sur ce résultat
            resultItem.addEventListener('click', function() {
                map.flyTo({
                    center: [place.coordinates[0], place.coordinates[1]],
                    zoom: 16,
                    essential: true
                });
            });
            
            // Ajouter cet élément au conteneur de résultats
            resultsContainer.appendChild(resultItem);
        });
        
        // Ajouter le conteneur de résultats au corps du document
        document.body.appendChild(resultsContainer);
    }
    
    // Fonction pour ajouter un marqueur à la carte
    function addMarker(coordinates, title) {
        new mapboxgl.Marker()
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${title}</h3>`))
            .addTo(map);
    }
    
    // Fonction pour ajouter un marqueur à la position de l'utilisateur
    function addUserMarker(coordinates) {
        new mapboxgl.Marker({ color: '#4285F4' })
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup().setHTML('<h3>Votre position</h3>'))
            .addTo(map);
    }
    
    // Fonction pour effacer les résultats
    function clearResults() {
        // Supprimer le conteneur de résultats s'il existe
        const existingResults = document.querySelector('.results-container');
        if (existingResults) {
            existingResults.remove();
        }
        
        // Supprimer tous les marqueurs
        const markers = document.querySelectorAll('.mapboxgl-marker');
        markers.forEach(marker => {
            if (!marker.classList.contains('user-marker')) {
                marker.remove();
            }
        });
    }
    
    // Fonction pour réinitialiser les filtres
    function resetFilters() {
        // Réinitialiser les valeurs des filtres
        filters.category = 'restaurant';
        filters.resultCount = 5;
        filters.transportMode = 'driving';
        filters.duration = 15;
        filters.distance = 5;
        
        // Réinitialiser les éléments de l'interface
        document.getElementById('categories').value = 'restaurant';
        document.getElementById('resultCount').value = '5';
        
        // Réinitialiser les boutons de transport
        transportButtons.forEach((button, index) => {
            if (index === 0) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Réinitialiser les curseurs
        document.getElementById('duration').value = '15';
        document.getElementById('durationValue').textContent = '15';
        
        document.getElementById('distance').value = '5';
        document.getElementById('distanceValue').textContent = '5';
    }
    
    // Fonction pour afficher un indicateur de chargement
    function showLoader() {
        // Supprimer l'indicateur de chargement existant s'il y en a un
        hideLoader();
        
        // Créer un nouvel indicateur de chargement
        const loader = document.createElement('div');
        loader.className = 'loader';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        loader.appendChild(spinner);
        
        const text = document.createElement('div');
        text.textContent = 'Chargement...';
        loader.appendChild(text);
        
        document.body.appendChild(loader);
    }
    
    // Fonction pour masquer l'indicateur de chargement
    function hideLoader() {
        const existingLoader = document.querySelector('.loader');
        if (existingLoader) {
            existingLoader.remove();
        }
    }
    
    // Initialisation: définir le premier bouton de transport comme actif
    transportButtons[0].classList.add('active');
});
