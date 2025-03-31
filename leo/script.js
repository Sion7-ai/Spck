// Warte bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // ================ Interaktives Buch ================
    const bookPage = document.getElementById('page1');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    let isFlipped = false;

    // Buchseite umblättern
    function togglePage() {
        isFlipped = !isFlipped;
        bookPage.style.transform = isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';
    }

    // Event-Listener für Umblättern
    if (bookPage && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', function() {
            if (!isFlipped) togglePage();
        });
        
        prevBtn.addEventListener('click', function() {
            if (isFlipped) togglePage();
        });
        
        bookPage.addEventListener('click', togglePage);
    }

    // ================ Testimonial Slider ================
    const testimonialContainer = document.querySelector('.testimonial-container');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const prevTestimonial = document.querySelector('.prev-testimonial');
    const nextTestimonial = document.querySelector('.next-testimonial');
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.testimonial-card').length;

    // Slider zu bestimmtem Slide bewegen
    function goToSlide(slideIndex) {
        if (testimonialContainer) {
            currentSlide = slideIndex;
            testimonialContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Aktiven Dot markieren
            sliderDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
    }

    // Event-Listener für Slider-Dots
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Event-Listener für Slider-Navigation
    if (prevTestimonial && nextTestimonial) {
        prevTestimonial.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlide);
        });
        
        nextTestimonial.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        });
    }

    // ================ Vorschau-Miniaturen ================
    const previewPages = document.querySelectorAll('.preview-page');
    const previewMainImage = document.querySelector('.preview-main-image');
    const pageDots = document.querySelectorAll('.page-dot');

    // Event-Listener für Vorschau-Miniaturen
    previewPages.forEach((page, index) => {
        page.addEventListener('click', function() {
            if (previewMainImage) {
                // Bild in der Hauptvorschau ändern
                const imgSrc = this.querySelector('img').src;
                previewMainImage.src = imgSrc;
                
                // Aktiven Dot markieren
                pageDots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        });
    });

    // Event-Listener für Seitendots
    pageDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            if (previewPages[index] && previewMainImage) {
                // Entsprechende Miniatur simulieren klicken
                const imgSrc = previewPages[index].querySelector('img').src;
                previewMainImage.src = imgSrc;
                
                // Aktiven Dot markieren
                pageDots.forEach((d, i) => {
                    d.classList.toggle('active', i === index);
                });
            }
        });
    });

    // ================ FAQ Accordion ================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle aktives FAQ-Item
            const isActive = item.classList.contains('active');
            
            // Alle anderen FAQ-Items schließen
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Wenn das angeklickte Item nicht bereits aktiv war, öffnen
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ================ Countdown-Timer ================
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');

    // Endzeit für den Countdown (3 Tage ab jetzt)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);

    function updateCountdown() {
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) {
            // Countdown ist abgelaufen
            if (daysElement) daysElement.textContent = '00';
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
            if (secondsElement) secondsElement.textContent = '00';
            return;
        }
        
        // Berechne Tage, Stunden, Minuten und Sekunden
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Füge führende Nullen hinzu
        const formatValue = value => value < 10 ? `0${value}` : value;
        
        // Update DOM-Elemente
        if (daysElement) daysElement.textContent = formatValue(days);
        if (hoursElement) hoursElement.textContent = formatValue(hours);
        if (minutesElement) minutesElement.textContent = formatValue(minutes);
        if (secondsElement) secondsElement.textContent = formatValue(seconds);
    }

    // Initialen Countdown-Wert anzeigen und dann alle Sekunde aktualisieren
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ================ Popup-Handling ================
    const exitPopup = document.getElementById('exit-popup');
    const closePopupBtn = document.querySelector('.close-popup');
    let showExitPopup = true;

    // Mausposition verfolgen, um Exit-Intent zu erkennen
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY < 50 && showExitPopup && exitPopup) {
            exitPopup.classList.add('active');
            showExitPopup = false; // Popup nur einmal anzeigen
        }
    });

    // Popup schließen
    if (closePopupBtn && exitPopup) {
        closePopupBtn.addEventListener('click', function() {
            exitPopup.classList.remove('active');
        });
    }

    // ================ Cookie-Banner ================
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookieBtn = document.getElementById('cookie-accept');
    const declineCookieBtn = document.getElementById('cookie-decline');

    // Cookie-Banner anzeigen, wenn Cookies nicht akzeptiert wurden
    if (!localStorage.getItem('cookiesAccepted') && cookieBanner) {
        setTimeout(() => {
            cookieBanner.classList.add('active');
        }, 2000);
    }

    // Event-Listener für Cookie-Buttons
    if (acceptCookieBtn) {
        acceptCookieBtn.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('active');
        });
    }

    if (declineCookieBtn) {
        declineCookieBtn.addEventListener('click', function() {
            localStorage.setItem('cookiesDeclined', 'true');
            cookieBanner.classList.remove('active');
        });
    }

    // ================ Back-to-Top Button ================
    const backToTopBtn = document.getElementById('back-to-top');

    // Beim Scrollen den Button anzeigen/ausblenden
    window.addEventListener('scroll', function() {
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }
    });

    // Beim Klicken nach oben scrollen
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ================ Scroll-Animationen ================
    // Animiere Elemente beim Scrollen ins Sichtfeld
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
    
    // Observer für Scroll-Animationen
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Setze anfängliche Styles und beobachte Elemente
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });

    // ================ Scroll zu Abschnitten ================
    // Smooth Scroll zu Abschnitten bei Klick auf Navigationslinks
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset für Header
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================ Shopping Cart ================
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    const buyButtons = document.querySelectorAll('.btn-primary');
    let cartItems = 0;

    // Produkte zum Warenkorb hinzufügen
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Wenn der Button einen Link hat, verhindern dass dieser ausgeführt wird
            if (this.getAttribute('href') === '#pricing') {
                e.preventDefault();
            }
            
            cartItems++;
            if (cartCount) {
                cartCount.textContent = cartItems;
                
                // Animiere den Warenkorb
                cartIcon.classList.add('pulse-animation');
                setTimeout(() => {
                    cartIcon.classList.remove('pulse-animation');
                }, 1000);
                
                // Zeige Bestätigung
                showNotification('Produkt wurde zum Warenkorb hinzugefügt!');
            }
        });
    });

    // ================ Benachrichtigungen ================
    function showNotification(message) {
        // Erstelle Benachrichtigungselement, wenn es noch nicht existiert
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
            
            // Style für die Benachrichtigung
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = 'var(--secondary-color)';
            notification.style.color = 'white';
            notification.style.padding = '1rem';
            notification.style.borderRadius = 'var(--border-radius)';
            notification.style.boxShadow = 'var(--box-shadow)';
            notification.style.zIndex = '1000';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }
        
        // Nachricht setzen und anzeigen
        notification.textContent = message;
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
        
        // Nach einigen Sekunden ausblenden
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
        }, 3000);
    }

    // Initialisiere die Seite mit GSAP-Animationen (falls verfügbar)
    if (typeof gsap !== 'undefined') {
        // Header-Animation
        gsap.from('header', { 
            y: -100, 
            opacity: 0, 
            duration: 1, 
            ease: 'power3.out' 
        });
        
        // Hero-Animation
        gsap.from('.hero-text > *', { 
            y: 50, 
            opacity: 0, 
            duration: 1, 
            stagger: 0.2, 
            ease: 'power3.out' 
        });
        
        // Buchanimation
        gsap.from('.book-wrapper', { 
            scale: 0.8, 
            opacity: 0, 
            duration: 1.5, 
            delay: 0.5,
            ease: 'elastic.out(1, 0.5)' 
        });
    }
});
