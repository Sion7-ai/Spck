// Forecast Component
const ForecastComponent = (() => {
    /**
     * Create forecast cards HTML
     * @param {Array} forecastData - Array of forecast day objects
     * @returns {string} - HTML string for forecast cards
     */
    const createForecastCardsHTML = (forecastData) => {
        if (!forecastData || !Array.isArray(forecastData) || forecastData.length === 0) {
            return '<div class="card forecast-card"><p>Keine Vorhersagedaten verfügbar</p></div>';
        }
        
        return forecastData.map(day => {
            const tempBarWidth = ((day.max - day.min) / 30) * 100;
            const tempBarStart = (day.min / 30) * 100;
            
            return `
                <div class="card forecast-card">
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
                </div>
            `;
        }).join('');
    };
    
    /**
     * Initialize temperature chart
     * @param {string} canvasId - Canvas element ID
     * @param {Array} forecastData - Array of forecast day objects
     * @returns {Object} - Chart.js chart instance
     */
    const initTemperatureChart = (canvasId, forecastData) => {
        if (!forecastData || !Array.isArray(forecastData) || forecastData.length === 0) {
            console.error('No forecast data available for chart');
            return null;
        }
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.tempChart) {
            window.tempChart.destroy();
        }
        
        // Create chart data
        const chartData = {
            labels: forecastData.map(day => day.day),
            datasets: [
                {
                    label: 'Maximum',
                    data: forecastData.map(day => day.max),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.2
                },
                {
                    label: 'Durchschnitt',
                    data: forecastData.map(day => day.temp),
                    borderColor: '#60a5fa',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    borderWidth: 2,
                    tension: 0.2
                },
                {
                    label: 'Minimum',
                    data: forecastData.map(day => day.min),
                    borderColor: '#93c5fd',
                    backgroundColor: 'rgba(147, 197, 253, 0.1)',
                    tension: 0.2
                }
            ]
        };
        
        // Chart options
        const chartOptions = {
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
        };
        
        // Create and return chart
        window.tempChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions
        });
        
        return window.tempChart;
    };
    
    /**
     * Get forecast data prepared for visualization
     * @param {Array} forecastData - Raw forecast data
     * @returns {Array} - Processed forecast data
     */
    const prepareForecastData = (forecastData) => {
        if (!forecastData || !Array.isArray(forecastData)) {
            return [];
        }
        
        return forecastData.map(day => ({
            day: day.day,
            temp: day.temp,
            min: day.min,
            max: day.max,
            condition: day.condition,
            icon: day.icon
        }));
    };
    
    /**
     * Check if we should show precipitation forecast
     * @param {Array} forecastData - Array of forecast day objects
     * @returns {boolean} - True if precipitation forecast should be shown
     */
    const shouldShowPrecipitation = (forecastData) => {
        if (!forecastData || !Array.isArray(forecastData)) {
            return false;
        }
        
        // Check if any day has rain chance > 20%
        return forecastData.some(day => day.rainChance > 20);
    };
    
    /**
     * Get descriptive text for the forecast trend
     * @param {Array} forecastData - Array of forecast day objects
     * @returns {string} - Description of the forecast trend
     */
    const getForecastTrendDescription = (forecastData) => {
        if (!forecastData || !Array.isArray(forecastData) || forecastData.length < 2) {
            return 'Keine Trendinformationen verfügbar';
        }
        
        // Calculate average temperature over the forecast period
        const avgTemps = forecastData.map(day => day.temp);
        const avgTemp = avgTemps.reduce((sum, temp) => sum + temp, 0) / avgTemps.length;
        
        // Check trend (increasing, decreasing, or stable)
        const firstDay = forecastData[0].temp;
        const lastDay = forecastData[forecastData.length - 1].temp;
        const tempDiff = lastDay - firstDay;
        
        // Check precipitation trend
        const hasRain = forecastData.some(day => 
            day.condition.toLowerCase().includes('regen') || 
            day.rainChance > 40
        );
        
        let trendText = '';
        
        // Temperature trend
        if (Math.abs(tempDiff) < 2) {
            trendText += 'Die Temperaturen bleiben relativ stabil';
        } else if (tempDiff > 0) {
            trendText += 'Die Temperaturen werden in den nächsten Tagen ansteigen';
        } else {
            trendText += 'Die Temperaturen werden in den nächsten Tagen sinken';
        }
        
        // Add precipitation info
        if (hasRain) {
            const rainDays = forecastData
                .filter(day => day.condition.toLowerCase().includes('regen') || day.rainChance > 40)
                .map(day => day.day)
                .join(', ');
            
            trendText += `. Regnerisches Wetter ist zu erwarten an: ${rainDays}`;
        } else {
            trendText += '. Es wird voraussichtlich trocken bleiben';
        }
        
        return trendText;
    };
    
    return {
        createForecastCardsHTML,
        initTemperatureChart,
        prepareForecastData,
        shouldShowPrecipitation,
        getForecastTrendDescription
    };
})();