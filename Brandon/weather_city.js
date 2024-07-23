var map = L.map('map').setView([21.3099, -157.8581], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var customIcon = L.icon({
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb9Kh7uMETj_laEyxdf1jeyiADZ_HrEjEb8Q&s', // Custom icon URL
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

fetch('city_weather.json')
    .then(response => response.json())
    .then(weatherData => {
        weatherData.forEach(function(city) {
            var marker = L.marker(city.coordinates, { icon: customIcon }).addTo(map);
            marker.bindPopup(
                `<b>${city.city}</b><br>` +
                `Temperature: ${city.temperature} °F<br>` +
                `Humidity: ${city.humidity} %<br>` +
                `Weather: ${city.weather}<br>` +
                `Wind Speed: ${city.wind_speed} mph`
            );
        });
    });