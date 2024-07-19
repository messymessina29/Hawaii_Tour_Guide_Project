// Initialize the map
var map = L.map('map').setView([21.3099, -157.8581], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch('city_weather.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(weatherData => {
        weatherData.forEach(function(city) {
            var marker = L.marker(city.coordinates).addTo(map);

            marker.bindPopup(
                `<b>${city.city}</b><br>` +
                `Temperature: ${city.temperature} °F<br>` +
                `Humidity: ${city.humidity} %<br>` +
                `Weather: ${city.weather}<br>` +
                `Wind Speed: ${city.wind_speed} mph`
            );
        });
    });
