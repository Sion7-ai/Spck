'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const customCursor = document.querySelector('.custom-cursor');
    const interactiveElements = document.querySelectorAll('.interactive, a, button'); // Select all interactive elements
    const menuToggle = document.getElementById('menuToggle');
    const overlayMenu = document.getElementById('overlayMenu');
    const closeMenu = document.getElementById('closeMenu');
    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    const scrollAnimatedElements = document.querySelectorAll('.scroll-animate');

    let cursorTimeout;

    // --- Custom Cursor Logic ---
    if (customCursor) {
        body.classList.add('js-cursor'); // Add class to hide default cursor via CSS

        window.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smoother updates
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
             if (e.target === overlayMenu) { // Check if the click is directly on the overlay
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

                // Optional: Close other open items
                // accordionToggles.forEach(otherToggle => {
                //    if (otherToggle !== toggle) {
                //        const otherItem = otherToggle.closest('.accordion-item');
                //        const otherContent = document.getElementById(otherToggle.getAttribute('aria-controls'));
                //        const otherIcon = otherToggle.querySelector('.accordion-icon');
                //        if (otherItem.classList.contains('open')) {
                //            otherItem.classList.remove('open');
                //            otherContent.style.maxHeight = null; // Use null to reset to CSS value
                //            otherToggle.setAttribute('aria-expanded', 'false');
                //            otherIcon.setAttribute('data-icon', 'mdi:plus');
                //        }
                //    }
                // });


                item.classList.toggle('open');
                toggle.setAttribute('aria-expanded', !isOpen);

                if (!isOpen) {
                    // Set max-height for opening transition
                    // content.style.maxHeight = content.scrollHeight + 'px'; // Precise height
                    icon.setAttribute('data-icon', 'mdi:close');
                } else {
                    // Remove max-height for closing transition (CSS handles the 0)
                    // content.style.maxHeight = null;
                    icon.setAttribute('data-icon', 'mdi:plus');
                }
                  // Let Iconify re-render the icon if needed (might not be necessary)
                 Iconify.render();
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
                    // Optional: Stop observing once visible
                    // observer.unobserve(entry.target);
                }
                 // Optional: Remove class if element scrolls out of view
                 // else {
                 //     entry.target.classList.remove('visible');
                 // }
            });
        }, {
            rootMargin: '0px', // How close to viewport edge triggers?
            threshold: 0.1  // How much of the element needs to be visible (0 to 1)
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