// Initialize the Leaflet map
const map = L.map('map').setView([21.3069, -157.8583], 13); // Center on Honolulu

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var customIcon = L.icon({
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb9Kh7uMETj_laEyxdf1jeyiADZ_HrEjEb8Q&s', // Custom icon URL
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

const apiKey = '1c38affb06ae52aeb715d4fbf79cbd8b'; // Replace with your OpenWeatherAPI key
const cities = ["Honolulu", "Waipahu", "Pearl City", "Kailua", "Kaneohe", "Aiea", "Ewa Beach", "Hale'iwa", "Hawaii Kai", "Nankuii", "Manoa", "Ma'ili", "Kapolei", "Waimanalo", "Mililani", "Wahiawa", "Punalu'u", "Hau'ula", "Laie", "Kahuku"];
const units = 'imperial'; // Or 'metric' for Celsius

async function fetchWeatherData(city) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    const response = await fetch(url);
    return await response.json();
}

async function fetchAllWeatherData() {
    const cityWeather = [];

    for (const city of cities) {
        const weatherData = await fetchWeatherData(city);
        cityWeather.push({
            city: city,
            coordinates: [weatherData.coord.lat, weatherData.coord.lon],
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            weather: weatherData.weather[0].description,
            windSpeed: weatherData.wind.speed
        });
    }

    return cityWeather;
}

async function displayWeatherOnMap() {
    const weatherData = await fetchAllWeatherData();
    
    // Add weather data to the map
    weatherData.forEach(data => {
        L.marker(data.coordinates, { icon: customIcon })
            .addTo(map)
            .bindPopup(`<b>${data.city}</b><br>Temperature: ${data.temperature} °F<br>Weather: ${data.weather}<br>Wind Speed: ${data.windSpeed} mph`)
            .openPopup();
    });
}

displayWeatherOnMap();

