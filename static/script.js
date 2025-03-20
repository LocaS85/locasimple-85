
// Variables globales
let map;
let markers = [];
let userMarker;
let userLocation = { lat: 48.8566, lng: 2.3522 }; // Paris par défaut
let transportMode = "driving";
let resultLimit = 5;

// Initialiser la carte et les événements lors du chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    // Activer le toggle des filtres
    document.getElementById("toggleFilters").addEventListener("click", function() {
        document.getElementById("filtersContainer").classList.toggle("hidden");
    });
    
    // Initialiser la carte Mapbox
    initMap();
    
    // Gérer les événements de recherche
    document.getElementById("searchForm").addEventListener("submit", handleSearch);
    
    // Écouter les changements de filtres
    initFilterListeners();
});

// Initialiser la carte Mapbox
function initMap() {
    try {
        // Vérifier si le token Mapbox est configuré
        if (!mapboxgl.accessToken || mapboxgl.accessToken === 'YOUR_MAPBOX_TOKEN') {
            showError("Token Mapbox non configuré. Veuillez configurer votre token dans le fichier d'environnement.");
            return;
        }
        
        // Créer la carte
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [userLocation.lng, userLocation.lat],
            zoom: 13
        });
        
        // Ajouter les contrôles de navigation
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Attendre que la carte soit chargée
        map.on('load', function() {
            console.log("Carte chargée avec succès");
            
            // Obtenir la localisation de l'utilisateur
            getUserLocation();
        });
        
        // Gérer les erreurs de chargement de la carte
        map.on('error', function(e) {
            console.error("Erreur de carte Mapbox:", e);
            showError("Erreur lors du chargement de la carte. Vérifiez votre connexion internet.");
        });
        
    } catch (error) {
        console.error("Erreur d'initialisation de la carte:", error);
        showError("Erreur d'initialisation de la carte. Vérifiez que Mapbox est correctement configuré.");
    }
}

// Obtenir la localisation de l'utilisateur
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Centrer la carte sur la position de l'utilisateur
                map.flyTo({
                    center: [userLocation.lng, userLocation.lat],
                    zoom: 14,
                    essential: true
                });
                
                // Ajouter un marqueur pour la position de l'utilisateur
                addUserMarker();
            },
            function(error) {
                console.error("Erreur de géolocalisation:", error);
                // En cas d'erreur, continuer avec la position par défaut
                addUserMarker();
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        console.error("La géolocalisation n'est pas prise en charge par ce navigateur.");
        // Continuer avec la position par défaut
        addUserMarker();
    }
}

// Ajouter un marqueur pour la position de l'utilisateur
function addUserMarker() {
    // Supprimer l'ancien marqueur s'il existe
    if (userMarker) {
        userMarker.remove();
    }
    
    // Créer un nouvel élément pour le marqueur personnalisé
    const el = document.createElement('div');
    el.className = 'user-marker';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#3498db';
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
    
    // Ajouter le marqueur à la carte
    userMarker = new mapboxgl.Marker(el)
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map);
}

// Gérer la recherche
function handleSearch(event) {
    event.preventDefault();
    
    const searchQuery = document.getElementById("searchInput").value.trim();
    if (!searchQuery) {
        showError("Veuillez entrer un terme de recherche.");
        return;
    }
    
    // Afficher le loader
    showLoader(true);
    
    // Appeler l'API Flask pour la recherche
    fetch(`http://127.0.0.1:5000/search?query=${encodeURIComponent(searchQuery)}&mode=${transportMode}&lat=${userLocation.lat}&lon=${userLocation.lng}&limit=${resultLimit}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(results => {
            // Masquer le loader
            showLoader(false);
            
            // Afficher les résultats
            displayResults(results);
        })
        .catch(error => {
            showLoader(false);
            console.error("Erreur de recherche:", error);
            showError("Erreur lors de la recherche. Vérifiez que le serveur Flask est démarré.");
        });
}

// Afficher les résultats de recherche
function displayResults(results) {
    // Supprimer les anciens marqueurs
    clearMarkers();
    
    // Vérifier s'il y a des résultats
    if (!results || results.length === 0) {
        showError("Aucun résultat trouvé pour cette recherche.");
        return;
    }
    
    // Créer un conteneur pour les résultats s'il n'existe pas
    let resultsContainer = document.getElementById("resultsContainer");
    if (!resultsContainer) {
        resultsContainer = document.createElement("div");
        resultsContainer.id = "resultsContainer";
        resultsContainer.className = "results-container";
        document.body.appendChild(resultsContainer);
    } else {
        resultsContainer.innerHTML = "";
    }
    
    // Créer une limite de carte pour ajuster la vue
    const bounds = new mapboxgl.LngLatBounds();
    
    // Ajouter la position de l'utilisateur à la limite
    bounds.extend([userLocation.lng, userLocation.lat]);
    
    // Parcourir les résultats
    results.forEach((result, index) => {
        // Ajouter le résultat à la liste
        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        resultItem.innerHTML = `
            <div class="result-title">${index + 1}. ${result.name}</div>
            <div class="result-address">${result.place_name || ''}</div>
            <div class="result-info">
                <span>${result.distance ? result.distance + ' km' : 'Distance inconnue'}</span>
                <span>${result.duration ? result.duration + ' min' : 'Durée inconnue'}</span>
            </div>
        `;
        
        // Ajouter un événement de clic pour centrer sur le marqueur
        resultItem.addEventListener("click", function() {
            map.flyTo({
                center: [result.lon, result.lat],
                zoom: 16,
                essential: true
            });
        });
        
        resultsContainer.appendChild(resultItem);
        
        // Créer un marqueur pour le résultat
        addMarker(result, index);
        
        // Étendre les limites de la carte pour inclure ce résultat
        bounds.extend([result.lon, result.lat]);
    });
    
    // Ajuster la vue de la carte pour montrer tous les résultats
    map.fitBounds(bounds, {
        padding: 100,
        maxZoom: 15
    });
    
    // Ajouter un bouton pour générer un PDF
    const pdfButton = document.createElement("button");
    pdfButton.textContent = "Générer PDF";
    pdfButton.className = "pdf-button";
    pdfButton.style.marginTop = "10px";
    pdfButton.style.padding = "8px 16px";
    pdfButton.style.backgroundColor = "#4CAF50";
    pdfButton.style.color = "white";
    pdfButton.style.border = "none";
    pdfButton.style.borderRadius = "4px";
    pdfButton.style.cursor = "pointer";
    pdfButton.style.width = "100%";
    
    pdfButton.addEventListener("click", function() {
        generatePDF(results);
    });
    
    resultsContainer.appendChild(pdfButton);
}

// Ajouter un marqueur sur la carte
function addMarker(result, index) {
    // Créer un élément div pour le marqueur
    const el = document.createElement('div');
    el.className = 'result-marker';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = getCategoryColor(result.category);
    el.style.display = 'flex';
    el.style.justifyContent = 'center';
    el.style.alignItems = 'center';
    el.style.color = 'white';
    el.style.fontWeight = 'bold';
    el.textContent = (index + 1).toString();
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    
    // Créer le contenu de la popup
    const popupContent = `
        <div class="popup-content">
            <h3>${result.name}</h3>
            <p>${result.place_name || ''}</p>
            <div class="popup-info">
                <p>Distance: ${result.distance ? result.distance + ' km' : 'N/A'}</p>
                <p>Durée: ${result.duration ? result.duration + ' min' : 'N/A'}</p>
            </div>
        </div>
    `;
    
    // Créer et ajouter le marqueur
    const marker = new mapboxgl.Marker(el)
        .setLngLat([result.lon, result.lat])
        .setPopup(new mapboxgl.Popup().setHTML(popupContent))
        .addTo(map);
    
    // Stocker le marqueur pour pouvoir le supprimer plus tard
    markers.push(marker);
}

// Supprimer tous les marqueurs de résultats
function clearMarkers() {
    markers.forEach(marker => marker.remove());
    markers = [];
}

// Obtenir une couleur en fonction de la catégorie
function getCategoryColor(category) {
    const colors = {
        restaurant: '#FF5733',
        restaurants: '#FF5733',
        grocery: '#33FF57',
        épicerie: '#33FF57',
        pharmacy: '#3357FF',
        pharmacie: '#3357FF',
        café: '#FF33A8',
        cafe: '#FF33A8',
        hotel: '#33A8FF',
        hôtel: '#33A8FF',
        default: '#888888'
    };
    
    return colors[category?.toLowerCase()] || colors.default;
}

// Générer un PDF avec les résultats
function generatePDF(results) {
    showLoader(true);
    
    fetch('http://127.0.0.1:5000/generate_pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ places: results })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        showLoader(false);
        alert("PDF généré avec succès!");
        console.log("PDF généré:", data);
    })
    .catch(error => {
        showLoader(false);
        console.error("Erreur de génération de PDF:", error);
        showError("Erreur lors de la génération du PDF. Vérifiez que le serveur Flask est démarré.");
    });
}

// Initialiser les écouteurs d'événements pour les filtres
function initFilterListeners() {
    // Changement du nombre de résultats
    document.getElementById("resultCount").addEventListener("change", function() {
        resultLimit = parseInt(this.value, 10);
    });
    
    // Boutons de mode de transport
    const transportButtons = document.querySelectorAll(".transport-button");
    transportButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Supprimer la classe active de tous les boutons
            transportButtons.forEach(btn => btn.classList.remove("active"));
            // Ajouter la classe active au bouton cliqué
            this.classList.add("active");
            
            // Définir le mode de transport en fonction du texte du bouton
            const buttonText = this.textContent;
            if (buttonText.includes("🚗")) {
                transportMode = "driving";
            } else if (buttonText.includes("🚶")) {
                transportMode = "walking";
            } else if (buttonText.includes("🚴")) {
                transportMode = "cycling";
            }
        });
    });
    
    // Par défaut, activer le mode voiture
    transportButtons[0].classList.add("active");
}

// Afficher/masquer le loader
function showLoader(show) {
    let loader = document.getElementById("loader");
    
    if (show) {
        if (!loader) {
            loader = document.createElement("div");
            loader.id = "loader";
            loader.className = "loader";
            loader.innerHTML = `
                <div class="spinner"></div>
                <div class="loader-text">Chargement...</div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = "block";
    } else if (loader) {
        loader.style.display = "none";
    }
}

// Afficher un message d'erreur
function showError(message) {
    // Créer un élément d'erreur s'il n'existe pas
    let errorElement = document.getElementById("errorMessage");
    
    if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.id = "errorMessage";
        errorElement.style.position = "absolute";
        errorElement.style.top = "80px";
        errorElement.style.left = "50%";
        errorElement.style.transform = "translateX(-50%)";
        errorElement.style.backgroundColor = "#f44336";
        errorElement.style.color = "white";
        errorElement.style.padding = "10px 15px";
        errorElement.style.borderRadius = "4px";
        errorElement.style.zIndex = "1000";
        errorElement.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
        document.body.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = "block";
    
    // Masquer après 5 secondes
    setTimeout(() => {
        errorElement.style.display = "none";
    }, 5000);
}

// Vérifier si le serveur Flask est en cours d'exécution
fetch('http://127.0.0.1:5000/health')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Serveur Flask connecté:", data);
    })
    .catch(error => {
        console.error("Erreur de connexion au serveur Flask:", error);
        showError("Le serveur Flask n'est pas démarré. Certaines fonctionnalités ne seront pas disponibles.");
    });
