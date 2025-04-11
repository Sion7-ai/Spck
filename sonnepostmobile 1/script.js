// ==============================
// INITIALIZATION
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initMenuToggle();
    initAccordion();
    initScrollAnimations();
    initParallaxEffects();
    
    // Add item-index to menu items for staggered animation
    document.querySelectorAll('.main-nav li').forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
});

// ==============================
// CUSTOM CURSOR
// ==============================
function initCustomCursor() {
    const cursor = document.querySelector('.cursor-follower');
    
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) {
        // Don't initialize on touch devices
        if (cursor) cursor.style.display = 'none';
        return;
    }
    
    let cursorVisible = false;
    
    // Show cursor on mouse movement
    document.addEventListener('mousemove', e => {
        if (!cursorVisible) {
            cursor.style.opacity = '1';
            cursorVisible = true;
        }
        
        // Position cursor with slight delay for smooth effect
        requestAnimationFrame(() => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    });
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseout', () => {
        cursor.style.opacity = '0';
        cursorVisible = false;
    });
    
    // Add hover class for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .menu-toggle, .accordion-header');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// ==============================
// MENU FUNCTIONALITY
// ==============================
function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const body = document.body;
    
    if (!menuToggle) return;
    
    menuToggle.addEventListener('click', () => {
        body.classList.toggle('menu-active');
    });
    
    // Close menu when clicking on a menu link
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('menu-active');
        });
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && body.classList.contains('menu-active')) {
            body.classList.remove('menu-active');
        }
    });
}

// ==============================
// ACCORDION FUNCTIONALITY
// ==============================
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.accordion-icon');
        
        if (!header || !content || !icon) return;
        
        header.addEventListener('click', () => {
            // Toggle active state
            const isActive = item.classList.toggle('active');
            
            // Change icon
            icon.textContent = isActive ? 'x' : '+';
        });
    });
}

// ==============================
// SCROLL ANIMATIONS
// ==============================
function initScrollAnimations() {
    const animatedElements = {
        'moment-card': document.querySelectorAll('.moment-card'),
        'highlight': document.querySelectorAll('.highlight'),
        'ring': document.querySelectorAll('.ring'),
        'ring-label': document.querySelectorAll('.ring-label'),
        'service-block': document.querySelectorAll('.service-block'),
        'scroll-animation': document.querySelectorAll('.scroll-animation')
    };
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // If user prefers reduced motion, show all elements without animation
        Object.values(animatedElements).forEach(elements => {
            elements.forEach(el => {
                el.classList.add('visible', 'animate');
            });
        });
        return;
    }
    
    // Set up intersection observer for scroll animations
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible/animate class when element enters viewport
                entry.target.classList.add(entry.target.classList.contains('ring') || 
                                          entry.target.classList.contains('ring-label') ? 
                                          'animate' : 'visible');
                
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observe all animated elements
    Object.values(animatedElements).forEach(elements => {
        elements.forEach(el => {
            observer.observe(el);
        });
    });
    
    // Add sequential delay to moment cards
    animatedElements['moment-card'].forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add sequential delay to highlight lines
    animatedElements['highlight'].forEach((highlight, index) => {
        highlight.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Stagger ring label animations
    animatedElements['ring-label'].forEach((label, index) => {
        label.style.transitionDelay = `${0.5 + (index * 0.1)}s`;
    });
}

// ==============================
// PARALLAX SCROLL EFFECTS
// ==============================
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    // Skip parallax on devices that prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            
            // Only apply parallax if element is in the viewport
            if (scrollTop > elementTop - window.innerHeight && 
                scrollTop < elementTop + elementHeight) {
                
                const speed = element.dataset.speed || 0.2;
                const yPos = -(scrollTop - elementTop) * speed;
                
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
}

// ==============================
// UTILITY FUNCTIONS
// ==============================
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}