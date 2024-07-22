// Global variables for map and markers
let hawaii_map;
let street;
let allMarkers = L.layerGroup();

// Function to create the map with base layers and overlays
function createMap(hotels) {
    // Create the base layer
    street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
    hawaii_map = L.map("map", {
        center: [21.3099, -157.8581],
        zoom: 13,
        layers: [street, hotels]
    });

    // Add layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(hawaii_map);
}

// Load the hotel data and create markers
d3.json('Resources/Hawaii_hotels.json').then(function(data) {
    // Create a layer group for hotel markers
    let hotelMarkers = L.layerGroup();

    data.forEach(function(d) {
        // Create a marker for each hotel
        let marker = L.marker([d.Latitude, d.Longitude]).bindPopup(
            '<h4>' + d.Name + '</h4><br>' +
            '<img src="' + d.Image_url + '" width="100" height="100"><br>' +
            'Price: ' + d.Price + '<br>' +
            'Rating: ' + d.Rating
        );

        // Adding click event listener to update side panel
        marker.on('click', function() {
            updateHotelInfo(d);
        });

        // Save the price in marker options for filtering
        marker.options.type = d.Price;
        marker.options.data = d;
        hotelMarkers.addLayer(marker);
    });

    // Save all markers to a global variable for filtering
    allMarkers = hotelMarkers;

    // Call the createMap function with the hotel markers
    createMap(hotelMarkers);

    // Populate the price selector
    selectPrice(data);
});

// Function to populate dropdown with hotel Price
function selectPrice(data) {
    // Extract unique price ranges and sort them
    let pricetypes = [...new Set(data.map(d => d.Price))].sort((a, b) => a.length - b.length);

    // Select dropdown
    let selector = d3.select('#selprice');

    // Clear any existing options
    selector.html('');

    // Add an 'all' option
    selector.append('option').text("All").property('value', 'All');

    // Append price options to dropdown
    pricetypes.forEach(price => {
        selector.append('option').text(price).property('value', price);
    });
}

// Function to update hotel info panel
function updateHotelInfo(hotel) {
    // select the hotel info panel
    let panel = d3.select('#sample-metadata');

    // Clear any existing content
    panel.html('');

    // Append hotel info to panel
    Object.entries(hotel).forEach(([key, value]) => {
        if (key !== 'Image_url') {
            panel.append('p').text(`${key}: ${value}`);
        }
    });

    // Add hotel image to panel
    if (hotel.Image_url) {
        panel.append('img')
            .attr('src', hotel.Image_url)
            .attr('alt', hotel.Name)
            .style('width', '80%')
    }
}

// Function to update the bar chart with top 3 hotels
function updateBarChart(filteredMarkers) {
    // Sort the filtered markers by rating and get the top 3
    let topHotels = filteredMarkers.sort((a, b) => b.Rating - a.Rating).slice(0, 3);

    // Prepare the data for the bar chart
    let barData = topHotels.map(hotel => ({
        name: hotel.Name,
        rating: hotel.Rating
    }));

    // Extract names and ratings for x and y values
    let names = barData.map(hotel => hotel.name);
    let ratings = barData.map(hotel => hotel.rating);

    // Create the bar chart trace
    let bar_trace = {
        x: names,
        y: ratings,
        text: barData.map(hotel => `Name: ${hotel.name}<br>Rating: ${hotel.rating}`),
        marker: { color: 'teal' },
        type: 'bar',
        hoverinfo: 'text'
    };

    // Define the layout for the bar chart
    let layout = {
        xaxis: { title: 'Hotels' },
        yaxis: { title: 'Rating' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [bar_trace], layout);
}

// Function initalize bar chart with top 3 hotels for all prices 
function initializeBarChart() {
    let allMarkersArray = []
    allMarkers.eachLayer(function(marker) {
        allMarkersArray.push(marker.options.data);
    });

    // Update bar chart with all markers
    updateBarChart(allMarkersArray)
}

// Handle dropdown selection change
function optionChanged(selectedprice) {
    console.log("Selected Price:", selectedprice); // Debugging
    if (!hawaii_map || !street || !allMarkers) {
        // console.error("hawaii_map, street, or allMarkers is not defined");
        return;
    }

    // Clear existing layers except base & street layer
    hawaii_map.eachLayer(function(layer) {
        if (layer !== street && layer !== hawaii_map.tileLayer) {
            hawaii_map.removeLayer(layer);
        }
    });

    // Filter markers based on the selected price & add to map
    let filteredMarkers = [];
    allMarkers.eachLayer(function(marker) {
        if (selectedprice === 'All' || marker.options.type === selectedprice) {
            hawaii_map.addLayer(marker);
            filteredMarkers.push(marker.options.data);
        }
    });

    // Update the bar chart with the filtered data
    updateBarChart(filteredMarkers);
}

// Call the initializeBarChart function when the page loads 
window.onload = initializeBarChart;
