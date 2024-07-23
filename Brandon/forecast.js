fetch('weather_forecast.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = '';

        data.forEach(day => {
            const card = document.createElement('div');
            card.className = 'forecast-card';

            const high = day.daily_high.toFixed(2);
            const low = day.daily_low.toFixed(2);
            const humidity = day.avg_humidity.toFixed(2);
            const windSpeed = day.avg_wind_speed.toFixed(2);
            ;

            forecastContainer.appendChild(card);
        });
    });