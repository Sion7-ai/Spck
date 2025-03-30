/**
 * Custom Cursor Effect
 * Replaces the default cursor with a custom stylized cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  // Only run on devices with fine pointer (mouse)
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Check if cursor elements exist
    if (!cursor || !cursorFollower) return;
    
    // Track the mouse position
    let mouseX = 0;
    let mouseY = 0;
    
    // Track the follower position for smooth animation
    let followerX = 0;
    let followerY = 0;
    
    // Interactive elements that change cursor state
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-item, input, textarea, select, .nav-link');
    
    /**
     * Update the mouse position variables
     * @param {MouseEvent} e - Mouse event
     */
    function updateMousePosition(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Position cursor directly at mouse position
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }
    
    /**
     * Animation loop for smooth cursor follower
     */
    function animateFollower() {
      // Calculate follower movement with easing
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      
      // Apply position to follower element
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      
      // Continue animation loop
      requestAnimationFrame(animateFollower);
    }
    
    /**
     * Add active state to cursor when hovering interactive elements
     * @param {Element} element - The interactive element
     */
    function setupInteraction(element) {
      // Mouse enter - activate cursor
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
      });
      
      // Mouse leave - deactivate cursor
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
      });
    }
    
    /**
     * Add clicking animation to cursor
     */
    function setupClickAnimation() {
      document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
        cursorFollower.classList.add('clicking');
      });
      
      document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
        cursorFollower.classList.remove('clicking');
      });
    }
    
    /**
     * Hide cursor when it leaves the window
     */
    function setupCursorVisibility() {
      document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
      });
      
      document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
      });
    }
    
    /**
     * Initialize the custom cursor
     */
    function init() {
      // Set up all event listeners
      document.addEventListener('mousemove', updateMousePosition);
      
      // Set up interactions for all interactive elements
      interactiveElements.forEach(setupInteraction);
      
      // Set up click animation
      setupClickAnimation();
      
      // Set up cursor visibility
      setupCursorVisibility();
      
      // Start animation loop
      animateFollower();
    }
    
    // Initialize the custom cursor
    init();
    
    // Add more interactive elements if dynamically added to the DOM
    // This would need to be called when new elements are added
    window.updateCursorInteractions = function() {
      const newInteractiveElements = document.querySelectorAll('a, button, .btn, .project-item, input, textarea, select, .nav-link');
      newInteractiveElements.forEach(setupInteraction);
    };
  }
});