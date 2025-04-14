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

    // Fallback emoji for different ratings
    const emojis = {
        1: '😠', 2: '😠', 
        3: '🙁', 4: '🙁', 
        5: '😐', 6: '😐', 
        7: '🙂', 8: '🙂', 
        9: '😄', 10: '😄'
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

    // --- Event Listeners ---

    // Slider Listener: Updates smiley and thumb color
    slider.addEventListener('input', (event) => {
        const rating = parseInt(event.target.value);
        ratingValueDisplay.textContent = `Aktuelle Bewertung: ${rating}`; // Update accessibility text
        updateSmileyAndSlider(rating);
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
        
        // Set emoji content and style based on rating
        if (rating <= 2) {
            smileyEmoji.innerHTML = emojis[1];
            smileyEmoji.style.background = 'linear-gradient(to bottom, #ffadad, #ff6666)';
            slider.style.setProperty('--slider-thumb-bg', 'var(--mount7-red-orange)');
        } else if (rating <= 4) {
            smileyEmoji.innerHTML = emojis[3];
            smileyEmoji.style.background = 'linear-gradient(to bottom, #ffbf87, #ff9248)';
            slider.style.setProperty('--slider-thumb-bg', 'var(--mount7-red-orange)');
        } else if (rating <= 6) {
            smileyEmoji.innerHTML = emojis[5];
            smileyEmoji.style.background = 'linear-gradient(to bottom, #ffda6a, #ff9a3c)';
            slider.style.setProperty('--slider-thumb-bg', 'var(--mount7-yellow-orange)');
        } else if (rating <= 8) {
            smileyEmoji.innerHTML = emojis[7];
            smileyEmoji.style.background = 'linear-gradient(to bottom, #a8deb5, #65c984)';
            slider.style.setProperty('--slider-thumb-bg', 'var(--mount7-turquoise)');
        } else { // 9 or 10
            smileyEmoji.innerHTML = emojis[9];
            smileyEmoji.style.background = 'linear-gradient(to bottom, #86c5da, #4a9cc1)';
            slider.style.setProperty('--slider-thumb-bg', 'var(--mount7-blue)');
        }
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