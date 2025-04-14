document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const ratingSection = document.getElementById('rating-section'); // Container for rating elements
    const slider = document.getElementById('rating-slider');
    const smileyEmoji = document.getElementById('smiley-emoji');
    const ratingValueDisplay = document.getElementById('rating-value-display'); // For screen readers
    const submitRatingBtn = document.getElementById('submit-rating-btn'); // The confirmation button
    const sliderNumbers = document.querySelector('.slider-numbers').children;

    const conditionalContent = document.getElementById('conditional-content'); // Container for next steps (the card)
    const improvementForm = document.getElementById('improvement-form');
    const positiveFeedback = document.getElementById('positive-feedback');

    const contactYesRadio = document.getElementById('contact-yes');
    const contactNoRadio = document.getElementById('contact-no');
    const contactDetails = document.getElementById('contact-details');
    
    // Fallback icon names for different ratings
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

    // Custom SVG emoji control
    const customSmileys = document.getElementById('custom-smileys');
    let useCustomSmileys = false;
    
    if (customSmileys && customSmileys.children.length > 0) {
        useCustomSmileys = true;
    }

    // --- Initial State ---
    // Ensure conditional content card and its children are hidden initially
    if (conditionalContent) {
        conditionalContent.classList.add('hidden');
        conditionalContent.classList.remove('visible');
    }
    
    if (improvementForm) {
        improvementForm.classList.add('hidden');
        improvementForm.classList.remove('visible');
    }
    
    if (positiveFeedback) {
        positiveFeedback.classList.add('hidden');
        positiveFeedback.classList.remove('visible');
    }
    
    if (contactDetails) {
        contactDetails.classList.add('hidden');
        contactDetails.classList.remove('visible');
    }

    // Update UI based on initial slider value
    updateSmileyAndSlider(parseInt(slider.value));
    
    // Update initial smiley position
    updateSmileyPosition();
    
    // Highlight active number in slider
    updateActiveNumber();
    
    // Add ripple effect to all buttons
    addRippleEffectToButtons();

    // --- Event Listeners ---

    // Slider Listener: Updates smiley and thumb color
    slider.addEventListener('input', (event) => {
        const rating = parseInt(event.target.value);
        ratingValueDisplay.textContent = `Aktuelle Bewertung: ${rating}`; // Update accessibility text
        updateSmileyAndSlider(rating);
        
        // Update smiley position to match slider thumb
        updateSmileyPosition();
        
        // Update active number
        updateActiveNumber();
    });

    // Window resize event to ensure smiley position is correct after window resizes
    window.addEventListener('resize', () => {
        updateSmileyPosition();
    });

    // Listener for the 'Submit Rating' Button
    submitRatingBtn.addEventListener('click', () => {
        const rating = parseInt(slider.value);

        // 1. Hide the entire rating section smoothly
        ratingSection.classList.add('hidden'); // Add class to trigger CSS transition

        // 2. Show the conditional content card smoothly
        if (conditionalContent) {
            conditionalContent.classList.remove('hidden');
            setTimeout(() => { // Ensure display:none is removed before adding class
                conditionalContent.classList.add('visible');

                // 3. Show the appropriate section inside the card
                setTimeout(() => {
                    if (rating >= 1 && rating <= 7) {
                        showSection(improvementForm);
                        hideSection(positiveFeedback, true); // Hide immediately if needed
                    } else if (rating >= 8 && rating <= 10) {
                        showSection(positiveFeedback);
                        hideSection(improvementForm, true); // Hide immediately if needed
                        
                        // Create upgraded confetti effect
                        setTimeout(createConfetti, 300);
                    }
                }, 50); // Short delay for child appearance after parent starts transition
            }, 10); // Small delay for parent visibility
        }
    });

    // Listener for 'Contact Yes/No' radios
    if (contactYesRadio) {
        contactYesRadio.addEventListener('change', (event) => {
            if (event.target.checked && contactDetails) {
                contactDetails.classList.remove('hidden');
                setTimeout(() => contactDetails.classList.add('visible'), 10);
            }
        });
    }

    if (contactNoRadio && contactDetails) {
        contactNoRadio.addEventListener('change', (event) => {
            if (event.target.checked) {
                contactDetails.classList.remove('visible');
                contactDetails.addEventListener('transitionend', () => {
                    if (!contactDetails.classList.contains('visible')) {
                        contactDetails.classList.add('hidden');
                    }
                }, { once: true });
                if (!contactDetails.classList.contains('visible')) {
                    setTimeout(() => contactDetails.classList.add('hidden'), 300);
                }
            }
        });
    }

    // Listener for the final 'Send Feedback' button
    const submitFeedbackBtn = document.getElementById('submit-feedback');
    if (submitFeedbackBtn) {
        submitFeedbackBtn.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Feedback submitted (simulated).');
            alert('Vielen Dank für dein Feedback!');
        });
    }

    // --- Functions ---
    
    // Funktion zum Aktualisieren der aktiven Zahl im Slider
    function updateActiveNumber() {
        const rating = parseInt(slider.value);
        
        // Entferne 'active' von allen Zahlen
        for (let span of sliderNumbers) {
            span.classList.remove('active');
        }
        
        // Füge 'active' zur aktuellen Zahl hinzu (Index ist rating-1, da rating von 1-10 geht)
        if (sliderNumbers[rating-1]) {
            sliderNumbers[rating-1].classList.add('active');
        }
    }

    // Button-Ripple-Effekt hinzufügen
    function addRippleEffectToButtons() {
        const buttons = document.querySelectorAll('button, .review-button');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                createRippleEffect(e, this);
            });
        });
    }
    
    // Erstellt den Ripple-Effekt auf Buttons
    function createRippleEffect(e, element) {
        const button = element || e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Updates smiley emoji and slider thumb color based on rating
    function updateSmileyAndSlider(rating) {
        // Clear existing content
        smileyEmoji.innerHTML = '';
        
        let backgroundColor = 'var(--mount7-yellow-orange)';
        
        // Set background color based on rating
        if (rating <= 2) {
            backgroundColor = 'var(--mount7-red-orange)';
        } else if (rating <= 4) {
            backgroundColor = 'var(--mount7-red-orange)';
        } else if (rating <= 6) {
            backgroundColor = 'var(--mount7-yellow-orange)';
        } else if (rating <= 8) {
            backgroundColor = 'var(--mount7-turquoise)';
        } else { // 9 or 10
            backgroundColor = 'var(--mount7-blue)';
        }
        
        // Update smiley with either custom SVG or iconify
        if (useCustomSmileys) {
            // Find appropriate custom SVG
            let targetRating;
            if (rating <= 2) targetRating = 1;
            else if (rating <= 4) targetRating = 3;
            else if (rating <= 6) targetRating = 5;
            else if (rating <= 8) targetRating = 7;
            else targetRating = 9;
            
            const targetSmiley = customSmileys.querySelector(`.custom-smiley[data-rating="${targetRating}"]`);
            
            if (targetSmiley) {
                smileyEmoji.appendChild(targetSmiley.cloneNode(true));
            } else {
                // Fallback to iconify
                const iconElement = document.createElement('span');
                iconElement.className = 'iconify';
                iconElement.setAttribute('data-icon', iconNames[rating]);
                iconElement.setAttribute('data-width', '42');
                iconElement.setAttribute('data-height', '42');
                smileyEmoji.appendChild(iconElement);
            }
        } else {
            // Use iconify (original behavior)
            const iconElement = document.createElement('span');
            iconElement.className = 'iconify';
            iconElement.setAttribute('data-icon', iconNames[rating]);
            iconElement.setAttribute('data-width', '42');
            iconElement.setAttribute('data-height', '42');
            smileyEmoji.appendChild(iconElement);
        }
        
        // Update background colors
        smileyEmoji.style.backgroundColor = backgroundColor;
        slider.style.setProperty('--slider-thumb-bg', backgroundColor);
    }

    // Function to update smiley position based on slider value
    function updateSmileyPosition() {
        if (!slider || !smileyEmoji) return;
        
        const sliderValue = parseInt(slider.value);
        const min = parseInt(slider.min);
        const max = parseInt(slider.max);
        const percentage = (sliderValue - min) / (max - min);
        
        const sliderWidth = slider.offsetWidth;
        const thumbWidth = 34; // Matches the CSS for the thumb
        
        // Calculate left position: percentage of slider width
        // Adjust for thumb width to center the emoji above the thumb
        const thumbPosition = percentage * (sliderWidth - thumbWidth) + thumbWidth / 2;
        smileyEmoji.style.left = thumbPosition + 'px';
    }

    // Function to show a specific section (improvement form or positive feedback)
    function showSection(element) {
        if (!element || element.classList.contains('visible')) return;
        element.classList.remove('hidden');
        element.style.display = 'block'; // Ensure display:block for transition
        setTimeout(() => { // Allow display change to register
             element.classList.add('visible');
        }, 10);
    }

    // Function to hide a specific section
    function hideSection(element, immediate = false) {
        if (!element || (!element.classList.contains('visible') && !immediate)) {
             // If not visible and not immediate hide, ensure it's correctly hidden
             if (!element.classList.contains('hidden')) {
                  element.classList.add('hidden');
                  element.style.display = 'none';
             }
             return;
        }

        if (immediate) {
            element.classList.remove('visible');
            element.classList.add('hidden');
            element.style.display = 'none';
        } else {
            element.classList.remove('visible');
            element.addEventListener('transitionend', () => {
                if (!element.classList.contains('visible')) {
                    element.classList.add('hidden');
                    element.style.display = 'none';
                }
            }, { once: true });
             // Fallback timeout
             setTimeout(() => {
                 if (!element.classList.contains('visible')) {
                     element.classList.add('hidden');
                     element.style.display = 'none';
                 }
             }, 550); // Match transition duration + buffer
        }
    }
    
    // Verbesserte Konfetti-Erzeugung
    function createConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        if (!confettiContainer) return;
        
        confettiContainer.innerHTML = ''; // Bestehende Konfetti löschen
        
        const colors = [
            '#002E40', // mount7-blue
            '#E5230C', // mount7-red-orange
            '#F2F0D0', // mount7-cream
            '#1F7373', // mount7-turquoise
            '#F3B05C'  // mount7-yellow-orange
        ];
        
        const shapes = ['square', 'rectangle', 'circle', 'triangle'];
        const speeds = ['slow', 'medium', 'fast'];
        const layers = ['front', 'middle', 'back'];
        
        // Erzeugt 80 Konfetti-Stücke
        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const speed = speeds[Math.floor(Math.random() * speeds.length)];
            const layer = layers[Math.floor(Math.random() * layers.length)];
            
            confetti.className = `confetti ${shape} ${speed} ${layer}`;
            
            // Position
            const left = Math.random() * 100; // Prozent
            const delay = Math.random() * 1.5; // Sekunden
            
            // Größe für nicht-dreieckige Formen anpassen
            if (shape !== 'triangle') {
                const size = Math.floor(Math.random() * 5) + 5; // 5-10px
                confetti.style.width = `${size}px`;
                confetti.style.height = shape === 'rectangle' ? `${size/2}px` : `${size}px`;
            }
            
            confetti.style.left = `${left}%`;
            confetti.style.animationDelay = `${delay}s`;
            
            // Farbe setzen (entweder direkt oder als Variable für Dreiecke)
            if (shape === 'triangle') {
                confetti.style.setProperty('--confetti-color', color);
            } else {
                confetti.style.backgroundColor = color;
            }
            
            confettiContainer.appendChild(confetti);
        }
    }
}); // End DOMContentLoaded