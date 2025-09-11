
    const apiKey = "707d8ccc53b34c35b0a165738250809"; 
    let forecastData = [];

    // Search button (by city name)
    function searchWeather() {
      const city = document.getElementById("city").value.trim();
      if (city) {
        getWeather(city);
      } else {
        alert("Please enter a city name!");
      }
    }

    // Get Weather by city name
    async function getWeather(city = "India") {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`;
      fetchWeather(url);
    }

    // Get Weather by latitude/longitude
    async function getWeatherByCoords(lat, lon) {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no&alerts=no`;
      fetchWeather(url);
    }

    // Fetch and display weather
    async function fetchWeather(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found ❌");
        const data = await response.json();

        // Current Weather
        document.getElementById("current").innerHTML = `
          <h2>${data.location.name}, ${data.location.country}</h2>
          <img src="${data.current.condition.icon}" alt="Weather icon">
          <div class="temp">${data.current.temp_c}°C</div>
          <div class="condition">${data.current.condition.text}</div>
          <div class="details">
            🌡 Feels like: ${data.current.feelslike_c}°C <br>
            💧 Humidity: ${data.current.humidity}% <br>
            💨 Wind: ${data.current.wind_kph} kph <br>
            🌅 Sunrise: ${data.forecast.forecastday[0].astro.sunrise} <br>
            🌇 Sunset: ${data.forecast.forecastday[0].astro.sunset}
          </div>
        `;

        // Forecast cards
        let forecastHTML = "";
        forecastData = data.forecast.forecastday;
        forecastData.forEach((day, index) => {
          forecastHTML += `
            <div class="day-card" onclick="openModal(${index})">
              <h3>${day.date}</h3>
              <img src="${day.day.condition.icon}" alt="icon">
              <p>${day.day.avgtemp_c}°C</p>
              <p>${day.day.condition.text}</p>
            </div>
          `;
        });
        document.getElementById("forecast").innerHTML = forecastHTML;

      } catch (error) {
        document.getElementById("current").innerHTML = `<p style="color:red;">${error.message}</p>`;
        document.getElementById("forecast").innerHTML = "";
      }
    }

    // Detect current location
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            getWeatherByCoords(lat, lon);
          },
          (err) => {
            alert("❌ Location access denied. Showing India weather.");
            getWeather("India");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        alert("❌ Geolocation not supported.");
        getWeather("India");
      }
    }

    // Open Modal
    function openModal(index) {
      const day = forecastData[index];
      document.getElementById("modal-content").innerHTML = `
        <h2>Forecast for ${day.date}</h2>
        <img src="${day.day.condition.icon}" alt="Weather icon">
        <p><strong>${day.day.condition.text}</strong></p>
        <p>🌡 Max Temp: ${day.day.maxtemp_c}°C</p>
        <p>❄ Min Temp: ${day.day.mintemp_c}°C</p>
        <p>🌡 Avg Temp: ${day.day.avgtemp_c}°C</p>
        <p>💧 Humidity: ${day.day.avghumidity}%</p>
        <p>☀ Sunrise: ${day.astro.sunrise}</p>
        <p>🌇 Sunset: ${day.astro.sunset}</p>
        <p>🌙 Moonrise: ${day.astro.moonrise}</p>
        <p>🌙 Moonset: ${day.astro.moonset}</p>
        <button class="close-btn" onclick="closeModal()">Close</button>
      `;
      document.getElementById("modal").style.display = "flex";
    }

    // Close Modal
    function closeModal() {
      document.getElementById("modal").style.display = "none";
    }

    // Load with current location by default
    getLocation();
 