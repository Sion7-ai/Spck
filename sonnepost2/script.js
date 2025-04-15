document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const backToTop = document.querySelector('.back-to-top');
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Header scroll effect
    function handleHeaderScroll() {
        if (window.scrollY > window.innerHeight * 0.8) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Back to top button visibility
    function handleBackToTopVisibility() {
        if (window.scrollY > window.innerHeight) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    // Scroll animations
    function handleScrollAnimations() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Menu toggle functionality
    menuToggle.addEventListener('click', function() {
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
    
    closeMenu.addEventListener('click', function() {
        menuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    // Back to top functionality
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Attach scroll event listeners
    window.addEventListener('scroll', function() {
        handleHeaderScroll();
        handleBackToTopVisibility();
        handleScrollAnimations();
    });
    
    // Initialize scroll animations on page load
    handleScrollAnimations();
    
    // Simple slider functionality
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach(slider => {
        const nextButton = slider.querySelector('.slider-next');
        const slides = slider.querySelectorAll('.slide');
        let currentSlide = 0;
        
        // This is a placeholder for more complex slider functionality
        // For a real implementation, you would need to add more slides and logic
        if (nextButton && slides.length > 0) {
            nextButton.addEventListener('click', function() {
                // For demo purposes - in a real implementation, you would cycle through slides
                console.log('Next slide clicked');
                
                // Example of how you would implement slide switching:
                // slides[currentSlide].style.display = 'none';
                // currentSlide = (currentSlide + 1) % slides.length;
                // slides[currentSlide].style.display = 'block';
            });
        }
    });
});
