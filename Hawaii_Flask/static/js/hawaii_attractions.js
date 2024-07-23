let hawaii_map;
let touristicMarkers = L.layerGroup(); // Initialize the layer group here

// Function to create the map with base layers and overlays
function createMap() {
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the map and set the initial view
    hawaii_map = L.map("map", {
        center: [21.2817, -157.8294], // Centered on Waikiki, Honolulu
        zoom: 13,
        layers: [street]
    });

    // Add the initial empty layer group to the map
    touristicMarkers.addTo(hawaii_map);
}

// Function to add markers to the map
function addMarkers(data) {
    // Clear existing markers
    touristicMarkers.clearLayers();

    // Add new markers from the data
    data.forEach(function(d) {
        let marker = L.marker([d.Latitude, d.Longitude]).bindPopup(
            '<b>' + d.Name + '</b><br>Type: ' + d.Type + '<br>Address: ' + d.Address + '<br>Rating: ' + d.Rating + ' (' + d.Review_Count + ' reviews)'
        );
        touristicMarkers.addLayer(marker);
    });
}

// Load the touristic activities data and create markers
d3.json('/static/json/touristic_activities.json').then(function(data) {
    window.attractions = data; // Store data in a global variable for filtering

    // Create the map
    createMap();

    // Create initial markers
    addMarkers(data);
}).catch(function(error) {
    console.log('Error loading or parsing data:', error);
});

// Function to apply filters and update markers
function applyFilters() {
    let typeFilter = document.getElementById('type-filter').value;
    let priceFilter = document.getElementById('price-filter').value;
    let ratingFilter = parseFloat(document.getElementById('rating-filter').value);

    let filteredAttractions = window.attractions.filter(function(d) {
        let typeMatch = (typeFilter === 'all') || (d.Type === typeFilter);
        let priceMatch = (priceFilter === 'all') || (d.Price === priceFilter);
        let ratingMatch = (isNaN(ratingFilter)) || (d.Rating >= ratingFilter);
        return typeMatch && priceMatch && ratingMatch;
    });

    addMarkers(filteredAttractions);
}

// Event listeners for the filter dropdowns and button
document.getElementById('price-filter').addEventListener('change', applyFilters);
document.getElementById('rating-filter').addEventListener('change', applyFilters);
document.getElementById('type-filter').addEventListener('change', applyFilters);
document.querySelector('button').addEventListener('click', applyFilters);
