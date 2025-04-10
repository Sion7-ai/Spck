document.addEventListener('DOMContentLoaded', function() {

    // --- Overlay Navigation ---
    const openNavBtn = document.getElementById('open-nav-btn');
    const closeNavBtn = document.getElementById('close-nav-btn');
    const overlayNav = document.getElementById('overlay-nav');

    if (openNavBtn && closeNavBtn && overlayNav) {
        openNavBtn.addEventListener('click', () => {
            overlayNav.classList.add('active');
            // Optional: Body scroll verhindern, wenn Overlay offen ist
            document.body.style.overflow = 'hidden';
        });

        closeNavBtn.addEventListener('click', () => {
            overlayNav.classList.remove('active');
             // Optional: Body scroll wieder erlauben
             document.body.style.overflow = '';
        });

        // Optional: Close nav when clicking a link inside
        overlayNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                overlayNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        // Optional: Close nav on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlayNav.classList.contains('active')) {
                 overlayNav.classList.remove('active');
                 document.body.style.overflow = '';
            }
        });
    }


    // --- Simple Hero Slider (Fade) ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlide = 0;
    const slideInterval = 5000; // Zeit in Millisekunden (5 Sekunden)

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length; // Loop back to start
        showSlide(currentSlide);
    }

    if (slides.length > 1) { // Only start slider if there's more than one slide
        // Initial slide is already set via HTML class 'active'
        // showSlide(currentSlide); // Show initial slide - not needed if set in HTML
        setInterval(nextSlide, slideInterval);
    }


    // --- Scroll to Top ---
    const scrollToTopLink = document.getElementById('scroll-to-top');

    if (scrollToTopLink) {
        scrollToTopLink.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor jump
            window.scrollTo({
                top: 0,
                // Smooth scroll behavior is set in CSS (html { scroll-behavior: smooth; })
            });
        });
    }

});