/**
 * Scroll Animations and Effects
 * This module handles all scroll-based interactions and animations
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Elements that will be animated on scroll
  const animatedElements = document.querySelectorAll('.project-item, .skill-item, .about-content, .about-image');
  
  // Navigation bar scrolling effect
  const nav = document.querySelector('.main-nav');
  
  // Current visible section for navigation highlighting
  let currentSection = '';
  
  // All sections for intersection observing
  const sections = document.querySelectorAll('section');
  
  // Parallax elements
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroShapes = document.querySelectorAll('.hero-shape');
  
  /**
   * Initialize the scroll effects
   */
  function init() {
    // Set up scroll animations
    setupScrollAnimations();
    
    // Set up parallax effects
    setupParallaxEffects();
    
    // Set up scroll spy for navigation
    setupScrollSpy();
    
    // Set up smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Initial check for elements in viewport
    checkElementsInViewport();
  }
  
  /**
   * Set up animations that trigger on scroll
   */
  function setupScrollAnimations() {
    // Options for the Intersection Observer
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.1 // Trigger when at least 10% of the target is visible
    };
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If the element is in the viewport
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // If it's a skill bar, animate the progress
          if (entry.target.classList.contains('skill-item')) {
            const progressBar = entry.target.querySelector('.skill-progress');
            const progressValue = progressBar.style.width;
            
            progressBar.style.width = '0';
            setTimeout(() => {
              progressBar.style.width = progressValue;
            }, 100);
          }
          
          // Unobserve after animation is triggered
          // observer.unobserve(entry.target);
        } else {
          // Optionally reset animation when element leaves viewport
          // entry.target.classList.remove('visible');
        }
      });
    }, options);
    
    // Observe all animated elements
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  /**
   * Handle parallax effects on scroll
   */
  function setupParallaxEffects() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Only apply parallax if we're at the hero section
      if (scrollTop < window.innerHeight) {
        // Parallax for hero title and subtitle
        if (heroTitle) {
          heroTitle.style.transform = `translateY(${scrollTop * 0.2}px)`;
          heroTitle.style.opacity = 1 - scrollTop / (window.innerHeight / 2);
        }
        
        if (heroSubtitle) {
          heroSubtitle.style.transform = `translateY(${scrollTop * 0.1}px)`;
          heroSubtitle.style.opacity = 1 - scrollTop / (window.innerHeight / 2);
        }
        
        // Parallax for background shapes
        heroShapes.forEach((shape, index) => {
          const speed = 0.05 * (index + 1);
          shape.style.transform = `translate(${scrollTop * speed}px, ${scrollTop * speed}px)`;
        });
      }
      
      // Navigation background effect
      if (scrollTop > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
  
  /**
   * Set up scroll spy to highlight the current section in navigation
   */
  function setupScrollSpy() {
    // Options for the Intersection Observer
    const options = {
      root: null,
      rootMargin: '-100px 0px -70% 0px', // Adjusted to trigger at proper scroll position
      threshold: 0 // Trigger as soon as any part is visible
    };
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If the section is in view
        if (entry.isIntersecting) {
          currentSection = entry.target.getAttribute('id');
          updateNavigation();
        }
      });
    }, options);
    
    // Observe all sections
    sections.forEach(section => {
      observer.observe(section);
    });
  }
  
  /**
   * Update navigation links based on current section
   */
  function updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      
      const href = link.getAttribute('href').substring(1); // Remove the #
      if (href === currentSection) {
        link.classList.add('active');
      }
    });
  }
  
  /**
   * Set up smooth scrolling for anchor links
   */
  function setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Calculate offset to account for fixed header
          const headerOffset = document.querySelector('.main-nav').offsetHeight;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  /**
   * Check if elements are in the viewport on page load
   */
  function checkElementsInViewport() {
    animatedElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      if (rect.top <= windowHeight * 0.8) {
        element.classList.add('visible');
        
        // If it's a skill bar, animate the progress
        if (element.classList.contains('skill-item')) {
          const progressBar = element.querySelector('.skill-progress');
          if (progressBar) {
            const progressValue = progressBar.style.width;
            progressBar.style.width = '0';
            setTimeout(() => {
              progressBar.style.width = progressValue;
            }, 500);
          }
        }
      }
    });
    
    // Set initial active navigation
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionTop = section.offsetTop - 200;
      
      if (scrollTop >= sectionTop) {
        currentSection = section.getAttribute('id');
        updateNavigation();
        break;
      }
    }
  }
  
  // Initialize everything
  init();
});