// Weather API Service
const WeatherApiService = (() => {
    // In a production app, you would use your API key
    // const API_KEY = 'YOUR_API_KEY';
    // const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    
    /**
     * Get weather data for a location
     * @param {string} location - City name
     * @returns {Promise} - Promise that resolves to weather data object
     */
    const getWeatherData = (location) => {
        return new Promise((resolve, reject) => {
            // In a real app, you would make an API call here
            // For demo purposes, we'll return mock data after a short delay
            setTimeout(() => {
                try {
                    // Generate weather data based on the location and current date
                    const data = generateMockWeatherData(location);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            }, 1000);
        });
    };
    
    /**
     * Generate mock weather data
     * @param {string} location - City name
     * @returns {Object} - Weather data object
     */
    const generateMockWeatherData = (location) => {
        // Get current date
        const now = new Date();
        const month = now.getMonth();
        
        // Seasonal temperature ranges (rough estimates for Central Europe)
        let baseTemp, tempVariation, rainChance;
        
        // Winter (Dec-Feb)
        if (month === 11 || month === 0 || month === 1) {
            baseTemp = 2;
            tempVariation = 5;
            rainChance = 30;
        }
        // Spring (Mar-May)
        else if (month >= 2 && month <= 4) {
            baseTemp = 12;
            tempVariation = 7;
            rainChance = 40;
        }
        // Summer (Jun-Aug)
        else if (month >= 5 && month <= 7) {
            baseTemp = 22;
            tempVariation = 6;
            rainChance = 20;
        }
        // Fall (Sep-Nov)
        else {
            baseTemp = 14;
            tempVariation = 8;
            rainChance = 50;
        }
        
        // Add some randomness based on location string length (just for variation)
        const locationFactor = location.length % 5 - 2;
        baseTemp += locationFactor;
        
        // Current temperature with some randomness
        const currentTemp = Math.round(baseTemp + (Math.random() * tempVariation * 2) - tempVariation);
        
        // Generate weather condition based on temperature and randomness
        const { condition, icon } = getWeatherCondition(currentTemp, rainChance);
        
        // Create forecast for next 3 days
        const forecast = [];
        for (let i = 0; i < 3; i++) {
            const dayTemp = Math.round(baseTemp + (Math.random() * tempVariation * 2) - tempVariation);
            const dayMin = Math.round(dayTemp - (Math.random() * 3) - 2);
            const dayMax = Math.round(dayTemp + (Math.random() * 3) + 2);
            const dayRainChance = Math.round(rainChance + (Math.random() * 30) - 15);
            const { condition: dayCondition, icon: dayIcon } = getWeatherCondition(dayTemp, dayRainChance);
            
            forecast.push({
                day: i === 0 ? 'Heute' : i === 1 ? 'Morgen' : 'Übermorgen',
                temp: dayTemp,
                min: dayMin,
                max: dayMax,
                condition: dayCondition,
                icon: dayIcon,
                rainChance: dayRainChance
            });
        }
        
        return {
            location: location,
            current: {
                temp: currentTemp,
                feelsLike: Math.round(currentTemp - (Math.random() * 3) + 1),
                condition: condition,
                humidity: Math.round(50 + (Math.random() * 40)),
                windSpeed: Math.round(5 + (Math.random() * 20)),
                rainChance: Math.round(rainChance + (Math.random() * 20) - 10),
                icon: icon
            },
            forecast: forecast
        };
    };
    
    /**
     * Get weather condition based on temperature and rain chance
     * @param {number} temp - Temperature in Celsius
     * @param {number} rainChance - Rain probability in percentage
     * @returns {Object} - Weather condition and icon
     */
    const getWeatherCondition = (temp, rainChance) => {
        // High chance of rain
        if (rainChance > 70) {
            return { condition: 'Regen', icon: 'rainy' };
        }
        // Medium chance of rain
        else if (rainChance > 40) {
            return { condition: 'Regenschauer möglich', icon: 'rainy-light' };
        }
        // Cold and cloudy
        else if (temp < 5) {
            if (Math.random() > 0.7) {
                return { condition: 'Schneefall möglich', icon: 'weather-snowy' };
            } else {
                return { condition: 'Bewölkt und kalt', icon: 'cloud' };
            }
        }
        // Cool and variable
        else if (temp < 12) {
            if (Math.random() > 0.6) {
                return { condition: 'Teilweise bewölkt', icon: 'partly-cloudy' };
            } else {
                return { condition: 'Überwiegend bewölkt', icon: 'cloud' };
            }
        }
        // Mild
        else if (temp < 20) {
            if (Math.random() > 0.5) {
                return { condition: 'Teils sonnig', icon: 'partly-cloudy' };
            } else {
                return { condition: 'Angenehm', icon: 'sunny' };
            }
        }
        // Warm to hot
        else {
            if (Math.random() > 0.8) {
                return { condition: 'Sonnig und heiß', icon: 'sunny' };
            } else if (Math.random() > 0.4) {
                return { condition: 'Sonnig', icon: 'sunny' };
            } else {
                return { condition: 'Heiter bis wolkig', icon: 'partly-cloudy' };
            }
        }
    };
    
    return {
        getWeatherData
    };
})();