/**
 * Page Loader Animation
 * Handles initial page loading animation and transition
 */

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.loader');
  const loaderProgress = document.querySelector('.loader-progress');
  const loaderText = document.querySelector('.loader-text');
  
  // Array of loading messages to cycle through
  const loadingMessages = [
    'Loading',
    'Preparing Canvas',
    'Loading Projects',
    'Almost There'
  ];
  
  // If no loader is present, exit early
  if (!loader || !loaderProgress) return;
  
  /**
   * Initialize the loader animation
   */
  function initLoader() {
    // Ensure the loader is visible
    loader.style.display = 'flex';
    
    // Start progress animation
    animateProgress();
    
    // Start cycling loading messages if they exist
    if (loaderText) {
      cycleLoadingMessages();
    }
    
    // Listen for when all content has loaded
    window.addEventListener('load', finishLoading);
  }
  
  /**
   * Animate the progress bar with realistic looking increments
   */
  function animateProgress() {
    let progress = 0;
    let loadSteps = generateLoadSteps();
    let stepIndex = 0;
    
    // Update progress at random intervals to simulate real loading
    const interval = setInterval(() => {
      if (stepIndex < loadSteps.length) {
        progress = loadSteps[stepIndex];
        loaderProgress.style.width = `${progress}%`;
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }
  
  /**
   * Generate an array of progress steps that looks natural
   * Starts quickly then slows down at the end
   * @returns {Array} Array of progress percentages
   */
  function generateLoadSteps() {
    const steps = [];
    let progress = 0;
    
    // Generate steps up to 85% with varying increments
    while (progress < 85) {
      // Random increment between 5 and 15
      const increment = Math.random() * 10 + 5;
      progress += increment;
      
      if (progress > 85) progress = 85;
      steps.push(progress);
    }
    
    // Add slower steps at the end to simulate waiting for content
    steps.push(90, 92, 94, 96, 98);
    
    return steps;
  }
  
  /**
   * Cycle through different loading messages
   */
  function cycleLoadingMessages() {
    let messageIndex = 0;
    
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      
      // Fade out current text
      loaderText.style.opacity = '0';
      
      setTimeout(() => {
        // Change text and fade in
        loaderText.textContent = loadingMessages[messageIndex];
        loaderText.style.opacity = '1';
      }, 300);
      
    }, 2000);
    
    // Clear interval when window is loaded
    window.addEventListener('load', () => {
      clearInterval(messageInterval);
    });
  }
  
  /**
   * Complete the loading animation and hide the loader
   */
  function finishLoading() {
    // Complete the progress bar to 100%
    loaderProgress.style.width = '100%';
    
    // Change the loading message to a completion message
    if (loaderText) {
      loaderText.textContent = 'Welcome';
    }
    
    // Add a slight delay before hiding the loader for smooth transition
    setTimeout(() => {
      // Fade out the loader
      loader.style.opacity = '0';
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        loader.style.display = 'none';
        document.body.classList.add('loaded');
      }, 500);
    }, 600);
  }
  
  // Start the loader animation
  initLoader();
});