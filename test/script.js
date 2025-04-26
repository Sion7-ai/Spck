document.addEventListener('DOMContentLoaded', () => {

    // --- Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const body = document.body;

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('menu-open');
            // Optional: Focus management for accessibility can be added here
        });
    }

    // --- Rotating Text in "Specializing In" Section ---
    const rotatingTextElement = document.getElementById('rotatingText');
    const words = ["BOLD", "Unexpected", "ETHICAL", "Growing"];
    let currentWordIndex = 0;

    function updateRotatingText() {
        if (!rotatingTextElement) return;

        const currentWord = words[currentWordIndex];
        const nextWordIndex = (currentWordIndex + 1) % words.length;
        const nextWord = words[nextWordIndex];

        // Add exit animation class
        rotatingTextElement.classList.add('exit');

        // After exit animation duration, change text and start enter animation
        setTimeout(() => {
            rotatingTextElement.textContent = nextWord;
            rotatingTextElement.classList.remove('exit');
            rotatingTextElement.classList.add('enter');

             // Remove enter class after animation to reset state
             setTimeout(() => {
                 rotatingTextElement.classList.remove('enter');
             }, 300); // Match CSS transition duration

            currentWordIndex = nextWordIndex;
        }, 300); // Match CSS transition duration
    }

    if (rotatingTextElement) {
        // Initial setup if needed
         rotatingTextElement.textContent = words[0];
         // Start the rotation interval
        setInterval(updateRotatingText, 2000); // Change word every 2 seconds (1.5s visible + 0.5s transition)
    }


    // --- Simple Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after reveal to save resources
                // observer.unobserve(entry.target);
            }
            // Optional: Add logic to remove 'is-visible' when scrolling back up
            // else {
            //     entry.target.classList.remove('is-visible');
            // }
        });
    }, {
        root: null, // Use the viewport as the root
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Work List Item Hover Effect (Arrow Move) ---
    // This is handled purely by CSS :hover pseudo-class in this implementation.
    // If more complex JS interaction was needed on hover, it would go here.

});