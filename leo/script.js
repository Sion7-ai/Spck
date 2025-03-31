// Warte bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // ==================== GLOBALE VARIABLEN ====================
    // Variablen für verschiedene UI-Elemente
    const header = document.querySelector('header');
    const backToTopBtn = document.getElementById('back-to-top');
    const bookWrapper = document.getElementById('book-wrapper');
    const heroSection = document.getElementById('hero');
    const cookieBanner = document.getElementById('cookie-banner');
    const exitPopup = document.getElementById('exit-popup');
    const shadowOverlay = document.getElementById('shadow-overlay');
    const miniGame = document.getElementById('toothbrush-game');

    // ==================== INTERAKTIVE ELEMENTE ====================
    
    // Maus-Trail-Effekt
    function createMouseTrail() {
        const body = document.querySelector('body');
        
        body.addEventListener('mousemove', function(e) {
            if (Math.random() > 0.94) { // Nur gelegentlich Effekte erzeugen
                const trail = document.createElement('div');
                trail.className = 'mouse-trail';
                
                // Zufällige Farbe aus Theme-Farben
                const colors = ['#FF9D2E', '#4ECDC4', '#FF6B6B', '#FEE440', '#9B5DE5'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                trail.style.left = e.pageX + 'px';
                trail.style.top = e.pageY + 'px';
                trail.style.backgroundColor = randomColor;
                
                body.appendChild(trail);
                
                // Animation und Entfernung
                setTimeout(function() {
                    trail.style.opacity = '0';
                    trail.style.transform = 'scale(2) translateY(-20px)';
                    
                    setTimeout(function() {
                        body.removeChild(trail);
                    }, 500);
                }, 10);
            }
        });
    }
    
    // Funkeneffekt für die Buttons
    function addSparkleEffect() {
        const primaryButtons = document.querySelectorAll('.btn-primary');
        
        primaryButtons.forEach(button => {
            button.addEventListener('mouseenter', createSparkles);
        });
        
        function createSparkles(e) {
            const button = e.target;
            const rect = button.getBoundingClientRect();
            
            for (let i = 0; i < 15; i++) {
                createSparkle(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
            }
        }
        
        function createSparkle(x, y) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            // Zufällige Farbe
            const colors = ['#FFD700', '#FF9D2E', '#FFBA6B'];
            sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Zufällige Größe
            const size = 3 + Math.random() * 4;
            sparkle.style.width = size + 'px';
            sparkle.style.height = size + 'px';
            
            document.body.appendChild(sparkle);
            
            // Animation und Entfernung
            setTimeout(() => {
                sparkle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * -100}px) scale(0)`;
                sparkle.style.opacity = '0';
                
                setTimeout(() => {
                    document.body.removeChild(sparkle);
                }, 500);
            }, 10);
        }
    }
    
    // GSAP-Animationen für Seitenelemente
    function initGSAPAnimations() {
        if (typeof gsap !== 'undefined') {
            // Hero-Sektion-Animation
            gsap.from('.hero-text > *', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out'
            });
            
            gsap.from('.book-wrapper', {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: 'back.out(1.7)'
            });
            
            gsap.from('.float-element', {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            });
            
            // Feature-Cards-Animation bei Scroll
            const featureCards = document.querySelectorAll('.feature-card');
            
            gsap.set(featureCards, { y: 50, opacity: 0 });
            
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            gsap.to(entry.target, {
                                y: 0,
                                opacity: 1,
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: 'back.out(1.5)'
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            
            featureCards.forEach(card => {
                observer.observe(card);
            });
        }
    }
    
    // ==================== INTERAKTIVES BUCH ====================
    
    // 3D-Buch-Tilt-Effekt
    function init3DBookEffect() {
        if (bookWrapper && heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((mouseX - centerX) / centerX) * 15;
                const rotateX = ((centerY - mouseY) / centerY) * 10;
                
                bookWrapper.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            });
            
            heroSection.addEventListener('mouseleave', () => {
                bookWrapper.style.transform = 'rotateY(0deg) rotateX(0deg)';
            });
            
            // Klickeffekt für das Buch
            bookWrapper.addEventListener('click', () => {
                bookWrapper.classList.add('book-active');
                
                setTimeout(() => {
                    bookWrapper.classList.remove('book-active');
                }, 500);
            });
        }
    }
    
    // ==================== BUCH-VORSCHAU-SEKTION ====================
    
    // Verbesserte Buchvorschau-Interaktion
    function initBookPreview() {
        const previewPages = document.querySelectorAll('.preview-page');
        const previewMainImage = document.querySelector('.preview-main-image');
        const pageDots = document.querySelectorAll('.page-dot');
        
        if (previewPages.length && previewMainImage) {
            // Setze die erste Seite als aktiv
            previewPages[0].classList.add('active');
            
            // Event-Listener für die Vorschau-Seiten
            previewPages.forEach((page, index) => {
                page.addEventListener('click', function() {
                    // Aktive Seite aktualisieren
                    previewPages.forEach(p => p.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Haupt-Bild aktualisieren mit Animation
                    const imgSrc = this.querySelector('img').src;
                    
                    if (typeof gsap !== 'undefined') {
                        gsap.to(previewMainImage, {
                            opacity: 0,
                            rotationY: -90,
                            duration: 0.3,
                            onComplete: () => {
                                previewMainImage.src = imgSrc;
                                gsap.to(previewMainImage, {
                                    opacity: 1,
                                    rotationY: 0,
                                    duration: 0.3
                                });
                            }
                        });
                    } else {
                        // Fallback ohne GSAP
                        previewMainImage.style.opacity = '0';
                        setTimeout(() => {
                            previewMainImage.src = imgSrc;
                            previewMainImage.style.opacity = '1';
                        }, 300);
                    }
                    
                    // Aktiven Punkt aktualisieren
                    pageDots.forEach(dot => dot.classList.remove('active'));
                    pageDots[index].classList.add('active');
                });
            });
            
            // Event-Listener für die Punkte-Navigation
            pageDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    previewPages[index].click();
                });
            });
        }
    }
    
    // ==================== INTERAKTIVES DEMO-BUCH ====================
    
    // Verbesserte Buchseiten-Umblätterung
    function initInteractiveBook() {
        const bookPage = document.getElementById('page1');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        let isFlipped = false;
        
        if (bookPage && nextBtn && prevBtn) {
            function flipPage(flip) {
                isFlipped = flip;
                
                if (typeof gsap !== 'undefined') {
                    gsap.to(bookPage, {
                        rotationY: isFlipped ? -180 : 0,
                        duration: 0.8,
                        ease: 'power2.inOut'
                    });
                } else {
                    // Fallback ohne GSAP
                    bookPage.style.transform = isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';
                }
            }
            
            // Event-Listener für Umblättern
            nextBtn.addEventListener('click', () => {
                if (!isFlipped) flipPage(true);
            });
            
            prevBtn.addEventListener('click', () => {
                if (isFlipped) flipPage(false);
            });
            
            // Auch das Buch selbst kann geklickt werden
            bookPage.addEventListener('click', () => {
                flipPage(!isFlipped);
            });
            
            // Hover-Effekt für die Ecke
            bookPage.addEventListener('mouseenter', () => {
                if (!isFlipped) {
                    const pageFront = bookPage.querySelector('.page-front');
                    pageFront.style.transform = 'rotateY(-15deg)';
                }
            });
            
            bookPage.addEventListener('mouseleave', () => {
                if (!isFlipped) {
                    const pageFront = bookPage.querySelector('.page-front');
                    pageFront.style.transform = 'rotateY(0deg)';
                }
            });
        }
    }
    
    // ==================== TESTIMONIAL SLIDER ====================
    
    // Testimonial-Slider-Funktionalität
    function initTestimonialSlider() {
        const testimonialContainer = document.querySelector('.testimonial-container');
        const sliderDots = document.querySelectorAll('.slider-dot');
        const prevBtn = document.querySelector('.prev-testimonial');
        const nextBtn = document.querySelector('.next-testimonial');
        let currentSlide = 0;
        
        if (testimonialContainer && sliderDots.length) {
            const totalSlides = document.querySelectorAll('.testimonial-card').length;
            
            function goToSlide(index) {
                currentSlide = index;
                
                // Vermeide negative Indizes und Overflow
                if (currentSlide < 0) currentSlide = totalSlides - 1;
                if (currentSlide >= totalSlides) currentSlide = 0;
                
                // Aktualisiere die Slide-Position
                testimonialContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
                
                // Aktualisiere die aktiven Punkte
                sliderDots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentSlide);
                });
            }
            
            // Event-Listener für die Dots
            sliderDots.forEach((dot, index) => {
                dot.addEventListener('click', () => goToSlide(index));
            });
            
            // Event-Listener für die Pfeile
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
                nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
            }
            
            // Auto-Rotation des Sliders (optional)
            let autoSlideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
            
            // Pausiere Auto-Rotation bei Hover
            testimonialContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            testimonialContainer.addEventListener('mouseleave', () => {
                autoSlideInterval = setInterval(() => {
                    goToSlide(currentSlide + 1);
                }, 5000);
            });
        }
    }
    
    // ==================== FAQ ACCORDION ====================
    
    // FAQ-Accordion-Funktionalität
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Toggle für das aktuelle Item
                const isActive = item.classList.contains('active');
                
                // Alle FAQ-Items schließen
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Wenn das Item nicht bereits aktiv war, öffnen
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // ==================== COUNTDOWN TIMER ====================
    
    // Countdown-Timer-Funktionalität
    function initCountdownTimer() {
        const daysElement = document.getElementById('countdown-days');
        const hoursElement = document.getElementById('countdown-hours');
        const minutesElement = document.getElementById('countdown-minutes');
        const secondsElement = document.getElementById('countdown-seconds');
        const offerTimeElements = document.querySelectorAll('.offer-time');
        
        if (daysElement && hoursElement && minutesElement && secondsElement) {
            // Setze das Enddatum (3 Tage ab jetzt)
            const now = new Date();
            const endDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
            
            function updateCountdown() {
                const currentTime = new Date();
                const diff = endDate - currentTime;
                
                if (diff <= 0) {
                    // Countdown abgelaufen
                    daysElement.textContent = '00';
                    hoursElement.textContent = '00';
                    minutesElement.textContent = '00';
                    secondsElement.textContent = '00';
                    
                    // Auch die Angebots-Zeit aktualisieren
                    offerTimeElements.forEach(el => {
                        el.textContent = 'abgelaufen';
                    });
                    
                    return;
                }
                
                // Berechnung der verbleibenden Zeit
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                // Führende Nullen hinzufügen
                const formatNumber = (num) => (num < 10 ? `0${num}` : num);
                
                // DOM-Elemente aktualisieren
                daysElement.textContent = formatNumber(days);
                hoursElement.textContent = formatNumber(hours);
                minutesElement.textContent = formatNumber(minutes);
                secondsElement.textContent = formatNumber(seconds);
                
                // Auch die Angebots-Zeit aktualisieren
                offerTimeElements.forEach(el => {
                    el.textContent = `${days} Tage`;
                });
            }
            
            // Initial aktualisieren und dann alle Sekunde
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
    }
    
    // ==================== SCROLL EFFEKTE ====================
    
    // Scroll-Progress-Bar
    function initScrollProgress() {
        const progressBar = document.querySelector('.tooth-progress-bar');
        const toothbrushIcon = document.querySelector('.toothbrush-icon');
        
        if (progressBar && toothbrushIcon) {
            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = scrollTop / docHeight;
                
                // Progress-Bar aktualisieren
                progressBar.style.width = `${scrollPercent * 100}%`;
                
                // Zahnbürsten-Icon bewegen
                toothbrushIcon.style.left = `${scrollPercent * 100}%`;
            });
        }
    }
    
    // Back-to-Top-Button-Funktionalität
    function initBackToTop() {
        if (backToTopBtn) {
            // Beim Scrollen den Button ein-/ausblenden
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTopBtn.classList.add('active');
                } else {
                    backToTopBtn.classList.remove('active');
                }
            });
            
            // Zum Seitenanfang scrollen beim Klicken
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Header-Scroll-Effekt (kleiner werden beim Scrollen)
    function initHeaderScrollEffect() {
        if (header) {
            let lastScrollTop = 0;
            
            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY;
                
                // Header ausblenden beim Runterscrollen
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
            });
        }
    }
    
    // Smooth Scroll für Anker-Links
    function initSmoothScroll() {
        const allLinks = document.querySelectorAll('a[href^="#"]');
        
        allLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Zu dem Element scrollen
                    window.scrollTo({
                        top: targetElement.offsetTop - 100, // Offset für den Header
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ==================== POPUP UND BENACHRICHTIGUNGEN ====================
    
    // Exit-Intent-Popup
    function initExitIntentPopup() {
        if (exitPopup) {
            let showExitPopup = true;
            
            // Exit-Intent erkennen (Maus verlässt den oberen Rand)
            document.addEventListener('mouseleave', (e) => {
                if (e.clientY < 50 && showExitPopup) {
                    // Nur einmal zeigen
                    showExitPopup = false;
                    
                    // Popup mit Verzögerung anzeigen
                    setTimeout(() => {
                        exitPopup.classList.add('active');
                        shadowOverlay.classList.add('active');
                    }, 500);
                }
            });
            
            // Popup schließen
            const closePopupBtn = exitPopup.querySelector('.close-popup');
            if (closePopupBtn) {
                closePopupBtn.addEventListener('click', () => {
                    exitPopup.classList.remove('active');
                    shadowOverlay.classList.remove('active');
                });
            }
            
            // Auch bei Klick auf den Overlay schließen
            shadowOverlay.addEventListener('click', () => {
                exitPopup.classList.remove('active');
                miniGame.classList.remove('active');
                shadowOverlay.classList.remove('active');
            });
        }
    }
    
    // Cookie-Banner
    function initCookieBanner() {
        if (cookieBanner) {
            // Prüfen, ob der Cookie bereits akzeptiert wurde
            if (!localStorage.getItem('cookiesAccepted') && !localStorage.getItem('cookiesDeclined')) {
                // Banner nach kurzer Verzögerung anzeigen
                setTimeout(() => {
                    cookieBanner.classList.add('active');
                }, 2000);
            }
            
            // Event-Listener für Cookie-Buttons
            const acceptBtn = document.getElementById('cookie-accept');
            const declineBtn = document.getElementById('cookie-decline');
            
            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'true');
                    cookieBanner.classList.remove('active');
                    showNotification('Cookies akzeptiert! Vielen Dank.');
                });
            }
            
            if (declineBtn) {
                declineBtn.addEventListener('click', () => {
                    localStorage.setItem('cookiesDeclined', 'true');
                    cookieBanner.classList.remove('active');
                    showNotification('Cookies abgelehnt. Es werden nur notwendige Cookies verwendet.');
                });
            }
        }
    }
    
    // Benachrichtigungssystem
    function showNotification(message, duration = 3000) {
        // Prüfen, ob bereits eine Benachrichtigung existiert
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            // Neue Benachrichtigung erstellen
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
            
            // Styling für die Benachrichtigung
            Object.assign(notification.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#4ECDC4',
                color: 'white',
                padding: '1rem',
                borderRadius: '10px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                zIndex: '1000',
                opacity: '0',
                transform: 'translateY(20px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease'
            });
        }
        
        // Nachricht setzen und anzeigen
        notification.textContent = message;
        
        // Animation abspielen
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
            
            // Nach einiger Zeit ausblenden
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(20px)';
                
                // Aus dem DOM entfernen
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, duration);
        }, 10);
    }
    
    // ==================== MINI-SPIEL ====================
    
    // Zahnputz-Minispiel
    function initToothbrushGame() {
        const gameButton = document.createElement('button');
        gameButton.textContent = '🦷 Spiel';
        gameButton.className = 'btn btn-secondary btn-round';
        gameButton.style.position = 'fixed';
        gameButton.style.bottom = '80px';
        gameButton.style.right = '20px';
        gameButton.style.zIndex = '90';
        document.body.appendChild(gameButton);
        
        const gameCloseBtn = document.querySelector('.game-close');
        const toothbrush = document.getElementById('toothbrush');
        const teeth = document.querySelectorAll('.tooth');
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const gameMessage = document.querySelector('.game-message');
        
        // Spiel öffnen
        gameButton.addEventListener('click', () => {
            miniGame.classList.add('active');
            shadowOverlay.classList.add('active');
            
            // Zahnbürste an die Mausposition setzen
            updateToothbrushPosition(event);
        });
        
        // Spiel schließen
        if (gameCloseBtn) {
            gameCloseBtn.addEventListener('click', () => {
                miniGame.classList.remove('active');
                shadowOverlay.classList.remove('active');
            });
        }
        
        // Zahnbürste mit der Maus bewegen
        if (toothbrush) {
            const gameContent = document.querySelector('.game-content');
            
            gameContent.addEventListener('mousemove', updateToothbrushPosition);
            gameContent.addEventListener('touchmove', (e) => {
                const touch = e.touches[0];
                updateToothbrushPosition({ clientX: touch.clientX, clientY: touch.clientY });
                e.preventDefault(); // Verhindern von Scroll
            });
            
            function updateToothbrushPosition(e) {
                if (!e) return;
                
                const rect = gameContent.getBoundingClientRect();
                const x = e.clientX - rect.left - toothbrush.offsetWidth / 2;
                const y = e.clientY - rect.top - toothbrush.offsetHeight / 2;
                
                // Begrenzung innerhalb des Spielbereichs
                const maxX = rect.width - toothbrush.offsetWidth;
                const maxY = rect.height - toothbrush.offsetHeight;
                
                const boundedX = Math.max(0, Math.min(x, maxX));
                const boundedY = Math.max(0, Math.min(y, maxY));
                
                toothbrush.style.left = boundedX + 'px';
                toothbrush.style.top = boundedY + 'px';
            }
            
            // Zähne putzen
            if (teeth.length) {
                let cleanedTeeth = 0;
                const totalTeeth = teeth.length;
                
                // Aktuellen Fortschritt anzeigen
                updateProgress();
                
                // Event-Delegation für die Zähne
                gameContent.addEventListener('mousemove', checkTeethCleaning);
                gameContent.addEventListener('touchmove', (e) => {
                    const touch = e.touches[0];
                    checkTeethCleaning({ clientX: touch.clientX, clientY: touch.clientY });
                });
                
                function checkTeethCleaning(e) {
                    if (!e) return;
                    
                    const rect = gameContent.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    teeth.forEach(tooth => {
                        if (tooth.getAttribute('data-clean') === 'false') {
                            const toothRect = tooth.getBoundingClientRect();
                            const toothX = toothRect.left - rect.left + toothRect.width / 2;
                            const toothY = toothRect.top - rect.top + toothRect.height / 2;
                            
                            // Berechne Abstand zwischen Zahnbürste und Zahn
                            const distance = Math.sqrt(Math.pow(x - toothX, 2) + Math.pow(y - toothY, 2));
                            
                            // Wenn Zahnbürste nahe genug ist
                            if (distance < 40) {
                                tooth.setAttribute('data-clean', 'true');
                                cleanedTeeth++;
                                
                                // Fortschritt aktualisieren
                                updateProgress();
                                
                                // Kleinen Partikelburst erzeugen
                                createCleaningBurst(toothX, toothY);
                                
                                // Prüfen, ob alle Zähne geputzt sind
                                if (cleanedTeeth === totalTeeth) {
                                    gameComplete();
                                }
                            }
                        }
                    });
                }
                
                function updateProgress() {
                    const progress = (cleanedTeeth / totalTeeth) * 100;
                    progressFill.style.width = progress + '%';
                    progressText.textContent = `${cleanedTeeth}/${totalTeeth} Zähne geputzt`;
                }
                
                function createCleaningBurst(x, y) {
                    for (let i = 0; i < 10; i++) {
                        const particle = document.createElement('div');
                        particle.style.position = 'absolute';
                        particle.style.width = '5px';
                        particle.style.height = '5px';
                        particle.style.backgroundColor = '#4ECDC4';
                        particle.style.borderRadius = '50%';
                        particle.style.left = x + 'px';
                        particle.style.top = y + 'px';
                        particle.style.opacity = '1';
                        particle.style.transition = 'all 0.5s ease';
                        
                        gameContent.appendChild(particle);
                        
                        // Animation
                        setTimeout(() => {
                            const angle = Math.random() * Math.PI * 2;
                            const distance = 20 + Math.random() * 30;
                            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                            particle.style.opacity = '0';
                            
                            // Entfernen
                            setTimeout(() => {
                                if (particle.parentNode) {
                                    particle.parentNode.removeChild(particle);
                                }
                            }, 500);
                        }, 10);
                    }
                }
                
                function gameComplete() {
                    // Erfolgsansicht anzeigen
                    if (gameMessage) {
                        gameMessage.classList.remove('hidden');
                    }
                    
                    // Konfetti-Effekt
                    createConfetti();
                    
                    // Benachrichtigung
                    showNotification('Super! Du hast Leo geholfen, alle Zähne zu putzen!', 5000);
                }
                
                function createConfetti() {
                    const colors = ['#FF9D2E', '#4ECDC4', '#FF6B6B', '#FEE440', '#9B5DE5'];
                    
                    for (let i = 0; i < 100; i++) {
                        const confetti = document.createElement('div');
                        
                        Object.assign(confetti.style, {
                            position: 'absolute',
                            width: `${5 + Math.random() * 5}px`,
                            height: `${5 + Math.random() * 5}px`,
                            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                            borderRadius: Math.random() > 0.5 ? '50%' : '3px',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 50}%`,
                            opacity: '1',
                            transformOrigin: 'center',
                            zIndex: '100',
                            transition: 'all 1s ease'
                        });
                        
                        gameContent.appendChild(confetti);
                        
                        // Animation
                        setTimeout(() => {
                            confetti.style.transform = `translate(${-50 + Math.random() * 100}px, ${100 + Math.random() * 200}px) rotate(${Math.random() * 360}deg)`;
                            confetti.style.opacity = '0';
                            
                            // Entfernen
                            setTimeout(() => {
                                if (confetti.parentNode) {
                                    confetti.parentNode.removeChild(confetti);
                                }
                            }, 1000);
                        }, 10 + Math.random() * 500);
                    }
                }
                
                // Spiel zurücksetzen
                document.querySelector('.game-message a').addEventListener('click', () => {
                    cleanedTeeth = 0;
                    teeth.forEach(tooth => {
                        tooth.setAttribute('data-clean', 'false');
                    });
                    updateProgress();
                    gameMessage.classList.add('hidden');
                    miniGame.classList.remove('active');
                    shadowOverlay.classList.remove('active');
                });
            }
        }
    }
    
    // ==================== WARENKORB UND KAUFPROZESS ====================
    
    // Einfache Warenkorb-Funktionalität
    function initCart() {
        const cartIcon = document.querySelector('.cart-icon');
        const cartCount = document.querySelector('.cart-count');
        const buyButtons = document.querySelectorAll('.btn-primary');
        let cartItems = 0;
        
        if (cartIcon && cartCount) {
            // Warenkorb-Klick
            cartIcon.addEventListener('click', () => {
                if (cartItems > 0) {
                    showNotification(`${cartItems} Artikel im Warenkorb`);
                } else {
                    showNotification('Dein Warenkorb ist leer');
                }
            });
            
            // Kaufen-Buttons
            buyButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Wenn Buttons Anker-Links sind, verhindern, dass sie navigieren
                    const href = button.getAttribute('href');
                    if (href === '#' || href === '#pricing') {
                        e.preventDefault();
                    }
                    
                    // Artikel zum Warenkorb hinzufügen
                    cartItems++;
                    cartCount.textContent = cartItems;
                    
                    // Visuelle Effekte
                    cartIcon.classList.add('pulse-animation');
                    setTimeout(() => {
                        cartIcon.classList.remove('pulse-animation');
                    }, 1000);
                    
                    // Benachrichtigung
                    showNotification('Produkt wurde zum Warenkorb hinzugefügt!');
                    
                    // Kaufen-Button-Animation
                    button.classList.add('animate-success');
                    setTimeout(() => {
                        button.classList.remove('animate-success');
                    }, 1000);
                });
            });
        }
    }
    
    // ==================== INITIALISIERUNG ====================
    
    // Alle Funktionen initialisieren
    function init() {
        // Grundlegende Effekte
        createMouseTrail();
        addSparkleEffect();
        initGSAPAnimations();
        
        // Interaktive Komponenten
        init3DBookEffect();
        initBookPreview();
        initInteractiveBook();
        initTestimonialSlider();
        initFaqAccordion();
        initCountdownTimer();
        
        // Scroll-Effekte
        initScrollProgress();
        initBackToTop();
        initHeaderScrollEffect();
        initSmoothScroll();
        
        // Popups und Benachrichtigungen
        initExitIntentPopup();
        initCookieBanner();
        
        // Mini-Spiel
        initToothbrushGame();
        
        // Warenkorb
        initCart();
    }
    
    // Alles initialisieren, wenn DOM bereit ist
    init();
});

// CSS-Klasse für Button-Animation hinzufügen
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .animate-success {
            background-color: #70E000 !important;
            transform: scale(1.1) !important;
        }
    </style>
`);
