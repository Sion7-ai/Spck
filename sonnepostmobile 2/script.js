document.addEventListener('DOMContentLoaded', () => {

    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const siteHeader = document.querySelector('.site-header');
    const mainContent = document.getElementById('main-content');
    const body = document.body;

    // --- Menü Toggle ---
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpen);
            mobileMenu.classList.toggle('open');
            mobileMenu.setAttribute('aria-hidden', isOpen);
            siteHeader.classList.toggle('menu-open');
            body.style.overflow = isOpen ? '' : 'hidden'; // Verhindert Scrollen des Body bei offenem Menü

             // Optional: Inhalt leicht verschieben oder abdunkeln, wenn Menü offen ist
            // mainContent.classList.toggle('menu-open-push');
        });

        // Menü schließen, wenn auf einen Link geklickt wird
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('open');
                mobileMenu.setAttribute('aria-hidden', 'true');
                siteHeader.classList.remove('menu-open');
                body.style.overflow = '';
                 // mainContent.classList.remove('menu-open-push');
            });
        });
    }

    // --- Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (header && content) {
            header.addEventListener('click', () => {
                const isOpen = header.getAttribute('aria-expanded') === 'true';

                // Alle anderen Items schließen (optional)
                // accordionItems.forEach(otherItem => {
                //     if (otherItem !== item) {
                //         otherItem.classList.remove('open');
                //         otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                //         otherItem.querySelector('.accordion-content').style.maxHeight = '0';
                //         otherItem.querySelector('.accordion-content').style.paddingTop = '0';
                //          otherItem.querySelector('.accordion-content').style.paddingBottom = '0';
                //     }
                // });

                // Aktuelles Item togglen
                if (isOpen) {
                    header.setAttribute('aria-expanded', 'false');
                    item.classList.remove('open');
                    content.style.maxHeight = '0';
                     content.style.paddingTop = '0';
                    content.style.paddingBottom = '0';

                } else {
                    header.setAttribute('aria-expanded', 'true');
                    item.classList.add('open');
                    // Set max-height to the scroll height to allow transition
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.paddingTop = 'var(--spacing-s)'; // Padding wiederherstellen
                    content.style.paddingBottom = 'var(--spacing-m)';
                }
            });
        }
    });

    // --- Aktuelles Jahr im Footer/Hero ---
    const yearSpans = document.querySelectorAll('#current-year, #current-year-footer, #current-year-hero');
    const currentYear = new Date().getFullYear();
    yearSpans.forEach(span => {
        if(span) span.textContent = currentYear;
    });

     // --- Optional: Header-Hintergrund beim Scrollen ---
     /*
     const header = document.querySelector('.site-header');
     window.addEventListener('scroll', () => {
         if (window.scrollY > 50) { // Schwellenwert für Scrolltiefe
             header.classList.add('scrolled');
         } else {
             header.classList.remove('scrolled');
         }
     });
     */

});