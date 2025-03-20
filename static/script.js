
// Initialisation de la carte Mapbox
document.addEventListener('DOMContentLoaded', function() {
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

    // Référence aux éléments DOM
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('resultsContainer');
    const loader = document.getElementById('loader');
    const locationButton = document.getElementById('locationButton');
    const resetButton = document.getElementById('resetButton');
    const durationValue = document.getElementById('durationValue');
    const distanceValue = document.getElementById('distanceValue');
    const toggleUnitButton = document.getElementById('toggleUnit');
    const transportButtons = document.querySelectorAll('.transport-button');
    const filterHeaders = document.querySelectorAll('.filter-header');
    const settingsButton = document.getElementById('settingsButton');
    const filtersMenu = document.getElementById('filtersMenu');

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
            const icon = this.querySelector('.fa-chevron-right');
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
        });
    });

    // Gestionnaire pour le bouton de changement d'unité
    toggleUnitButton.addEventListener('click', function() {
        if (distanceUnit === 'km') {
            distanceUnit = 'miles';
            toggleUnitButton.textContent = 'miles';
            // Conversion des kilomètres en miles
            distanceValue.textContent = (parseInt(distanceValue.textContent) * 0.621371).toFixed(1);
        } else {
            distanceUnit = 'km';
            toggleUnitButton.textContent = 'km';
            // Conversion des miles en kilomètres
            distanceValue.textContent = (parseInt(distanceValue.textContent) / 0.621371).toFixed(1);
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
        searchResults.forEach(marker => marker.remove());
        searchResults = [];
        
        // Réinitialiser la carte
        map.flyTo({
            center: [2.3522, 48.8566], // Paris
            zoom: 12
        });
    });

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
        
        // Récupérer les coordonnées actuelles de la carte
        const center = map.getCenter();
        
        // Envoyer la requête au serveur Flask
        fetch(`/api/search?query=${encodeURIComponent(query)}&lat=${center.lat}&lon=${center.lng}&mode=${selectedTransportMode}&limit=${document.getElementById('resultCount').value}`)
            .then(response => response.json())
            .then(data => {
                // Vider les résultats précédents
                resultsContainer.innerHTML = '';
                
                // Retirer les marqueurs des résultats précédents
                searchResults.forEach(marker => marker.remove());
                searchResults = [];
                
                if (data.length === 0) {
                    resultsContainer.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
                    resultsContainer.classList.remove('hidden');
                    loader.classList.add('hidden');
                    return;
                }
                
                // Ajouter les nouveaux résultats
                data.forEach((place, index) => {
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
                    
                    const marker = new mapboxgl.Marker(el)
                        .setLngLat(place.coordinates)
                        .addTo(map);
                    
                    searchResults.push(marker);
                    
                    // Créer l'élément de résultat dans la liste
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    resultItem.innerHTML = `
                        <div class="result-title">${place.name}</div>
                        <div class="result-address">${place.place_name}</div>
                        <div class="result-info">
                            <span>Distance: ${calculateDistance(center, place.coordinates).toFixed(1)} ${distanceUnit}</span>
                            <span>Catégorie: ${place.category}</span>
                        </div>
                    `;
                    
                    // Ajouter un gestionnaire de clic sur le résultat
                    resultItem.addEventListener('click', function() {
                        map.flyTo({
                            center: place.coordinates,
                            zoom: 15
                        });
                    });
                    
                    resultsContainer.appendChild(resultItem);
                });
                
                // Afficher les résultats
                resultsContainer.classList.remove('hidden');
                
                // Adapter la vue pour montrer tous les résultats
                if (data.length > 1) {
                    const bounds = new mapboxgl.LngLatBounds();
                    data.forEach(place => bounds.extend(place.coordinates));
                    map.fitBounds(bounds, { padding: 100 });
                } else if (data.length === 1) {
                    map.flyTo({
                        center: data[0].coordinates,
                        zoom: 15
                    });
                }
            })
            .catch(error => {
                console.error('Erreur lors de la recherche:', error);
                alert('Une erreur est survenue lors de la recherche');
            })
            .finally(() => {
                loader.classList.add('hidden');
            });
    });

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
