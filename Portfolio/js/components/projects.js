/**
 * Projects Gallery Functionality
 * Handles project filtering, navigation, and modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // Project container and items
  const projectsContainer = document.querySelector('.projects-container');
  const projectItems = document.querySelectorAll('.project-item');
  
  // Navigation buttons
  const prevButton = document.querySelector('.projects-nav-btn.prev');
  const nextButton = document.querySelector('.projects-nav-btn.next');
  const pagination = document.querySelector('.projects-pagination');
  
  // Variables for horizontal scroll functionality
  let currentIndex = 0;
  let isMobile = window.innerWidth <= 768;
  
  /**
   * Initialize the projects functionality
   */
  function init() {
    // Create pagination dots
    createPaginationDots();
    
    // Add click handlers to project items
    addProjectClickHandlers();
    
    // Add navigation handlers
    if (prevButton && nextButton) {
      prevButton.addEventListener('click', navigatePrev);
      nextButton.addEventListener('click', navigateNext);
    }
    
    // Update navigation buttons state initially
    updateNavigationState();
    
    // Add resize listener for responsive behavior
    window.addEventListener('resize', handleResize);
    
    // Handle horizontal scroll on mobile
    if (isMobile && projectsContainer) {
      initHorizontalScroll();
    }
  }
  
  /**
   * Create pagination dots based on the number of projects
   */
  function createPaginationDots() {
    if (!pagination) return;
    
    // Clear any existing dots
    pagination.innerHTML = '';
    
    // Create a dot for each project item (on mobile) or each pair (on desktop)
    const totalDots = isMobile ? projectItems.length : Math.ceil(projectItems.length / 2);
    
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.classList.add('pagination-dot');
      
      if (i === 0) {
        dot.classList.add('active');
      }
      
      dot.addEventListener('click', () => {
        navigateToIndex(i);
      });
      
      pagination.appendChild(dot);
    }
  }
  
  /**
   * Add click handlers to project items to open project details
   */
  function addProjectClickHandlers() {
    projectItems.forEach(item => {
      item.addEventListener('click', function() {
        openProjectModal(this);
      });
    });
  }
  
  /**
   * Navigate to the previous project
   */
  function navigatePrev() {
    if (currentIndex > 0) {
      currentIndex--;
      scrollToCurrentIndex();
      updateNavigationState();
    }
  }
  
  /**
   * Navigate to the next project
   */
  function navigateNext() {
    const maxIndex = isMobile 
      ? projectItems.length - 1
      : Math.ceil(projectItems.length / 2) - 1;
      
    if (currentIndex < maxIndex) {
      currentIndex++;
      scrollToCurrentIndex();
      updateNavigationState();
    }
  }
  
  /**
   * Navigate to a specific index
   * @param {number} index - The index to navigate to
   */
  function navigateToIndex(index) {
    currentIndex = index;
    scrollToCurrentIndex();
    updateNavigationState();
  }
  
  /**
   * Update the navigation buttons state (disabled/enabled)
   */
  function updateNavigationState() {
    if (!prevButton || !nextButton || !pagination) return;
    
    // Update previous button
    if (currentIndex === 0) {
      prevButton.setAttribute('disabled', 'true');
    } else {
      prevButton.removeAttribute('disabled');
    }
    
    // Update next button
    const maxIndex = isMobile 
      ? projectItems.length - 1
      : Math.ceil(projectItems.length / 2) - 1;
      
    if (currentIndex >= maxIndex) {
      nextButton.setAttribute('disabled', 'true');
    } else {
      nextButton.removeAttribute('disabled');
    }
    
    // Update pagination dots
    const dots = pagination.querySelectorAll('.pagination-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  /**
   * Scroll to the current index in the projects container
   */
  function scrollToCurrentIndex() {
    if (!projectsContainer || !projectItems.length) return;
    
    if (isMobile) {
      // On mobile, scroll to the specific project
      if (projectItems[currentIndex]) {
        projectItems[currentIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    } else {
      // On desktop, calculate the position based on grid layout
      const itemsPerRow = 2; // Number of items per row in the grid
      const rowIndex = Math.floor(currentIndex * itemsPerRow / projectItems.length);
      
      // Scroll to the row
      projectsContainer.scrollTo({
        top: rowIndex * projectItems[0].offsetHeight,
        behavior: 'smooth'
      });
    }
  }
  
  /**
   * Initialize horizontal scroll functionality for mobile
   */
  function initHorizontalScroll() {
    // Add scroll event listener to handle pagination updates
    projectsContainer.addEventListener('scroll', () => {
      // Detect which item is most visible
      let mostVisibleIndex = 0;
      let mostVisibleArea = 0;
      
      projectItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const containerRect = projectsContainer.getBoundingClientRect();
        
        // Calculate how much of the item is visible
        const leftVisible = Math.max(rect.left, containerRect.left);
        const rightVisible = Math.min(rect.right, containerRect.right);
        const visibleWidth = Math.max(0, rightVisible - leftVisible);
        
        if (visibleWidth > mostVisibleArea) {
          mostVisibleArea = visibleWidth;
          mostVisibleIndex = index;
        }
      });
      
      // Update the current index if it changed
      if (mostVisibleIndex !== currentIndex) {
        currentIndex = mostVisibleIndex;
        updateNavigationState();
      }
    });
  }
  
  /**
   * Handle window resize events
   */
  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    // If there was a change in layout mode, reset the navigation
    if (wasMobile !== isMobile) {
      currentIndex = 0;
      createPaginationDots();
      updateNavigationState();
      
      // Initialize or remove horizontal scroll based on viewport
      if (isMobile && projectsContainer) {
        initHorizontalScroll();
      }
    }
  }
  
  /**
   * Open a modal with project details
   * @param {HTMLElement} projectItem - The clicked project item
   */
  function openProjectModal(projectItem) {
    // Create modal elements
    const modal = document.createElement('div');
    modal.classList.add('project-modal');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    const closeButton = document.createElement('div');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '<span class="iconify" data-icon="tabler:x" data-width="24"></span>';
    
    // Get project info
    const projectTitle = projectItem.querySelector('.project-title').textContent;
    const projectCategory = projectItem.querySelector('.project-category').textContent;
    const projectImage = projectItem.querySelector('.project-image img').getAttribute('src');
    
    // Create modal HTML
    modalContent.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title">${projectTitle}</h2>
        <p class="modal-category">${projectCategory}</p>
      </div>
      <div class="modal-image">
        <img src="${projectImage}" alt="${projectTitle}">
      </div>
      <div class="modal-description">
        <p>This is a detailed description of the project. It would include information about the client, the challenge, the solution, and the outcome.</p>
        <p>In a real implementation, this content would be loaded dynamically, possibly from a data file or CMS.</p>
      </div>
    `;
    
    // Add elements to DOM
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add close functionality
    closeButton.addEventListener('click', () => {
      closeProjectModal(modal);
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProjectModal(modal);
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function handleEscape(e) {
      if (e.key === 'Escape') {
        closeProjectModal(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Animate modal in
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }
  
  /**
   * Close the project modal
   * @param {HTMLElement} modal - The modal element to close
   */
  function closeProjectModal(modal) {
    modal.classList.remove('active');
    
    // Wait for animation to complete before removing
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    }, 300);
  }
  
  // Initialize the functionality
  init();
});