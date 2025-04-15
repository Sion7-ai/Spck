'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    // const customCursor = document.querySelector('.custom-cursor'); // --- AUSKOMMENTIERT ---
    // const interactiveElements = document.querySelectorAll('.interactive, a, button'); // Kann bleiben für andere Selektionen, aber nicht mehr für Cursor
    const menuToggle = document.getElementById('menuToggle');
    const overlayMenu = document.getElementById('overlayMenu');
    const closeMenu = document.getElementById('closeMenu');
    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    const scrollAnimatedElements = document.querySelectorAll('.scroll-animate');

    // let cursorTimeout; // --- AUSKOMMENTIERT ---

    // --- Custom Cursor Logic --- AUSKOMMENTIERT ---
    /*
    if (customCursor) {
        // body.classList.add('js-cursor'); // Add class to hide default cursor via CSS

        window.addEventListener('mousemove', (e) => {
             cancelAnimationFrame(cursorTimeout);
             cursorTimeout = requestAnimationFrame(() => {
                 customCursor.style.left = `${e.clientX}px`;
                 customCursor.style.top = `${e.clientY}px`;
             });
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('hovered');
            });
        });
         // Hide cursor if mouse leaves window
         document.addEventListener('mouseleave', () => {
             customCursor.style.opacity = '0';
         });
         document.addEventListener('mouseenter', () => {
             customCursor.style.opacity = '1';
         });
    } else {
        console.warn('Custom cursor element not found.');
    }
    */
    // --- ENDE Custom Cursor Logic ---

    // --- Overlay Menu Logic ---
    if (menuToggle && overlayMenu && closeMenu) {
        menuToggle.addEventListener('click', () => {
            overlayMenu.classList.add('active');
            body.classList.add('overlay-active'); // Prevent body scroll
        });

        closeMenu.addEventListener('click', () => {
            overlayMenu.classList.remove('active');
            body.classList.remove('overlay-active');
        });

        // Optional: Close menu when clicking a link inside
        overlayMenu.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                overlayMenu.classList.remove('active');
                body.classList.remove('overlay-active');
            });
        });
         // Optional: Close menu when clicking outside the nav (on the overlay background)
         overlayMenu.addEventListener('click', (e) => {
             // Nur schließen, wenn direkt auf das Overlay geklickt wird, nicht auf dessen Kinder (wie Text oder Links)
             if (e.target === overlayMenu) {
                 overlayMenu.classList.remove('active');
                 body.classList.remove('overlay-active');
             }
         });

    } else {
        console.warn('Menu elements not found (toggle, overlay, or close button).');
    }

    // --- Accordion Logic ---
    if (accordionToggles.length > 0) {
        accordionToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const item = toggle.closest('.accordion-item');
                const content = document.getElementById(toggle.getAttribute('aria-controls'));
                const icon = toggle.querySelector('.accordion-icon');
                const isOpen = item.classList.contains('open');

                // --- VERBESSERUNG: Andere schließen ---
                // Schließe alle anderen offenen Akkordeon-Elemente in DIESEM Akkordeon-Block
                const parentAccordion = toggle.closest('.accordion');
                if (parentAccordion) {
                    parentAccordion.querySelectorAll('.accordion-item.open').forEach(openItem => {
                        if (openItem !== item) { // Nur andere Elemente schließen
                            openItem.classList.remove('open');
                            const openContent = document.getElementById(openItem.querySelector('.accordion-toggle').getAttribute('aria-controls'));
                            const openIcon = openItem.querySelector('.accordion-icon');
                            // openContent.style.maxHeight = null; // CSS handhabt das Schließen
                            openItem.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'false');
                            if (openIcon) openIcon.setAttribute('data-icon', 'mdi:plus');
                        }
                    });
                }
                // --- ENDE VERBESSERUNG ---


                // Öffne/Schließe das aktuelle Element
                item.classList.toggle('open');
                toggle.setAttribute('aria-expanded', !isOpen);

                if (!isOpen) {
                    // Setze max-height nicht mehr explizit, CSS mit hohem Wert regelt das
                    // content.style.maxHeight = content.scrollHeight + 'px';
                    if (icon) icon.setAttribute('data-icon', 'mdi:minus'); // Geändertes Icon zu Minus
                } else {
                    // content.style.maxHeight = null; // CSS handhabt das Schließen
                    if (icon) icon.setAttribute('data-icon', 'mdi:plus');
                }
                  // Let Iconify re-render the icon if needed (sollte automatisch passieren, aber sicher ist sicher)
                 if (typeof Iconify !== 'undefined') {
                     Iconify.render();
                 }
            });
        });
    } else {
         console.warn('No accordion toggles found.');
    }


    // --- Scroll Animation Logic (Basic Intersection Observer) ---
    if ('IntersectionObserver' in window && scrollAnimatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Stop observing once visible (Performance)
                    // observer.unobserve(entry.target);
                }
                 // Optional: Remove class if element scrolls out of view (Animation bei jedem Scrollen)
                 // else {
                 //     entry.target.classList.remove('visible');
                 // }
            });
        }, {
            rootMargin: '0px 0px -50px 0px', // Trigger etwas früher (50px bevor es ganz im Viewport ist)
            threshold: 0.1  // Mind. 10% sichtbar
        });

        scrollAnimatedElements.forEach(el => {
            observer.observe(el);
        });
    } else if (scrollAnimatedElements.length > 0) {
        // Fallback for browsers without Intersection Observer (e.g., make all visible)
        scrollAnimatedElements.forEach(el => el.classList.add('visible'));
        console.warn('Intersection Observer not supported, scroll animations fallback applied.');
    }

    // --- Placeholder for Parallax Effect ---
    // const parallaxElement = document.querySelector('.parallax-placeholder');
    // if (parallaxElement) {
    //     window.addEventListener('scroll', () => {
    //         const scrollY = window.scrollY;
    //         // Adjust the 'top' or 'transform: translateY' property based on scrollY
    //         // Example: parallaxElement.style.transform = `translateY(${scrollY * 0.5}px)`;
    //         // Needs careful calculation based on element's position and desired speed
    //     });
    // }

});
