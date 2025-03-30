// Clothing Suggestion Engine
const ClothingEngine = (() => {
    /**
     * Generate clothing suggestions based on weather and user preferences
     * @param {Object} weather - Current weather data
     * @param {Object} preferences - User preferences object
     * @returns {Object} - Clothing suggestions object
     */
    const generateSuggestions = (weather, preferences) => {
        if (!weather || !preferences) {
            return {
                layers: ['Informationen nicht verfügbar'],
                lowerBody: 'Informationen nicht verfügbar',
                footwear: 'Informationen nicht verfügbar',
                accessories: []
            };
        }
        
        const { temp, condition, rainChance, windSpeed } = weather;
        const { style, sensitivity, gender } = preferences;
        
        // Adjust temperature based on sensitivity
        let adjustedTemp = temp;
        if (sensitivity === 'cold-sensitive') {
            adjustedTemp = temp - 2;
        } else if (sensitivity === 'warm-resistant') {
            adjustedTemp = temp + 2;
        }
        
        // Adjust for wind chill
        if (windSpeed > 20) {
            adjustedTemp -= 2;
        } else if (windSpeed > 10) {
            adjustedTemp -= 1;
        }
        
        // Generate clothing layers
        const layers = generateLayers(adjustedTemp, condition, rainChance, style, gender);
        
        // Generate lower body clothing
        const lowerBody = generateLowerBody(adjustedTemp, condition, rainChance, style, gender);
        
        // Generate footwear
        const footwear = generateFootwear(adjustedTemp, condition, rainChance, style);
        
        // Generate accessories
        const accessories = generateAccessories(adjustedTemp, condition, rainChance, windSpeed);
        
        return {
            layers,
            lowerBody,
            footwear,
            accessories
        };
    };
    
    /**
     * Generate upper body clothing layers
     * @param {number} temp - Adjusted temperature
     * @param {string} condition - Weather condition
     * @param {number} rainChance - Rain probability
     * @param {string} style - Clothing style preference
     * @param {string} gender - Gender preference
     * @returns {Array} - Array of clothing layer suggestions
     */
    const generateLayers = (temp, condition, rainChance, style, gender) => {
        const layers = [];
        const isRainy = condition.toLowerCase().includes('regen') || rainChance > 30;
        
        // Business style has specific rules
        if (style === 'business') {
            if (gender === 'female') {
                if (temp < 10) {
                    layers.push('Bluse');
                    layers.push('Blazer');
                    if (temp < 5) {
                        layers.push('Mantel');
                    }
                } else if (temp < 20) {
                    layers.push('Bluse');
                    if (temp < 15) {
                        layers.push('Leichter Blazer');
                    }
                } else {
                    layers.push('Leichte Bluse');
                    if (isRainy) {
                        layers.push('Leichter Blazer');
                    }
                }
            } else { // male or neutral for business
                if (temp < 10) {
                    layers.push('Hemd');
                    layers.push('Sakko');
                    if (temp < 5) {
                        layers.push('Mantel');
                    }
                } else if (temp < 20) {
                    layers.push('Hemd');
                    if (temp < 15) {
                        layers.push('Sakko');
                    }
                } else {
                    layers.push('Leichtes Hemd');
                    if (isRainy) {
                        layers.push('Leichtes Sakko');
                    }
                }
            }
            
            // Add rain protection for business
            if (isRainy) {
                layers.push('Regenschirm mitnehmen');
            }
            
            return layers;
        }
        
        // Sporty style has specific rules
        if (style === 'sporty') {
            if (temp < 5) {
                layers.push('Thermo-Sportunterwäsche');
                layers.push('Langärmliges Sportshirt');
                layers.push('Sportjacke');
            } else if (temp < 15) {
                layers.push('Langärmliges Sportshirt');
                if (temp < 10) {
                    layers.push('Leichte Sportjacke');
                }
            } else {
                layers.push('Sportshirt');
                if (temp > 25) {
                    layers.push('Atmungsaktives Tank-Top');
                }
            }
            
            if (isRainy) {
                layers.push('Wasserdichte Sportjacke');
            }
            
            return layers;
        }
        
        // Casual/default style
        if (temp < 0) {
            layers.push('Thermounterwäsche');
            layers.push('Langärmliges Shirt');
            layers.push('Dicker Pullover');
            layers.push('Winterjacke');
        } else if (temp < 5) {
            layers.push('Langärmliges Shirt');
            layers.push('Pullover');
            layers.push('Warme Jacke');
        } else if (temp < 10) {
            layers.push('Langärmliges Shirt');
            layers.push('Leichter Pullover');
            layers.push('Übergangsjacke');
        } else if (temp < 15) {
            layers.push('T-Shirt');
            layers.push('Leichte Jacke oder Cardigan');
        } else if (temp < 20) {
            layers.push('T-Shirt');
            if (isRainy) {
                layers.push('Leichte Regenjacke');
            }
        } else if (temp < 25) {
            layers.push('T-Shirt');
        } else {
            layers.push('Leichtes T-Shirt oder ärmelloses Top');
        }
        
        return layers;
    };
    
    /**
     * Generate lower body clothing
     * @param {number} temp - Adjusted temperature
     * @param {string} condition - Weather condition
     * @param {number} rainChance - Rain probability
     * @param {string} style - Clothing style preference
     * @param {string} gender - Gender preference
     * @returns {string} - Lower body clothing suggestion
     */
    const generateLowerBody = (temp, condition, rainChance, style, gender) => {
        const isRainy = condition.toLowerCase().includes('regen') || rainChance > 40;
        
        // Business style
        if (style === 'business') {
            if (gender === 'female') {
                if (temp < 10) {
                    return 'Stoffhose oder Rock mit blickdichten Strumpfhosen';
                } else if (temp < 20) {
                    return 'Stoffhose oder Rock mit dünnen Strumpfhosen';
                } else {
                    return 'Leichte Stoffhose oder Rock';
                }
            } else { // male or neutral for business
                if (temp < 10) {
                    return 'Anzughose aus dickeren Materialien';
                } else {
                    return 'Stoffhose';
                }
            }
        }
        
        // Sporty style
        if (style === 'sporty') {
            if (temp < 5) {
                return 'Lange Thermo-Sporthose';
            } else if (temp < 15) {
                return 'Trainingshose';
            } else {
                return temp < 20 ? 'Leichte Sporthose' : 'Kurze Sporthose';
            }
        }
        
        // Casual/default style
        if (gender === 'female') {
            if (temp < 5) {
                return 'Warme Hose oder Jeans, ggf. Rock mit dicken Strumpfhosen';
            } else if (temp < 15) {
                return 'Jeans oder leichte Hose, optional Rock mit Strumpfhose';
            } else if (temp < 25) {
                return 'Leichte Hose, Rock oder Capri-Hose';
            } else {
                return 'Kurze Hose, Rock oder leichte Sommerhose';
            }
        } else { // male or neutral
            if (temp < 5) {
                return 'Warme Hose oder Jeans';
            } else if (temp < 15) {
                return 'Jeans oder leichte Hose';
            } else if (temp < 25) {
                return 'Leichte Hose';
            } else {
                return 'Kurze Hose oder sehr leichte Sommerhose';
            }
        }
    };
    
    /**
     * Generate footwear suggestions
     * @param {number} temp - Adjusted temperature
     * @param {string} condition - Weather condition
     * @param {number} rainChance - Rain probability
     * @param {string} style - Clothing style preference
     * @returns {string} - Footwear suggestion
     */
    const generateFootwear = (temp, condition, rainChance, style) => {
        const isRainy = condition.toLowerCase().includes('regen') || rainChance > 40;
        const isSnowy = condition.toLowerCase().includes('schnee');
        
        // Business style
        if (style === 'business') {
            if (isRainy || isSnowy) {
                return 'Wasserfeste Business-Schuhe';
            } else if (temp < 5) {
                return 'Geschlossene warme Business-Schuhe';
            } else if (temp < 20) {
                return 'Geschlossene Business-Schuhe';
            } else {
                return 'Leichte Business-Schuhe';
            }
        }
        
        // Sporty style
        if (style === 'sporty') {
            if (isSnowy) {
                return 'Wasserfeste Sportschuhe mit gutem Profil';
            } else if (isRainy) {
                return 'Wasserfeste Sportschuhe';
            } else if (temp < 10) {
                return 'Geschlossene Sportschuhe';
            } else {
                return 'Leichte Sportschuhe';
            }
        }
        
        // Casual/default style
        if (isSnowy) {
            return 'Winterstiefel oder wasserfeste Schuhe mit Profil';
        } else if (isRainy) {
            return 'Wasserfeste Schuhe';
        } else if (temp < 5) {
            return 'Warme, gefütterte Schuhe oder Stiefel';
        } else if (temp < 15) {
            return 'Sneaker oder geschlossene Schuhe';
        } else if (temp < 25) {
            return 'Leichte Sneaker oder geschlossene Schuhe';
        } else {
            return 'Sandalen oder sehr leichte Schuhe';
        }
    };
    
    /**
     * Generate accessories suggestions
     * @param {number} temp - Adjusted temperature
     * @param {string} condition - Weather condition
     * @param {number} rainChance - Rain probability
     * @param {number} windSpeed - Wind speed
     * @returns {Array} - Array of accessory suggestions
     */
    const generateAccessories = (temp, condition, rainChance, windSpeed) => {
        const accessories = [];
        const isRainy = condition.toLowerCase().includes('regen') || rainChance > 40;
        const isSunny = condition.toLowerCase().includes('sonnig');
        const isWindy = windSpeed > 15;
        
        // Cold weather accessories
        if (temp < 0) {
            accessories.push('Dicke Mütze');
            accessories.push('Schal');
            accessories.push('Warme Handschuhe');
        } else if (temp < 5) {
            accessories.push('Mütze');
            accessories.push('Leichter Schal');
            if (isWindy) {
                accessories.push('Handschuhe');
            }
        } else if (temp < 10 && isWindy) {
            accessories.push('Leichte Mütze oder Kopfbedeckung');
        }
        
        // Rain protection
        if (isRainy) {
            accessories.push('Regenschirm');
        }
        
        // Sun protection
        if (isSunny) {
            if (temp > 15) {
                accessories.push('Sonnenbrille');
            }
            if (temp > 20) {
                accessories.push('Sonnencreme');
                accessories.push('Kopfbedeckung zum Sonnenschutz');
            }
            if (temp > 25) {
                accessories.push('Wasserflasche mitnehmen');
            }
        }
        
        return accessories;
    };
    
    return {
        generateSuggestions
    };
})();