document.addEventListener('DOMContentLoaded', function() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const header = document.getElementById('header');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const allSections = document.querySelectorAll('main#main-content > section[id]'); // Sections for ScrollSpy
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-menu .nav-link'); // All nav links

  // --- Header Scroll Effect ---
  if (header) {
      ScrollTrigger.create({
          trigger: "body", // Could be more specific if needed
          start: "top -80px", // When scrolled 80px down
          toggleClass: {targets: header, className: "scrolled"},
          // markers: true // for debugging
      });
  }

  // --- Mobile Menu Toggle ---
  if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', () => {
          const isOpen = mobileMenu.classList.toggle('open');
          document.body.classList.toggle('no-scroll', isOpen);
          mobileMenuToggle.setAttribute('aria-expanded', isOpen);
          const icon = mobileMenuToggle.querySelector('iconify-icon');
          if (icon) icon.setAttribute('icon', isOpen ? 'mdi:close' : 'mdi:menu');
      });

      // Mobile dropdown functionality
      document.querySelectorAll('#mobile-menu .mobile-dropdown-li > .nav-link-dropdown').forEach(span => {
          span.addEventListener('click', (e) => {
              e.preventDefault();
              const subMenu = span.nextElementSibling;
              const icon = span.querySelector('iconify-icon');
              if (subMenu) {
                  const isSubMenuOpen = subMenu.style.display === 'block';
                  subMenu.style.display = isSubMenuOpen ? 'none' : 'block';
                  span.setAttribute('aria-expanded', !isSubMenuOpen);
                  if (icon) icon.style.transform = isSubMenuOpen ? 'rotate(0deg)' : 'rotate(180deg)';
              }
          });
      });
  }
  
  // --- Desktop Dropdown (Leistungen) - Click Toggle ---
  const desktopLeistungenTrigger = document.getElementById('desktop-leistungen-trigger');
  const desktopLeistungenMenu = document.getElementById('desktop-leistungen-menu');

  if (desktopLeistungenTrigger && desktopLeistungenMenu) {
      desktopLeistungenTrigger.addEventListener('click', function(event) {
          event.preventDefault();
          const isOpen = desktopLeistungenMenu.classList.toggle('open-dd');
          this.classList.toggle('open-dd-trigger', isOpen);
          this.setAttribute('aria-expanded', isOpen);
      });

      // Close dropdown if clicked outside
      document.addEventListener('click', function(event) {
          if (!desktopLeistungenTrigger.contains(event.target) && !desktopLeistungenMenu.contains(event.target)) {
              if (desktopLeistungenMenu.classList.contains('open-dd')) {
                  desktopLeistungenMenu.classList.remove('open-dd');
                  desktopLeistungenTrigger.classList.remove('open-dd-trigger');
                  desktopLeistungenTrigger.setAttribute('aria-expanded', 'false');
              }
          }
      });
  }


  // --- Smooth Scroll for Navigation Links ---
  document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId.startsWith('#') && targetId.length > 1) {
              e.preventDefault();
              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                  let scrollToPosition = targetElement.offsetTop;
                  if (targetId !== '#hero' && header) {
                       scrollToPosition -= header.offsetHeight;
                  } else if (targetId === '#hero') {
                      scrollToPosition = 0; // Scroll to very top for Hero
                  }

                  gsap.to(window, {
                      duration: 1.2,
                      scrollTo: { y: scrollToPosition, autoKill: true },
                      ease: "power3.inOut"
                  });

                  if (mobileMenu && mobileMenu.classList.contains('open')) {
                      mobileMenu.classList.remove('open');
                      document.body.classList.remove('no-scroll');
                      if(mobileMenuToggle) {
                          mobileMenuToggle.setAttribute('aria-expanded', 'false');
                          const icon = mobileMenuToggle.querySelector('iconify-icon');
                          if (icon) icon.setAttribute('icon', 'mdi:menu');
                      }
                  }
              }
          }
      });
  });
  
  // --- ScrollSpy for Navigation Active State ---
  if (allSections.length > 0 && navLinks.length > 0) {
      allSections.forEach(section => {
          ScrollTrigger.create({
              trigger: section,
              start: () => `top ${header ? header.offsetHeight + 50 : 50}px`, // Adjusted start
              end: () => `bottom ${header ? header.offsetHeight + 50 : 50}px`, // Adjusted end
              // markers: true, // For debugging
              onEnter: () => setActiveLink(section.id),
              onEnterBack: () => setActiveLink(section.id),
          });
      });
  }
  function setActiveLink(sectionId) {
      navLinks.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active-link');
          }
          // Handle dropdown parent
          if (link.classList.contains('nav-link-dropdown')) {
              const parentLi = link.closest('.dropdown-li');
              if (parentLi && parentLi.querySelector(`.dropdown-menu a[href="#${sectionId}"]`)) {
                  link.classList.add('active-link'); // Highlight parent "Leistungen" if a sub-item is active
              }
          }
      });
  }


  // --- Hero Slider ---
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroNavDots = document.querySelectorAll('.hero-slider-nav .nav-dot');
  let currentHeroSlide = 0;
  let heroInterval;

  if (heroSlides.length > 0) {
      // Ensure the first slide is immediately visible on load
      gsap.set(heroSlides[0], { autoAlpha: 1, visibility: 'visible' });
      heroSlides[0].classList.add('active'); // Ensure active class is set initially
      if(heroNavDots[0]) heroNavDots[0].classList.add('active');

      function showHeroSlide(index, direction = "next") {
          if (heroSlides.length === 0) return;
          const oldSlide = heroSlides[currentHeroSlide];
          const newSlide = heroSlides[index];

          if (oldSlide === newSlide) return; // Prevent re-animating the same slide

          gsap.killTweensOf([oldSlide, newSlide, oldSlide.querySelectorAll('.hero-text-column > *, .hero-image-column'), newSlide.querySelectorAll('.hero-text-column > *, .hero-image-column')]); // Kill previous animations

          // Animate out old slide
          if (oldSlide) {
              gsap.to(oldSlide, { autoAlpha: 0, duration: 0.5, ease: "power2.in" });
              gsap.to(oldSlide.querySelectorAll('.hero-text-column > *, .hero-image-column'), {
                  autoAlpha: 0, x: direction === "next" ? -30 : 30, stagger: 0.03, duration: 0.4
              });
          }
         
          heroSlides.forEach(s => s.classList.remove('active'));
          heroNavDots.forEach(dot => dot.classList.remove('active'));

          newSlide.classList.add('active');
          if(heroNavDots[index]) heroNavDots[index].classList.add('active');
          currentHeroSlide = index;

          // Animate in new slide
          gsap.fromTo(newSlide,
              { autoAlpha: 0, visibility: 'hidden' }, // Start hidden
              { autoAlpha: 1, visibility: 'visible', duration: 0.1, ease: "none" } // Make slide visible quickly at start of animation
          );

          gsap.fromTo(newSlide.querySelector('.hero-text-column h1'), { autoAlpha: 0, x: direction === "next" ? 30 : -30 }, { autoAlpha: 1, x: 0, duration: 0.6, delay: 0.3, ease: "power2.out" });
          gsap.fromTo(newSlide.querySelector('.hero-text-column .sub-headline'), { autoAlpha: 0, x: direction === "next" ? 30 : -30 }, { autoAlpha: 1, x: 0, duration: 0.6, delay: 0.4, ease: "power2.out" });
           // Check if button container exists before animating the button
          const buttonContainer = newSlide.querySelector('.hero-button-container');
          if (buttonContainer) {
              gsap.fromTo(buttonContainer, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.5, ease: "back.out(1.7)" });
          }
          gsap.fromTo(newSlide.querySelector('.hero-image-column'), { autoAlpha: 0.3, scale: 1.03 }, { autoAlpha: 1, scale: 1, duration: 0.8, delay: 0.2, ease: "power2.out" });
      }

      function nextHeroSlideAuto() {
          let newSlideIndex = (currentHeroSlide + 1) % heroSlides.length;
          showHeroSlide(newSlideIndex, "next");
      }

      // Start interval AFTER the initial slide is shown
      heroInterval = setInterval(nextHeroSlideAuto, 7000);

      heroNavDots.forEach(dot => {
          dot.addEventListener('click', () => {
              clearInterval(heroInterval);
              const newIndex = parseInt(dot.dataset.slide);
              const direction = newIndex > currentHeroSlide ? "next" : (newIndex < currentHeroSlide ? "prev" : "next");
              showHeroSlide(newIndex, direction);
              heroInterval = setInterval(nextHeroSlideAuto, 7000);
          });
      });
  }
  
  // --- Accordion ---
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
      const accHeader = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      const icon = accHeader.querySelector('.accordion-icon');

      accHeader.addEventListener('click', () => {
          const isActive = item.classList.toggle('active');
          accHeader.setAttribute('aria-expanded', isActive);
          if (icon) icon.setAttribute('icon', isActive ? 'mdi:minus' : 'mdi:plus');
          
          gsap.to(content, {
              height: isActive ? "auto" : 0, // More reliable than scrollHeight for dynamic content
              paddingBottom: isActive ? 'var(--spacing-m)' : 0,
              duration: 0.4,
              ease: "power1.inOut",
              onComplete: () => { // Ensure proper display after animation
                  if (!isActive) content.style.display = "none";
              },
              onStart: () => {
                  if (isActive) content.style.display = "block";
              }
          });
      });
       // Set initial state for GSAP (content hidden)
      if (!item.classList.contains('active')) {
          gsap.set(content, {height: 0, paddingBottom: 0, display: "none"});
      }
  });

  // --- Testimonial Slider ---
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const prevTestimonialBtn = document.querySelector('.prev-testimonial');
  const nextTestimonialBtn = document.querySelector('.next-testimonial');
  let currentTestimonial = 0;

  if (testimonialSlides.length > 0) {
      gsap.set(testimonialSlides[0], { autoAlpha: 1, visibility: 'visible' }); // Ensure first testimonial is visible initially
      testimonialSlides[0].classList.add('active');

      function showTestimonial(index, direction = "next") {
          if (testimonialSlides.length === 0) return;
          const oldTestimonial = testimonialSlides[currentTestimonial];
          const newTestimonial = testimonialSlides[index];

          if (oldTestimonial === newTestimonial) return; // Prevent re-animating the same testimonial

          gsap.killTweensOf([oldTestimonial, newTestimonial]);

          if (oldTestimonial) {
               gsap.to(oldTestimonial, { autoAlpha: 0, x: direction === "next" ? -20 : 20, duration: 0.3, ease: "power1.in", onComplete: () => oldTestimonial.classList.remove('active') });
          }
          
          newTestimonial.classList.add('active');
          gsap.fromTo(newTestimonial,
              { autoAlpha: 0, visibility: 'hidden', x: direction === "next" ? 20 : -20, scale: 0.99 },
              { autoAlpha: 1, visibility: 'visible', x: 0, scale: 1, duration: 0.4, delay: oldTestimonial ? 0.1 : 0, ease: "power2.out" }
          );
          currentTestimonial = index;
      }

      // showTestimonial(0, "next"); // Already handled by initial set

      if (nextTestimonialBtn) {
          nextTestimonialBtn.addEventListener('click', () => {
              let newIndex = (currentTestimonial + 1) % testimonialSlides.length;
              showTestimonial(newIndex, "next");
          });
      }
      if (prevTestimonialBtn) {
          prevTestimonialBtn.addEventListener('click', () => {
              let newIndex = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
              showTestimonial(newIndex, "prev");
          });
      }
  }

  // --- GSAP Scroll Animations for .fade-in elements ---
  const fadeElements = gsap.utils.toArray('.fade-in');
  fadeElements.forEach(elem => {
      gsap.fromTo(elem,
          { autoAlpha: 0, y: 40 }, // Use autoAlpha for opacity and visibility
          {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              scrollTrigger: {
                  trigger: elem,
                  start: "top 90%", // Start animation a bit later
                  toggleActions: "play none none none",
              },
              ease: "power2.out"
          }
      );
  });
  
  // Update current year in footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

});