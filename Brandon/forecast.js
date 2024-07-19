fetch('weather_forecast.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = '';

        data.forEach(day => {
            const card = document.createElement('div');
            card.className = 'forecast-card';

            card.innerHTML = `
                <h3>${new Date(day.date).toDateString()}</h3>
                <p>High: ${day.daily_high} °F</p>
                <p>Low: ${day.daily_low} °F</p>
                <p>Humidity: ${day.avg_humidity} %</p>
                <p>Wind Speed: ${day.avg_wind_speed} mph</p>
            `;

            forecastContainer.appendChild(card);
        });
    });