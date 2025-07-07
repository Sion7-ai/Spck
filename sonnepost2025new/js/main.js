document.addEventListener('DOMContentLoaded', function() {

    const siteHeader = document.getElementById('site-header');
    if (siteHeader) {
        const headerScrollThresholdRaw = getComputedStyle(document.documentElement).getPropertyValue('--header-scroll-threshold').trim();
        const headerScrollThreshold = parseInt(headerScrollThresholdRaw, 10) || 50;
        let isScrolled = false;

        function handleHeaderScroll() {
            const shouldBeScrolled = window.scrollY > headerScrollThreshold;
            if (shouldBeScrolled !== isScrolled) {
                siteHeader.classList.toggle('scrolled', shouldBeScrolled);
                isScrolled = shouldBeScrolled;
            }
        }

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(handleHeaderScroll);
        }, { passive: true });
        handleHeaderScroll();
    }

    const menuTrigger = document.getElementById('menu-trigger');
    const fullscreenNav = document.getElementById('fullscreen-nav');
    const navCloseBtn = document.getElementById('fullscreen-nav-close-btn');
    if (menuTrigger && fullscreenNav && navCloseBtn) {
        let previouslyFocusedElement = null;

        function updateFocusableElementsInNav() {
            return Array.from(
                fullscreenNav.querySelectorAll(
                    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter(el => el.offsetParent !== null);
        }

        function trapFocusInNav(e) {
            if (!fullscreenNav.classList.contains('is-open') || e.key !== 'Tab') return;

            const focusableElements = updateFocusableElementsInNav();
            if (focusableElements.length === 0) {
                e.preventDefault();
                return;
            }

            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            const isFocusInside = fullscreenNav.contains(document.activeElement);

            if (e.shiftKey) {
                if ((isFocusInside && document.activeElement === firstFocusable) || !isFocusInside) {
                    if (lastFocusable) lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if ((isFocusInside && document.activeElement === lastFocusable) || !isFocusInside) {
                    if (firstFocusable) firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }

        function openFullscreenNav() {
            previouslyFocusedElement = document.activeElement;
            document.body.classList.add('fullscreen-nav-open');
            fullscreenNav.classList.add('is-open');
            fullscreenNav.removeAttribute('aria-hidden');
            menuTrigger.setAttribute('aria-expanded', 'true');
            menuTrigger.setAttribute('aria-label', 'Menü schließen');

            Array.from(document.body.children).forEach(child => {
                if (child !== fullscreenNav && !fullscreenNav.contains(child) && !child.hasAttribute('aria-hidden') && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
                    child.inert = true;
                    child.setAttribute('aria-hidden', 'true');
                    child.dataset.madeInert = true;
                }
            });

            document.addEventListener('keydown', trapFocusInNav);
            const firstFocusableInNav = updateFocusableElementsInNav()[0] || navCloseBtn;
            setTimeout(() => { if(firstFocusableInNav) firstFocusableInNav.focus(); }, 50);
        }

        function closeFullscreenNav() {
            document.body.classList.remove('fullscreen-nav-open');
            fullscreenNav.classList.remove('is-open');
            fullscreenNav.setAttribute('aria-hidden', 'true');
            menuTrigger.setAttribute('aria-expanded', 'false');
            menuTrigger.setAttribute('aria-label', 'Menü öffnen');

            Array.from(document.body.children).forEach(child => {
                if (child.dataset.madeInert) {
                    child.inert = false;
                    child.removeAttribute('aria-hidden');
                    delete child.dataset.madeInert;
                }
            });

            document.removeEventListener('keydown', trapFocusInNav);
            if (previouslyFocusedElement && document.body.contains(previouslyFocusedElement)) {
                previouslyFocusedElement.focus();
            } else {
                menuTrigger.focus();
            }
        }

        menuTrigger.addEventListener('click', () => {
            fullscreenNav.classList.contains('is-open') ? closeFullscreenNav() : openFullscreenNav();
        });
        navCloseBtn.addEventListener('click', closeFullscreenNav);

        fullscreenNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('javascript:')) {
                    setTimeout(closeFullscreenNav, 150);
                } else if (href === '#' && link.id === 'cookie-settings-trigger-nav') {
                     setTimeout(closeFullscreenNav, 150);
                } else if (href === '#') {
                    e.preventDefault();
                }
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && fullscreenNav.classList.contains('is-open')) {
                closeFullscreenNav();
            }
        });
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.gsap-fade-in').forEach((el) => {
            gsap.from(el, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        });

        const heroAngebotSection = document.querySelector('.hero-angebot-section');
        if (heroAngebotSection) {
            gsap.from(heroAngebotSection.querySelectorAll('.hero-angebot-text-content > *, .hero-angebot-image-wrapper'), {
                opacity: 0,
                y: 30,
                duration: 0.7,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: heroAngebotSection,
                    start: "top 80%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }
    }

    window.showPopup = function(popupId) {
        const popup = document.getElementById(popupId);
        if (!popup || popup.classList.contains('is-visible')) return;

        popup._previouslyFocusedElement = document.activeElement;
        popup.classList.add('is-visible');
        popup.removeAttribute('aria-hidden');

        Array.from(document.body.children).forEach(child => {
            if (child !== popup && !popup.contains(child) && !child.hasAttribute('aria-hidden') && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
                child.inert = true;
                child.setAttribute('aria-hidden', 'true');
                child.dataset.madeInertByPopup = true;
            }
        });

        const focusableElements = Array.from(popup.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.disabled && el.offsetParent !== null);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        const closeButton = popup.querySelector('.close-popup');

        const trapPopupFocus = (e) => {
             if (!popup.classList.contains('is-visible') || e.key !== 'Tab') return;
             if (focusableElements.length === 0) { e.preventDefault(); return; }
             const isFocusInside = popup.contains(document.activeElement);
             if (e.shiftKey) { if ((isFocusInside && document.activeElement === firstFocusable) || !isFocusInside) { if (lastFocusable) lastFocusable.focus(); e.preventDefault(); } }
             else { if ((isFocusInside && document.activeElement === lastFocusable) || !isFocusInside) { if (firstFocusable) firstFocusable.focus(); e.preventDefault(); } }
         };
        popup._trapFocusListener = trapPopupFocus;
        document.addEventListener('keydown', trapPopupFocus);

        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                window.closePopup(popupId);
            }
        };
        popup._escapeListener = closeOnEscape;
        document.addEventListener('keydown', closeOnEscape);

        const closeOnClickOutside = (e) => {
            if (e.target === popup) {
                window.closePopup(popupId);
            }
        };
        popup._clickOutsideListener = closeOnClickOutside;
        popup.addEventListener('click', closeOnClickOutside);

        setTimeout(() => {
            if (closeButton) closeButton.focus();
            else if (firstFocusable) firstFocusable.focus();
        }, 50);
    };

    window.closePopup = function(popupId, elementToFocus = null) {
        const popup = document.getElementById(popupId);
        if (!popup || !popup.classList.contains('is-visible')) return;

        popup.classList.remove('is-visible');
        popup.setAttribute('aria-hidden', 'true');

        Array.from(document.body.children).forEach(child => {
            if (child.dataset.madeInertByPopup) {
                child.inert = false;
                child.removeAttribute('aria-hidden');
                delete child.dataset.madeInertByPopup;
            }
        });

        if (popup._escapeListener) { document.removeEventListener('keydown', popup._escapeListener); delete popup._escapeListener; }
        if (popup._trapFocusListener) { document.removeEventListener('keydown', popup._trapFocusListener); delete popup._trapFocusListener; }
        if (popup._clickOutsideListener) { popup.removeEventListener('click', popup._clickOutsideListener); delete popup._clickOutsideListener; }


        const focusTarget = elementToFocus || popup._previouslyFocusedElement;
        if (focusTarget && document.body.contains(focusTarget) && typeof focusTarget.focus === 'function') {
            setTimeout(() => focusTarget.focus(), 0);
        } else {
            document.body.focus();
        }
        delete popup._previouslyFocusedElement;
    };

    const betriebsferienPopup = document.getElementById('betriebsferien-popup');
    if (betriebsferienPopup) {
        if (!sessionStorage.getItem('betriebsferienPopupShown')) {
             showPopup('betriebsferien-popup');
             sessionStorage.setItem('betriebsferienPopupShown', 'true');
        }

        const closeBtn = betriebsferienPopup.querySelector('.close-popup');
        if (closeBtn && !closeBtn.hasAttribute('onclick')) {
            closeBtn.addEventListener('click', () => closePopup('betriebsferien-popup'));
        }
    }


    const imageLightbox = document.getElementById('image-lightbox');
    const lightboxImageElement = document.getElementById('lightbox-image');
    const lightboxCloseButton = imageLightbox ? imageLightbox.querySelector('.lightbox-close') : null;
    let activeLightboxTrigger = null;

    function openImageLightbox(imageUrl, altText, triggerElement) {
        if (!imageLightbox || !lightboxImageElement) return;

        lightboxImageElement.setAttribute('src', imageUrl);
        lightboxImageElement.setAttribute('alt', altText);
        activeLightboxTrigger = triggerElement;

        imageLightbox._previouslyFocusedElement = document.activeElement;
        imageLightbox.classList.add('is-visible');
        imageLightbox.removeAttribute('aria-hidden');

        Array.from(document.body.children).forEach(child => {
            if (child !== imageLightbox && !imageLightbox.contains(child) && !child.hasAttribute('aria-hidden') && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
                child.inert = true;
                child.setAttribute('aria-hidden', 'true');
                child.dataset.madeInertByLightbox = true;
            }
        });

        const focusableElementsInLightbox = [lightboxCloseButton].filter(el => el && el.offsetParent !== null);
        const firstFocusableLightbox = focusableElementsInLightbox[0];
        const lastFocusableLightbox = focusableElementsInLightbox[focusableElementsInLightbox.length - 1];

        imageLightbox._trapFocusListener = (e) => {
            if (!imageLightbox.classList.contains('is-visible') || e.key !== 'Tab') return;
            if (focusableElementsInLightbox.length === 0) { e.preventDefault(); return; }
            const isFocusInside = imageLightbox.contains(document.activeElement);
            if (e.shiftKey) { if ((isFocusInside && document.activeElement === firstFocusableLightbox) || !isFocusInside) { if (lastFocusableLightbox) lastFocusableLightbox.focus(); e.preventDefault(); } }
            else { if ((isFocusInside && document.activeElement === lastFocusableLightbox) || !isFocusInside) { if (firstFocusableLightbox) firstFocusableLightbox.focus(); e.preventDefault(); } }
        };
        document.addEventListener('keydown', imageLightbox._trapFocusListener);

        imageLightbox._escapeListener = (e) => { if (e.key === 'Escape') closeImageLightbox(); };
        document.addEventListener('keydown', imageLightbox._escapeListener);

        imageLightbox._clickOutsideListener = (e) => { if (e.target === imageLightbox) closeImageLightbox(); };
        imageLightbox.addEventListener('click', imageLightbox._clickOutsideListener);

        setTimeout(() => { if (lightboxCloseButton) lightboxCloseButton.focus(); }, 50);
    }

    function closeImageLightbox() {
        if (!imageLightbox) return;
        imageLightbox.classList.remove('is-visible');
        imageLightbox.setAttribute('aria-hidden', 'true');

        Array.from(document.body.children).forEach(child => {
            if (child.dataset.madeInertByLightbox) {
                child.inert = false;
                child.removeAttribute('aria-hidden');
                delete child.dataset.madeInertByLightbox;
            }
        });

        if (imageLightbox._escapeListener) { document.removeEventListener('keydown', imageLightbox._escapeListener); delete imageLightbox._escapeListener; }
        if (imageLightbox._trapFocusListener) { document.removeEventListener('keydown', imageLightbox._trapFocusListener); delete imageLightbox._trapFocusListener; }
        if (imageLightbox._clickOutsideListener) { imageLightbox.removeEventListener('click', imageLightbox._clickOutsideListener); delete imageLightbox._clickOutsideListener; }

        if (activeLightboxTrigger && typeof activeLightboxTrigger.focus === 'function') {
            activeLightboxTrigger.focus();
        } else if (imageLightbox._previouslyFocusedElement && document.body.contains(imageLightbox._previouslyFocusedElement) && typeof imageLightbox._previouslyFocusedElement.focus === 'function') {
            imageLightbox._previouslyFocusedElement.focus();
        } else {
            document.body.focus();
        }
        delete imageLightbox._previouslyFocusedElement;
        activeLightboxTrigger = null;

        if (lightboxImageElement) {
            lightboxImageElement.setAttribute('src', '');
            lightboxImageElement.setAttribute('alt', '');
        }
    }

    if (imageLightbox && lightboxCloseButton) {
        lightboxCloseButton.addEventListener('click', closeImageLightbox);
    }

    const galleryTriggers = document.querySelectorAll('.gallery-lightbox-trigger');
    galleryTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(event) {
            event.preventDefault();
            const imageUrl = this.getAttribute('href');
            const altText = this.dataset.alt || (this.querySelector('img') ? this.querySelector('img').getAttribute('alt') : 'Vergrößerte Bildansicht');
            openImageLightbox(imageUrl, altText, this);
        });
    });

    function initializeSlider(sliderId, prevBtnId, nextBtnId, pauseBtnId = null, autoPlay = false, autoPlayInterval = 5000, isImageSlider = false) {
        const sliderWrapper = document.getElementById(sliderId);
        if (!sliderWrapper) {
            return;
        }

        const slides = Array.from(sliderWrapper.children).filter(child => child.classList.contains('slide'));
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const pauseBtn = pauseBtnId ? document.getElementById(pauseBtnId) : null;
        const sliderContainer = sliderWrapper.closest('.slider-container');
        const srAnnouncer = sliderContainer ? sliderContainer.querySelector('.sr-slide-announcer') : null;

        if (!prevBtn || !nextBtn || !sliderContainer) {
            return;
        }
        if (slides.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            if (pauseBtn) pauseBtn.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        let slideInterval;
        let isPaused = false;
        let isAutoplayActive = autoPlay;

        function updateSlider(announce = false) {
            sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === slides.length - 1;

            slides.forEach((slide, index) => {
                const isCurrent = index === currentIndex;
                slide.setAttribute('aria-hidden', String(!isCurrent));
                const focusableInSlide = slide.querySelectorAll('a, button, input, textarea, select, [tabindex="0"]');
                focusableInSlide.forEach(focusable => focusable.setAttribute('tabindex', isCurrent ? '0' : '-1'));

                if (isImageSlider && slide.tagName === 'A') {
                    slide.setAttribute('tabindex', isCurrent ? '0' : '-1');
                }
            });

            if (announce && srAnnouncer) {
                let slideTextContent = `Folie ${currentIndex + 1} von ${slides.length} angezeigt.`;
                if (!isImageSlider && slides[currentIndex]) {
                     slideTextContent += ` ${(slides[currentIndex].textContent || '').trim().substring(0, 100)}`;
                } else if (isImageSlider && slides[currentIndex]) {
                    const imgElement = slides[currentIndex].querySelector('img') || slides[currentIndex];
                    if (imgElement && imgElement.alt) {
                        slideTextContent += ` Bild: ${imgElement.alt}`;
                    }
                }
                srAnnouncer.textContent = `${slideTextContent} ${(new Date()).getTime()}`;
            }
        }

        function navigateSlide(direction) {
            isPaused = true;
            stopAutoPlay();
            const newIndex = currentIndex + direction;
            if (newIndex >= 0 && newIndex < slides.length) {
                currentIndex = newIndex;
                updateSlider(true);
            }
        }

        function startAutoPlay() {
            if (!isAutoplayActive || isPaused || slides.length <= 1) return;
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlider(true);
            }, autoPlayInterval);
            if (pauseBtn) {
                pauseBtn.setAttribute('aria-label', 'Animation anhalten');
                const useEl = pauseBtn.querySelector('use');
                if(useEl) useEl.setAttribute('href', '#icon-pause-circle');
            }
        }

        function stopAutoPlay() {
            clearInterval(slideInterval);
            if (pauseBtn) {
                pauseBtn.setAttribute('aria-label', 'Animation fortsetzen');
                const useEl = pauseBtn.querySelector('use');
                if(useEl) useEl.setAttribute('href', '#icon-play-circle');
            }
        }

        prevBtn.addEventListener('click', () => navigateSlide(-1));
        nextBtn.addEventListener('click', () => navigateSlide(1));

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                isPaused = !isPaused;
                isPaused ? stopAutoPlay() : startAutoPlay();
            });
        }

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        function handleReducedMotion(event) {
            if (event.matches) {
                isAutoplayActive = false;
                stopAutoPlay();
                if (pauseBtn) pauseBtn.style.display = 'none';
            } else {
                isAutoplayActive = autoPlay;
                if (!isPaused) startAutoPlay();
                if (pauseBtn && slides.length > 1) pauseBtn.style.display = 'inline-block';
            }
        }
        mediaQuery.addEventListener('change', handleReducedMotion);
        handleReducedMotion(mediaQuery);

        updateSlider();
    }

    initializeSlider('testimonial-slider', 'prevSlideTestimonial', 'nextSlideTestimonial', 'testimonial-pause', true, 7000, false);
    initializeSlider('image-slider', 'prevSlideImage', 'nextSlideImage', 'image-slider-pause', true, 6000, true);


    function openCookieSettings() {
        alert('Hier würden die Cookie-Einstellungen geöffnet (z.B. per CMP API).');
    }
    const cookieSettingsTrigger = document.getElementById('cookie-settings-trigger');
    const cookieSettingsTriggerNav = document.getElementById('cookie-settings-trigger-nav');

    if (cookieSettingsTrigger) {
        cookieSettingsTrigger.addEventListener('click', function(event) {
            event.preventDefault();
            openCookieSettings();
        });
    }
    if (cookieSettingsTriggerNav) {
        cookieSettingsTriggerNav.addEventListener('click', function(event) {
            event.preventDefault();
            openCookieSettings();
        });
    }

});