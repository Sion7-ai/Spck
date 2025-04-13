document.addEventListener('DOMContentLoaded', function() {
    
    // ---------- Navigation ----------
    
    // Header-Scroll-Effekt
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Mobile Navigation Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            
            // Icon wechseln (Menü <-> Schließen)
            const icon = mobileMenuToggle.querySelector('.iconify');
            if (mainNav.classList.contains('active')) {
                icon.setAttribute('data-icon', 'material-symbols:close');
            } else {
                icon.setAttribute('data-icon', 'material-symbols:menu');
            }
        });
    }
    
    // ---------- Animationen ----------
    
    // Scroll-Reveal Animationen
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Initial Check
    
    // Animierte Zahlen (Counter)
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateNumbers() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let current = 0;
            const increment = target / 50; // 50 Schritte zur Zielzahl
            const duration = 1500; // 1.5 Sekunden
            const stepTime = duration / 50;
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    }
    
    // Intersection Observer für Animationen
    const statsSection = document.querySelector('.stats-container');
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // ---------- Netzwerk-Animation (Hero) ----------
    
    // Diese Funktion erstellt eine einfache Netzwerk-Animation
    // im Hero-Bereich, die die Verbindung von KI und menschlicher 
    // Kreativität visualisiert
    
    function initNetworkAnimation() {
        const container = document.getElementById('three-container');
        
        if (!container) return;
        
        // Canvas für die Animation erstellen
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Netzwerk-Partikel
        const particlesArray = [];
        const particleCount = 50;
        const connectionDistance = 100;
        const colors = {
            dots: 'rgba(255, 255, 255, 0.8)',
            lines: 'rgba(255, 255, 255, 0.2)',
            highlights: 'rgba(255, 107, 107, 0.8)'
        };
        
        // Partikel-Klasse
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.isHighlighted = Math.random() > 0.85; // Einige Partikel hervorheben
            }
            
            update() {
                // Bewegung
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Grenzen prüfen und umkehren
                if (this.x > canvas.width || this.x < 0) {
                    this.speedX = -this.speedX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.speedY = -this.speedY;
                }
            }
            
            draw() {
                ctx.fillStyle = this.isHighlighted ? colors.highlights : colors.dots;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Partikel erstellen
        function createParticles() {
            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particlesArray.push(new Particle(x, y));
            }
        }
        
        // Verbindungen zwischen Partikeln zeichnen
        function drawConnections() {
            for (let i = 0; i < particlesArray.length; i++) {
                for (let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        // Transparenz basierend auf Distanz
                        const opacity = 1 - (distance / connectionDistance);
                        
                        if (particlesArray[i].isHighlighted || particlesArray[j].isHighlighted) {
                            ctx.strokeStyle = `rgba(255, 107, 107, ${opacity * 0.5})`;
                        } else {
                            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                        }
                        
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        // Animation-Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Alle Partikel aktualisieren und zeichnen
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            
            drawConnections();
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].draw();
            }
            
            requestAnimationFrame(animate);
        }
        
        // Starten
        createParticles();
        animate();
        
        // Bei Größenänderung anpassen
        window.addEventListener('resize', () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        });
    }
    
    // Netzwerk-Animation initialisieren
    initNetworkAnimation();
    
    // ---------- Carousels und Sliders ----------
    
    // Services Carousel
    const servicesCarousel = document.querySelector('.services-carousel');
    const serviceCards = document.querySelectorAll('.service-card');
    const carouselDots = document.querySelectorAll('.carousel-dots .dot');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    
    if (servicesCarousel && serviceCards.length > 0) {
        let currentIndex = 0;
        const cardWidth = serviceCards[0].offsetWidth;
        const visibleCards = Math.floor(servicesCarousel.offsetWidth / cardWidth);
        const maxIndex = Math.max(0, serviceCards.length - visibleCards);
        
        // Dots aktualisieren
        function updateDots() {
            carouselDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Zum nächsten Slide
        function nextSlide() {
            if (window.innerWidth < 768) { // Für mobile Ansicht
                currentIndex = (currentIndex + 1) % serviceCards.length;
            } else {
                currentIndex = Math.min(currentIndex + 1, maxIndex);
            }
            updateCarousel();
        }
        
        // Zum vorherigen Slide
        function prevSlide() {
            if (window.innerWidth < 768) { // Für mobile Ansicht
                currentIndex = (currentIndex - 1 + serviceCards.length) % serviceCards.length;
            } else {
                currentIndex = Math.max(currentIndex - 1, 0);
            }
            updateCarousel();
        }
        
        // Carousel aktualisieren
        function updateCarousel() {
            if (window.innerWidth < 768) {
                // Für mobile Ansicht: Nur eine Karte zeigen
                serviceCards.forEach((card, index) => {
                    card.style.display = index === currentIndex ? 'block' : 'none';
                });
            } else {
                // Für Desktop: Scrollen
                const offset = -currentIndex * (cardWidth + parseInt(getComputedStyle(serviceCards[0]).marginRight));
                servicesCarousel.style.transform = `translateX(${offset}px)`;
            }
            
            updateDots();
        }
        // Event-Listener
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', prevSlide);
            nextButton.addEventListener('click', nextSlide);
        }
        
        // Dots klickbar machen
        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        // Touchscreen-Unterstützung
        let touchStartX = 0;
        let touchEndX = 0;
        
        servicesCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        servicesCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
            }
        }
        
        // Initial Update
        updateCarousel();
        
        // Bei Größenänderung anpassen
        window.addEventListener('resize', updateCarousel);
    }
    
    // Testimonial Carousel
    const testimonialCarousel = document.querySelector('.testimonials-carousel');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonials .carousel-dots .dot');
    const testimonialPrev = document.querySelector('.testimonials .carousel-prev');
    const testimonialNext = document.querySelector('.testimonials .carousel-next');
    
    if (testimonialCarousel && testimonialCards.length > 0) {
        let currentTestimonial = 0;
        let autoplayInterval;
        
        // Testimonial aktualisieren
        function updateTestimonial() {
            testimonialCards.forEach((card, index) => {
                card.style.display = index === currentTestimonial ? 'block' : 'none';
            });
            
            if (testimonialDots.length > 0) {
                testimonialDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentTestimonial);
                });
            }
        }
        
        // Nächstes Testimonial
        function nextTestimonial() {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            updateTestimonial();
        }
        
        // Vorheriges Testimonial
        function prevTestimonial() {
            currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
            updateTestimonial();
        }
        
        // Automatische Rotation starten
        function startAutoplay() {
            autoplayInterval = setInterval(nextTestimonial, 5000);
        }
        
        // Automatische Rotation stoppen
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        // Event-Listener
        if (testimonialPrev && testimonialNext) {
            testimonialPrev.addEventListener('click', () => {
                prevTestimonial();
                stopAutoplay();
                startAutoplay();
            });
            
            testimonialNext.addEventListener('click', () => {
                nextTestimonial();
                stopAutoplay();
                startAutoplay();
            });
        }
        
        // Dots klickbar machen
        if (testimonialDots.length > 0) {
            testimonialDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentTestimonial = index;
                    updateTestimonial();
                    stopAutoplay();
                    startAutoplay();
                });
            });
        }
        // Pause bei Hover
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', stopAutoplay);
            card.addEventListener('mouseleave', startAutoplay);
        });
        
        // Touchscreen-Unterstützung
        let touchStartX = 0;
        let touchEndX = 0;
        
        testimonialCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        });
        
        testimonialCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextTestimonial();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                prevTestimonial();
            }
        }
        
        // Initial Update und Start
        updateTestimonial();
        startAutoplay();
    }
    
    // ---------- Comparison Slider ----------
    
    // Vor/Nach-Vergleichsslider implementieren
    const comparisonSliders = document.querySelectorAll('.comparison-slider');
    
    comparisonSliders.forEach(slider => {
        const sliderHandle = slider.querySelector('.slider-handle');
        const afterImage = slider.querySelector('.comparison-after');
        
        // Initialer Zustand
        let isDown = false;
        
        // Funktion zum Aktualisieren der Sliderposition
        function updateSliderPosition(e) {
            if (!isDown && e.type !== 'click') return;
            
            const rect = slider.getBoundingClientRect();
            let x;
            
            // Touch oder Maus
            if (e.type.includes('touch')) {
                x = e.touches[0].clientX - rect.left;
            } else {
                x = e.clientX - rect.left;
            }
            
            // Sicherstellen, dass Slider innerhalb der Grenzen bleibt
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            
            // Position in Prozent
            const percent = (x / rect.width) * 100;
            
            // After-Bild und Slider-Handle positionieren
            afterImage.style.width = `${percent}%`;
            sliderHandle.style.left = `${percent}%`;
        }
        
        // Event-Listener
        sliderHandle.addEventListener('mousedown', () => {
            isDown = true;
            sliderHandle.style.cursor = 'grabbing';
        });
        
        sliderHandle.addEventListener('touchstart', () => {
            isDown = true;
        });
        
        window.addEventListener('mouseup', () => {
            isDown = false;
            sliderHandle.style.cursor = 'grab';
        });
        
        window.addEventListener('touchend', () => {
            isDown = false;
        });
        
        slider.addEventListener('mousemove', updateSliderPosition);
        slider.addEventListener('touchmove', updateSliderPosition);
        
        // Ermöglichen, dass Benutzer auch direkt auf den Slider klicken können
        slider.addEventListener('click', updateSliderPosition);
    });
    // ---------- KI-Demo ----------
    
    // Simulierte KI-Demofunktion
    const aiForm = document.querySelector('.ai-form');
    const aiResults = document.querySelector('.ai-results');
    
    if (aiForm && aiResults) {
        const generateButton = aiForm.querySelector('button');
        const conceptInput = document.getElementById('design-concept');
        
        generateButton.addEventListener('click', () => {
            if (!conceptInput.value.trim()) {
                alert('Bitte geben Sie ein Designkonzept ein.');
                return;
            }
            
            // Loading-Zustand
            aiResults.innerHTML = `
                <div class="loading-indicator">
                    <div class="spinner"></div>
                    <p>KI arbeitet an Ihrem Design...</p>
                </div>
            `;
            
            // CSS für Spinner
            const style = document.createElement('style');
            style.textContent = `
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top-color: var(--color-indigo);
                    animation: spin 1s ease-in-out infinite;
                    margin: 0 auto var(--space-sm);
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .loading-indicator {
                    text-align: center;
                }
            `;
            document.head.appendChild(style);
            
            // Simulierte Verzögerung für KI-Verarbeitung
            setTimeout(() => {
                // Farben basierend auf Eingabe generieren
                const concept = conceptInput.value.toLowerCase();
                let mainColor, accentColor, neutralColor;
                
                if (concept.includes('minimalist') || concept.includes('modern')) {
                    mainColor = '#3A3A3A';
                    accentColor = '#00C2CB';
                    neutralColor = '#F8F8F8';
                } else if (concept.includes('natur') || concept.includes('bio') || concept.includes('öko')) {
                    mainColor = '#4CAF50';
                    accentColor = '#8BC34A';
                    neutralColor = '#F1F8E9';
                } else if (concept.includes('tech') || concept.includes('digital')) {
                    mainColor = '#2D3282';
                    accentColor = '#00C2CB';
                    neutralColor = '#F8F7F3';
                } else if (concept.includes('kreativ') || concept.includes('kunst')) {
                    mainColor = '#FF6B6B';
                    accentColor = '#FFD166';
                    neutralColor = '#FFFFFF';
                } else {
                    // Fallback
                    mainColor = '#2D3282';
                    accentColor = '#FF6B6B';
                    neutralColor = '#F8F7F3';
                }
                
                // KI-Ergebnis anzeigen
                aiResults.innerHTML = `
                    <div class="ai-result">
                        <div class="design-preview">
                            <div class="color-palette">
                                <div class="color-item" style="background-color: ${mainColor}"></div>
                                <div class="color-item" style="background-color: ${accentColor}"></div>
                                <div class="color-item" style="background-color: ${neutralColor}"></div>
                            </div>
                            <div class="mockup-preview" style="background-color: ${neutralColor}; border: 1px solid #ddd; border-radius: 8px; height: 200px; position: relative; overflow: hidden;">
                                <div style="background-color: ${mainColor}; height: 40px; width: 100%;"></div>
                                <div style="padding: 15px;">
                                    <div style="background-color: ${accentColor}; width: 50px; height: 50px; border-radius: 50%; margin-bottom: 20px;"></div>
                                    <div style="background-color: #ddd; width: 80%; height: 10px; margin-bottom: 10px;"></div>
                                    <div style="background-color: #ddd; width: 60%; height: 10px;"></div>
                                </div>
                            </div>
                        </div>
                        <div class="ai-notes">
                            <p><strong>KI-Designvorschlag:</strong> Basierend auf "${conceptInput.value}"</p>
                            <div class="design-insights">
                                <p>Farbpalette: Primär (${mainColor}), Akzent (${accentColor}), Neutral (${neutralColor})</p>
                                <p>Stil: ${concept.includes('minimalist') ? 'Minimalistisch' : concept.includes('natur') ? 'Organisch' : concept.includes('tech') ? 'Technisch' : 'Ausgewogen'} mit klaren Kontrasten</p>
                                <a href="#" class="btn btn-secondary">Mit Herz verfeinern</a>
                            </div>
                        </div>
                    </div>
                `;
                // CSS für Ergebnis
                const resultStyle = document.createElement('style');
                resultStyle.textContent = `
                    .ai-result {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: var(--space-md);
                        width: 100%;
                    }
                    
                    .color-palette {
                        display: flex;
                        gap: 10px;
                        margin-bottom: 15px;
                    }
                    
                    .color-item {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        border: 1px solid #ddd;
                    }
                    
                    .ai-notes {
                        background-color: white;
                        padding: 15px;
                        border-radius: 8px;
                        box-shadow: var(--shadow-sm);
                    }
                    
                    .design-insights {
                        margin-top: 10px;
                        font-size: 0.9rem;
                    }
                    
                    .design-insights p {
                        margin-bottom: 8px;
                    }
                    
                    .design-insights .btn {
                        margin-top: 15px;
                    }
                    
                    @media (min-width: 768px) {
                        .ai-result {
                            grid-template-columns: 1fr 1fr;
                        }
                    }
                `;
                document.head.appendChild(resultStyle);
                
                // Event-Listener für "Mit Herz verfeinern" Button
                const refineButton = aiResults.querySelector('.btn-secondary');
                refineButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Verfeinertes Design nach "menschlichem Touch"
                    setTimeout(() => {
                        // Subtile Verbesserungen an den Farben
                        const refinedMainColor = adjustColor(mainColor, 10);
                        const refinedAccentColor = adjustColor(accentColor, -5);
                        
                        aiResults.innerHTML = `
                            <div class="ai-result">
                                <div class="design-preview">
                                    <h4 style="margin-bottom: 15px;">Vor/Nach-Vergleich</h4>
                                    <div class="comparison-container" style="display: flex; gap: 20px;">
                                        <div class="before" style="flex: 1;">
                                            <h5 style="margin-bottom: 10px; font-size: 0.9rem;">KI-Version</h5>
                                            <div class="color-palette">
                                                <div class="color-item" style="background-color: ${mainColor}"></div>
                                                <div class="color-item" style="background-color: ${accentColor}"></div>
                                                <div class="color-item" style="background-color: ${neutralColor}"></div>
                                            </div>
                                            <div class="mockup-mini" style="background-color: ${neutralColor}; border: 1px solid #ddd; border-radius: 8px; height: 150px; position: relative; overflow: hidden;">
                                                <div style="background-color: ${mainColor}; height: 30px; width: 100%;"></div>
                                                <div style="padding: 10px;">
                                                    <div style="background-color: ${accentColor}; width: 40px; height: 40px; border-radius: 50%; margin-bottom: 15px;"></div>
                                                    <div style="background-color: #ddd; width: 80%; height: 8px; margin-bottom: 8px;"></div>
                                                    <div style="background-color: #ddd; width: 60%; height: 8px;"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="after" style="flex: 1;">
                                            <h5 style="margin-bottom: 10px; font-size: 0.9rem;">Verfeinerte Version</h5>
                                            <div class="color-palette">
                                                <div class="color-item" style="background-color: ${refinedMainColor}"></div>
                                                <div class="color-item" style="background-color: ${refinedAccentColor}"></div>
                                                <div class="color-item" style="background-color: ${neutralColor}"></div>
                                            </div>
                                            <div class="mockup-mini" style="background-color: ${neutralColor}; border: 1px solid #ddd; border-radius: 8px; height: 150px; position: relative; overflow: hidden; box-shadow: var(--shadow-sm);">
                                                <div style="background-color: ${refinedMainColor}; height: 30px; width: 100%;"></div>
                                                <div style="padding: 10px;">
                                                    <div style="background-color: ${refinedAccentColor}; width: 40px; height: 40px; border-radius: 50%; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);"></div>
                                                    <div style="background-color: #ddd; width: 80%; height: 8px; margin-bottom: 8px; border-radius: 4px;"></div>
                                                    <div style="background-color: #ddd; width: 60%; height: 8px; border-radius: 4px;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ai-notes">
                                    <p><strong>Vom Menschen verfeinert:</strong></p>
                                    <div class="design-insights">
                                        <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 15px;">
                                            <li>Farbkontrast optimiert für bessere Lesbarkeit</li>
                                            <li>Leichte Schattierung für mehr Tiefe hinzugefügt</li>
                                            <li>Abgerundete Ecken für bessere Usability</li>
                                            <li>Subtile Schatten für visuelles Feedback</li>
                                        </ul>
                                        <a href="#contact" class="btn btn-cta">Echtes Projekt starten</a>
                                    </div>
                                </div>
                            </div>
                        `;
                    }, 800);
                });
                
            }, 2000); // 2 Sekunden Ladezeit
        });
        
        // Hilfsfunktion: Farbe um einen bestimmten Betrag aufhellen/abdunkeln
        function adjustColor(color, amount) {
            // Hex zu RGB konvertieren
            let r = parseInt(color.substring(1, 3), 16);
            let g = parseInt(color.substring(3, 5), 16);
            let b = parseInt(color.substring(5, 7), 16);
            
            // Farbwerte anpassen
            r = Math.max(0, Math.min(255, r + amount));
            g = Math.max(0, Math.min(255, g + amount));
            b = Math.max(0, Math.min(255, b + amount));
            
            // Zurück zu Hex konvertieren
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
    }
});