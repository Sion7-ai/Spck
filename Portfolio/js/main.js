/**
 * Main JavaScript File
 * Initializes global functionality and utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  // Prevent transition animations on page load
  document.body.classList.add('preload');
  
  // Remove the preload class after page has fully loaded
  window.addEventListener('load', () => {
    document.body.classList.remove('preload');
    
    // Initialize page loader
    initPageLoader();
  });
  
  // Mobile Navigation Toggle
  initMobileNav();
  
  // Update copyright year
  updateCopyrightYear();
  
  // Initialize contact form
  initContactForm();
});

/**
 * Initialize the page loader animation
 */
function initPageLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return;
  
  // Simulate loading progress
  const progressElement = loader.querySelector('.loader-progress');
  let progress = 0;
  
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Fade out loader
      setTimeout(() => {
        loader.style.opacity = '0';
        
        // Remove loader from DOM after animation
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }, 300);
    }
    
    progressElement.style.width = `${progress}%`;
  }, 100);
}

/**
 * Initialize the mobile navigation menu
 */
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!navToggle || !navLinks) return;
  
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Change toggle icon
    const icon = navToggle.querySelector('.iconify');
    if (navLinks.classList.contains('active')) {
      icon.setAttribute('data-icon', 'tabler:x');
    } else {
      icon.setAttribute('data-icon', 'tabler:menu');
    }
  });
  
  // Close mobile menu when clicking on a link
  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.querySelector('.iconify').setAttribute('data-icon', 'tabler:menu');
    });
  });
}

/**
 * Update the copyright year in the footer
 */
function updateCopyrightYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Initialize the contact form with validation and submission
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate the form
    if (validateForm(form)) {
      // Simulate form submission (replace with actual submission logic)
      simulateFormSubmission(form);
    }
  });
  
  // Add floating label effect to form inputs
  const formInputs = form.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    // Initial check in case the field has a value (e.g., on page refresh)
    if (input.value.trim() !== '') {
      input.classList.add('has-value');
    }
    
    // Add event listeners for focus and blur
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      if (input.value.trim() !== '') {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  });
}

/**
 * Validate form inputs
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    // Remove any existing error messages
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Reset error state
    input.parentElement.classList.remove('error');
    
    // Check if the field is required and empty
    if (input.required && input.value.trim() === '') {
      addErrorMessage(input, 'This field is required');
      isValid = false;
    }
    
    // Validate email format
    if (input.type === 'email' && input.value.trim() !== '') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.value.trim())) {
        addErrorMessage(input, 'Please enter a valid email address');
        isValid = false;
      }
    }
  });
  
  return isValid;
}

/**
 * Add error message to form field
 * @param {HTMLElement} input - The input with error
 * @param {string} message - The error message
 */
function addErrorMessage(input, message) {
  input.parentElement.classList.add('error');
  
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.textContent = message;
  
  input.parentElement.appendChild(errorMessage);
}

/**
 * Simulate form submission with loading state
 * @param {HTMLFormElement} form - The form being submitted
 */
function simulateFormSubmission(form) {
  // Add loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
  
  // Simulate a delay (replace with actual AJAX call)
  setTimeout(() => {
    // Show success message
    form.innerHTML = `
      <div class="form-success">
        <span class="iconify" data-icon="tabler:check-circle" data-width="48"></span>
        <h3>Message Sent!</h3>
        <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
      </div>
    `;
  }, 2000);
}

/**
 * Reveal animations when scrolling
 * Sets up the initial classes for animations triggered by scroll.js
 */
function setupScrollAnimations() {
  // Add animation classes to elements
  const animatedElements = document.querySelectorAll('.project-item, .skill-item, .about-content, .about-image');
  
  animatedElements.forEach(element => {
    if (!element.classList.contains('animate')) {
      element.classList.add('animate');
    }
  });
}