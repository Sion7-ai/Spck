// Main JavaScript for WeatherWise App

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const locationForm = document.getElementById('location-form');
    const locationInput = document.getElementById('location-input');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const weatherContent = document.getElementById('weather-content');
    
    // Preference selectors
    const styleSelect = document.getElementById('style-select');
    const sensitivitySelect = document.getElementById('sensitivity-select');
    const genderSelect = document.getElementById('gender-select');
    
    // Initialize app
    initApp();
    
    // Event Listeners
    settingsToggle.addEventListener('click', toggleSettings);
    locationForm.addEventListener('submit', handleLocationSubmit);
    styleSelect.addEventListener('change', handlePreferenceChange);
    sensitivitySelect.addEventListener('change', handlePreferenceChange);
    genderSelect.addEventListener('change', handlePreferenceChange);
    
    // Initialize the app
    function initApp() {
        // Load saved preferences
        const savedPreferences = PreferencesManager.loadPreferences();
        if (savedPreferences) {
            styleSelect.value = savedPreferences.style;
            sensitivitySelect.value = savedPreferences.sensitivity;
            genderSelect.value = savedPreferences.gender;
        }
        
        // Load saved location or use default
        const savedLocation = localStorage.getItem('weatherwise-location') || 'Berlin';
        locationInput.value = savedLocation;
        
        // Fetch weather data for the location
        fetchWeatherForLocation(savedLocation);
    }
    
    // Toggle settings panel visibility
    function toggleSettings() {
        settingsPanel.classList.toggle('hidden');
    }
    
    // Handle location form submission
    function handleLocationSubmit(e) {
        e.preventDefault();
        const location = locationInput.value.trim();
        if (location) {
            fetchWeatherForLocation(location);
            // Save location
            localStorage.setItem('weatherwise-location', location);
        }
    }
    
    // Handle preference changes
    function handlePreferenceChange() {
        const preferences = {
            style: styleSelect.value,
            sensitivity: sensitivitySelect.value,
            gender: genderSelect.value
        };
        
        // Save preferences
        PreferencesManager.savePreferences(preferences);
        
        // Update clothing suggestions
        if (weatherData) {
            updateClothingSuggestions(weatherData, preferences);
        }
    }
    
    // Main data fetching function
    let weatherData = null;
    
    function fetchWeatherForLocation(location) {
        // Show loading spinner
        loadingSpinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        weatherContent.classList.add('hidden');
        
        // Call weather API service
        WeatherApiService.getWeatherData(location)
            .then(data => {
                weatherData = data;
                // Update UI with weather data
                updateWeatherUI(data);
                // Generate clothing suggestions
                const preferences = PreferencesManager.loadPreferences();
                updateClothingSuggestions(data, preferences);
                // Update forecast
                updateForecastUI(data.forecast);
                
                // Hide loading spinner and show content
                loadingSpinner.classList.add('hidden');
                weatherContent.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                loadingSpinner.classList.add('hidden');
                errorMessage.classList.remove('hidden');
                errorMessage.textContent = `Fehler beim Abrufen der Wetterdaten für "${location}". Bitte versuche es später erneut.`;
            });
    }
    
    // Update UI with weather data
    function updateWeatherUI(data) {
        // Update location
        document.getElementById('weather-location').textContent = data.location;
        
        // Update current weather
        document.getElementById('current-temp').textContent = `${data.current.temp}°C`;
        document.getElementById('feels-like').textContent = `Gefühlt: ${data.current.feelsLike}°C`;
        document.getElementById('weather-condition').textContent = data.current.condition;
        
        // Update weather details
        document.getElementById('humidity').textContent = `${data.current.humidity}% Luftfeuchtigkeit`;
        document.getElementById('wind-speed').textContent = `${data.current.windSpeed} km/h Wind`;
        document.getElementById('rain-chance').textContent = `${data.current.rainChance}% Regenwahrscheinlichkeit`;
        
        // Update weather icon
        const weatherIcon = document.getElementById('weather-icon');
        weatherIcon.innerHTML = `<span class="iconify" data-icon="material-symbols:${data.current.icon}" data-width="48"></span>`;
    }
    
    // Update clothing suggestions
    function updateClothingSuggestions(data, preferences) {
        const suggestions = ClothingEngine.generateSuggestions(data.current, preferences);
        
        // Update layers
        const layersList = document.getElementById('layers-list');
        layersList.innerHTML = '';
        suggestions.layers.forEach(layer => {
            const li = document.createElement('li');
            li.textContent = layer;
            layersList.appendChild(li);
        });
        
        // Update lower body and footwear
        document.getElementById('lower-body').textContent = suggestions.lowerBody;
        document.getElementById('footwear').textContent = suggestions.footwear;
        
        // Update accessories
        const accessoriesList = document.getElementById('accessories-list');
        accessoriesList.innerHTML = '';
        if (suggestions.accessories.length > 0) {
            suggestions.accessories.forEach(accessory => {
                const li = document.createElement('li');
                li.textContent = accessory;
                accessoriesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Keine speziellen Accessoires nötig';
            accessoriesList.appendChild(li);
        }
    }
    
    // Update forecast UI
    function updateForecastUI(forecast) {
        // Create forecast cards
        const forecastCardsContainer = document.getElementById('forecast-cards');
        forecastCardsContainer.innerHTML = '';
        
        forecast.forEach(day => {
            const card = document.createElement('div');
            card.className = 'card forecast-card';
            
            const tempBarWidth = ((day.max - day.min) / 30) * 100;
            const tempBarStart = (day.min / 30) * 100;
            
            card.innerHTML = `
                <div class="forecast-card-header">
                    <div>
                        <h3>${day.day}</h3>
                        <p class="forecast-condition">${day.condition}</p>
                    </div>
                    <span class="iconify" data-icon="material-symbols:${day.icon}" data-width="36"></span>
                </div>
                <div class="temp-range">
                    <span class="temp-min">${day.min}°C</span>
                    <div class="temp-bar">
                        <div class="temp-fill" style="width: ${tempBarWidth}%; left: ${tempBarStart}%"></div>
                    </div>
                    <span class="temp-max">${day.max}°C</span>
                </div>
            `;
            
            forecastCardsContainer.appendChild(card);
        });
        
        // Create forecast chart
        const ctx = document.getElementById('temperature-chart').getContext('2d');
        
        // Destroy previous chart if exists
        if (window.tempChart) {
            window.tempChart.destroy();
        }
        
        // Create new chart
        window.tempChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: forecast.map(day => day.day),
                datasets: [
                    {
                        label: 'Maximum',
                        data: forecast.map(day => day.max),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.2
                    },
                    {
                        label: 'Durchschnitt',
                        data: forecast.map(day => day.temp),
                        borderColor: '#60a5fa',
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                        borderWidth: 2,
                        tension: 0.2
                    },
                    {
                        label: 'Minimum',
                        data: forecast.map(day => day.min),
                        borderColor: '#93c5fd',
                        backgroundColor: 'rgba(147, 197, 253, 0.1)',
                        tension: 0.2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return value + '°C';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw + '°C';
                            }
                        }
                    }
                }
            }
        });
    }
});