const apiKey = "8AK6FUZTPX3B7M9CP3F43GUGZ";

function getWeather() {
    const city = document.querySelector("input").value.trim();
    const resultDiv = document.getElementById("result");

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;

    resultDiv.style.display = "block";
    resultDiv.innerHTML = "<p>Loading...</p>";

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            const current = data.currentConditions;
            const temp = current.temp;
            const feelsLike = current.feelslike;
            const humidity = current.humidity;
            const wind = current.windspeed;
            const condition = current.conditions;

            const icon = getWeatherIcon(condition);

            let html = `
                <h2>${data.address}</h2>
                <p>${icon} <strong>${condition}</strong></p>
                <p>🌡 Temperature: ${temp}°C</p>
                <p>🤗 Feels Like: ${feelsLike}°C</p>
                <p>💧 Humidity: ${humidity}%</p>
                <p>💨 Wind: ${wind} km/h</p>
                <hr>
                <h3>7-Day Forecast:</h3>
                <div class="forecast">
            `;

            if (data.days && data.days.length > 0) {
                data.days.slice(0, 7).forEach(day => {
                    html += `
                        <div class="forecast-day">
                            <p><strong>${new Date(day.datetime).toDateString()}</strong></p>
                            <p>${getWeatherIcon(day.conditions)}</p>
                            <p>🌡 ${day.temp}°C</p>
                            <p>${day.conditions}</p>
                        </div>
                    `;
                });
                html += "</div>";
            } else {
                html += "<p>No forecast data available.</p></div>";
            }

            resultDiv.innerHTML = html;
        })
        .catch(error => {
            resultDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        });
}

function getWeatherIcon(condition) {
    condition = condition.toLowerCase();
    if (condition.includes("rain")) return "🌧";
    if (condition.includes("cloud")) return "☁️";
    if (condition.includes("clear")) return "☀️";
    if (condition.includes("snow")) return "❄️";
    if (condition.includes("thunder")) return "⛈";
    if (condition.includes("fog") || condition.includes("haze")) return "🌫";
    return "🌡";
}
