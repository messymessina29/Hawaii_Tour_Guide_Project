document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize the map and other components
    init();
});

// Coordinates and zoom level for the map
let hawaiiCoords = [21.3069, -157.8583];
let mapZoomLevel = 13;

let myMap = L.map('map').setView(hawaiiCoords, mapZoomLevel);

let streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let eventMarkers = L.layerGroup().addTo(myMap);
let yelpMarkers = L.layerGroup().addTo(myMap);

// Define base maps
let baseMaps = {
    "Street Map": streetLayer
};

// Define overlay maps
let overlayMaps = {
    "Event Markers": eventMarkers,
    "Yelp Markers": yelpMarkers
};

// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);

let allEvents = [];

function buildMetadata(events = [], yelpBusinesses = []) {
    console.log("Updating metadata with events:", events);
    console.log("Updating metadata with yelpBusinesses:", yelpBusinesses);

    let metadataDisplay = d3.select('#sample-metadata');
    metadataDisplay.html("");

    events.forEach(event => {
        let eventDiv = metadataDisplay.append("div").attr("class", "event-metadata");
        eventDiv.append("p").text(`Name: ${event.name || 'No Name'}`);
        eventDiv.append("p").text(`Date: ${event.dates?.start?.localDate || 'No Date'}`);
        eventDiv.append("p").text(`Time: ${event.dates?.start?.localTime || 'No Time'}`);
        eventDiv.append("p").text(`Genre: ${event.classifications?.[0]?.genre?.name || 'No Genre'}`);
        if (event._embedded && event._embedded.venues && event._embedded.venues.length > 0) {
            eventDiv.append("p").text(`Venue: ${event._embedded.venues[0].name || 'No Venue'}`);
            eventDiv.append("hr");
        }
    });

    let additionalInfoDisplay = d3.select('#event-details');
    additionalInfoDisplay.html("");

    yelpBusinesses.forEach(business => {
        let businessDiv = additionalInfoDisplay.append("div").attr("class", "business-metadata");
        businessDiv.append("p").text(`Name: ${business.Name || 'No Name'}`);
        businessDiv.append("p").text(`Rating: ${business.Rating || 'No Rating'}`);
        businessDiv.append("p").text(`Address: ${business.Address || 'No Address'}`);
        businessDiv.append("p").text(`Type: ${business.Type || 'No Type'}`);
    });
}

function init() {
    flatpickr("#datePicker", {
        dateFormat: "Y-m-d",
        inline: true,
        onChange: function(selectedDates, dateStr, instance) {
            dateChanged(dateStr, allEvents);
        }
    });

    // Fetch the JSON data and build metadata for all events on the default date (if needed)
    d3.json('/fetch-events').then((data) => {
        console.log("Data fetched from Ticketmaster API:", data);
        if (data && data._embedded && data._embedded.events) {
            var events = data._embedded.events;
            allEvents = events;
            console.log(`Fetched ${events.length} events from the Ticketmaster API`);

            // Use the current date for initial display
            var today = new Date().toISOString().split('T')[0];
            dateChanged(today, events);
        } else {
            console.error("No events found in the data.");
        }
    }).catch(error => {
        console.error("Error fetching events data:", error);
    });

    d3.json(jsonDataUrl).then(data => {
        console.log("Data fetched from touristic_activities.json:", data);
        if (data) {
            placeYelpMarkers(data);
        } else {
            console.error("No Yelp businesses found in the data.");
        }
    }).catch(error => {
        console.error("Error fetching touristic_activities.json:", error);
    });

    createLegend(); // Create the legend when initializing the map
}

function dateChanged(date, events) {
    if (!events) {
        console.error("No events available for filtering.");
        return;
    }
    console.log(`Filtering events for the selected date: ${date}`);
    let filteredEvents = events.filter(event => event.dates.start.localDate === date);
    console.log(`Found ${filteredEvents.length} events for the selected date`);
    eventMarkers.clearLayers();
    if (filteredEvents.length > 0) {
        buildMetadata(filteredEvents);
        placeEventMarkers(filteredEvents);
    } else {
        d3.select('#sample-metadata').html("");
        d3.select('#event-details').html("");
        console.warn(`No events found for the selected date: ${date}`);
    }
}

function placeEventMarkers(events) {
    events.forEach(event => {
        let venue = event._embedded.venues[0];
        let lat = venue.location.latitude;
        let lon = venue.location.longitude;

        if (lat && lon) {
            let marker = L.marker([lat, lon]).addTo(eventMarkers);
            marker.bindPopup(`<strong>${event.name || 'No Name'}</strong><br>${venue.name || 'No Venue'}<br>${venue.address?.line1 || 'No Address'}`);
            marker.on('click', () => {
                buildMetadata([event]);
            });
        } else {
            console.warn(`Invalid coordinates for event: ${event.name}`, venue.location);
        }
    });
}

function placeYelpMarkers(businesses) {
    const tours = ["Tours", "Museums", "Walking Tours", "Art Galleries", "Historical Tours", "Art Museums"];
    const parks = ["Parks", "Zoos", "Botanical Gardens", "Aquariums", "Kids Activities"];
    const boats = ["Boat Charters", "Snorkeling", "Beaches", "Boating", "Boat Equipment Rentals", "Boat Tours"];
    const arts = ["Performing Arts", "Venues & Event Spaces", "Festivals"];
    const outdoors = ["Hiking", "Bike Rentals", "Scooter Rentals", "Motorcycle Rentals", "Motorcycle Dealers"];

    businesses.forEach(business => {
        let lat = business.Latitude;
        let lon = business.Longitude;

        let color;
        if (tours.includes(business.Type)) {
            color = 'red';
        } else if (parks.includes(business.Type)) {
            color = 'green';
        } else if (boats.includes(business.Type)) {
            color = 'blue';
        } else if (arts.includes(business.Type)) {
            color = 'pink';
        } else if (outdoors.includes(business.Type)) {
            color = 'brown';
        } else {
            color = 'gray';
        }

        let circleStyle = {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: 8
        };

        let marker = L.circleMarker([lat, lon], circleStyle).addTo(yelpMarkers);

        marker.bindPopup(`<strong>${business.Name || 'No Name'}</strong><br>Type: ${business.Type || 'No Type'}<br>Rating: ${business.Rating || 'No Rating'}<br>${business.Address || 'No Address'}`);
        marker.on('click', () => {
            buildMetadata([], [business]);
        });
    });
}

function createLegend() {
    let legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');

        div.innerHTML += "<p><strong>Activity Groups</strong></p>";
        
        // Define the legend information using your existing arrays
        const legendInfo = [
            { type: "Tours", color: "red" },
            { type: "Parks", color: "green" },
            { type: "Boats", color: "blue" },
            { type: "Arts", color: "pink" },
            { type: "Outdoors", color: "brown" }
        ];

        // Loop through legendInfo and generate a label with a colored square for each type
        legendInfo.forEach(item => {
            div.innerHTML +=
                `<i style="background:${item.color}"></i> ${item.type}<br>`;
        });

        return div;
    };

    legend.addTo(myMap); // Add legend to the map
}
