document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('rating-slider');
    const smileyIcon = document.getElementById('smiley-icon');
    const ratingValueDisplay = document.getElementById('rating-value-display'); // For screen readers

    const improvementForm = document.getElementById('improvement-form');
    const positiveFeedback = document.getElementById('positive-feedback');
    const conditionalContent = document.getElementById('conditional-content');

    const contactYesRadio = document.getElementById('contact-yes');
    const contactDetails = document.getElementById('contact-details');

    // --- Initial State ---
    // Hide conditional sections initially using JS after CSS might have loaded
    improvementForm.classList.add('hidden');
    improvementForm.classList.remove('visible');
    positiveFeedback.classList.add('hidden');
    positiveFeedback.classList.remove('visible');
    contactDetails.classList.add('hidden');
    contactDetails.classList.remove('visible');

    // Update UI based on initial slider value
    updateFeedbackUI(parseInt(slider.value));

    // --- Event Listeners ---
    slider.addEventListener('input', (event) => {
        const rating = parseInt(event.target.value);
        updateFeedbackUI(rating);
    });

    contactYesRadio.addEventListener('change', (event) => {
        if (event.target.checked) {
            contactDetails.classList.remove('hidden');
            // Trigger transition
            requestAnimationFrame(() => {
                 contactDetails.classList.add('visible');
            });
        }
    });

    document.getElementById('contact-no').addEventListener('change', (event) => {
        if (event.target.checked) {
            contactDetails.classList.remove('visible');
            // Optional: Add slight delay before adding hidden if needed for transition out
            setTimeout(() => {
                 contactDetails.classList.add('hidden');
            }, 300); // Match transition duration
        }
    });

    // Prevent default form submission for demo
    document.getElementById('submit-feedback').addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Feedback submitted (simulated).');
        // Here you would typically send the data to a server
        alert('Vielen Dank für dein Feedback!');
        // Optionally reset the form or redirect
    });


    // --- Functions ---
    function updateFeedbackUI(rating) {
        // Update screen reader text
        ratingValueDisplay.textContent = `Aktuelle Bewertung: ${rating}`;

        // Update smiley icon and slider thumb color
        updateSmileyAndSlider(rating);

        // Show/Hide conditional content sections with transition
        if (rating >= 1 && rating <= 7) {
            showSection(improvementForm);
            hideSection(positiveFeedback);
        } else if (rating >= 8 && rating <= 10) {
            showSection(positiveFeedback);
            hideSection(improvementForm);
        } else {
            // Hide both if rating is somehow invalid (e.g., initial state before interaction)
             hideSection(improvementForm);
             hideSection(positiveFeedback);
        }
    }

    function updateSmileyAndSlider(rating) {
        let iconName = 'material-symbols:sentiment-neutral-outline';
        let iconColor = 'var(--smiley-color-mid)';
        let thumbColor = 'var(--mount7-yellow-orange)'; // Default to mid

        // Define rating thresholds and corresponding styles
        if (rating <= 2) {
            iconName = 'material-symbols:sentiment-very-dissatisfied-outline'; // Very sad
            iconColor = 'var(--smiley-color-low)';
            thumbColor = 'var(--mount7-red-orange)';
        } else if (rating <= 4) {
            iconName = 'material-symbols:sentiment-dissatisfied-outline'; // Sad
            iconColor = 'var(--smiley-color-low)';
            thumbColor = 'var(--mount7-red-orange)';
        } else if (rating <= 6) {
            iconName = 'material-symbols:sentiment-neutral-outline'; // Neutral
            iconColor = 'var(--smiley-color-mid)';
            thumbColor = 'var(--mount7-yellow-orange)';
        } else if (rating <= 8) {
            iconName = 'material-symbols:sentiment-satisfied-outline'; // Happy
            iconColor = 'var(--smiley-color-high)';
            thumbColor = 'var(--mount7-turquoise)';
        } else { // Rating 9 or 10
            iconName = 'material-symbols:sentiment-very-satisfied-outline'; // Very happy
            iconColor = 'var(--smiley-color-very-high)';
            thumbColor = 'var(--mount7-blue)';
        }

        // Update Iconify icon data attribute which triggers Iconify to load the new icon
        smileyIcon.setAttribute('data-icon', iconName);
        // Update icon color directly via style attribute for smooth transition
        smileyIcon.style.color = iconColor;

        // Update slider thumb color via CSS variable for smooth transition
        slider.style.setProperty('--slider-thumb-bg', thumbColor);
    }

    function showSection(element) {
        if (element.classList.contains('hidden') || !element.classList.contains('visible')) {
             element.classList.remove('hidden');
             // Use requestAnimationFrame to ensure 'display: none' is removed before adding 'visible' class for transition
             requestAnimationFrame(() => {
                requestAnimationFrame(() => { // Double RAF can sometimes help ensure rendering before transition starts
                     element.classList.add('visible');
                });
             });
        }
    }

    function hideSection(element) {
         if (element.classList.contains('visible')) {
             element.classList.remove('visible');
             // Add 'hidden' class after the transition completes
             element.addEventListener('transitionend', () => {
                 // Only add hidden if it's still meant to be hidden (prevent race conditions)
                 if (!element.classList.contains('visible')) {
                     element.classList.add('hidden');
                 }
             }, { once: true }); // Use 'once' to automatically remove the listener
         } else {
             // If it wasn't visible, ensure it's hidden immediately
             element.classList.add('hidden');
         }
    }

}); // End DOMContentLoaded