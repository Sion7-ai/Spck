document.addEventListener('DOMContentLoaded', function() {
    // Navigation item toggle
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Here you would normally update the content based on the selected tab
            // For demo purposes, we'll just log it
            console.log(`Tab selected: ${this.textContent}`);
        });
    });

    // Card hover animation enhancement
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
    });

    // Scroll animations for elements
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.card, .service-card, .mobile-device');
        
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    }

    // Initialize elements for animation
    const elementsToAnimate = document.querySelectorAll('.card, .service-card, .mobile-device');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Add CSS animation class
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .animate {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
            }
            
            .circle-element {
                animation: float 6s ease-in-out infinite;
            }
            
            .product-visual {
                animation: float 8s ease-in-out infinite;
                animation-delay: 1s;
            }
        </style>
    `);

    // Run the animation on scroll and initial load
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', function() {
        // Small delay for initial animations
        setTimeout(animateOnScroll, 300);
    });

    // Handle mobile menu toggle if viewport is resized
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            document.body.classList.remove('mobile-nav-active');
        }
    });

    // Contact button functionality
    const contactBtn = document.querySelector('.contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            // Create a modal or scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.log('Contact button clicked - would show contact modal');
                
                // Demo modal functionality - in real implementation use a proper modal component
                alert('Kontaktieren Sie uns: info@dego-design.de | +49 30 1234567');
            }
        });
    }

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const circleElement = document.querySelector('.circle-element');
            const productVisual = document.querySelector('.product-visual');
            
            if (circleElement && productVisual) {
                // Subtle parallax effect
                circleElement.style.transform = `translateY(${scrollPosition * 0.05}px)`;
                productVisual.style.transform = `translateY(${scrollPosition * -0.08}px) rotate(-10deg)`;
            }
        });
    }

    // Initialize floating animations for visual elements
    const circleElement = document.querySelector('.circle-element');
    const productVisual = document.querySelector('.product-visual');
    
    if (circleElement) {
        circleElement.style.animation = 'float 6s ease-in-out infinite';
    }
    
    if (productVisual) {
        productVisual.style.animation = 'float 8s ease-in-out infinite';
        productVisual.style.animationDelay = '1s';
    }
});