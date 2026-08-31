const untisBtnEl = document.querySelector(".units-btn");
const unitsStateEl = document.querySelector(".units-state");
const unitSecEl = document.querySelectorAll(".unit-section");
const switchBtnEl = document.querySelector(".switch-button");
const celsiusEl = document.querySelector(".celsius");
const fahrenheitEl = document.querySelector(".fahrenheit");
const milesEl = document.querySelector(".mph");
const kilometersEl = document.querySelector(".kmh");
const inchesEl = document.querySelector(".inches");
const millimetersEl = document.querySelector(".millimeters");
const searchSectionEl = document.querySelector(".search-sec");
const searchInputEl = document.querySelector(".search-input");
const mainTempEl = document.querySelector(".main-temp");
const windSpeed = document.querySelector(".wind-bottom");
const humidity = document.querySelector(".humidity-bottm");
const feelsLike = document.querySelector(".feels-like-bottom");
const Precipitation = document.querySelector(".Precipitation-bottom");
const cityName = document.querySelector(".today-bg__main-par");
const dateTime = document.querySelector(".today-bg__lower-par");
const weatherIcon = document.querySelector(".weather-img");
const dailyForecastHtml = document.querySelector(".daily-forecast");
const lowerSkeletonEl = document.querySelector(".lower-skeleton");
const lowerCardsEl = document.querySelector(".lower-cards");
const hourlyCardsHtml = document.querySelector(".hourly-cards");
const mainSkeletonEl = document.querySelector(".main-skeleton");

const dailySkeletonCards = document.querySelector(".day-forecast-skeleton")
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.419998&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&hourly=temperature_2m,weather_code`;

let currentWeatherUrl = BASE_URL;
let feelsLikeTempNum;
let windSpeedNum;
let PrecipitationNum;
let mainTempNum;
let latitude;
let longitude;

const weatherDescriptions = {
  0: {
    icon: "./assets/images/icon-sunny.webp",
    text: "Sunny",
  },

  1: {
    icon: "./assets/images/icon-partly-cloudy.webp",
    text: "Mainly clear",
  },

  2: {
    icon: "./assets/images/icon-partly-cloudy.webp",
    text: "Partly cloudy",
  },

  3: {
    icon: "./assets/images/icon-partly-cloudy.webp",
    text: "Overcast",
  },

  45: {
    icon: "./assets/images/icon-fog.webp",
    text: "Fog",
  },

  51: {
    icon: "./assets/images/icon-drizzle.webp",
    text: "Light drizzle",
  },

  53: {
    icon: "./assets/images/icon-drizzle.webp",
    text: "Moderate drizzle",
  },

  55: {
    icon: "./assets/images/icon-drizzle.webp",
    text: "Dense drizzle",
  },

  61: {
    icon: "./assets/images/icon-rain.webp",
    text: "Slight rain",
  },

  63: {
    icon: "./assets/images/icon-rain.webp",
    text: "Moderate rain",
  },

  65: {
    icon: "./assets/images/icon-rain.webp",
    text: "Heavy rain",
  },

  71: {
    icon: "./assets/images/icon-snow.webp",
    text: "Slight snow",
  },

  73: {
    icon: "./assets/images/icon-snow.webp",
    text: "Moderate snow",
  },

  75: {
    icon: "./assets/images/icon-snow.webp",
    text: "Heavy snow",
  },

  80: {
    icon: "./assets/images/icon-rain.webp",
    text: "Slight rain showers",
  },

  81: {
    icon: "./assets/images/icon-rain.webp",
    text: "Moderate rain showers",
  },

  82: {
    icon: "./assets/images/icon-rain.webp",
    text: "Violent rain showers",
  },

  95: {
    icon: "./assets/images/icon-storm.webp",
    text: "Thunderstorm",
  },

  96: {
    icon: "./assets/images/icon-storm.webp",
    text: "Thunderstorm with slight hail",
  },

  99: {
    icon: "./assets/images/icon-storm.webp",
    text: "Thunderstorm with heavy hail",
  },
};

const date = new Date();
const formattedDate = date.toLocaleDateString("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
  year: "numeric",
});

dateTime.textContent = formattedDate;

// -- Managing Units Dropdown List --
function mouseEnterHandler() {
  unitsStateEl.classList.add("units-state--active");
}

function mouseLeaveHandler() {
  unitsStateEl.classList.remove("units-state--active");
}

untisBtnEl.addEventListener("mouseenter", mouseEnterHandler);
unitsStateEl.addEventListener("mouseleave", mouseLeaveHandler);

// -- Managing Switch Button in Units Dropdown List --
async function switchHandler(event) {
  const clickedBtn = event.target.closest(".switch-button");
  if (!clickedBtn) return;
  if (switchBtnEl.textContent.trim() === "Switch to Imperial") {
    switchBtnEl.textContent = "Switch to Metric";
  } else {
    switchBtnEl.textContent = "Switch to Imperial";
  }

  if (switchBtnEl.textContent.trim() === "Switch to Metric") {
    celsiusEl.classList.remove("state-button--active");
    fahrenheitEl.classList.add("state-button--active");
    milesEl.classList.add("state-button--active");
    kilometersEl.classList.remove("state-button--active");
    inchesEl.classList.add("state-button--active");
    millimetersEl.classList.remove("state-button--active");
  } else {
    celsiusEl.classList.add("state-button--active");
    fahrenheitEl.classList.remove("state-button--active");
    milesEl.classList.remove("state-button--active");
    kilometersEl.classList.add("state-button--active");
    inchesEl.classList.remove("state-button--active");
    millimetersEl.classList.add("state-button--active");
  }

  // -- Changing Main Page Based On Dropdown List --
  if (isImperial()) {
    document.querySelector(".feels-like-bottom").textContent =
      `${Math.round((feelsLikeTempNum * 9) / 5 + 32)}°`;
    document.querySelector(".wind-bottom").textContent =
      `${Math.round(windSpeedNum * 0.621371)} mph`;
    document.querySelector(".Precipitation-bottom").textContent =
      `${Math.round(PrecipitationNum * 0.0393701)} in`;
    mainTempEl.textContent = `${Math.round((mainTempNum * 9) / 5 + 32)}°`;
  } else if (isMetric()) {
    document.querySelector(".feels-like-bottom").textContent =
      `${Math.round(feelsLikeTempNum)}°`;
    document.querySelector(".wind-bottom").textContent = `${windSpeedNum} km/h`;
    document.querySelector(".Precipitation-bottom").textContent =
      `${PrecipitationNum} mm`;
    mainTempEl.textContent = `${Math.round(mainTempNum)}°`;
  }

  await getDailyForecast(currentWeatherUrl);
  await getHourlyForecast(currentWeatherUrl);
}

switchBtnEl.addEventListener("click", switchHandler);

// -- Managing Units Dropdown button --
async function clickHandler(event) {
  const clickedBtn = event.target.closest(".state-button");
  if (!clickedBtn) return;
  const section = clickedBtn.closest(".unit-section");
  const activeBtn = section.querySelector(".state-button--active");

  if (activeBtn) {
    activeBtn.classList.remove("state-button--active");
  }

  clickedBtn.classList.add("state-button--active");

  // -- Changing Main Page Based On Dropdown List --
  if (fahrenheitEl.classList.contains("state-button--active")) {
    document.querySelector(".feels-like-bottom").textContent =
      `${Math.round((feelsLikeTempNum * 9) / 5 + 32)}°`;
    mainTempEl.textContent = `${Math.round((mainTempNum * 9) / 5 + 32)}°`;
  }
  if (milesEl.classList.contains("state-button--active")) {
    document.querySelector(".wind-bottom").textContent =
      `${Math.round(windSpeedNum * 0.621371)} mph`;
  }
  if (inchesEl.classList.contains("state-button--active")) {
    document.querySelector(".Precipitation-bottom").textContent =
      `${Math.round(PrecipitationNum * 0.0393701)} in`;
  }
  if (celsiusEl.classList.contains("state-button--active")) {
    document.querySelector(".feels-like-bottom").textContent =
      `${Math.round(feelsLikeTempNum)}°`;
    mainTempEl.textContent = `${Math.round(mainTempNum)}°`;
  }
  if (kilometersEl.classList.contains("state-button--active")) {
    document.querySelector(".wind-bottom").textContent = `${windSpeedNum} km/h`;
  }
  if (millimetersEl.classList.contains("state-button--active")) {
    document.querySelector(".Precipitation-bottom").textContent =
      `${Math.round(PrecipitationNum)} mm`;
  }
  await getDailyForecast(currentWeatherUrl);
  await getHourlyForecast(currentWeatherUrl);
}

unitSecEl.forEach((section) => section.addEventListener("click", clickHandler));

function isImperial() {
  return (
    fahrenheitEl.classList.contains("state-button--active") &&
    milesEl.classList.contains("state-button--active") &&
    inchesEl.classList.contains("state-button--active")
  );
}

function isMetric() {
  return (
    celsiusEl.classList.contains("state-button--active") &&
    kilometersEl.classList.contains("state-button--active") &&
    millimetersEl.classList.contains("state-button--active")
  );
}

// -- managing search and fecth api
async function submitHandler(event) {
  event.preventDefault();
  const searchValue = searchInputEl.value;
  const city = searchValue.trim();
  if (!city) return;
  mainSkeletonEl.classList.remove("main-skeleton--loading-done");
  lowerSkeletonEl.classList.remove("lower-skeleton--loading-done");


  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
  const data = await getData(geoUrl);
  latitude = data[0].lat;
  longitude = data[0].lon;
  const searchedCityName = data[0].name;
  const countryCode = data[0].country;
  const countryName = new Intl.DisplayNames(["en"], {
    type: "region",
  }).of(countryCode);
  cityName.textContent = `${searchedCityName}, ${countryName}`;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&hourly=temperature_2m,weather_code`;

  currentWeatherUrl = weatherUrl;
  await loadWeather(currentWeatherUrl);
  searchInputEl.value = "";
  await getDailyForecast(currentWeatherUrl);
  await getHourlyForecast(currentWeatherUrl);
  const data1 = getData(currentWeatherUrl);
  mainSkeletonEl.classList.add("main-skeleton--loading-done");
  lowerSkeletonEl.classList.add("lower-skeleton--loading-done");
  console.log(data1);
}

async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();
  lowerSkeletonEl.classList.add("lower-skeleton--loading-done");
  mainSkeletonEl.classList.add("main-skeleton--loading-done");
  return data;
}

async function loadWeather(url) {
  const data = await getData(url);
  mainTempNum = data.current.temperature_2m;

  windSpeedNum = data.current.wind_speed_10m;

  feelsLikeTempNum = data.current.apparent_temperature;

  PrecipitationNum = data.current.precipitation;

  mainTempEl.textContent = `${Math.round(mainTempNum)}°`;
  windSpeed.textContent = `${Math.round(windSpeedNum)} km/h`;
  humidity.textContent = `${Math.round(data.current.relative_humidity_2m)}%`;
  feelsLike.textContent = `${Math.round(feelsLikeTempNum)}°`;
  Precipitation.textContent = `${Math.round(PrecipitationNum)} mm`;

  weatherIcon.innerHTML = `<img
            class="weather-icon"
            src="${weatherDescriptions[data.current.weather_code].icon}"
            alt="${weatherDescriptions[data.current.weather_code].text}"
          />`;

  console.log(feelsLike);
}

async function getDailyForecast(url) {
  const weatherData = await getData(url);
  const dailyForecast = weatherData.daily.time.map((date, index) => ({
    day: new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    min: Math.round(weatherData.daily.temperature_2m_min[index]),
    max: Math.round(weatherData.daily.temperature_2m_max[index]),
    icon: weatherDescriptions[weatherData.daily.weather_code[index]].icon,
    text: weatherDescriptions[weatherData.daily.weather_code[index]].text,
  }));

  dailyForecastHtml.innerHTML = dailyForecast
    .map((day) => {
      let min = day.min;
      let max = day.max;
      if (fahrenheitEl.classList.contains("state-button--active")) {
        max = Math.round((max * 9) / 5 + 32);
        min = Math.round((min * 9) / 5 + 32);
      } else {
        min = day.min;
        max = day.max;
      }
      return `<div class="day-forecast">
          <p class="day-forecast__top-par">${day.day}</p>
          <img
            src="${day.icon}"
            alt="${day.text}"
            class="day-forecast__mid-icon"
          />
          <div class="day-forecast__lower">
            <p class="day-forecast__lower--left-side">${max}°</p>
            <p class="day-forecast__lower--right-side">${min}°</p>
          </div>
        </div>`;
    })
    .join("");
}

async function getHourlyForecast(url) {
  const weatherData = await getData(url);
  const currentTime = weatherData.current.time;
  const hourlyForecast = weatherData.hourly.time
    .map((time, index) => ({
      rawTime: time,
      time: new Date(time).toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      temp: Math.round(weatherData.hourly.temperature_2m[index]),
      icon: weatherDescriptions[weatherData.hourly.weather_code[index]].icon,
      text: weatherDescriptions[weatherData.hourly.weather_code[index]].text,
    }))
    .filter((hour) => hour.rawTime >= currentTime)
    .slice(0, 8);
  hourlyForecast[0].time = "NOW";
  hourlyCardsHtml.innerHTML = hourlyForecast
    .map((hour) => {
      let temp = hour.temp;
      if (fahrenheitEl.classList.contains("state-button--active")) {
        temp = Math.round((hour.temp * 9) / 5 + 32);
      }
      return `<div class="hour-forecast">
          <div class="hourly-forecast__left-side">
            <img
              class="hourly-forecast__left-side-icon"
              src="${hour.icon}"
              alt="${hour.text}"
            />
            <p class="hourly-forecast__left-side-hour">${hour.time}</p>
          </div>
          <div class="hourly-forecast__right-side">
            <p class="hourly-forecast__right-side-temp">${temp}°</p>
          </div>
        </div>`;
    })
    .join("");
}

getHourlyForecast(BASE_URL);
loadWeather(BASE_URL);
getDailyForecast(BASE_URL);
searchSectionEl.addEventListener("submit", submitHandler);
