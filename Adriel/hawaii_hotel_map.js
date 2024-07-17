// Function to create the map with base layers and overlays
function createMap(hotels) {
    // Create the base layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps object
    let baseMaps = {
        "Street Map": street,
    };

    // Create an overlay object to hold our overlay
    let overlayMaps = {
        "Hotels": hotels
    };

    // Create the map
    let hawaii_map = L.map("map", {
        center: [21.3099, -157.8581],
        zoom: 13,
        layers: [street, hotels]
    });

    // Add layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(hawaii_map);
}

// Load the restaurant data and create markers
d3.json('Hawaii_hotels.json').then(function(data) {
    // Create a layer group for restaurant markers
    let hotelMarkers = L.layerGroup();

    data.forEach(function(d) {
        // Create a marker for each restaurant
        let marker = L.marker([d.Latitude, d.Longitude]).bindPopup(
            '<b>' + d.Name + '</b><br>Type: ' + d.Type + '<br>Address: ' + d.Address + '<br>Distance: ' + d['Distance(Miles)'] + ' miles'
        );
        hotelMarkers.addLayer(marker);
    });

    // Call the createMap function with the restaurant markers
    createMap(hotelMarkers);
});