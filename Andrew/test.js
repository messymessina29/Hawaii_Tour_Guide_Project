// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create two separate layer groups: one for the city markers and another for the state markers.
let restaurants = L.layerGroup(restaurantMarkers);
let hotels = L.layerGroup(hotelMarkers);

// Create a baseMaps object.
let baseMaps = {
"Street Map": street,
"Topographic Map": topo
};

// Create an overlay object.
let overlayMaps = {
"Restaurants": restaurants,
"Hotels": hotels
};

// Define a map object.
let hawaii_map = L.map("map", {
    center: [21.3099, -157.8581],
    zoom: 13,
    layers: [street, restaurants, hotels]
});
 
// Pass our map layers to our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
collapsed: false
}).addTo(hawaii_map);
