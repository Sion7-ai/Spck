document.addEventListener('DOMContentLoaded', () => {

    const preloader = document.querySelector('.preloader');
    const body = document.body;
    const heroHeadlineSpans = document.querySelectorAll('.animated-headline span');
    const reelImage = document.getElementById('reel-image');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    // --- Preloader ---
    window.addEventListener('load', () => {
        setTimeout(() => { // Kurze Verzögerung nach dem Laden
             preloader.classList.add('hidden');
             // Start animations after preloader is gone
             startHeroAnimation();
        }, 200); // Minimalzeit für den Ladebalken
    });


    // --- Hero Headline Animation ---
    function startHeroAnimation() {
        heroHeadlineSpans.forEach((span, index) => {
            // Add data-text for potential CSS glitch effect use
            span.parentElement.dataset.text = span.parentElement.textContent.trim().replace(/\s+/g, ' ');

            // Staggered reveal
            setTimeout(() => {
                span.classList.add('visible');
            }, index * 400); // Verzögerung zwischen den Zeilen
        });
    }
    // Initialer Start (falls kein Preloader verwendet wird oder als Fallback)
    // startHeroAnimation(); // Wird jetzt nach dem Preloader gestartet


    // --- Preview Reel Image Cycling ---
    const reelImages = [
        // Füge hier mehrere Pexels Bild-URLs ein
        'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/169573/pexels-photo-169573.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=600'
    ];
    let currentImageIndex = 0;

    function changeReelImage() {
        if (!reelImage) return;

        reelImage.classList.add('fade-out'); // Start fade out

        setTimeout(() => {
            currentImageIndex = (currentImageIndex + 1) % reelImages.length;
            reelImage.src = reelImages[currentImageIndex];

            // Warten bis das neue Bild potenziell geladen ist, dann einblenden
             // (Eine robustere Lösung würde das 'onload' Event nutzen)
            reelImage.onload = () => {
                 reelImage.classList.remove('fade-out'); // Fade in
            }
            // Fallback, falls onload nicht feuert (z.B. bei gecachten Bildern)
            setTimeout(() => reelImage.classList.remove('fade-out'), 50);

        }, 500); // Muss zur CSS transition passen
    }

    if (reelImage) {
      setInterval(changeReelImage, 2000); // Bild alle 2 Sekunden wechseln
    }


    // --- Scroll Reveal Animation ---
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Animation nur einmal auslösen
                // observer.unobserve(entry.target);
            } else {
                 // Optional: Animation zurücksetzen, wenn Element wieder aus dem Viewport verschwindet
                 entry.target.classList.remove('visible');
            }
        });
    }, {
        root: null, // Beobachtet im Verhältnis zum Viewport
        threshold: 0.1, // Element muss zu 10% sichtbar sein
        rootMargin: '0px 0px -50px 0px' // Trigger etwas früher/später auslösen
    });

    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // --- Hintergrundfarbe beim Scrollen ändern (Beispiel) ---
    const projectsSection = document.querySelector('.projects');
    const clientsSection = document.querySelector('.clients');

    const colorObserver = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
            if(entry.target === projectsSection) {
                if (entry.isIntersecting) {
                     body.style.backgroundColor = 'var(--primary-bg-light)';
                 } else {
                      // Wenn wir wieder nach oben scrollen und .projects verlässt den Viewport
                     const heroSection = document.querySelector('.hero');
                     // Prüfen ob Hero Section sichtbar ist, um Flackern zu vermeiden
                     const heroRect = heroSection.getBoundingClientRect();
                     if (heroRect.top >= 0 && heroRect.bottom <= window.innerHeight) {
                         body.style.backgroundColor = 'var(--primary-bg-color)';
                     }
                 }
            } else if (entry.target === clientsSection) {
                 if (entry.isIntersecting) {
                     body.style.backgroundColor = 'var(--primary-bg-color)';
                 } else {
                     // Prüfen ob Projects Section noch sichtbar ist, wenn Clients nach oben verschwindet
                     const projectsRect = projectsSection.getBoundingClientRect();
                     if (projectsRect.bottom > 0 && projectsRect.top < window.innerHeight / 2) { // Wenn die Projektsection noch halb sichtbar ist
                        body.style.backgroundColor = 'var(--primary-bg-light)';
                     }
                 }
            }
         });
    }, { threshold: 0.3 }); // 30% Sichtbarkeit für Farbwechsel

    if(projectsSection) colorObserver.observe(projectsSection);
    if(clientsSection) colorObserver.observe(clientsSection);

});