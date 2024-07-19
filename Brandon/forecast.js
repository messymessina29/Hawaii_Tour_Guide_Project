fetch('weather_forecast.json')
    .then(response => {
        // Check if the response is OK (status code 200)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Debugging line to check data format
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = ''; // Clear any existing content

        data.forEach(day => {
            // Create a card for each day
            const card = document.createElement('div');
            card.className = 'forecast-card';

            // Populate the card with data
            card.innerHTML = `
                <h3>${new Date(day.date).toDateString()}</h3>
                <p>High: ${day.daily_high} °F</p>
                <p>Low: ${day.daily_low} °F</p>
                <p>Humidity: ${day.avg_humidity} %</p>
                <p>Wind Speed: ${day.avg_wind_speed} mph</p>
            `;

            // Add the card to the container
            forecastContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error fetching forecast data:', error);
    });