const apiKey = "49bdaeaca469967799cd3cdc03e2389e"; // ← pega tu key aquí cuando esté activa

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorBox = document.getElementById('errorBox');
const weatherCard = document.getElementById('weatherCard');
const forecastBox = document.getElementById('forecast');

const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeModal = document.getElementById('closeModal');

// ---------------------------
// EVENTOS PRINCIPALES
// ---------------------------

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") getWeather();
});

helpBtn.addEventListener('click', () => {
    helpModal.classList.remove("hidden");
});

closeModal.addEventListener('click', () => {
    helpModal.classList.add("hidden");
});

// ---------------------------
// FUNCIONES PRINCIPALES
// ---------------------------

async function getWeather() {
    const city = cityInput.value.trim();
    if (city === "") return;

    clearError();

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod === "404" || data.cod === 404) {
            showError();
            weatherCard.classList.add("hidden");
            forecastBox.classList.add("hidden");
            return;
        }

        showWeather(data);
        getForecast(city);

    } catch (error) {
        showError();
        console.log("Error:", error);
    }
}

// ---------------------------
// MOSTRAR CLIMA ACTUAL
// ---------------------------

function showWeather(data) {
    weatherCard.classList.remove("hidden");

    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temp').textContent = Math.round(data.main.temp) + "°C";
    document.getElementById('description').textContent = data.weather[0].description;

    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('wind').textContent = data.wind.speed;
    document.getElementById('feels').textContent = Math.round(data.main.feels_like);

    const icon = data.weather[0].icon;
    document.getElementById('weatherIcon').src =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

// ---------------------------
// PRONÓSTICO DE 3 DÍAS
// ---------------------------

async function getForecast(city) {
    const url =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=es`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const list = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

        forecastBox.innerHTML = "";
        forecastBox.classList.remove("hidden");

        list.forEach(day => {
            const date = new Date(day.dt_txt);
            const name = date.toLocaleDateString("es-ES", { weekday: "short" });

            forecastBox.innerHTML += `
                <div class="forecast-item">
                    <p>${name}</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                    <p>${Math.round(day.main.temp)}°C</p>
                    <p class="desc">${day.weather[0].description}</p>
                </div>
            `;
        });

    } catch (error) {
        console.log("Error en pronóstico:", error);
    }
}

// ---------------------------
// MANEJO DE ERRORES
// ---------------------------

function showError() {
    errorBox.classList.remove("hidden");
    errorBox.classList.add("shake");
    setTimeout(() => errorBox.classList.remove("shake"), 300);
}

function clearError() {
    errorBox.classList.add("hidden");
}

// =========================================================
// THEME TOGGLE  —  MODO DÍA / NOCHE
// =========================================================

const themeToggle = document.getElementById("themeToggle");

let savedTheme = localStorage.getItem("theme");
if (!savedTheme) {
    const hour = new Date().getHours();
    savedTheme = (hour >= 6 && hour < 19) ? "light" : "dark";
    localStorage.setItem("theme", savedTheme);
}
document.body.classList.add(savedTheme);
themeToggle.setAttribute("aria-checked", savedTheme === "light" ? "true" : "false");

let animating = false;

themeToggle.addEventListener("click", () => {
    if (animating) return;
    animating = true;

    const isDark = document.body.classList.contains("dark");
    const next = isDark ? "light" : "dark";

    document.body.classList.add("animating");

    document.body.classList.remove(isDark ? "dark" : "light");
    document.body.classList.add(next);

    themeToggle.setAttribute("aria-checked", next === "light" ? "true" : "false");
    localStorage.setItem("theme", next);

    setTimeout(() => {
        document.body.classList.remove("animating");
        animating = false;
    }, 1200);
});

// ================================
// MODAL DE AYUDA
// ================================

helpBtn.addEventListener("click", () => {
    helpModal.classList.remove("hidden");
    helpModal.setAttribute("aria-hidden", "false");
});

closeModal.addEventListener("click", () => {
    helpModal.classList.add("hidden");
    helpModal.setAttribute("aria-hidden", "true");
});

helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) {
        helpModal.classList.add("hidden");
        helpModal.setAttribute("aria-hidden", "true");
    }
});
