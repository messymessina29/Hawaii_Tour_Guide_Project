// Function to create the map with base layers and overlays
function createMap(touristicActivities) {
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
        "Touristic Activities": touristicActivities
    };

    // Create the map
    let hawaii_map = L.map("map", {
        center: [21.2817, -157.8294], // Centered on Waikiki, Honolulu
        zoom: 13,
        layers: [street, touristicActivities]
    });

    // Add layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(hawaii_map);
}

// Load the touristic activities data and create markers
d3.json('touristic_activities.json').then(function(data) {
    // Create a layer group for touristic activity markers
    let touristicMarkers = L.layerGroup();

    data.forEach(function(d) {
        // Create a marker for each touristic activity
        let marker = L.marker([d.Latitude, d.Longitude]).bindPopup(
            '<b>' + d.Name + '</b><br>Type: ' + d.Type + '<br>Address: ' + d.Address + '<br>Rating: ' + d.Rating + ' (' + d.Review_Count + ' reviews)'
        );
        touristicMarkers.addLayer(marker);
    });

    // Call the createMap function with the touristic activity markers
    createMap(touristicMarkers);
}).catch(function(error) {
    console.log('Error loading or parsing data:', error);
});
console.log('Loading touristic activities data...');
d3.json('touristic_activities.json').then(function(data) {
    console.log('Data loaded:', data); // Debugging statement
    let touristicMarkers = L.layerGroup();
    data.forEach(function(d) {
        let marker = L.marker([d.Latitude, d.Longitude]).bindPopup(
            '<b>' + d.Name + '</b><br>Type: ' + d.Type + '<br>Address: ' + d.Address + '<br>Rating: ' + d.Rating + ' (' + d.Review_Count + ' reviews)'
        );
        touristicMarkers.addLayer(marker);
    });
    createMap(touristicMarkers);
}).catch(function(error) {
    console.log('Error loading or parsing data:', error);
});