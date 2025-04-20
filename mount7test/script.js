document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible (adjust sensitivity)
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: Stop observing the element once it's visible to save resources
                    observer.unobserve(entry.target);
                }
                // Optional: To re-animate if it scrolls out and back in (can be performance intensive)
                // else {
                //     entry.target.classList.remove('is-visible');
                // }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        console.log("Keine Elemente mit .animate-on-scroll für Animation gefunden.");
    }


    // --- Simple Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.contains('is-active');

            if (isActive) {
                 mainNav.classList.remove('is-active');
                 menuToggle.innerHTML = '<span class="iconify" data-icon="mdi-light:menu" data-inline="false"></span>';
                 menuToggle.setAttribute('aria-label', 'Menü öffnen');
                 menuToggle.setAttribute('aria-expanded', 'false');
                 document.body.style.overflow = ''; // Allow body scrolling
            } else {
                 mainNav.classList.add('is-active');
                 menuToggle.innerHTML = '<span class="iconify" data-icon="mdi-light:close" data-inline="false"></span>';
                 menuToggle.setAttribute('aria-label', 'Menü schließen');
                 menuToggle.setAttribute('aria-expanded', 'true');
                 document.body.style.overflow = 'hidden'; // Prevent body scrolling when menu is open
            }
        });

        // Close menu if a link is clicked (optional, good for single-page apps or #links)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                 if (mainNav.classList.contains('is-active')) {
                    mainNav.classList.remove('is-active');
                    menuToggle.innerHTML = '<span class="iconify" data-icon="mdi-light:menu" data-inline="false"></span>';
                    menuToggle.setAttribute('aria-label', 'Menü öffnen');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                 }
            });
        });

    } else {
         console.log("Mobile Menü Toggle oder Hauptnavigation nicht gefunden.");
    }


     // --- Carousel Placeholder Hint ---
     const carousels = document.querySelectorAll('.product-carousel, .blog-carousel');
     if (carousels.length > 0) {
        console.log(`Found ${carousels.length} carousel containers. Basic horizontal scroll is enabled via CSS. For full slider functionality (dots, arrows, touch swipe), consider integrating a JavaScript library like SwiperJS (https://swiperjs.com/) or Tiny Slider (https://github.com/ganlanyuan/tiny-slider).`);
     }

}); // End DOMContentLoaded