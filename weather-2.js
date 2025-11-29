const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "4630850f4aa828417a059850d77bf00d"; // Replace with your actual API key

// Handle form submission
weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value;
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            saveWeatherToLocalStorage(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error.message);
        }
    } else {
        displayError("Please enter a city");
    }
});

// Fetch weather data from OpenWeatherMap
async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(`http://localhost/Prototype2/connection.php?q=${cityName}`)

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

// Display the fetched weather info
function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather: [{ description, id }] } = data;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Clear previous data and display the weather card
    card.textContent = "";
    card.style.display = "flex";

    // Create elements for displaying weather information
    const cityDisplay = document.createElement("h1");
    const dateDisplay = document.createElement("p");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    dateDisplay.textContent = formattedDate;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(2)} °C`;  // Convert from Kelvin to Celsius and format to 2 decimal places
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = `Description: ${description}`;

    // Weather Emoji based on weather conditions
    if (id >= 200 && id < 300) {
        weatherEmoji.textContent = "⚡ Thunderstorm";
    } else if (id >= 300 && id < 400) {
        weatherEmoji.textContent = "🌧️ Drizzle";
    } else if (id >= 500 && id < 600) {
        weatherEmoji.textContent = "🌦️ Rainy";
    } else if (id >= 600 && id < 700) {
        weatherEmoji.textContent = "❄️ Snow";
    } else if (id >= 700 && id < 800) {
        weatherEmoji.textContent = "🌫️ Misty";
    } else if (id === 800) {
        weatherEmoji.textContent = "☀️ Clear";
    } else if (id > 800) {
        weatherEmoji.textContent = "☁️ Clouds";
    }

    // Append elements to the card
    card.appendChild(cityDisplay);
    card.appendChild(dateDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

// Save weather data to localStorage
function saveWeatherToLocalStorage(data) {
    localStorage.setItem("weatherData", JSON.stringify(data));
}

function loadWeatherFromLocalStorage() {
    const data = localStorage.getItem("weatherData");
    if (data) {
        try {
            displayWeatherInfo(JSON.parse(data));
        } catch (e) {
        }
    }
}

// On page load, show weather from localStorage if available
window.addEventListener("DOMContentLoaded", loadWeatherFromLocalStorage);
// Display error message if something goes wrong
function displayError(message) {
    card.textContent = message;
    card.style.display = "block"; // Show the error message in the card
}
