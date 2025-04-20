// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    // Initialisierungscode hier

    // --- Platzhalter für Initialisierung von Bibliotheken ---

    // Beispiel: AOS (Animate On Scroll) Initialisierung
    /*
    if (typeof AOS !== 'undefined') {
        AOS.init({
            // Konfiguration hier (z.B. duration, once, offset)
            duration: 800,
            once: true,
            offset: 150, // Trigger Animation 150px vor Erreichen des Elements
        });
        console.log('AOS initialized');
    } else {
        console.warn('AOS library not found. Scroll animations may not work.');
    }
    */

    // Beispiel: GSAP ScrollTrigger Initialisierung
    /*
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
         gsap.registerPlugin(ScrollTrigger);
         // Set up ScrollTrigger animations here
         console.log('GSAP ScrollTrigger initialized');
    } else {
        console.warn('GSAP or ScrollTrigger library not found. Complex animations may not work.');
    }
    */

    // Beispiel: Swiper (Testimonial/Service Carousel) Initialisierung
    /*
    if (typeof Swiper !== 'undefined') {
        const testimonialSwiper = new Swiper('.testimonial-carousel', {
            // Swiper Konfiguration hier
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination', // Optional: Pagination dots
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next', // Optional: Nav arrows
                prevEl: '.swiper-button-prev',
            },
            // Responsive breakpoints
            breakpoints: {
                640: { slidesPerView: 1 },
                768: { slidesPerView: 1 },
                1024: { slidesPerView: 1 },
            }
        });
        console.log('Testimonial Swiper initialized');

        // Similar setup for Service Explorer if using Swiper
        // const servicesSwiper = new Swiper('.service-cards-container', { ... });

    } else {
        console.warn('Swiper library not found. Carousels may not work.');
    }
    */


    // --- Platzhalter für benutzerdefinierte Interaktionen ---

    // Hamburger Menü Funktionalität (Mobile Navigation)
    const hamburgerButton = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerButton && navLinks) {
        hamburgerButton.addEventListener('click', () => {
            navLinks.classList.toggle('is-open'); // CSS-Klasse zum Anzeigen/Verbergen
            // Optional: Ändere das Hamburger-Icon
            const iconSpan = hamburgerButton.querySelector('.iconify');
            if (navLinks.classList.contains('is-open')) {
                 iconSpan.dataset.icon = 'feather:x'; // Beispiel: Schließen-Icon
            } else {
                 iconSpan.dataset.icon = 'feather:menu'; // Beispiel: Menü-Icon
            }
        });
        // Optional: Schließe Menü, wenn ein Link geklickt wird (für Single Page Apps)
        navLinks.querySelectorAll('a').forEach(link => {
             link.addEventListener('click', () => {
                 navLinks.classList.remove('is-open');
                  hamburgerButton.querySelector('.iconify').dataset.icon = 'feather:menu';
             });
        });
        console.log('Hamburger menu functionality added');
    }


    // KI Demo Tool Logik
    const kiDemoForm = document.querySelector('.ki-demo-tool form');
    const kiResultsDiv = document.querySelector('.ki-demo-tool .ki-results');

    if (kiDemoForm && kiResultsDiv) {
        kiDemoForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Verhindert das Neuladen der Seite
            const input = kiDemoForm.querySelector('input[type="text"]').value;

            if (input.trim() === '') {
                 kiResultsDiv.innerHTML = '<p style="color: orange;">Bitte geben Sie eine Beschreibung ein.</p>';
                 return;
            }

            // Ladeindikator anzeigen
            kiResultsDiv.innerHTML = '<p style="color: var(--color-indigo);">KI arbeitet...</p>';

            // Hier würde die tatsächliche KI-Integration/Logik stattfinden.
            // Dies ist ein Mock-Up/Platzhalter.
            console.log(`KI-Demo Anfrage: "${input}"`);

            // Simulierte Wartezeit für KI-Prozess
            setTimeout(() => {
                const mockResult = `Basierend auf "${input}": Vorschlag einer Farbpalette (z.B. Blau, Grün) und einiger Designelemente.`;
                kiResultsDiv.innerHTML = `<p>${mockResult}</p>`;
                // Optional: "Mit Herz verfeinern"-Button anzeigen
                // kiResultsDiv.innerHTML += '<button class="btn btn-secondary">Mit Herz verfeinern</button>';
                console.log('KI-Demo results displayed');
            }, 2000); // 2 Sekunden Verzögerung

        });
        console.log('KI Demo form listener added');
    }


    // Vorher/Nachher Slider Logik (Platzhalter)
    // Dies würde eine separate Bibliothek oder benutzerdefiniertes JS erfordern.
    /*
    const beforeAfterSliders = document.querySelectorAll('.before-after-slider');
    beforeAfterSliders.forEach(slider => {
        // Implementierung der Slider-Logik hier
        console.log('Placeholder for Before/After slider logic');
    });
    */

    // Akkordeon FAQ Logik (Platzhalter)
    // Dies würde JavaScript erfordern, um Abschnitte auf Klick ein- und auszuklappen.
    /*
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer'); // Dieses Element verstecken/anzeigen

        question.addEventListener('click', () => {
            // Toggle Klasse, um die Antwort anzuzeigen/verstecken
            // item.classList.toggle('is-open');
            // Optional: Icon ändern
        });
    });
    console.log('Placeholder for FAQ Accordion logic');
    */

    // Portfolio Filter Logik (Platzhalter)
    // Dies würde JavaScript erfordern, um Projekte basierend auf Filtern zu verstecken/anzeigen.
    /*
    const filterButtons = document.querySelectorAll('.portfolio-filter button');
    const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.dataset.filter; // z.B. data-filter="webdesign"

            portfolioItems.forEach(item => {
                const itemCategories = item.dataset.categories; // z.B. data-categories="webdesign branding"

                if (filterValue === 'all' || itemCategories.includes(filterValue)) {
                    item.style.display = 'block'; // Oder passendes Grid/Flex Layout
                    // Füge eine Animation hinzu (CSS Transition oder JS)
                } else {
                    item.style.display = 'none';
                }
            });

            // Update active filter button state
            filterButtons.forEach(btn => btn.classList.remove('is-active'));
            button.classList.add('is-active');

            console.log(`Filtered portfolio by: ${filterValue}`);
        });
    });
    console.log('Placeholder for Portfolio Filter logic');
    */


    // --- Ende der benutzerdefinierten Interaktionen ---

}); // Ende DOMContentLoaded

// Optional: Code, der global laufen muss (selten erforderlich)
console.log('Script file loaded.');