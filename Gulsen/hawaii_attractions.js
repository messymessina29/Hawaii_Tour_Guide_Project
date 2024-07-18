// Function to create the map with base layers and overlays
function createMap() {
    // Create the base layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the map
    window.hawaii_map = L.map("map", {
        center: [21.2817, -157.8294], // Centered on Waikiki, Honolulu
        zoom: 13,
        layers: [street]
    });
}

// Function to add markers to the map
function addMarkers(data) {
    // Clear existing markers
    if (window.touristicMarkers) {
        window.hawaii_map.removeLayer(window.touristicMarkers);
    }

    window.touristicMarkers = L.layerGroup();

    data.forEach(function(d) {
        let marker = L.marker([d.Latitude, d.Longitude]).bindPopup(
            '<b>' + d.Name + '</b><br>Type: ' + d.Type + '<br>Address: ' + d.Address + '<br>Rating: ' + d.Rating + ' (' + d.Review_Count + ' reviews)'
        );
        window.touristicMarkers.addLayer(marker);
    });

    window.touristicMarkers.addTo(window.hawaii_map);
}

// Load the touristic activities data and create markers
d3.json('touristic_activities.json').then(function(data) {
    window.attractions = data;  // Store data in a global variable for filtering

    // Create the map
    createMap();

    // Create initial markers
    addMarkers(data);
}).catch(function(error) {
    console.log('Error loading or parsing data:', error);
});

function applyFilters() {
    let priceFilter = document.getElementById('price-filter').value;
    let ratingFilter = parseFloat(document.getElementById('rating-filter').value);

    let filteredAttractions = window.attractions.filter(function(d) {
        let priceMatch = (priceFilter === 'all') || (d.Price === priceFilter);
        let ratingMatch = (isNaN(ratingFilter)) || (d.Rating >= ratingFilter);
        return priceMatch && ratingMatch;
    });

    addMarkers(filteredAttractions);
}

document.getElementById('price-filter').addEventListener('change', applyFilters);
document.getElementById('rating-filter').addEventListener('change', applyFilters);
document.querySelector('button').addEventListener('click', applyFilters);
