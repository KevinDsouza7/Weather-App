const apiKey = 'e72aa65810937fc2b854e546d1f56247';

// Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const historyList = document.getElementById('history');
const todaySection = document.getElementById('today');
const forecastSection = document.getElementById('forecast');

// Event listener for form submission
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const cityName = searchInput.value.trim();
  if (cityName !== '') {
    getWeatherData(cityName);
  }
});

// Function to get weather data from OpenWeatherMap API
function getWeatherData(cityName) {
  // Use your OpenWeatherMap API endpoint
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  // Fetch current weather data
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      addToHistory(cityName);
    })
    .catch(error => console.error('Error fetching current weather:', error));

  // Fetch 5-day forecast data
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => displayForecast(data))
    .catch(error => console.error('Error fetching forecast:', error));
}

// Function to display current weather
function displayCurrentWeather(data) {
  const cityName = data.name;
  const date = dayjs().format('MMMM D, YYYY');
  const icon = data.weather[0].icon;
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  const currentWeatherHTML = `
    <h2>${cityName}</h2>
    <p>Date: ${date}</p>
    <p>Weather: <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon"> </p>
    <p>Temperature: ${temperature} °C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;

  todaySection.innerHTML = currentWeatherHTML;
}

// Function to display 5-day forecast
function displayForecast(data) {
  console.log(data); // Log the entire forecast data

  const forecastData = data.list.slice(0, 5); // Take the first 5 entries for a 5-day forecast
  
  const forecastHTML = forecastData.map(entry => {
    const date = dayjs(entry.dt_txt).format('MMMM D, YYYY');
    const icon = entry.weather[0].icon;
    const temperature = entry.main.temp;
    const humidity = entry.main.humidity;

    return `
      <div class="col-md-2">
        <p>Date: ${date}</p>
        <p>Weather: <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon"> </p>
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
      </div>
    `;
  }).join('');

  forecastSection.innerHTML = forecastHTML;
}


// Function to add a city to the search history
function addToHistory(cityName) {
    // Save search history to localStorage
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  
    // Remove the oldest search if there are already 3 searches
    if (history.length >= 3) {
      history.shift();
    }
  
    history.push(cityName);
    localStorage.setItem('weatherHistory', JSON.stringify(history));
  
    // Load and display updated search history
    loadSearchHistory();
  }
  
  // Function to load search history from localStorage
  function loadSearchHistory() {
    // Clear existing history items
    historyList.innerHTML = '';
  
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  
    // Iterate through the last 3 searches
    for (let i = Math.max(0, history.length - 3); i < history.length; i++) {
      const cityName = history[i];
      const historyItem = document.createElement('button');
      
      // Add different styles for the most recent searches
      if (i >= history.length - 3) {
        historyItem.classList.add('list-group-item', 'list-group-item-action', 'recent-search');
      } else {
        historyItem.classList.add('list-group-item', 'list-group-item-action');
      }
  
      historyItem.textContent = cityName;
  
      // Add event listener to history item to trigger a new search when clicked
      historyItem.addEventListener('click', function () {
        getWeatherData(cityName);
      });
  
      historyList.appendChild(historyItem);
    }
  }
  
  // Load search history on page load
  loadSearchHistory();
  