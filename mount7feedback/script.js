document.addEventListener('DOMContentLoaded', () => {
    // ===== ELEMENT-REFERENZEN =====
    // Rating-Elemente
    const ratingContainer = document.getElementById('rating-container');
    const slider = document.getElementById('rating-slider');
    const smileyEmoji = document.getElementById('smiley-emoji');
    const ratingValueDisplay = document.getElementById('rating-value-display');
    const submitRatingBtn = document.getElementById('submit-rating-btn');

    // Inhaltsbereiche
    const improvementForm = document.getElementById('improvement-form');
    const positiveFeedback = document.getElementById('positive-feedback');

    // Kontaktdetails-Formular
    const contactYesRadio = document.getElementById('contact-yes');
    const contactNoRadio = document.getElementById('contact-no');
    const contactDetails = document.getElementById('contact-details');

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

    // Fenster-Größenänderung: Aktualisiert Smiley-Position bei Änderung der Fenstergröße
    window.addEventListener('resize', () => {
        updateSmileyPosition();
    });

    // 'Bewertung bestätigen' Button-Listener
    submitRatingBtn.addEventListener('click', () => {
        const rating = parseInt(slider.value);

        // Bewertungscontainer ausblenden
        ratingContainer.style.display = 'none';
        
        // Kurze Verzögerung und dann den entsprechenden Bereich einblenden
        setTimeout(() => {
            if (rating >= 1 && rating <= 7) {
                // Verbesserungsformular anzeigen
                improvementForm.style.display = 'block';
                improvementForm.classList.add('animate-fade-in');
            } else if (rating >= 8 && rating <= 10) {
                // Positives Feedback anzeigen
                positiveFeedback.style.display = 'block';
                positiveFeedback.classList.add('animate-fade-in');
                
                // Konfetti-Effekt mit Verzögerung
                setTimeout(createConfetti, 500);
            }
        }, 200);
    });

    // Kontakt-Optionen Radiobutton-Listener - KORRIGIERT
    if (contactYesRadio) {
        contactYesRadio.addEventListener('click', function() {
            console.log("Ja-Radio geklickt");
            if (contactDetails) {
                contactDetails.style.display = 'block';
            }
        });
    }

    if (contactNoRadio && contactDetails) {
        contactNoRadio.addEventListener('click', function() {
            console.log("Nein-Radio geklickt");
            contactDetails.style.display = 'none';
        });
    }

    // 'Feedback senden' Button-Listener
    const submitFeedbackBtn = document.getElementById('submit-feedback');
    if (submitFeedbackBtn) {
        submitFeedbackBtn.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Hier könnte in einer realen Anwendung ein Formular-Submit oder API-Aufruf erfolgen
            console.log('Feedback submitted (simulated).');
            
            // Bestätigungsmeldung anzeigen
            alert('Vielen Dank für dein Feedback!');
            
            // Optional: Zurück zur Startseite oder Formular zurücksetzen
            // window.location.reload();
        });
    }

    // ===== FUNKTIONEN =====
    // Aktualisiert Smiley-Emoji und Slider-Thumb-Farbe basierend auf der Bewertung
    function updateSmileyAndSlider(rating) {
        smileyEmoji.className = 'smiley-image';
        
        let iconName = iconNames[rating];
        let backgroundColor = 'var(--mount7-yellow-orange)';
        
        // Farbe basierend auf Bewertung setzen
        if (rating <= 2) {
            backgroundColor = 'var(--mount7-red-orange)';
        } else if (rating <= 4) {
            backgroundColor = 'var(--mount7-red-orange)';
        } else if (rating <= 6) {
            backgroundColor = 'var(--mount7-yellow-orange)';
        } else if (rating <= 8) {
            backgroundColor = 'var(--mount7-turquoise)';
        } else { // 9 oder 10
            backgroundColor = 'var(--mount7-blue)';
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
        const thumbWidth = 30; // Sollte der CSS-Breite des Thumbs entsprechen
        
        // Position berechnen - an genau der X-Position des Thumbs
        const thumbPosition = percentage * (sliderWidth - thumbWidth) + (thumbWidth / 2);
        
        // Den Smiley exakt über den Thumb positionieren
        smileyEmoji.style.left = `${thumbPosition}px`;
        smileyEmoji.style.transform = 'translateX(-50%)'; // Zentrieren des Smileys über dem Thumb
    }

    // Erstellt den Konfetti-Effekt für positive Bewertungen
    function createConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        if (!confettiContainer) return;
        
        confettiContainer.innerHTML = '';
        
        const colors = [
            '#002E40', // mount7-blue
            '#E5230C', // mount7-red-orange
            '#F2F0D0', // mount7-cream
            '#1F7373', // mount7-turquoise
            '#F3B05C'  // mount7-yellow-orange
        ];
        
        // 50 Konfetti-Elemente erstellen
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Zufällige Eigenschaften
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const size = Math.floor(Math.random() * 8) + 5; // 5-12px
            const shape = Math.random() > 0.5 ? '50%' : '0';
            
            // Stile anwenden
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}%`;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.borderRadius = shape;
            confetti.style.animationDelay = `${delay}s`;
            
            confettiContainer.appendChild(confetti);
        }
    }
});