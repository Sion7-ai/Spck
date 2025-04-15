document.addEventListener('DOMContentLoaded', () => {
    // ===== ELEMENT-REFERENZEN =====
    // Rating-Karten
    const ratingCard = document.getElementById('rating-card');
    const improvementForm = document.getElementById('improvement-form');
    const positiveFeedback = document.getElementById('positive-feedback');
    
    // Rating-Elemente
    const slider = document.getElementById('rating-slider');
    const smileyEmoji = document.getElementById('smiley-emoji');
    const ratingValueDisplay = document.getElementById('rating-value-display');
    const submitRatingBtn = document.getElementById('submit-rating-btn');
    
    // Formular-Elemente
    const contactYesRadio = document.getElementById('contact-yes');
    const contactNoRadio = document.getElementById('contact-no');
    const contactDetails = document.getElementById('contact-details');
    const submitFeedbackBtn = document.getElementById('submit-feedback');
    
    // ===== KONFIGURATION =====
    // Icon-Namen für verschiedene Bewertungsstufen
    const iconNames = {
        1: 'material-symbols:sentiment-very-dissatisfied-outline',
        2: 'material-symbols:sentiment-very-dissatisfied-outline',
        3: 'material-symbols:sentiment-dissatisfied-outline',
        4: 'material-symbols:sentiment-dissatisfied-outline',
        5: 'material-symbols:sentiment-neutral-outline',
        6: 'material-symbols:sentiment-neutral-outline',
        7: 'material-symbols:sentiment-satisfied-outline',
        8: 'material-symbols:sentiment-satisfied-outline',
        9: 'material-symbols:sentiment-very-satisfied-outline',
        10: 'material-symbols:sentiment-very-satisfied-outline'
    };

    // ===== INITIALER ZUSTAND =====
    // Initialisiere UI basierend auf dem Standardwert des Sliders
    updateSmileyAndSlider(parseInt(slider.value));
    updateSmileyPosition();

    // ===== EVENT-LISTENER =====
    // Slider-Listener: Aktualisiert Smiley und Farbe
    slider.addEventListener('input', (event) => {
        const rating = parseInt(event.target.value);
        ratingValueDisplay.textContent = `Aktuelle Bewertung: ${rating}`;
        updateSmileyAndSlider(rating);
        updateSmileyPosition();
    });

    // Fenster-Größenänderung: Aktualisiert Smiley-Position
    window.addEventListener('resize', () => {
        updateSmileyPosition();
    });

    // 'Bewertung bestätigen' Button-Listener
    submitRatingBtn.addEventListener('click', () => {
        const rating = parseInt(slider.value);

        // Rating-Karte ausblenden
        ratingCard.style.display = 'none';

        // Entsprechende Folgeseite anzeigen
        if (rating >= 1 && rating <= 7) {
            // Verbesserungsvorschläge Formular anzeigen
            improvementForm.classList.add('visible');
        } else {
            // Positive Bewertung Dialog anzeigen
            positiveFeedback.classList.add('visible');
        }
    });

    // Kontakt-Optionen Radiobutton-Listener
    if (contactYesRadio && contactNoRadio) {
        contactYesRadio.addEventListener('change', () => {
            if (contactYesRadio.checked) {
                contactDetails.classList.add('visible');
            }
        });

        contactNoRadio.addEventListener('change', () => {
            if (contactNoRadio.checked) {
                contactDetails.classList.remove('visible');
            }
        });
    }

    // 'Feedback senden' Button-Listener
    if (submitFeedbackBtn) {
        submitFeedbackBtn.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Formular auslesen
            const feedbackText = document.getElementById('feedback-text').value;
            const contactWanted = contactYesRadio.checked;
            let customerName = '';
            let customerEmail = '';
            
            if (contactWanted) {
                customerName = document.getElementById('customer-name').value;
                customerEmail = document.getElementById('customer-email').value;
            }
            
            // Hier könnte in einer realen Anwendung ein Formular-Submit oder API-Aufruf erfolgen
            console.log('Feedback submitted:', {
                feedback: feedbackText,
                contactWanted,
                customerName,
                customerEmail
            });
            
            // Bestätigungsmeldung anzeigen
            alert('Vielen Dank für dein Feedback!');
            
            // Formular zurücksetzen und ausblenden
            improvementForm.classList.remove('visible');
            
            // Zum positiven Feedback wechseln (optional)
            setTimeout(() => {
                positiveFeedback.classList.add('visible');
            }, 300);
        });
    }

    // ===== FUNKTIONEN =====
    // Aktualisiert Smiley-Emoji und Slider-Thumb-Farbe basierend auf der Bewertung
    function updateSmileyAndSlider(rating) {
        let iconName = iconNames[rating];
        let backgroundColor = '#F3B05C'; // Default = yellow-orange
        
        // Farbe basierend auf Bewertung setzen
        if (rating <= 2) {
            backgroundColor = '#E5230C'; // red-orange
        } else if (rating <= 4) {
            backgroundColor = '#E5230C'; // red-orange
        } else if (rating <= 6) {
            backgroundColor = '#F3B05C'; // yellow-orange
        } else if (rating <= 8) {
            backgroundColor = '#1F7373'; // turquoise
        } else { // 9 oder 10
            backgroundColor = '#002E40'; // blue
        }
        
        // Icon aktualisieren
        const iconElement = smileyEmoji.querySelector('.iconify');
        if (iconElement) {
            iconElement.setAttribute('data-icon', iconName);
        }
        
        // Hintergrundfarben aktualisieren
        smileyEmoji.style.backgroundColor = backgroundColor;
        smileyEmoji.style.color = backgroundColor; // Für den ::after Pfeil
        slider.style.setProperty('--slider-thumb-bg', backgroundColor);
    }

    // Aktualisiert die Smiley-Position basierend auf dem Slider-Wert
    function updateSmileyPosition() {
        if (!slider || !smileyEmoji) return;
        
        const sliderValue = parseInt(slider.value);
        const min = parseInt(slider.min);
        const max = parseInt(slider.max);
        const percentage = (sliderValue - min) / (max - min);
        
        const sliderWidth = slider.offsetWidth;
        const thumbWidth = 20; // Sollte der CSS-Breite des Thumbs entsprechen
        
        // Position berechnen - an genau der X-Position des Thumbs
        const thumbPosition = percentage * (sliderWidth - thumbWidth) + (thumbWidth / 2);
        
        // Den Smiley exakt über den Thumb positionieren
        smileyEmoji.style.left = `${thumbPosition}px`;
        smileyEmoji.style.transform = 'translateX(-50%)'; // Zentrieren des Smileys
    }
});
