// Preferences Manager
const PreferencesManager = (() => {
    const STORAGE_KEY = 'weatherwise-preferences';
    
    // Default preferences
    const DEFAULT_PREFERENCES = {
        style: 'casual',
        sensitivity: 'normal',
        gender: 'neutral'
    };
    
    /**
     * Save user preferences to localStorage
     * @param {Object} preferences - User preferences object
     */
    const savePreferences = (preferences) => {
        try {
            const prefsToSave = {
                ...DEFAULT_PREFERENCES,
                ...preferences
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prefsToSave));
            return true;
        } catch (error) {
            console.error('Error saving preferences:', error);
            return false;
        }
    };
    
    /**
     * Load user preferences from localStorage
     * @returns {Object} - User preferences object
     */
    const loadPreferences = () => {
        try {
            const savedPrefs = localStorage.getItem(STORAGE_KEY);
            if (savedPrefs) {
                return JSON.parse(savedPrefs);
            }
            return DEFAULT_PREFERENCES;
        } catch (error) {
            console.error('Error loading preferences:', error);
            return DEFAULT_PREFERENCES;
        }
    };
    
    /**
     * Reset user preferences to defaults
     * @returns {Object} - Default preferences object
     */
    const resetPreferences = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return DEFAULT_PREFERENCES;
        } catch (error) {
            console.error('Error resetting preferences:', error);
            return DEFAULT_PREFERENCES;
        }
    };
    
    /**
     * Update a single preference value
     * @param {string} key - Preference key
     * @param {string} value - New preference value
     * @returns {Object} - Updated preferences object
     */
    const updatePreference = (key, value) => {
        try {
            const currentPrefs = loadPreferences();
            const updatedPrefs = {
                ...currentPrefs,
                [key]: value
            };
            savePreferences(updatedPrefs);
            return updatedPrefs;
        } catch (error) {
            console.error('Error updating preference:', error);
            return loadPreferences();
        }
    };
    
    return {
        savePreferences,
        loadPreferences,
        resetPreferences,
        updatePreference,
        DEFAULT_PREFERENCES
    };
})();