document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const ratingSection = document.getElementById('rating-section'); // Container for rating elements
    const slider = document.getElementById('rating-slider');
    const smileyEmoji = document.getElementById('smiley-emoji');
    const ratingValueDisplay = document.getElementById('rating-value-display'); // For screen readers
    const submitRatingBtn = document.getElementById('submit-rating-btn'); // The confirmation button

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

    // --- Event Listeners ---

    // Slider Listener: Updates smiley and thumb color
    slider.addEventListener('input', (event) => {
        const rating = parseInt(event.target.value);
        ratingValueDisplay.textContent = `Aktuelle Bewertung: ${rating}`; // Update accessibility text
        updateSmileyAndSlider(rating);
        
        // Update smiley position to match slider thumb
        updateSmileyPosition();
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
                        
                        // Create simple CSS confetti effect
                        setTimeout(() => {
                            const confettiContainer = document.getElementById('confetti-container');
                            if (confettiContainer) {
                                confettiContainer.innerHTML = ''; // Clear previous confetti
                                
                                const colors = [
                                    '#002E40', // mount7-blue
                                    '#E5230C', // mount7-red-orange
                                    '#F2F0D0', // mount7-cream
                                    '#1F7373', // mount7-turquoise
                                    '#F3B05C'  // Yellow-orange bleibt für confetti
                                ];
                                
                                // Create 50 confetti pieces
                                for (let i = 0; i < 50; i++) {
                                    const confetti = document.createElement('div');
                                    confetti.className = 'confetti';
                                    
                                    // Random position, color, delay and shape
                                    const color = colors[Math.floor(Math.random() * colors.length)];
                                    const left = Math.random() * 100;
                                    const delay = Math.random() * 2;
                                    const size = Math.floor(Math.random() * 8) + 5; // 5-12px
                                    const shape = Math.random() > 0.5 ? '50%' : '0';
                                    
                                    // Apply styles
                                    confetti.style.backgroundColor = color;
                                    confetti.style.left = `${left}%`;
                                    confetti.style.width = `${size}px`;
                                    confetti.style.height = `${size}px`;
                                    confetti.style.borderRadius = shape;
                                    confetti.style.animationDelay = `${delay}s`;
                                    
                                    confettiContainer.appendChild(confetti);
                                }
                            }
                        }, 300);
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

    // Updates smiley emoji and slider thumb color based on rating
    function updateSmileyAndSlider(rating) {
        // Add appropriate CSS classes to style the emoji based on rating
        smileyEmoji.className = 'smiley-image';
        
        let iconName = iconNames[rating];
        let backgroundColor = 'var(--mount7-yellow-orange)'; // Wieder zurück zum Original
        
        // Set icon and color based on rating
        if (rating <= 2) {
            backgroundColor = 'var(--mount7-red-orange)';
        } else if (rating <= 4) {
            backgroundColor = 'var(--mount7-red-orange)';
        } else if (rating <= 6) {
            backgroundColor = 'var(--mount7-yellow-orange)'; // Wieder zurück zum Original
        } else if (rating <= 8) {
            backgroundColor = 'var(--mount7-turquoise)';
        } else { // 9 or 10
            backgroundColor = 'var(--mount7-blue)';
        }
        
        // Update icon
        const iconElement = smileyEmoji.querySelector('.iconify');
        if (iconElement) {
            iconElement.setAttribute('data-icon', iconName);
        }
        
        // Update background colors
        smileyEmoji.style.backgroundColor = backgroundColor;
        smileyEmoji.style.color = backgroundColor; // Für den ::after Pfeil
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
        const thumbWidth = 30; // This should match the CSS width for the thumb
        
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
}); // End DOMContentLoaded