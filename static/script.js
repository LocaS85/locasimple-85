
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
        transportMode: 'driving', // 'driving', 'walking', 'cycling', 'transit'
        duration: 15,
        distance: 5,
        unit: 'km' // 'km', 'miles'
    };
    
    // Initialiser la carte Mapbox
    initMap();
    
    // Gestion des accordéons de filtres
    document.querySelectorAll('.filter-header').forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            
            // Fermer tous les autres contenus de filtre
            document.querySelectorAll('.filter-content').forEach(content => {
                if (content.id !== targetId) {
                    content.classList.remove('active');
                }
            });
            
            // Basculer la classe active sur le contenu cible
            targetContent.classList.toggle('active');
            
            // Rotation de l'icône
            const icon = this.querySelector('.fa-chevron-right');
            if (targetContent.classList.contains('active')) {
                icon.style.transform = 'rotate(90deg)';
            } else {
                icon.style.transform = 'rotate(0)';
            }
        });
    });
    
    // Gestion des boutons de transport
    document.querySelectorAll('.transport-button').forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            document.querySelectorAll('.transport-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Mettre à jour le mode de transport
            filters.transportMode = this.getAttribute('data-mode');
            console.log('Mode de transport:', filters.transportMode);
        });
    });
    
    // Gestion du changement de catégorie
    document.querySelectorAll('.category-item input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCategories = [];
            document.querySelectorAll('.category-item input:checked').forEach(checked => {
                checkedCategories.push(checked.id.replace('cat-', ''));
            });
            
            // Si au moins une catégorie est cochée, mettre à jour le filtre
            if (checkedCategories.length > 0) {
                filters.category = checkedCategories;
            } else {
                // Si aucune catégorie n'est cochée, cocher par défaut "restaurant"
                document.getElementById('cat-restaurant').checked = true;
                filters.category = ['restaurant'];
            }
            
            console.log('Catégories:', filters.category);
        });
    });
    
    // Gestion du changement du nombre de résultats
    document.getElementById('resultCount').addEventListener('change', function() {
        filters.resultCount = parseInt(this.value, 10);
        console.log('Nombre de résultats:', filters.resultCount);
    });
    
    // Gestion de la durée
    const durationSlider = document.createElement('input');
    durationSlider.type = 'range';
    durationSlider.id = 'durationSlider';
    durationSlider.min = '5';
    durationSlider.max = '60';
    durationSlider.value = '15';
    
    // Ajouter le slider après le texte de durée
    const durationItem = document.querySelector('.duration-item');
    durationItem.appendChild(durationSlider);
    
    // Écouter les changements du slider de durée
    durationSlider.addEventListener('input', function() {
        filters.duration = parseInt(this.value, 10);
        document.getElementById('durationValue').textContent = this.value;
        console.log('Durée max:', filters.duration, 'min');
    });
    
    // Gestion de la distance
    const distanceSlider = document.createElement('input');
    distanceSlider.type = 'range';
    distanceSlider.id = 'distanceSlider';
    distanceSlider.min = '1';
    distanceSlider.max = '20';
    distanceSlider.value = '5';
    
    // Ajouter le slider après le texte de distance
    const distanceItem = document.querySelector('.distance-item');
    distanceItem.appendChild(distanceSlider);
    
    // Écouter les changements du slider de distance
    distanceSlider.addEventListener('input', function() {
        filters.distance = parseInt(this.value, 10);
        document.getElementById('distanceValue').textContent = this.value;
        console.log('Distance max:', filters.distance, filters.unit);
    });
    
    // Gestion du changement d'unité (km/miles)
    document.getElementById('toggleUnit').addEventListener('click', function() {
        if (filters.unit === 'km') {
            filters.unit = 'miles';
            this.textContent = 'miles';
            
            // Convertir la valeur de km à miles
            const kmValue = parseInt(distanceSlider.value, 10);
            const mileValue = Math.round(kmValue * 0.621371);
            distanceSlider.value = mileValue;
            document.getElementById('distanceValue').textContent = mileValue;
        } else {
            filters.unit = 'km';
            this.textContent = 'km';
            
            // Convertir la valeur de miles à km
            const mileValue = parseInt(distanceSlider.value, 10);
            const kmValue = Math.round(mileValue / 0.621371);
            distanceSlider.value = kmValue;
            document.getElementById('distanceValue').textContent = kmValue;
        }
        console.log('Unité de distance:', filters.unit);
    });
    
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
        
        // Référence au conteneur de résultats
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.classList.remove('hidden');
        
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
            
            // Ajouter la distance et la durée (simulées pour l'exemple)
            const info = document.createElement('div');
            info.className = 'result-info';
            
            // Distance (simulée)
            const distance = document.createElement('span');
            const distanceValue = Math.random() * 10;
            distance.textContent = `${distanceValue.toFixed(1)} ${filters.unit}`;
            info.appendChild(distance);
            
            // Durée (simulée)
            const duration = document.createElement('span');
            const durationValue = Math.floor(distanceValue * 5);
            duration.textContent = `${durationValue} min`;
            info.appendChild(duration);
            
            resultItem.appendChild(info);
            
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
        // Masquer le conteneur de résultats
        document.getElementById('resultsContainer').classList.add('hidden');
        
        // Vider le conteneur de résultats
        document.getElementById('resultsContainer').innerHTML = '';
        
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
        filters.unit = 'km';
        
        // Réinitialiser les éléments de l'interface
        document.getElementById('resultCount').value = '5';
        
        // Réinitialiser les catégories
        document.querySelectorAll('.category-item input').forEach(checkbox => {
            checkbox.checked = checkbox.id === 'cat-restaurant';
        });
        
        // Réinitialiser les boutons de transport
        document.querySelectorAll('.transport-button').forEach((button, index) => {
            button.classList.toggle('active', index === 0);
        });
        
        // Réinitialiser les curseurs
        document.getElementById('durationSlider').value = '15';
        document.getElementById('durationValue').textContent = '15';
        
        document.getElementById('distanceSlider').value = '5';
        document.getElementById('distanceValue').textContent = '5';
        
        // Réinitialiser l'unité
        document.getElementById('toggleUnit').textContent = 'km';
    }
    
    // Fonction pour afficher un indicateur de chargement
    function showLoader() {
        document.getElementById('loader').classList.remove('hidden');
    }
    
    // Fonction pour masquer l'indicateur de chargement
    function hideLoader() {
        document.getElementById('loader').classList.add('hidden');
    }
});
