// Variable to hold the map and markers
let hawaii_map;
let allMarkers = L.layerGroup();
let street;

// Function to create the map with base layers and overlays
function createMap() {
    // Create the base layer
    street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the map of Hawaii
    hawaii_map = L.map("map", {
        center: [21.3099, -157.8581],
        zoom: 13,
        layers: [street]
    });

    // Add layer control to the map
    L.control.layers({
        "Street Map": street
    }, {}, {
        collapsed: false
    }).addTo(hawaii_map);
}

// Load the restaurant data and create markers
d3.json('Resources/hawaii_restaurants_nodups.json').then(function(data) {
    // Create a layer group for restaurant markers
    data.forEach(function(d) {
        // Create a marker for each restaurant
        let marker = L.marker([d.Latitude, d.Longitude]).bindPopup(
            '<b>' + d.Name + '</b><br>Type: ' + d.Type + '<br>Yelp Rating: ' + d.Rating + '<br>Price: ' + d.Price + '<br>Address: ' + d.Address + '<br>Distance: ' + d['Distance(Miles)'] + ' miles'
        );
        marker.type = d.Type;  // Add a custom property to the marker
        allMarkers.addLayer(marker);
    });

    // Add the restaurant markers to the map
    allMarkers.addTo(hawaii_map);

    // Populate the dropdown
    selectTypes(data);

    // Store the initial data for filtering
    window.initialData = data;
});

// Function to populate the dropdown with unique restaurant types
function selectTypes(data) {
    // Extract unique restaurant types
    let restTypes = [...new Set(data.map(d => d.Type))];

    // Select the dropdown element
    let selector = d3.select('#selType');

    // Add an "All" option
    selector.append('option').text("All").property('value', "All");

    // Append options to the dropdown
    restTypes.forEach(type => {
        selector.append('option').text(type).property('value', type);
    });
}

// Function to handle dropdown selection change
function optionChanged(selectedType) {
    // Clear all existing layers from the map except the base layer and street layer
    hawaii_map.eachLayer(function(layer) {
        if (layer !== street && layer !== hawaii_map.tileLayer) {
            hawaii_map.removeLayer(layer);
        }
    });

    // Filter markers based on the selected type and add them to the map
    allMarkers.eachLayer(function(marker) {
        if (selectedType === "All" || marker.type === selectedType) {
            hawaii_map.addLayer(marker);
        }
    });

    createTable(selectedType);
}
// Function to update the table with top 5 restaurants based on the selected type
function createTable(selectedType) {
    // Filter data based on the selected type
    let filteredData = window.initialData.filter(d => selectedType === "All" || d.Type === selectedType);

    // Sort data by rating in descending order
    filteredData.sort((a, b) => b.Rating - a.Rating);

    // Get the top 5 restaurants
    let top5rest = filteredData.slice(0, 5);

    // Select the table body
    let tablebody = d3.select("#restaurantTable tbody");

    // Clear existing rows
    tablebody.html("");

    // Append rows with the top 5 restaurants
    top5rest.forEach(d => {
        let row = tablebody.append("tr");
        row.append("td").text(d.Name);
        row.append("td").text(d.Rating);
        row.append("td").text(d.Price);
    });
}

// Initialize the map
createMap();